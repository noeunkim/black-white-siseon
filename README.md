
# Heukbaek Siseon (흑백시선)

A responsive web application that delivers daily hot issues with balanced two-sided perspectives.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** CSS Modules / Vanilla CSS (with CSS Variables for theming)
- **Deployment:** Vercel

## Deployment on Vercel

This project is optimized for deployment on [Vercel](https://vercel.com).

1.  **Push to GitHub:**
    Initialize a git repository and push this code to GitHub.
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    git branch -M main
    git remote add origin <your-repo-url>
    git push -u origin main
    ```

2.  **Import to Vercel:**
    - Go to your Vercel Dashboard.
    - Click **"Add New..."** -> **"Project"**.
    - Import the GitHub repository you just created.

3.  **Configure:**
    - **Framework Preset:** Next.js (Should be auto-detected)
    - **Build Command:** `next build` (Default)
    - **Output Directory:** `.next` (Default)
    - **Environment Variables:** None required for this MVP.

4.  **Deploy:**
    - Click **"Deploy"**.
    - Vercel will build and deploy the application.

## Image Optimization

The project uses `next/image` for image optimization.
Configuration in `next.config.ts` allows images from:
- `placehold.co` (Used for mock images)

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
