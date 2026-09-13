# Tiety

A responsive services website covering website development, custom AI coding, IT support, and networking.

## Files

- `index.html` — ready to open from the Desktop; also the GitHub Pages entrypoint.
- `dist/index.html` — canonical page source.
- `dist/assets/` — stylesheet, interactions, and original hero artwork.
- `scripts/` — dependency-free local preview, homepage sync, and validation utilities.
- `DATABASE.md` — the complete data and storage inventory.
- `ASSETS.md` — asset provenance.
- `.openai/hosting.json` — preserved configuration for the earlier Sites project.
- `.nojekyll` — serves this static project directly on GitHub Pages.

The complete site uses HTML, CSS, and JavaScript with local assets and system fonts. No package installation or compilation is required.

## Open and edit

Open `index.html` directly, or run `node scripts/serve.mjs` and visit `http://127.0.0.1:4173/`.

Edit the canonical files under `dist/`. Then run `node scripts/sync.mjs` to update the root homepage and `node scripts/validate.mjs` to check both entrypoints and their asset references.

## GitHub Pages

Repository: https://github.com/ethan55801/Tiety.co

In repository Settings → Pages, select Deploy from a branch, then `main` and `/ (root)`. Save the setting. All asset paths are relative, so the site works beneath the repository path. The root homepage is generated from the canonical source; keep it in sync when editing.

## Project brief and data

The project brief form prepares a text file that visitors can preview, copy, or save to their own device. It does not send an enquiry, contact an inbox, or save a customer record. Editing any field clears the prepared copy to prevent saving outdated details. The only local preference is the animation pause setting. Navigation remains available if scripts fail, and the decorative animation starts only when its pause control is ready. See `DATABASE.md` for details.

## Content and accessibility

The site includes responsive navigation, native expandable service details and FAQs, scroll reveals, a floating hero, a motion pause control, and support for the device's reduced-motion preference. Scenarios describe possible projects; they are not claims about completed client work. The company long name and contact details still need owner confirmation and have not been invented.

The local `work/` folder retains previous versions and working archives and is excluded from Git. No passwords, access tokens, personal customer records, or environment secrets belong in the repository.
