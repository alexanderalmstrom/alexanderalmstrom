# alexanderalmstrom.com

1. Copy `.env.example` to `.env` and replace the corresponding values for Contentful space id and access token.

## Install

Install dependencies.

```bash
pnpm install
```

## Development

Run the Vite dev server on port 3000.

```bash
pnpm run dev
```

Type check the TypeScript sources.

```bash
pnpm run typecheck
```

## Build

Create a `build` directory with bundled assets.

```bash
pnpm run build
```

## Server

A static node express server for testing. Requires `pnpm run build` first, since it serves the `build` directory.

```bash
pnpm run start
```

## Deploy to Netlify

Install netlify-cli.

```bash
npm install netlify-cli -g
```

Deploy app.

```bash
netlify deploy
```
