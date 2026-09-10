# Graysen Gould — Portfolio

A personal portfolio site built as an interactive, terminal-themed single-page app. Instead of a traditional scrolling page, the site simulates a command-line shell — visitors can click bracketed nav links (`[about]`, `[work]`, `[projects]`, etc.) or type commands directly to explore sections like About, Contact, News, Work Experience, Education, Research, Projects, Skills, and Personal.

## Technologies Used

- [React](https://react.dev/) — UI components and state
- [Vite](https://vitejs.dev/) — dev server and build tooling
- Plain CSS (custom properties / no framework)
- JavaScript (ES modules)
- **Cloudflare Workers** — static asset hosting/deployment (see `wrangler.toml`)

## Deployment

This project is **not** deployed with GitHub Pages. It's built with Vite and deployed as a Cloudflare Workers static-assets site using [Wrangler](https://developers.cloudflare.com/workers/wrangler/). `wrangler.toml` points Cloudflare at the `./dist` folder produced by `npm run build`.

To deploy:

```bash
npm run build
npx wrangler deploy
```

## Viewing the Project Locally

```bash
git clone https://github.com/GraysenGould/portfolio.git
cd portfolio
npm install
npm run dev
```

Then open the local URL Vite prints (typically `http://localhost:5173`).

To produce and preview a production build:

```bash
npm run build
npm run preview
```
