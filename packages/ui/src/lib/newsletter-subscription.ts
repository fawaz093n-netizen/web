const BREVO_API_BASE_URL = "https://api.brevo.com/v3";
const NEWSLETTER_UNSUBSCRIBE_URL = "https://www.prisma.io/api/newsletter/unsubscribe";

export const PRISMA_NEWSLETTER_LIST_ID = 15;
export const NEWSLETTER_WELCOME_TEMPLATE_ID = 228;
export const NEWSLETTER_UNSUBSCRIBE_COOKIE_NAME = "prisma_newsletter_unsubscribe";
export const NEWSLETTER_UNSUBSCRIBE_TOKEN_ATTRIBUTE = "NEWSLETTER_UNSUBSCRIBE_TOKEN";

export type NewsletterSource = "blog" | "docs" | "website";

type BrevoContact = {
  attributes: Record<string, unknown>;
  email: string | null;
  emailBlacklisted: boolean;
  listIds: number[];
};

type BrevoErrorBody = {
  code?: string;
  message?: string;
};

export type NewsletterSubscriptionResult = {
  status: "already_subscribed" | "subscribed";
  welcomeSent: boolean;
};

export type NewsletterUnsubscribeResult = {
  status: "already_unsubscribed" | "invalid_token" | "unsubscribed";
};

export class NewsletterSubscriptionError extends Error {
  readonly code: string;
  readonly status?: number;

  constructor(message: string, options: { code: string; status?: number; cause?: unknown }) {
    super(message, { cause: options.cause });
    this.name = "NewsletterSubscriptionError";
    this.code = options.code;
    this.status = options.status;
  }
}

type SubscribeToNewsletterOptions = {
  apiKey: string;
  email: string;
  fetcher?: typeof fetch;
  source: NewsletterSource;
};

type UnsubscribeFromNewsletterOptions = {
  apiKey: string;
  fetcher?: typeof fetch;
  token: string;
};

const unsubscribeTokenPattern = /^[0-9a-f]{64}$/;

export function isValidNewsletterEmail(email: string): boolean {
  if (email.length === 0 || email.length > 254 || /\s/.test(email)) return false;

  const atIndex = email.indexOf("@");
  if (atIndex <= 0 || atIndex !== email.lastIndexOf("@")) return false;

  const localPart = email.slice(0, atIndex);
  const domainParts = email.slice(atIndex + 1).split(".");
  return (
    localPart.length <= 64 &&
    domainParts.length >= 2 &&
    domainParts.every((part) => part.length > 0 && part.length <= 63)
  );
}

function getBrevoHeaders(apiKey: string) {
  return {
    accept: "application/json",
    "api-key": apiKey,
    "content-type": "application/json",
  };
}

async function readJson(response: Response): Promise<BrevoErrorBody & Record<string, unknown>> {
  const responseText = await response.text();
  if (!responseText) return {};

  try {
    return JSON.parse(responseText) as BrevoErrorBody & Record<string, unknown>;
  } catch (cause) {
    throw new NewsletterSubscriptionError("Brevo returned an invalid response", {
      code: "invalid_brevo_response",
      status: response.status,
      cause,
    });
  }
}

function toBrevoError(
  operation: string,
  response: Response,
  body: BrevoErrorBody,
): NewsletterSubscriptionError {
  return new NewsletterSubscriptionError(`Brevo ${operation} failed`, {
    code: body.code ?? "brevo_request_failed",
    status: response.status,
  });
}

function parseContact(body: Record<string, unknown>): BrevoContact {
  const listIds = Array.isArray(body.listIds)
    ? body.listIds.filter((listId): listId is number => typeof listId === "number")
    : [];

  return {
    attributes:
      typeof body.attributes === "object" && body.attributes !== null
        ? (body.attributes as Record<string, unknown>)
        : {},
    email: typeof body.email === "string" ? body.email : null,
    emailBlacklisted: body.emailBlacklisted === true,
    listIds,
  };
}

export function isValidNewsletterUnsubscribeToken(token: string): boolean {
  return unsubscribeTokenPattern.test(token);
}

function getExistingUnsubscribeToken(contact: BrevoContact | null): string | null {
  const token = contact?.attributes[NEWSLETTER_UNSUBSCRIBE_TOKEN_ATTRIBUTE];
  return typeof token === "string" && isValidNewsletterUnsubscribeToken(token) ? token : null;
}

