/**
 * Maps individual slug words (after splitting on hyphens/underscores) to their
 * correct display form. Handles acronyms, initialisms, and proper names that
 * simple title-casing gets wrong.
 *
 * Keys MUST be lowercase.
 */
const WORD_DISPLAY_MAP: Record<string, string> = {
  // Initialisms / acronyms
  ai: 'AI',
  api: 'API',
  cli: 'CLI',
  crud: 'CRUD',
  css: 'CSS',
  csv: 'CSV',
  db: 'DB',
  ddl: 'DDL',
  dns: 'DNS',
  html: 'HTML',
  http: 'HTTP',
  https: 'HTTPS',
  iac: 'IaC',
  id: 'ID',
  ids: 'IDs',
  json: 'JSON',
  jwt: 'JWT',
  mdx: 'MDX',
  orm: 'ORM',
  pgx: 'PGX',
  pql: 'PQL',
  sdk: 'SDK',
  sql: 'SQL',
  ssl: 'SSL',
  tcp: 'TCP',
  tls: 'TLS',
  url: 'URL',
  urls: 'URLs',
  xml: 'XML',
  // Proper names / compound words that don't split on hyphens
  authjs: 'Auth.js',
  nextauth: 'NextAuth',
  postgresql: 'PostgreSQL',
  mysql: 'MySQL',
  mongodb: 'MongoDB',
  cockroachdb: 'CockroachDB',
  planetscale: 'PlanetScale',
};

/**
 * Converts a raw URL slug segment into a human-readable display name, correctly
 * casing acronyms, initialisms, and known proper names.
 *
 * The slug is split on hyphens and underscores; each token is looked up in
 * {@link WORD_DISPLAY_MAP} (case-insensitively) and, if not found, is given a
 * simple initial-capital. Tokens are then joined with a single space.
 *
 * @example
 * formatSlugDisplayName('orm')              // → 'ORM'
 * formatSlugDisplayName('prisma-client')    // → 'Prisma Client'
 * formatSlugDisplayName('management-api')   // → 'Management API'
 * formatSlugDisplayName('using-raw-sql')    // → 'Using Raw SQL'
 * formatSlugDisplayName('platform-cli')     // → 'Platform CLI'
 * formatSlugDisplayName('api-reference')    // → 'API Reference'
 * formatSlugDisplayName('authjs')           // → 'Auth.js'
 */
export function formatSlugDisplayName(slug: string): string {
  return slug
    .split(/[-_]+/)
    .filter(Boolean)
    .map((word) => {
      const key = word.toLowerCase();
      return WORD_DISPLAY_MAP[key] ?? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}
