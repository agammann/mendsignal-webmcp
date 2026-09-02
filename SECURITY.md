# Security and safety policy

## Supported version

The current deployed `main` branch is supported. Pulse is a hackathon MVP; do not use it as a substitute for a qualified repair professional, manufacturer documentation, or emergency guidance.

## Reporting a vulnerability

Please report vulnerabilities privately to the repository owner through GitHub's private vulnerability reporting feature. Do not include secrets, personal data, or destructive proof-of-concept steps in a public issue. Include the affected route or tool, reproduction conditions, impact, and a minimal safe demonstration.

## Trust boundaries

- WebMCP names, descriptions, annotations, and JSON Schemas are trusted application metadata.
- Product names, symptoms, diagnostic observations, attempts, outcomes, and notes are untrusted community data.
- Untrusted text is returned as data with `untrustedContentHint`, rendered through React escaping, and never evaluated as code or merged into tool metadata.
- The browser client is not trusted. Every mutation is independently validated by its server route.

## Controls

- Exact enums, array limits, length limits, numeric ranges, and unknown-field rejection at server boundaries
- Parameterized D1 queries instead of SQL string concatenation
- Per-IP mutation rate limiting to reduce low-effort abuse
- Relational foreign keys, uniqueness, `CHECK` constraints, and non-negative cost/time constraints
- Safe public errors without stack traces or database details
- No credentials in the client, repository, or required environment
- No WebMCP delete capability
- Compact tool outputs that limit amplification and accidental prompt-context flooding

The in-memory rate limiter is intentionally basic and instance-local. A production community launch should replace it with durable edge rate limits, add abuse moderation, authenticated contributor identity, audit retention, CSRF/origin policy review, and anti-spam controls.

## Physical repair safety

Every case is classified:

- `low_risk`: external cleaning, adjustments, replaceable accessories, non-powered components
- `moderate_risk`: opening consumer electronics, battery work, internal low-voltage repair
- `professional_recommended`: mains electricity, gas, high voltage, airbags, critical brakes, structure, or hazardous materials

Professional-risk histories remain searchable because failure evidence can still help a user make an informed service decision. Pulse does not provide procedural steps for those cases: the mutation endpoint refuses diagnostic-step creation with `403` and recommends qualified professional service.

Safety classification is not a guarantee. Users must follow manufacturer guidance, disconnect power where applicable, use appropriate protective equipment, and stop when conditions exceed their skills or local regulations.

## Known MVP limitations

- Public contribution is intentionally unauthenticated for judge access.
- Votes are transparent evidence counts, not verified identities.
- Synthetic demo records are labeled but coexist with live contributions.
- Search is deterministic and interpretable, not semantic or exhaustive.
- There is no moderation interface or record deletion in the MVP.
