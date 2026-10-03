# ZS Creative — Portfolio

Static site (HTML, CSS, vanilla JS). No build step.

## Edit content
Everything editable is in `assets/js/content.js`: email, social URLs, projects, images, case studies.
Empty values are hidden automatically. Put images in `assets/img/` and set `image` and `alt`.

## Run locally
`npx serve .` (or open `index.html`; the contact form only works on Netlify).

## Deploy
1. `git init && git add . && git commit -m "ZS Creative site"`, then push to GitHub.
2. Netlify: Add new site, Import from Git, choose the repo. Build command: empty. Publish directory: `.`
3. Contact form: after the first deploy, Netlify Forms picks up the `contact` form. Enable email notifications under Site settings, Forms.
4. Add your domain and, if you want, a `sitemap.xml` and `og:image` once the domain is known.


## ZS Creative V2 — quick customization

### 1. Edit your contact information
Open `assets/js/content.js` and add your real email and social URLs. Empty values stay hidden.

### 2. Add project images
Put your JPG/PNG/WebP files in `assets/img/`, then set the project's `image` field to `assets/img/filename.jpg`.

### 3. Deploy with GitHub + Netlify
This is a static site. The Netlify publish directory is `.` and there is no build command. Push the project to GitHub, then connect that repository to Netlify.

### 4. Keep the old site until V2 is ready
Use a separate GitHub repository or branch while editing. Switch the Netlify site only after you have tested the new version on desktop and mobile.
