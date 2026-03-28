# Shifa AI Production Deployment Guide

This guide is for one simple goal:

Get **Shifa AI** live on the internet using:

- `Vercel Hobby` for the website
- `Convex` for the backend
- `Google` for login
- `Gemini` for AI

If you follow these steps in order, you should not get stuck.

Think of it like 4 boxes:

1. `GitHub` holds your code
2. `Vercel` shows your website
3. `Convex` runs your backend
4. `Google` handles login and Gemini

We are going to connect all 4 boxes together.

---

## Super Short Version

If you are in a hurry, this is the whole flow:

1. Make sure the app works locally
2. Create a Convex production deployment
3. Put Gemini keys in Convex production
4. Create a Google OAuth web app
5. Import the project into Vercel
6. Add env vars in Vercel
7. Set the Vercel build command
8. Deploy
9. Test Google sign-in and protected pages

The rest of this file explains each step slowly.

---

## Step 0: What You Need Before Starting

You need these accounts:

- GitHub
- Vercel
- Convex
- Google Cloud Console
- Google AI Studio

You also need the project code pushed to GitHub.

---

## Step 1: Make Sure It Works On Your Computer First

Open the project folder and run:

```powershell
npm install
npx convex dev
npx tsc --noEmit
npm run build
```

If all 4 commands work, good.

If `npx convex dev` works, it should create `.env.local` and add:

```env
CONVEX_DEPLOYMENT=...
NEXT_PUBLIC_CONVEX_URL=...
NEXT_PUBLIC_CONVEX_SITE_URL=...
```

Do not skip this step.

If it does not work locally, deployment will be harder.

---

## Step 2: Understand Which Secrets Go Where

This is the most important thing to understand.

### Put these in Vercel

These are used by the Next.js app:

```env
NEXTAUTH_URL=
AUTH_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
CONVEX_DEPLOY_KEY=
NEXT_PUBLIC_CONVEX_URL=
```

### Put these in Convex production

These are used by Convex actions:

```env
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash-lite
```

### Put these only in `.env.local`

These are for your local computer only:

```env
NEXTAUTH_URL=http://localhost:3000
AUTH_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
CONVEX_DEPLOYMENT=
NEXT_PUBLIC_CONVEX_URL=
NEXT_PUBLIC_CONVEX_SITE_URL=
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash-lite
```

Important:

- `.env.example` is only a sample
- `.env.local` is for real local secrets
- Vercel has its own env section
- Convex has its own env section

---

## Step 3: Create A Real `AUTH_SECRET`

Run this:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Copy the output.

Use that as:

```env
AUTH_SECRET=your_generated_secret_here
```

Do not use:

```env
AUTH_SECRET=supersecretkey
```

That is too weak for production.

---

## Step 4: Create Or Find Your Convex Production Deployment

Open the Convex dashboard.

Then:

1. open your project
2. find the `production` deployment
3. copy the production deployment URL
4. copy the production deploy key

You will need:

- `NEXT_PUBLIC_CONVEX_URL`
- `CONVEX_DEPLOY_KEY`

They will look something like this:

```env
NEXT_PUBLIC_CONVEX_URL=https://your-production-name.convex.cloud
CONVEX_DEPLOY_KEY=your_long_secret_key
```

---

## Step 5: Put Gemini In Convex Production

This part is easy to miss.

Gemini is used inside Convex actions, so the Gemini key must be stored in Convex production.

First get a Gemini API key from:

https://aistudio.google.com/app/apikey

Then run:

```powershell
npx convex env set --prod GEMINI_API_KEY YOUR_GEMINI_KEY
npx convex env set --prod GEMINI_MODEL gemini-2.5-flash-lite
npx convex env list --prod
```

If `GEMINI_API_KEY` is missing in Convex production, the app will still run, but medicine analysis will return fallback text instead of real AI results.

---

## Step 6: Create Google Login For Production

Open Google Cloud Console.

Then:

1. go to `APIs & Services`
2. go to `Credentials`
3. create or open an `OAuth 2.0 Client ID`
4. choose `Web application`

You will get:

- `AUTH_GOOGLE_ID`
- `AUTH_GOOGLE_SECRET`

Do not close this page yet.

We still need to add URLs.

---

## Step 7: Create The Correct Google URLs

Google needs 2 kinds of URLs.

### Authorized JavaScript origins

Add your local origin:

```text
http://localhost:3000
```

Later, add your production Vercel URL:

```text
https://your-project.vercel.app
```

### Authorized redirect URIs

Add your local callback:

```text
http://localhost:3000/api/auth/callback/google
```

Later, add your production callback:

```text
https://your-project.vercel.app/api/auth/callback/google
```

Very important:

- `origin` is just domain + port
- `redirect URI` is the full callback path
- do not mix them up

Wrong:

```text
https://your-project.vercel.app/api/auth/callback/google
```

inside the origin box.

Right:

```text
https://your-project.vercel.app
```

inside the origin box.

---

## Step 8: Push Your Code To GitHub

Before Vercel can deploy, your code should be in GitHub.

Make sure these files are committed:

- app code
- convex code
- `README.md`
- `DEPLOYMENT.md`

Make sure these are **not** committed:

- `.env.local`
- real secrets

---

## Step 9: Import The Project Into Vercel

Open Vercel.

Then:

