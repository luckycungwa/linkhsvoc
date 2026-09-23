# LinkHavoc

A simple personal creator page where you put your important links, content, and identity in one place.

LinkHavoc is a rebranded fork of [LittleLink](https://github.com/sethcottle/littlelink) (MIT) and keeps its lightweight, static, dependency-free philosophy: a single page, a couple of CSS files, no framework, no build tooling required.

**Links. Content. Identity. One page.**

- Profile / avatar
- Creator name, username, short bio
- Social links
- Primary link buttons
- Optional content sections
- Clear footer / branding
- Responsive mobile experience

## Quick start

Open `index.html` directly, or serve it:

```bash
npm run build
```

The build scripts validates every local asset reference (no broken links, fonts, images) and emits a clean, deployable copy into `dist/`.

For local preview from `dist/` while developing, any static server works, e.g.:

```bash
npx serve dist
```

Continue editing `index.html`, `css/style.css`, and `images/` as you would any static site — no rebuild step is required to run from the repo root.

## Deploy

LinkHavoc is a static site and deploys anywhere. The `dist/` output is what Vercel serves.

### Vercel (recommended)

1. Push this repository to GitHub/GitLab/Bitbucket.
2. In Vercel, **New Project** → import the repository.
3. Vercel reads `vercel.json` and runs `npm run build`, serving `dist/`.
4. Deploy.

### Other platforms

- **Cloudflare Workers / Pages** — use `wrangler.toml` (Workers assets) with the repo root as the static asset directory.
- **Netlify / Amplify / GitHub Pages** — point the publish directory at `dist/` (or serve the repo root directly; no build is required).
- **DigitalOcean App Platform** — use `.do/deploy.template.yaml`.
- **Docker / home lab** — see `docker/README.md`.

## Customization

All content lives in `index.html`:

- Profile: replace `images/avatar.svg`, the name, handle, and bio.
- Social links: edit the `.socials` block; each link is a pill with an inlined monochrome icon.
- Links: edit the `.link-list` block. Use exactly one `.button-primary` for the page's primary action, and `-outline` / `-dark` variants for the rest. The system deliberately keeps orange scarce — one primary element per viewport.
- Colors and tokens live at the top of `css/style.css`.

Icons are inlined directly in the HTML (not `<img>` or `<use>`), so they inherit `currentColor` from their `<a>` — no brand-color files to manage.

## Accessibility

LinkHavoc maintains the LittleLink baseline:

- Semantic HTML and landmarks (`nav`, `main`, `header`, `footer`)
- Visible focus states (`ring-focus`)
- Accessible labels and alt text
- Contrast designed for cream / white surfaces
- Fully keyboard operable
- `prefers-reduced-motion` respected

## License and attribution

This project is MIT licensed. It is a fork of [LittleLink](https://github.com/sethcottle/littlelink), copyright Seth Cottle 2019–2024.

- The full MIT text is in [LICENSE.md](LICENSE.md).
- The homepage footer credits LittleLink and links to its license.

## Versioning

See [VERSION.md](VERSION.md) for the base LittleLink version this fork started from and the LinkHavoc changelog.