# wivorK site audit — 12 October 2026

## Completed visual changes

- Process photography is bounded at 1,080 CSS pixels, centered, and rounded. Explanations sit below the images, with separate WhatsApp and process links.
- Both carousels auto-advance every 5.5 seconds with a 650ms dissolve. The previous image stays visible while the next image downloads and decodes. Keyboard focus, offscreen state, hidden tabs, and reduced-motion preferences pause automatic progression. Hover keeps playback running; the explicit pause control remains available.
- Both carousels use compact pill indicators with an active progress bar, small dots, and a round pause control. Four gallery backgrounds now use consistent charcoal studio treatments.
- The process follows a woman through reference photographs, sculpting, printing, and painting. The upload scene communicates sending photographs; the painting scene contains only the artist's hand.
- The closing banner uses the requested black-outfit miniature. The logo has a faint shadow. Footer colors and content are preserved, with consistent 16px corners. The blanket AI-generated footer label is removed.
- Product and process panels use distinct ash and white backgrounds. Their rounded outer edges expand and contract as they pass through the center of the viewport in either scroll direction.
- Mobile spacing, button wrapping, process chapter labels, and navigation are improved.
- The Packages page keeps its dark background and dark navigation, with a light single-person card and dark couple card. Shorter descriptions and three inclusions avoid repeating size and price information. Existing sizes and prices are retained; process explanations are condensed and spaced consistently.
- Landing product photographs are rounded independently, with the descriptions and actions on the pale section background.

## Production image quality and loading

| Asset | Actual resolution | Encoded size |
| --- | --- | --- |
| Reference upload | 1672 × 941 | 188 KiB |
| Digital sculpture | 1672 × 941 | 130 KiB |
| Resin printing | 1672 × 941 | 158 KiB |
| Hand painting | 1672 × 941 | 125 KiB |
| Detailed film frames | 1280 × 720 | Samples: 10–21 KiB per frame |
| Film fallback samples | 384 × 216 | First sample: 1.6 KiB |

The landing slideshow directly loads the full 1672 × 941 WebP; it does not intentionally serve a low-quality thumbnail. A selected replacement is decoded before the dissolve starts. Its maximum display width is 1,080px, giving about 1.55 source pixels per CSS pixel. This is suitable for ordinary desktop displays and phone layouts, but below the 2× resolution ideal for a full-width 1,080px Retina presentation.

The fullscreen `/process` film contains 481 detailed frames totaling 6.95 MiB of encoded data. It uses a small decoded-frame cache, neighboring-frame loading, and 20 low-resolution fallback samples. It starts background loading all detailed frames after 1.5 seconds unless reduced motion or data saving is active. That helps later scrubbing, but the first interaction can still use a fallback while a detailed frame is pending. A high-resolution canvas cannot recover detail absent from the 720p source.

Recommended next steps, in priority order:

1. Preload and decode the next landing slide while the current slide is visible. Keep the existing previous image visible until the incoming full-quality image is ready. Start this work near the viewport, rather than immediately downloading every lower-page image.
2. Verify actual cache headers on the deployed host. The repository has configurations for hosts that recognize `_headers` and an nginx example; localhost does not prove either is enabled in production.
3. For sharper large-screen landing imagery, export genuinely higher-resolution source images at 2160px or 2560px wide, alongside smaller responsive variants with `srcset` and `sizes`. Upscaling an existing image does not restore real detail.
4. For a sharper fullscreen film, export from a genuine 1080p or higher original. Keep smaller frames for mobile/data-saving connections; load the current detailed frame before speculative neighbors. Evaluate video delivery if future clips become longer or substantially larger.
5. Measure cold-cache and warm-cache behavior with network throttling on the deployed URL. Caching improves repeat visits; it does not remove the download time of a first visit or guarantee zero lag.

No production cache configuration changes were made as part of this report.

## Cache findings

`public/_headers` currently declares one-year caching for built JavaScript/CSS, fonts, and film frames, and 30-day caching for process and product media. `deploy/nginx-cache.conf` provides similar rules.

- **Missing hero rule:** `/work/` is absent from `_headers`, so the gallery relies on host defaults.
- **Overlapping film rules:** `/process/frames/*` also matches `/process/*`. Cloudflare combines repeated headers, so these can produce conflicting `max-age` values. Use mutually exclusive image and frame patterns. [Cloudflare header behavior](https://developers.cloudflare.com/pages/configuration/headers/)
- **HTML coverage:** `/process/*` can also match `/process/` or `/process/index.html`. HTML should revalidate rather than inherit a month-long image cache policy.
- **Asset versioning:** One-year `immutable` caching should use URLs that change when content changes. Frame and font names currently do not contain content hashes. Use versioned directories or names when replacing those files. The revised slideshow images already have versioned filenames. [MDN Cache-Control guidance](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cache-Control)
- **Host verification:** `_headers` works on supported static hosts; it does not configure every hosting platform or responses from Cloudflare Pages Functions automatically. The deployment host and public production URL were not established in this audit. [Cloudflare Pages headers](https://developers.cloudflare.com/pages/configuration/headers/)

## SEO and AI search readiness

SEO helps search engines crawl, understand, and surface a site. AISO is commonly used for AI search optimization, also called AEO or GEO: making business information easy for AI search systems to understand and cite. Google's AI search features use the same underlying SEO requirements; special AI markup or an `llms.txt` file is not required for inclusion, and inclusion is not guaranteed. [Google AI search guidance](https://developers.google.com/search/docs/appearance/ai-features)

Present in this checkout: unique titles and descriptions for the three pages, semantic headings, image alt text, internal links, and prerendered HTML content.

Not found in the source audit: canonical URLs, sitemap configuration/files, a robots.txt file, Open Graph metadata, or JSON-LD structured data. A missing robots.txt does not itself block crawling. The preferred production domain is needed for correct absolute canonical and sitemap URLs.

Recommended content: a clear business description mentioning custom portrait miniatures in Sri Lanka, dedicated product information, verified prices, available sizes and materials, reference-photo requirements, turnaround and delivery details, and concise answers to common customer questions. Add only accurate business/product structured data that matches visible content. Verify the deployed domain in Search Console and maintain consistent real business details.

## Verification

Browser checks covered the home, packages, and process pages at widths from 320px to 1920px: no horizontal overflow or broken loaded images were observed. Slideshow auto-advance, hover pause, arrows, step selection, mobile navigation, and reduced-motion behavior passed before the final imagery and dissolve refinements. The panel animation was subsequently changed, at the user’s request, to expand and contract while scrolling in either direction. Final verification results are reported with the handoff.

Production CDN behavior, live search indexing, and performance on an actual customer's network remain unverified without the deployed site URL.