async function createUnsubscribeToken(apiKey: string, email: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(apiKey),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const digest = new Uint8Array(
    await crypto.subtle.sign(
      "HMAC",
      key,
      new TextEncoder().encode(`prisma-newsletter-unsubscribe:${email}`),
    ),
  );

  return Array.from(digest, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function getContact(
  fetcher: typeof fetch,
  apiKey: string,
  email: string,
): Promise<BrevoContact | null> {
  const response = await fetcher(
    `${BREVO_API_BASE_URL}/contacts/${encodeURIComponent(email)}?identifierType=email_id`,
    { headers: getBrevoHeaders(apiKey) },
  );

  if (response.status === 404) return null;

  const body = await readJson(response);
  if (!response.ok) throw toBrevoError("contact lookup", response, body);

  return parseContact(body);
}

async function upsertContact(
  fetcher: typeof fetch,
  apiKey: string,
  email: string,
  source: NewsletterSource,
  contact: BrevoContact | null,
  unsubscribeToken: string,
): Promise<void> {
  const body = {
    attributes: {
      EMAIL: email,
      [NEWSLETTER_UNSUBSCRIBE_TOKEN_ATTRIBUTE]: unsubscribeToken,
      SOURCE: source,
    },
    emailBlacklisted: false,
    listIds: [PRISMA_NEWSLETTER_LIST_ID],
  };

  const response = contact
    ? await fetcher(`${BREVO_API_BASE_URL}/contacts/${encodeURIComponent(email)}`, {
        method: "PUT",
        headers: getBrevoHeaders(apiKey),
        body: JSON.stringify(body),
      })
    : await fetcher(`${BREVO_API_BASE_URL}/contacts`, {
        method: "POST",
        headers: getBrevoHeaders(apiKey),
        body: JSON.stringify({ email, updateEnabled: true, ...body }),
      });

  const responseBody = await readJson(response);
  if (!response.ok) throw toBrevoError("contact subscription", response, responseBody);
}

async function createWelcomeIdempotencyKey(email: string): Promise<string> {
  const input = new TextEncoder().encode(`prisma-newsletter-welcome:${email}`);
  const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", input)).slice(0, 16);

  // UUID v8 reserves the version for application-defined deterministic identifiers.
  digest[6] = (digest[6] & 0x0f) | 0x80;
  digest[8] = (digest[8] & 0x3f) | 0x80;

  const hex = Array.from(digest, (byte) => byte.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

async function sendWelcomeEmail(
  fetcher: typeof fetch,
  apiKey: string,
  email: string,
  unsubscribeToken: string,
): Promise<void> {
  const response = await fetcher(`${BREVO_API_BASE_URL}/smtp/email`, {
    method: "POST",
    headers: getBrevoHeaders(apiKey),
    body: JSON.stringify({
      to: [{ email }],
      templateId: NEWSLETTER_WELCOME_TEMPLATE_ID,
      params: {
        unsubscribeUrl: `${NEWSLETTER_UNSUBSCRIBE_URL}?token=${unsubscribeToken}`,
      },
      tags: ["newsletter-welcome"],
      headers: {
        "Idempotency-Key": await createWelcomeIdempotencyKey(email),
      },
    }),
  });

  const body = await readJson(response);
  if (!response.ok) throw toBrevoError("welcome email send", response, body);
}

export async function subscribeToPrismaNewsletter({
  apiKey,
  email,
  fetcher = fetch,
  source,
}: SubscribeToNewsletterOptions): Promise<NewsletterSubscriptionResult> {
  const normalizedEmail = email.trim().toLowerCase();
  const contact = await getContact(fetcher, apiKey, normalizedEmail);

  if (contact?.listIds.includes(PRISMA_NEWSLETTER_LIST_ID) && !contact.emailBlacklisted) {
    return { status: "already_subscribed", welcomeSent: false };
  }

  const unsubscribeToken =
    getExistingUnsubscribeToken(contact) ?? (await createUnsubscribeToken(apiKey, normalizedEmail));

  await upsertContact(fetcher, apiKey, normalizedEmail, source, contact, unsubscribeToken);

  try {
    await sendWelcomeEmail(fetcher, apiKey, normalizedEmail, unsubscribeToken);
    return { status: "subscribed", welcomeSent: true };
  } catch {
    // The subscription is complete even when the non-essential welcome email fails.
    return { status: "subscribed", welcomeSent: false };
  }
}

export async function unsubscribeFromPrismaNewsletter({
  apiKey,
  fetcher = fetch,
  token,
}: UnsubscribeFromNewsletterOptions): Promise<NewsletterUnsubscribeResult> {
  if (!isValidNewsletterUnsubscribeToken(token)) return { status: "invalid_token" };

  const contactsUrl = new URL(`${BREVO_API_BASE_URL}/contacts`);
  contactsUrl.searchParams.set("limit", "2");
  contactsUrl.searchParams.set(
    "filter",
    `equals(${NEWSLETTER_UNSUBSCRIBE_TOKEN_ATTRIBUTE},"${token}")`,
  );

  const lookupResponse = await fetcher(contactsUrl, { headers: getBrevoHeaders(apiKey) });
  const lookupBody = await readJson(lookupResponse);
  if (!lookupResponse.ok) throw toBrevoError("unsubscribe lookup", lookupResponse, lookupBody);

  const contacts = Array.isArray(lookupBody.contacts)
    ? lookupBody.contacts.filter(
        (contact): contact is Record<string, unknown> =>
          typeof contact === "object" && contact !== null,
      )
    : [];
  if (contacts.length !== 1) return { status: "invalid_token" };

  const contact = parseContact(contacts[0]);
  if (!contact.email) return { status: "invalid_token" };
  if (!contact.listIds.includes(PRISMA_NEWSLETTER_LIST_ID)) {
    return { status: "already_unsubscribed" };
  }

  const updateResponse = await fetcher(
    `${BREVO_API_BASE_URL}/contacts/${encodeURIComponent(contact.email)}?identifierType=email_id`,
    {
      method: "PUT",
      headers: getBrevoHeaders(apiKey),
      body: JSON.stringify({ unlinkListIds: [PRISMA_NEWSLETTER_LIST_ID] }),
    },
  );
  const updateBody = await readJson(updateResponse);
  if (!updateResponse.ok) throw toBrevoError("newsletter unsubscribe", updateResponse, updateBody);

  return { status: "unsubscribed" };
}
