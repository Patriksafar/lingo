# Lingo

Lingo is an open-source translations management tool. You can easily deploy Lingo to Vercel.

## Getting Started

We aim to minimize configuration requirements so you can focus on building your i18n app with minimal hassle.

### Tech Stack

- [`shadcn/ui`](https://ui.shadcn.com/): Beautifully designed components that you can copy and paste into your apps. Made with Tailwind CSS. Open source.
- [Auth.js](https://authjs.dev/): Easy-to-setup authentication for the Web. Open source.
- [Tailwind CSS](https://tailwindcss.com/): A utility-first CSS framework packed with classes.

### Set Up Your Database

You can use your own database, but we highly recommend using Vercel's PostgreSQL for easy setup.

1. Go to your Vercel profile and navigate to `Storage` -> `Create database` -> `Postgres`.
2. Copy the `POSTGRES_URL` to your local `.env.local` file.

### Set Up Your Environment

Next, you need to set a few variables for authentication.

1. Generate your own secure `AUTH_SECRET` by running the command:

   ```bash
   npx auth secret
   ```

2. Copy the generated key to your `.env.local` file.

We currently implement the Google OAuth provider, so you need to get your own Google credentials from your Google Cloud console.

Since we are using [NextAuth](https://authjs.dev/), you can check their [documentation on how to set up credentials for Google](https://console.developers.google.com/apis/credentials).

Add the following to your `.env.local` file:

```
AUTH_SECRET=""
AUTH_GOOGLE_ID=""
AUTH_GOOGLE_SECRET=""
```

### Run the Development Server

Finally, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.
