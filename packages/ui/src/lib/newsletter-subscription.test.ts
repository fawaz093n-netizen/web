import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  NEWSLETTER_WELCOME_TEMPLATE_ID,
  NEWSLETTER_UNSUBSCRIBE_TOKEN_ATTRIBUTE,
  PRISMA_NEWSLETTER_LIST_ID,
  NewsletterSubscriptionError,
  subscribeToPrismaNewsletter,
  unsubscribeFromPrismaNewsletter,
} from "./newsletter-subscription";

type FetchCall = {
  input: string;
  init?: RequestInit;
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(status === 204 ? null : JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function createFetch(responses: Response[]) {
  const calls: FetchCall[] = [];
  const fetcher = (async (input: string | URL | Request, init?: RequestInit) => {
    calls.push({ input: String(input), init });
    const response = responses.shift();
    assert.ok(response, "Unexpected Brevo request");
    return response;
  }) as typeof fetch;

  return { calls, fetcher };
}

describe("subscribeToPrismaNewsletter", () => {
  it("subscribes a new website contact and sends one welcome email", async () => {
    const { calls, fetcher } = createFetch([
      jsonResponse({}, 404),
      jsonResponse({ id: 123 }, 201),
      jsonResponse({ messageId: "welcome-1" }, 201),
    ]);

    const result = await subscribeToPrismaNewsletter({
      apiKey: "test-key",
      email: " Dev@Example.com ",
      fetcher,
      source: "website",
    });

    assert.deepEqual(result, { status: "subscribed", welcomeSent: true });
    assert.equal(calls.length, 3);

    const contactBody = JSON.parse(String(calls[1]?.init?.body));
    assert.equal(contactBody.email, "dev@example.com");
    assert.equal(contactBody.updateEnabled, true);
    assert.equal(contactBody.attributes.EMAIL, "dev@example.com");
    assert.equal(contactBody.attributes.SOURCE, "website");
    assert.match(contactBody.attributes[NEWSLETTER_UNSUBSCRIBE_TOKEN_ATTRIBUTE], /^[0-9a-f]{64}$/);
    assert.equal(contactBody.emailBlacklisted, false);
    assert.deepEqual(contactBody.listIds, [PRISMA_NEWSLETTER_LIST_ID]);

    const emailBody = JSON.parse(String(calls[2]?.init?.body));
    assert.equal(emailBody.templateId, NEWSLETTER_WELCOME_TEMPLATE_ID);
    assert.deepEqual(emailBody.to, [{ email: "dev@example.com" }]);
    assert.equal(
      emailBody.params.unsubscribeUrl,
      `https://www.prisma.io/api/newsletter/unsubscribe?token=${contactBody.attributes[NEWSLETTER_UNSUBSCRIBE_TOKEN_ATTRIBUTE]}`,
    );
    assert.match(
      emailBody.headers["Idempotency-Key"],
      /^[0-9a-f]{8}-[0-9a-f]{4}-8[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
    );
  });

  it("keeps an existing unsubscribe token when a contact resubscribes", async () => {
    const token = "a".repeat(64);
    const { calls, fetcher } = createFetch([
      jsonResponse({
        attributes: { [NEWSLETTER_UNSUBSCRIBE_TOKEN_ATTRIBUTE]: token },
        emailBlacklisted: false,
        listIds: [],
      }),
      jsonResponse({}, 204),
      jsonResponse({ messageId: "welcome-2" }, 201),
    ]);

    await subscribeToPrismaNewsletter({
      apiKey: "test-key",
      email: "returning@example.com",
      fetcher,
      source: "blog",
    });

    const contactBody = JSON.parse(String(calls[1]?.init?.body));
    const emailBody = JSON.parse(String(calls[2]?.init?.body));
    assert.equal(contactBody.attributes[NEWSLETTER_UNSUBSCRIBE_TOKEN_ATTRIBUTE], token);
    assert.equal(
      emailBody.params.unsubscribeUrl,
      `https://www.prisma.io/api/newsletter/unsubscribe?token=${token}`,
    );
  });

  it("does not send a welcome when the contact is already subscribed", async () => {
    const { calls, fetcher } = createFetch([
      jsonResponse({ emailBlacklisted: false, listIds: [PRISMA_NEWSLETTER_LIST_ID] }),
    ]);

    const result = await subscribeToPrismaNewsletter({
      apiKey: "test-key",
      email: "console-user@example.com",
      fetcher,
      source: "blog",
    });

    assert.deepEqual(result, { status: "already_subscribed", welcomeSent: false });
    assert.equal(calls.length, 1);
  });

  it("resubscribes a blacklisted contact before sending the welcome", async () => {
    const { calls, fetcher } = createFetch([
      jsonResponse({ emailBlacklisted: true, listIds: [PRISMA_NEWSLETTER_LIST_ID] }),
      jsonResponse({}, 204),
      jsonResponse({ messageId: "welcome-2" }, 201),
    ]);

    const result = await subscribeToPrismaNewsletter({
      apiKey: "test-key",
      email: "returning@example.com",
      fetcher,
      source: "docs",
    });

    assert.deepEqual(result, { status: "subscribed", welcomeSent: true });
    assert.equal(calls[1]?.init?.method, "PUT");
    assert.equal(calls.length, 3);
  });

  it("keeps a completed subscription when the welcome send fails", async () => {
    const { fetcher } = createFetch([
      jsonResponse({}, 404),
      jsonResponse({ id: 123 }, 201),
      jsonResponse({ code: "temporary_failure" }, 503),
    ]);

    const result = await subscribeToPrismaNewsletter({
      apiKey: "test-key",
      email: "dev@example.com",
      fetcher,
      source: "website",
    });

    assert.deepEqual(result, { status: "subscribed", welcomeSent: false });
  });

  it("does not include the subscriber email in subscription errors", async () => {
    const { fetcher } = createFetch([jsonResponse({ code: "unauthorized" }, 401)]);

    await assert.rejects(
      subscribeToPrismaNewsletter({
        apiKey: "test-key",
        email: "private@example.com",
        fetcher,
        source: "website",
      }),
      (error: unknown) => {
        assert.ok(error instanceof NewsletterSubscriptionError);
        assert.equal(error.code, "unauthorized");
        assert.doesNotMatch(error.message, /private@example\.com/);
        return true;
      },
    );
  });
});

describe("unsubscribeFromPrismaNewsletter", () => {
  it("removes the contact from only the newsletter list", async () => {
    const token = "b".repeat(64);
    const { calls, fetcher } = createFetch([
      jsonResponse({
        contacts: [
          {
            email: "dev@example.com",
            listIds: [PRISMA_NEWSLETTER_LIST_ID, 99],
          },
        ],
      }),
      jsonResponse({}, 204),
    ]);

    const result = await unsubscribeFromPrismaNewsletter({
      apiKey: "test-key",
      fetcher,
      token,
    });

    assert.deepEqual(result, { status: "unsubscribed" });
    assert.match(calls[0].input, /filter=equals%28NEWSLETTER_UNSUBSCRIBE_TOKEN%2C%22b{64}%22%29/);
    assert.match(calls[1].input, /contacts\/dev%40example\.com\?identifierType=email_id$/);
    assert.deepEqual(JSON.parse(String(calls[1].init?.body)), {
      unlinkListIds: [PRISMA_NEWSLETTER_LIST_ID],
    });
  });

  it("does not update a contact that already left the newsletter list", async () => {
    const { calls, fetcher } = createFetch([
      jsonResponse({ contacts: [{ email: "dev@example.com", listIds: [99] }] }),
    ]);

    const result = await unsubscribeFromPrismaNewsletter({
      apiKey: "test-key",
      fetcher,
      token: "c".repeat(64),
    });

    assert.deepEqual(result, { status: "already_unsubscribed" });
    assert.equal(calls.length, 1);
  });

  it("rejects an invalid token without calling Brevo", async () => {
    const { calls, fetcher } = createFetch([]);

    const result = await unsubscribeFromPrismaNewsletter({
      apiKey: "test-key",
      fetcher,
      token: "not-a-token",
    });

    assert.deepEqual(result, { status: "invalid_token" });
    assert.equal(calls.length, 0);
  });
});
