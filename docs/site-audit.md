# wivork site audit — 12 October 2026

## Completed visual changes

- Process photography is bounded at 1,080 CSS pixels, centered, and rounded. Explanations sit below the images, with separate WhatsApp and process links.
- Both carousels auto-advance every 5.5 seconds with a 650ms dissolve. The previous image stays visible while the next image downloads and decodes. Keyboard focus, offscreen state, hidden tabs, and reduced-motion preferences pause automatic progression. Hover keeps playback running; the explicit pause control remains available.
- Both carousels use compact pill indicators with an active progress bar, small dots, and a round pause control. Four gallery backgrounds now use consistent charcoal studio treatments.
- The process follows a woman through reference photographs, sculpting, printing, and painting. The upload scene communicates sending photographs; the painting scene contains only the artist's hand.
- The closing banner uses the requested black-outfit miniature. The logo has a faint shadow. Footer colors and content are preserved, with consistent 16px corners. The blanket AI-generated footer label is removed.
- Product and process panels use distinct ash and white backgrounds. Their rounded outer edges expand and contract as they pass through the center of the viewport in either scroll direction.
- Mobile spacing, button wrapping, process chapter labels, and navigation are improved.
- The Packages page keeps its dark background and dark navigation, with a light single-person card and dark couple card. Selecting Portrait busts changes the sculpting, printing, and painting illustrations to upper-body busts. Shorter descriptions and three inclusions avoid repeating size and price information. Existing sizes and prices are retained; process explanations are condensed and spaced consistently. Process photography uses portrait crops with explicit sizing to prevent tall letterboxed image boxes.
- Landing product photographs are rounded independently, with the descriptions and actions on the pale section background.

## Production image quality and loading

| Asset | Actual resolution | Encoded size |
| --- | --- | --- |
| Reference upload | 1672 × 941 | 188 KiB |
| Digital sculpture | 1672 × 941 | 130 KiB |
| Resin printing | 1672 × 941 | 158 KiB |
| Hand painting | 1672 × 941 | 125 KiB |
| Detailed film frames | 1280 × 720 | Samples: 10–21 KiB per frame |
| Legacy fallback samples (unused) | 384 × 216 | First sample: 1.6 KiB |

The landing slideshow directly loads the full 1672 × 941 WebP; it does not intentionally serve a low-quality thumbnail. A selected replacement is decoded before the dissolve starts. Its maximum display width is 1,080px, giving about 1.55 source pixels per CSS pixel. This is suitable for ordinary desktop displays and phone layouts, but below the 2× resolution ideal for a full-width 1,080px Retina presentation.

The fullscreen `/process` film contains 481 detailed frames totaling 6.95 MiB of encoded data. It uses a small decoded-frame cache, neighboring-frame loading, and low-priority background warming. After the scrolling-quality fix, it keeps the last decoded 1280 × 720 frame until the next detailed frame is ready. It no longer draws the 384 × 216 fallback samples. Current-frame requests take priority over speculative neighbors. A matching higher-resolution original is needed for genuine 1080p detail.

Recommended next steps, in priority order:

1. **Implemented:** preload and decode the next landing slide while the carousel is visible, at low priority. Keep the existing image visible until the incoming full-quality image is ready. Reduced motion and data-saving preferences skip speculative loading.
2. Verify actual cache headers on the deployed host. The repository has configurations for hosts that recognize `_headers` and an nginx example; localhost does not prove either is enabled in production.
3. For sharper large-screen landing imagery, export genuinely higher-resolution source images at 2160px or 2560px wide, alongside smaller responsive variants with `srcset` and `sizes`. Upscaling an existing image does not restore real detail.
4. For a sharper fullscreen film, export from a genuine 1080p or higher original. Keep smaller frames for mobile/data-saving connections; load the current detailed frame before speculative neighbors. Evaluate video delivery if future clips become longer or substantially larger.
5. Measure cold-cache and warm-cache behavior with network throttling on the deployed URL. Caching improves repeat visits; it does not remove the download time of a first visit or guarantee zero lag.

After the hosting platform was confirmed, Vercel-specific browser cache rules and build settings were added in `vercel.json`, with Node 24 selected in `package.json`. They take effect on the next Vercel deployment. See [the Vercel deployment notes](vercel-deployment.md). The deployed cache headers still need verification.

## Cache findings

The original alternative-host configuration in `public/_headers` declares one-year caching for built JavaScript/CSS, fonts, and film frames, and 30-day caching for process and product media. `deploy/nginx-cache.conf` provides similar rules. These files do not configure Vercel. The new `vercel.json` covers hero media and avoids overlapping image, frame, and HTML rules; the findings below refer to the original alternative-host files.

- **Missing hero rule:** `/work/` is absent from `_headers`, so the gallery relies on host defaults.
- **Overlapping film rules:** `/process/frames/*` also matches `/process/*`. Cloudflare combines repeated headers, so these can produce conflicting `max-age` values. Use mutually exclusive image and frame patterns. [Cloudflare header behavior](https://developers.cloudflare.com/pages/configuration/headers/)
- **HTML coverage:** `/process/*` can also match `/process/` or `/process/index.html`. HTML should revalidate rather than inherit a month-long image cache policy.
- **Asset versioning:** One-year `immutable` caching should use URLs that change when content changes. Frame and font names currently do not contain content hashes. Use versioned directories or names when replacing those files. The revised slideshow images already have versioned filenames. [MDN Cache-Control guidance](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cache-Control)
- **Host verification:** `_headers` works on supported static hosts; it does not configure every hosting platform or responses from Cloudflare Pages Functions automatically. The host has now been confirmed as Vercel; its public production URL has not been provided. [Cloudflare Pages headers](https://developers.cloudflare.com/pages/configuration/headers/)

## SEO and AI search readiness

SEO helps search engines crawl, understand, and surface a site. AISO is commonly used for AI search optimization, also called AEO or GEO: making business information easy for AI search systems to understand and cite. Google's AI search features use the same underlying SEO requirements; special AI markup or an `llms.txt` file is not required for inclusion, and inclusion is not guaranteed. [Google AI search guidance](https://developers.google.com/search/docs/appearance/ai-features)

Present in this checkout: unique titles and descriptions for the three pages, semantic headings, image alt text, internal links, and prerendered HTML content.

Not found in the source audit: canonical URLs, sitemap configuration/files, a robots.txt file, Open Graph metadata, or JSON-LD structured data. A missing robots.txt does not itself block crawling. The preferred production domain is needed for correct absolute canonical and sitemap URLs.

Recommended content: a clear business description mentioning custom portrait miniatures in Sri Lanka, dedicated product information, verified prices, available sizes and materials, reference-photo requirements, turnaround and delivery details, and concise answers to common customer questions. Add only accurate business/product structured data that matches visible content. Verify the deployed domain in Search Console and maintain consistent real business details.

## Verification

The final production build and `git diff --check` passed. Browser checks covered the home, packages, and process pages at 320px, 390px, 768px, and 1920px, with additional earlier checks at 375px and 1440px. No horizontal overflow or broken loaded images were observed. Auto-slide with dissolve, continued playback on hover, arrows, step selection, mobile navigation, and reduced-motion behavior passed with no browser errors. Separate final checks verified accurate prices and bust-specific imagery at 320px, 768px, and 1440px, distinct ash/white section backgrounds, and reversible panel expansion.

Production CDN behavior, live search indexing, and performance on an actual customer's network remain unverified without the deployed site URL.
