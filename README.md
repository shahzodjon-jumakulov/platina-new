# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Platina: local development

- The API base URL comes from `BASE_URL` and **defaults to production** (`https://cp.platina.uz`).
  Against a local backend: `BASE_URL=http://localhost:8000 npm run dev`
- Backend setup, restoring the DB and media, and the Telegram safety step:
  `LOCAL_DEV.md` in `github.com/shahzodjon-jumakulov/platina-back`
- Known issues, including the sitemap load storm in `server/utils/feed.ts`: `ISSUES.md` (#3) in the same repo
- Production: pm2 `ecosystem.config.cjs` (8 instances, port 3003); deploy with `npm ci && npm run build && pm2 restart platinauz`
