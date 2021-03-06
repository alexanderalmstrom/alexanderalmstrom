# alexanderalmstrom.com

1. Edit `.env.example` with your Contentful space id and token. Rename it to `.env`. Or copy the content of  `.env.example` and create a new `.env` file.

## Install

Install npm dependencies.

```
yarn install
```

## Development

Run webpack dev server.

```
yarn run start
```

## Build

Create a `build` directory with bundled assets.

```
yarn run build
```

## Server

A static node express server for testing.

```
yarn run server:dev
```

or

```
yarn run server:prod
```

## Deploy to Netlify

Install netlify-cli.

```
npm install netlify-cli -g
```

Deploy app.

```
netlify deploy
```
