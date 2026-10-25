# Navora Gallery

A static, responsive gallery built with plain HTML, CSS, and JavaScript. All images, the official Navora logo, the favicon, and the Fredoka font are stored in this repository. The page does not need a build step, backend, package installation, API key, or paid hosting service.

## Preview locally

Open `index.html` in a browser, or run `python3 -m http.server 8000` in this folder and visit `http://localhost:8000/`.

## Publish with GitHub Pages

1. Upload the contents of this folder to the `main` branch of the GitHub repository. Keep `index.html` at the repository root.
2. In the repository, open **Settings → Pages → Deploy from a branch → main → / (root)**, then save.
3. Wait for GitHub Pages to finish deploying. The site will work at the repository Pages URL or a custom domain because every local path is relative.

No `CNAME` file is included. Add one only after choosing the gallery domain.

## Gallery controls

Select a category to filter the photos. Open any photo to view it in full. The popup supports previous and next buttons, thumbnails, left and right arrow keys, Escape, backdrop click, and a horizontal swipe on touch screens. Focus returns to the photo that opened it.

## Files and credits

- `index.html`, `css/styles.css`, `js/gallery.js`: complete website source.
- `assets/images/`: the original locally optimized WebP gallery photos and illustration.
- `assets/supplied/`: 97 additional supplied images, including the store mockup versions, optimized as WebP with descriptive filenames.
- `assets/brand/`: supplied official Navora artwork. The favicon is a crop of the supplied mark.
- `assets/fonts/Fredoka.ttf`: Fredoka variable font from the [Google Fonts repository](https://github.com/google/fonts/tree/main/ofl/fredoka), licensed under the SIL Open Font License in `assets/fonts/OFL.txt`.
- `screenshots/`: desktop, mobile, and mobile popup previews.

Gallery images are lazy loaded below the hero. Reduced motion settings are respected.
