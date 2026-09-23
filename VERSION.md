# LinkHavoc Version History

## Current Version: v1.0.0 (LinkHavoc rebrand)

### v1.0.0 - LinkHavoc
LinkHavoc is a rebranded fork of **LittleLink v3.11.0** (07/28/2026, MIT license, copyright Seth Cottle 2019–2024). This fork replaces the LittleLink identity with the LinkHavoc creator-page experience.

Major changes in this release:

- **Rebrand**: LittleLink → LinkHavoc. Replaced user-facing identity, titles, descriptions, social/Open Graph metadata, favicon, brand assets, and documentation. Preserved the MIT license and LittleLink attribution in the footer, `README.md`, and `LICENSE.md`.
- **Design**: Implemented a single cream light theme based on the LinkHavoc design system (Replicate-style direction):
  - Warm cream canvas `#f9f7f3`, ink `#202020`, hairline borders, fully-pill-shaped interactive elements.
  - Signature orange `#ea2804` reserved for a single primary CTA per viewport.
  - Black (`#000`) footer band with on-dark text.
  - Self-hosted font stack: Bricolage Grotesque (display), Inter (body/UI), JetBrains Mono (mono) — replacing the proprietary rb-freigeist-neue / basier-square families and the previous Google Fonts delivery.
- **Architecture**:
  - Removed `css/brands.css`, the legacy theme (`theme-auto` / `theme-light` / `theme-dark`) machinery, and the workflows/contrast check that depended on `brands.css`.
  - Icons are now inlined in the HTML (colorable via `currentColor`) instead of separate per-brand SVG files.
  - Added a dependency-free `scripts/build.mjs` and `vercel.json`; `npm run build` validates all local asset references and emits a clean `dist/` for deployment.
- **Assets**: replaced placeholders with SVGs rendered as in-repo source (`images/favicon.svg`, `images/avatar.svg`, `images/og-image.svg`). Favicon is now an SVG (see note below).
- **Content**: demo creator profile "Avery Quinn" with realistic (fictional) example links; no fabricated testimonials or usage claims.

### GNU/Fediverse and other LittleLink-era notes
The underlying page is a static single file; all upstream LittleLink versions prior to this fork (v3.11.0 back to v1.0.0) are documented upstream at:
https://github.com/sethcottle/littlelink/releases

#### Known manual-review items before production use
- **OG image format**: social scrapers (Facebook, LinkedIn) historically reject SVG `og:image` values; some deliver them. If broad sharing compatibility matters, rasterize `images/og-image.svg` to a 1200×630 PNG and update the `og:image` / `twitter:image` attributes in `index.html`, and the favicon link to a `.ico`/`.png` if an SVG favicon is unsupported in your target context. Browsers support SVG favicons (Chrome, Safari, Edge, Firefox ≥ 41).
- **Canonical / absolute URLs**: `og:url` and any canonical references are intentionally left as placeholders until a real production domain exists. Fill them before launch.
- **Broken link placeholders**: demo links in `index.html` intentionally point to `#` — replace them with real destinations.