# Offline ToolHub: Growth and AdSense Task List

Last updated: 2026-08-01

Status legend: `[x]` complete, `[-]` in progress, `[ ]` pending, `[U]` user action required.

## Phase 0: Correct the production identity and index signals

- [x] Codex: centralize the production site name and URL.
- [x] Codex: replace every `toolhub.dev` canonical, sitemap, robots and JSON-LD URL.
- [x] Codex: rename the public brand to Offline ToolHub to avoid confusion with the unrelated `toolhub.dev` website.
- [x] Codex: give Privacy, Terms, About, category and tool pages self-referencing canonicals.
- [x] Codex: mark internal search pages `noindex,follow` and remove `/search` from the sitemap.
- [x] Codex: add Privacy, Terms and About to the sitemap.
- [x] Codex: stop changing every sitemap `lastmod` value on each build.
- [x] Codex: remove unsupported guaranteed-offline claims until a service worker exists.
- [x] Codex: build and inspect the generated static files.
- [U] User: deploy the verified build to `offlinetoolhub.com`.

## Phase 1: Establish the measurement baseline

- [x] Codex: add an optional Cloudflare Web Analytics integration controlled by an environment variable.
- [U] User: enable Cloudflare Web Analytics and set its site token in the GitHub repository secret `CF_WEB_ANALYTICS_TOKEN`.
- [U] User: create a Google Search Console domain property and add the DNS verification record.
- [U] User: submit `https://offlinetoolhub.com/sitemap.xml` only after the corrected deployment.
- [U] User: inspect several priority URLs in Search Console and request indexing where appropriate.
- [U] User: create/import the site in Bing Webmaster Tools and submit the same sitemap.
- [ ] Codex: add task-completion and error analytics after the analytics provider is selected.
- [ ] Codex: create a weekly dashboard for impressions, clicks, indexed pages, successful tool runs, downloads and errors.

## Phase 2: Improve product quality and organic traffic

- [x] Codex: split the shared tool route bundle so each page loads only its own tool code.
- [ ] Codex: run mobile/desktop Core Web Vitals audits and address the largest regressions.
- [ ] Codex: select the first 20-30 priority tools using demand, current impressions and reliability.
- [ ] Codex: add tool-specific how-to steps, formats, limits, examples, troubleshooting and FAQs to priority pages.
- [ ] Codex: replace duplicated category-level FAQ schema on priority pages with genuinely page-specific content.
- [ ] Codex: complete real-file and real-device tests for priority image, PDF, audio and video tools.
- [ ] Codex: add visible error reporting and regression tests for the most-used workflows.
- [ ] Codex: document formulas, assumptions, units, sources and disclaimers for finance and health calculators.
- [ ] Codex: improve internal links between format pairs, parent tools and category hubs.
- [ ] Codex: add a 1200x630 social sharing image and page-level social metadata.
- [ ] Codex: decide whether to implement a real PWA/offline cache; otherwise keep claims limited to local processing.
- [ ] Codex: use Search Console queries to refresh titles/content and consolidate pages that do not earn impressions.
- [U] User: review weekly traffic results and approve the next priority cluster when business judgment is needed.
- [U] User: arrange legitimate distribution/outreach for the strongest tools; avoid paid links and bulk directory spam.

## Phase 3: Prepare and apply for Google AdSense

- [x] Codex: keep ad units disabled when `NEXT_PUBLIC_AD_NETWORK=none`.
- [x] Codex: remove the fake publisher entry from `ads.txt`.
- [x] Codex: add site-wide AdSense verification/script support behind environment variables.
- [x] Codex: ensure missing IDs never render fake ad placeholders.
- [x] Codex: update privacy and terms copy so it matches the site's current behavior.
- [U] User: obtain or confirm the AdSense account and real `ca-pub-...` publisher ID.
- [U] User: add `offlinetoolhub.com` in AdSense, then set GitHub repository secrets `ADSENSE_ID` and `AD_NETWORK_OVERSEAS=adsense` for the verification build.
- [U] User: replace `ads.txt` with the exact real seller line supplied by AdSense.
- [U] User: configure a Google-certified CMP/Privacy & Messaging flow for EEA, UK and Switzerland, plus applicable US states.
- [U] User: create the initial ad units or approve Auto Ads after the site review succeeds.
- [ ] Codex: connect real unit IDs, validate consent behavior and prevent ads on empty/low-value pages.
- [ ] Codex: start with one or two low-disruption placements and verify layout shift/mobile usability.
- [U] User: submit the site for AdSense review after quality and indexing gates are met.

## Suggested application gates (internal targets, not Google minimums)

- Correct self-referencing canonicals and a clean Search Console coverage report.
- At least 20-30 priority pages with unique, verified, useful content.
- No known broken core workflows or misleading privacy/offline claims.
- Several weeks of stable organic-search data and real tool usage.
- Real publisher ID, accurate `ads.txt`, privacy policy and certified consent flow ready.

## Trust and operations

- [U] User: create a domain contact address such as `support@offlinetoolhub.com` and forward it to the maintained inbox.
- [ ] Codex: replace the personal Gmail address after the domain mailbox is ready.
- [x] Codex: add release checks that fail on placeholder publisher IDs, wrong production domains or missing sitemap URLs.
- [x] Codex: document required deployment environment variables in `.env.example`.
- [ ] Codex: document the AdSense review/go-live rollback procedure after real IDs and deployment details are known.
