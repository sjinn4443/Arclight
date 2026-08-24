# Arclight cloud Scheduled tasks

Create these only after the Railway reporting service, Secure MCP Tunnel and developer-mode ChatGPT app have passed the smoke test. Use `Europe/London` for every schedule so daylight-saving changes are handled by the scheduler. GitHub `sjinn4443/Arclight` and the private `Arclight Reporting` app are the only current sources. Never use a local folder.

Every task must use concise British English without an Oxford comma. Never place credentials, private hostnames, names, contacts, profile IDs or raw IPs in chat, task logs or GitHub. The private DOCX resource link is the only allowed delivery path for personal rows. No automatic retries.

## 1. Daily infrastructure snapshot

- Schedule: daily at 04:00
- Model: latest Terra-class model, low reasoning
- Target budget: 2,000 tokens
- Prompt:

> Read GitHub main SHA and current Actions status. Call Arclight Reporting `health`, `deployment` and `backup`. Compare GitHub SHA with deployed SHA. Return one concise success line or one precise anomaly with the next action. Do not inspect PostgreSQL rows and do not expose identifiers or private infrastructure values.

## 2. Weekday overnight pulse

- Schedule: Monday to Friday at 08:30
- Model: latest Terra-class model, low reasoning
- Target budget: 2,000 tokens
- Prompt:

> Review the previous 24 hours of GitHub, Actions and deployment changes, then call Arclight Reporting `usage_statistics`. Return exactly one British-English sentence of at most 40 words containing only the main anomaly or action. Use aggregates only.

## 3. Wednesday product-quality audit

- Schedule: Wednesday at 04:00, deliver by 09:00
- Model: latest strongest frontier model, high or greater reasoning
- Target budget: 45,000 tokens
- Prompt:

> Audit GitHub main without editing code. Cover all Lighthouse categories, the whole ARIA and accessibility surface, every translation, iOS and WebKit, offline and PWA behaviour, formatting, type-check health, minification and bundle health. Test 320x568, 390x844, 844x390, 768x1024, 1024x768, 1440x900 and 1920x1080. Use the latest strongest language capability for translations. Return exactly 10 evidenced UI or UX improvements, ordered by impact, with file references and concise verification evidence.

## 4. Friday security and code-health review

- Schedule: Friday at 04:00, deliver by 09:00
- Model: latest smartest frontier coding model, maximum practical reasoning
- Target budget: 55,000 tokens, or 75,000 on the first Friday
- Prompt:

> Review GitHub only and make recommendations without editing code. On the first Friday of the month, run a deep independent multi-pass whole-repository review with a 75,000-token target. Otherwise compare the previous seven days with a 55,000-token target. Return five validated security or code-health findings when five genuinely exist, never pad the list. Include up to three evidenced refactors, dead-code or temporary-file candidates and CI/CD improvements. State validation and uncertainty succinctly.

## 5. Friday communication and PostgreSQL report

- Schedule: Friday at 16:15, deliver by 17:00
- Model: latest Terra-class model, medium reasoning
- Target budget: 12,000 tokens
- Prompt:

> Produce a concise seven-day layperson summary and changelog draft from GitHub and deployments. Call Arclight Reporting `usage_statistics`, then `generate_postgres_docx`. Include aggregate 24-hour, 7-day and 30-day statistics in the prose. Attach the returned DOCX resource link without opening, quoting or reproducing its personal rows. Mention validation exceptions only. Never expose names, contacts, profile IDs or raw IPs in chat.

## 6. Second-Monday repository hygiene

- Schedule: the second Monday of each month at 04:00
- Model: latest smart frontier coding model, high reasoning
- Target budget: 15,000 tokens
- Prompt:

> Review GitHub main for refactors, dead code and temporary files. Protect fixtures and referenced assets. Only when each deletion is evidenced and relevant tests pass, create one unmerged draft PR capped at 200 files and 250 MB with recovery evidence. Never merge. If validation is incomplete, return recommendations only.

## 7–10. Monthly translation quarters

Create four independent tasks at 04:00 on the first Monday, first Tuesday, first Wednesday and first Thursday of each month. Assign deterministic quarters 1–4 respectively.

- Model: latest strongest language model, maximum practical reasoning
- Target budget: 25,000 tokens per quarter
- Prompt template:

> Review deterministic locale and UI string quarter **N of 4** from GitHub main without editing code. Check every assigned string for missing keys, interpolation, pluralisation, truncation, directionality, register, clinical meaning and responsive fit. Use stable path-and-key ordering so the four tasks cover the corpus exactly once. Return concise evidenced findings and suggested wording.

## Cutover gate

Before disabling `arclight-overnight-pulse`, manually run all task types while the desktop app is closed. Confirm Scheduled run records, matching GitHub and deployed SHAs, green CI, read-only database checks, backup freshness, aggregate-only MCP text, a downloadable rendered DOCX, scrubbed metadata and no credentials, private hostnames or personal rows in task or server logs. Also test dates on both sides of the Europe/London DST transition.

