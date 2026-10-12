# Vercel deployment and caching

This project is a static Astro site. Vercel can build and serve it without an Astro Vercel adapter. Vercel caches static files on its CDN automatically; browser caching is a separate policy. [Astro deployment guide](https://docs.astro.build/en/guides/deploy/vercel/), [Vercel CDN documentation](https://vercel.com/docs/caching/cdn-cache)

## Repository configuration

`vercel.json` selects Astro, runs `npm run build`, and serves `dist`. Its headers give content-hashed `/_astro/` files one year of immutable browser caching, unchanged-name fonts 30 days, and public media (including hero photos, process illustrations, and film frames) one day. HTML revalidates. Media rules do not overlap the HTML routes or each other. New versions of public assets should keep using new filenames so an update does not wait for the old browser cache to expire. [Vercel custom headers](https://vercel.com/docs/project-configuration/vercel-json#headers)

The original `public/_headers` and nginx example are retained for other hosts; they do not configure Vercel. `package.json` selects Node 24, matching the local build and satisfying the installed Astro requirement of Node >=22.12. Vercel supports Node 24. [Node version selection](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions)

The visible landing carousel preloads and decodes its next full-quality image at low priority. Data-saving and reduced-motion preferences skip that speculative request. The current image remains visible until its replacement decodes.

The process film now keeps the previous decoded 1280 × 720 frame while waiting for the next detailed frame. It no longer draws 384 × 216 fallback thumbnails during scrolling. Current-frame requests have higher priority than neighboring frames and background cache warming. A matching higher-resolution film original would be needed to add genuine 1080p detail.

## Optional CLI workflow

From the project directory:

```sh
npm install -g vercel
vercel login
vercel link
vercel
```

During `vercel link`, select your existing Vercel project. `vercel` creates a preview deployment. Production publication uses `vercel --prod` once the preview is ready. A Git-connected project can deploy through Vercel's existing Git workflow instead; the CLI is optional. [Vercel CLI](https://vercel.com/docs/cli)

If configuring through the dashboard, use framework **Astro**, build command **npm run build**, output **dist**, and Node **24.x**.

## Verify after deployment

Use the deployment URL to check:

```sh
curl -I https://YOUR-DOMAIN/work/hero-16x9/yellow-sari-studio-v2.webp
curl -I https://YOUR-DOMAIN/process/frames/f_0240.webp
curl -I https://YOUR-DOMAIN/process
```

The images should return `Cache-Control: public, max-age=86400`; HTML should revalidate. Check `x-vercel-cache` on repeated requests to inspect CDN behavior. Browser DevTools can separately show browser memory/disk cache reuse. Compare cold and warm loads under network throttling and scrub the film quickly in both directions. Local preview cannot verify Vercel's response headers. [Vercel response headers](https://vercel.com/docs/headers/response-headers)

No Vercel deployment, account linking, or global CLI installation was performed in this session.

Validation completed locally: the Astro build passed, 13 representative URL patterns matched one intended browser-cache policy, and HTML paths did not match long-lived media rules. A browser check confirmed next-slide preloading. Under delayed frame downloads, fast scroll jumps rendered 21 frames across five positions, all at 1280 × 720, with zero thumbnail requests and zero browser errors.