1. click `Add New Project`
2. import your GitHub repo
3. let Vercel detect `Next.js`
4. keep the root folder as the repo root
5. open project settings after import

Now we will configure it.

---

## Step 10: Set The Vercel Build Command

In Vercel project settings, find the build settings.

Set the build command to:

```bash
npx convex deploy --cmd "npm run build"
```

Why this matters:

- `npx convex deploy` sends your Convex backend code to production
- `npm run build` builds your Next.js app

This is the easiest setup for this project.

---

## Step 11: Add Environment Variables In Vercel

Open:

`Project Settings -> Environment Variables`

Add these values for `Production`:

```env
NEXTAUTH_URL=https://your-project.vercel.app
AUTH_SECRET=your_generated_secret
AUTH_GOOGLE_ID=your_google_client_id
AUTH_GOOGLE_SECRET=your_google_client_secret
CONVEX_DEPLOY_KEY=your_convex_production_deploy_key
NEXT_PUBLIC_CONVEX_URL=https://your-production-deployment.convex.cloud
```

If you already connected a custom domain, use that instead of `your-project.vercel.app`:

```env
NEXTAUTH_URL=https://yourdomain.com
```

Keep it simple on the free tier:

- configure `Production`
- ignore `Preview` for now

That avoids Google auth problems on random preview URLs.

---

## Step 12: Do The First Deploy

Now trigger a deployment in Vercel.

You can do that by:

1. pushing a commit to your main branch
2. or clicking redeploy in Vercel

Wait until the deployment says `Ready`.

Then open the production URL.

Example:

```text
https://your-project.vercel.app
```

---

## Step 13: Finish Google OAuth For The Real Production URL

Now that Vercel gave you the real production URL, go back to Google Cloud Console and make sure the real URL is added.

If your site is:

```text
https://shifa-ai.vercel.app
```

Then add:

### Authorized JavaScript origins

```text
https://shifa-ai.vercel.app
```

### Authorized redirect URIs

```text
https://shifa-ai.vercel.app/api/auth/callback/google
```

If you use a custom domain, add that too.

---

## Step 14: Test The Live Site

Test these one by one:

1. homepage opens
2. Google sign-in button opens Google
3. login succeeds
4. after login, you return to the app
5. `/dashboard` opens when logged in
6. `/appointments` opens when logged in
7. if logged out, those protected pages redirect back to `/`

If all 7 work, your production deployment is basically correct.

---

## Step 15: Easy Troubleshooting

### Problem: Vercel build fails before the app builds

Usually this means:

- `CONVEX_DEPLOY_KEY` is missing in Vercel
- or the build command is wrong

Check:

```bash
npx convex deploy --cmd "npm run build"
```

### Problem: Google says `redirect_uri_mismatch`

Usually this means the Google callback URL does not exactly match your real production URL.

It must match exactly:

```text
https://your-project.vercel.app/api/auth/callback/google
```

### Problem: Google sign-in button does nothing in production

Usually one of these is missing in Vercel:

- `NEXTAUTH_URL`
- `AUTH_SECRET`
- `AUTH_GOOGLE_ID`
- `AUTH_GOOGLE_SECRET`

### Problem: Medicine analysis shows fallback text only

Usually this means Gemini was not added to Convex production.

Run:

```powershell
npx convex env list --prod
```

Make sure you see:

- `GEMINI_API_KEY`
- `GEMINI_MODEL`

### Problem: Local works but production does not

That usually means:

- local `.env.local` is correct
- Vercel env vars are missing
- or Google production URLs were not added

---

## Step 16: Best Free-Tier Setup

To keep things easy and cheap:

- use `Vercel Hobby`
- use one `Convex production deployment`
- use `gemini-2.5-flash-lite`
- use one Google OAuth app for:
  - `localhost`
  - your one production URL

Do not try to fully support every preview deployment on day one.

That is where most beginner auth headaches come from.

---

## Step 17: The Exact Checklist

If you want the simplest checklist possible, do this in order:

1. Run `npx convex dev`
2. Generate `AUTH_SECRET`
3. Get `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET`
4. Get `CONVEX_DEPLOY_KEY`
5. Get `NEXT_PUBLIC_CONVEX_URL` from Convex production
6. Get `GEMINI_API_KEY`
7. Run `npx convex env set --prod GEMINI_API_KEY ...`
8. Run `npx convex env set --prod GEMINI_MODEL gemini-2.5-flash-lite`
9. Import repo into Vercel
10. Set build command to `npx convex deploy --cmd "npm run build"`
11. Add Vercel production env vars
12. Add Google production origin and callback URL
13. Deploy
14. Test login
15. Test `/dashboard`
16. Test `/appointments`

---

## Official Docs

These are the main references behind this guide:

- Vercel env vars: https://vercel.com/docs/environment-variables
- Vercel project settings: https://vercel.com/docs/project-configuration/project-settings
- Convex CLI: https://docs.convex.dev/cli
- Convex env vars: https://docs.convex.dev/production/environment-variables
- NextAuth: https://next-auth.js.org/
- Google OAuth web apps: https://developers.google.com/identity/protocols/oauth2/web-server
- Gemini API keys: https://ai.google.dev/gemini-api/docs/api-key
- Gemini pricing: https://ai.google.dev/gemini-api/docs/pricing
