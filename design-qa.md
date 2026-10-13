# AI COACHING visual and interaction QA

final result: passed

## Evidence

- Source visual truth: `C:/Users/takas/AppData/Local/Temp/codex-clipboard-2e111c02-0e28-4a1a-8693-d50db6120799.png`.
- Implementation: `http://127.0.0.1:3000/`, Next.js production server.
- Source and desktop capture: 1672 × 941 pixels, 1672 × 941 CSS pixels, device scale factor 1; no density normalization needed.
- Desktop screenshot: `C:/Users/takas/AppData/Local/Temp/coaching-desktop.png`.
- Combined full-view and focused typography/CTA comparison: `C:/Users/takas/AppData/Local/Temp/coaching-comparison-final.jpg`. Both images were opened in the same comparison input.
- Mobile screenshots: `C:/Users/takas/AppData/Local/Temp/coaching-mobile-375.png`, `coaching-mobile-390.png`, `coaching-mobile-430.png` in the same Temp directory. CSS viewports 375/390/430 × 844; full-page captures with density 1.
- State: entrance animation complete; navigation and dialogs closed. Additional interactions tested separately.
- Browser plugin not available; used bundled Playwright with installed Microsoft Edge, headless. No browser package was installed in the project.

## Comparison history

1. Initial capture: [P2] warm ribbon and skyline too low; headline/CTA too low; mobile normal-flow person preceded copy. Fixed ribbon/skyline offsets, typography spacing, and DOM order. New screenshots captured and compared.
2. Second comparison: [P2] warm ribbon valley extended too far down; tablet 768px roadmap overlapped the heading. Reduced warm ribbon width, added the supplied cool ribbon as a lower-right accent, switched <=1023px to vertical composition, and moved step 02 right at intermediate desktop widths. Fixed mobile dialog focus restoration to return to the menu toggle.
3. Final production capture: no actionable P0/P1/P2 differences under the supplied brief's priorities. Completed full-view and focused text/CTA comparisons. Mobile copy → CTA → person → roadmap order verified visually; no horizontal overflow at tested widths.

## Required fidelity surfaces

- **Typography:** Noto Sans JP as explicitly requested. Main copy is HTML, one line on desktop and two lines on mobile. The reference uses a serif-like Japanese headline; that difference is intentional to satisfy the prescribed font. Weight, scale, gradient, position, description line spacing, and CTA proportions checked in the focused comparison.
- **Spacing/layout:** Desktop logo/nav, left copy and CTA, rising roadmap, right-bottom person, handwriting and growth card reproduce the reference composition. Mobile is a vertical flow with a 2 × 2 roadmap. Header remains independently operable.
- **Colors/tokens:** All six brand hex values stored as CSS variables; step colors use the brief's values. Warm gradient and cyan decorations are subdued. White surfaces and dark text preserve readability.
- **Images:** All seven original RGBA files inventoried and preserved; five raster assets displayed. Roadmap and growth reference rasters are retained but rebuilt with HTML as requested. Person aspect ratio preserved with contain. The supplied standalone person/ribbons differ in exact expression, outline, and opacity from the composited reference; this is a source-asset constraint. There is no full-image hero background.
- **Copy:** All requested headline, eyebrow, description, buttons, four step titles/descriptions, handwritten message, and growth-card message are present. Unprovided commercial details are not invented.

## Functional checks

| Check | Result |
|---|---|
| Page URL/title and meaningful content | Passed |
| Production app, no framework error overlay | Passed |
| Console errors and page exceptions | 0 |
| One h1, one AI element, four roadmap cards | Passed |
| Same AI DOM element moves from center to final position | Passed, identity sampled throughout intro |
| Roadmap entrance order 01 → 02 → 03 → 04 | Passed, approximately 200ms apart |
| Intro duration | 3519.7ms from first animation sample to completion |
| Resize during intro | Passed, finishes in final position |
| Reduced motion | Passed, AI opacity 1 and transform none after reload |
| Courses CTA | Opens real four-step course summary |
| Consultation CTA | Opens honest preparation-state notice |
| Mobile menu and pricing | Menu opens; pricing opens information dialog |
| Escape | Closes modal/menu; desktop CTA focus restored |
| Responsive widths | 375, 390, 430, 768, 1024, 1440; desktop visual reference 1672 |
| Horizontal overflow | None at all tested widths |
| Production build / typecheck / lint | Passed, lint 0 warnings |
| Production dependency audit | 0 vulnerabilities |

Verification scripts were kept in the user's Temp directory, outside product source. Initial 404 was resolved by adding the app icon; final production console check has no errors. Missing browser image decoding at one intermediate mobile capture was addressed in the screenshot procedure by awaiting image decode; fresh and production screenshots show the person.

## Remaining limitations and P3 polish

- Exact reference glyphs cannot coexist with the requested Noto Sans JP; the brief's font requirement is authoritative.
- Subtle source-asset and roadmap icon differences remain; layout and content are verified.
- Real iOS Safari, Android Chrome, assistive-technology audits, and measured Core Web Vitals were not tested. Edge desktop was used for responsive validation.
- Consultation booking endpoint, pricing and articles require owner-provided content before public launch. These controls currently show page-local information dialogs.
- Development-only lint dependency audit reports five high-severity entries in a single transitive braces chain. No patched braces release was available; suggested downgrade of eslint-config-next was not applied. Production dependencies audit clean.

## Implementation checklist

- [x] Supplied assets preserved and used as independent layers.
- [x] Header, HTML copy, CTA, person, ribbons, roadmap and auxiliary visuals implemented.
- [x] GSAP lifecycle cleanup, reduced motion and responsive layouts implemented.
- [x] Production browser, screenshot comparison and interaction checks completed.
- [x] Build, lint, typecheck completed; local production preview remains running.
