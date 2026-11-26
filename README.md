# Little Makes

An original, mobile-first children's artwork gift storefront built with Next.js App Router, TypeScript, Tailwind CSS, shadcn-style Button (Radix Slot/CVA), Radix Dialog and Lucide. ILS pricing; English and Hebrew/RTL storefront and creator controls.

## Run locally

Node 20.9+ required.

```sh
npm install
cp .env.example .env.local
npm run dev
```

Open http://127.0.0.1:3000. `npm run lint`, `npm test`, and `npm run build` validate the project. With an unconfigured local demo running, `npm run test:api` checks upload/privacy, template and validation gates using a synthetic image. `npm start` serves the production build.

## What works

Drawing template → consent/upload → private demo preview → product and finish/size → bag → coupon/quantity → order-detail form. HELLO10 discounts 10% (rounded to whole ILS); ₪29 delivery, free from ₪249 after discount. No invented reviews, countdowns, scarcity, automatic email capture, or simulated payment success. The offer can be dismissed. The bag is in memory for the current visit; it does not persist children's images to browser storage.

The storefront uses the 40 generated product examples in `public/catalog/`. The hero displays two continuous, counter-moving rows, with a pause button and support for reduced motion. Upload the intended drawing to view it throughout the page and creator. Mockups preserve the uploaded image; they do not claim background removal, character extraction, or image generation. Product specifications and prices are proposed catalogue configuration, requiring merchant approval.

## Architecture

- `lib/products.ts`: catalogue and price calculations; server pricing must use this data when checkout is enabled.
- `components/storefront.tsx`: responsive landing page and controlled creator/cart flow.
- `components/ui/button.tsx`: reusable shadcn-style Button; accessible Radix Dialog supplies focus trapping, Escape and restoration.
- `lib/server.ts`: `PrivateStorage`, `ArtworkProvider`, `MockupRenderer` interfaces. Local filesystem adapter and explicit demo provider. Sharp validates decodable images, caps pixels, normalizes orientation, removes metadata and outputs JPEG.
- `POST /api/uploads`: consent + allowlist + 10 MB validation. Session-bound files outside public. `GET/DELETE /api/uploads/:id` require the same HttpOnly, SameSite=Strict session. Random UUID filenames, no original names. Private/no-store responses. Delete removes the file and current bag references.
- `POST /api/jobs`: validates upload ownership, selected template and drawing-check result, then returns an explicit `demo_ready` job. It never calls an external AI provider.
- `lib/models.ts`: admin-ready order/payment/artwork status model.
- `POST /api/orders`: deliberately returns 503 configuration_required. The order form does not transmit its contact/address fields. No order is created and no payment is taken.

## Before accepting real orders

### Optional AI artwork

For a local trial, set `ARTWORK_PROVIDER=openai`, `OPENAI_API_KEY`, and both existing drawing-validator settings. The upload screen offers a separate opt-in to send the drawing to OpenAI. Only a verified drawing can use generation. The result is a downloadable transparent PNG for the selected sticker, cushion, or magnetic-story template and is accessible through the same private session. Deleting the drawing also removes its generated PNG. The gift gallery continues to preview the original drawing.

The 40 additional catalog gifts use a 2048 × 2048 px master motif for print review. Engraved products request monochrome linework. Catalog photos are generated product examples.

Sticker output is a 1760 × 2480 px portrait sheet, cushion output is 2048 × 2048 px, and magnetic pieces use 2048 × 1536 px. Review the artwork with the printer for final dimensions, cut paths, bleed, and color requirements. Before enabling the paid API on a public deployment, configure persistent private storage, retention, and generation quotas. The current filesystem adapter is for local use.

This is a working local demo with a production-oriented separation of concerns, **not a live commerce backend**. Replace local storage with private encrypted object storage and signed, owner-checked reads. Add durable database sessions/auth, job queue and status polling, rate limiting, proxy-level request-body limits, abuse monitoring, scheduled retention/deletion, database-backed orders and webhook-verified payments. Local session lasts 24 hours; local files currently require explicit deletion or operator cleanup and are not automatically purged. Do not deploy the local filesystem adapter to ephemeral/serverless hosts or serve `.private` through a web server.

Implement provider calls only on the server using environment secrets. Forward artwork only to a contracted provider after informed consent, with training disabled and a retention agreement. Keep originals immutable and connect generated assets to ownership and deletion records. Retrying queues/webhooks needs idempotency. Never trust client prices, variants, coupons or payment success. Validate delivery details server-side, calculate totals server-side and only mark paid after a signed provider webhook. Review Hebrew translations, legal/privacy/returns policies, product safety and fulfilment integration, operator access controls and monitoring before launch. No analytics or ad network is installed; campaign offer is first-party UI.

## Reference review

Reviewed EverTiles homepage and its creation page before implementation. Adapted the broad sequence (gallery, style, upload, free preview, product, checkout) and persistent CTA. Observed a seasonal sale strip at creation entry. Original Little Makes brand, copy, CSS product templates and decorative symbols; no reference images, logos, source code or testimonials copied. No children’s artwork is in public assets.

## Verification

Validated lint, production compilation and TypeScript, three catalogue/pricing tests, and HTTP checks for consent enforcement, session isolation, image normalization, demo jobs, deletion and disabled ordering. Visually inspected desktop, 390px and 320px layouts plus the mobile upload sheet and Hebrew mode. Native file-picker automation was unavailable in the in-app browser; upload processing was tested directly over HTTP with a synthetic image. No child image was used in tests.

## Drawing templates and input recognition

The journey now starts with `lib/templates.ts`: drawing-first sticker, shaped-cushion and storytelling templates. Each configuration supplies a product, name, description and preservation direction for the swappable generation adapter. The demo does not claim it has extracted characters, created new expressions or produced a finished manufacturing file.


`POST /api/validation` checks session ownership and calls the `DrawingValidator` abstraction. `DRAWING_VALIDATION_URL` must be an HTTPS endpoint; `DRAWING_VALIDATION_KEY` is sent only as a server-side Bearer token. Its JSON request contains `image: { mimeType: "image/jpeg", base64: "..." }`, `task: "classify_child_drawing"` and the classification instructions. Its response must be `{ kind: "drawing" | "not_drawing" | "uncertain", confidence: 0..1, issue?: "no_drawing" | "blurry" | "too_dark" | "cropped" | "multiple_pages" }`. No recognition provider is configured by default and no external image request is made without both settings. Use only a contracted, private provider with no training and appropriate deletion/retention terms.

Confident non-drawings block preview and ask for the original artwork. Ambiguous/poor-quality images request a clearer photo without blaming the drawing. Provider timeouts, malformed responses and outages do not approve an image. Unconfigured recognition is explicitly labelled and requires a separate **Continue with unverified demo** action. That override is accepted only for an unconfigured provider, never for a rejection or outage. `/api/jobs` independently enforces the decision; changing client state cannot bypass a configured check. Vision decisions are cached privately for one hour per immutable upload/provider endpoint, and removed with the upload. Unconfigured/error results remain retryable.

Review the labelled development-only UI fixtures at http://127.0.0.1:3000/qa/drawing-checks for accepted, non-drawing, uncertain, blurry, outage and unconfigured states in English/Hebrew. These fixtures are not classifications of a real uploaded image. They return a not-found page in production.

## Purchase-flow design review (24 November 2026)

Reviewed EverTiles with its public sample photo through style selection, upload, generation progress, generated-preview selection, product controls, cart, promo-code error and address/payment-entry intent. No personal/address/card data was entered and no payment was made. The review observed dominant product visuals, short reassurance rows, a compact cart total, coupon entry opened on request, an inline invalid-code message, and a separate address step before payment. A dismissible email-discount offer appeared later in the cart; its precise trigger was not established.

Applied to Little Makes: a dominant selected-template visual, compact template choices and one-line benefits; concise upload/preview titles; short inline drawing-check messages with expandable detail; coupon entry collapsed until requested; short auto-dismissing success notifications; no timed promotional interruption. Important errors remain visible, and demo disclosures/consent/deletion/validation gates remain available. The design direction is also recorded in AGENTS.md for future work.

The revised 390px flow was also exercised in the browser with a synthetic image: upload/consent, unconfigured-recognition notice, explicit unverified demo, product selection, bag, invalid-code correction to HELLO10 and order-detail entry. The synthetic upload was deleted afterward.

## Visual simplification (24 November 2026)

Upright, single-color headings; shorter hero/section copy; annotation-free hero; complete mobile template rows; fewer product badges. The placeholder before/after section appears only after a real upload exists. Product examples use contain-fit layouts and safe margins. Tested at 320px/390px and in Hebrew RTL.


### Processing video

The processing screen uses actual upload/check/generation stages, an indeterminate progress bar while work runs, and a ready state only after the server returns a ready job. It never invents percentage progress or delays readiness to make someone watch. “See my demo” opens the original-image demo immediately once ready. Cancelling aborts checking/generation requests and keeps the drawing available. An in-flight upload is allowed to finish so its returned private object can be deleted; a future remote provider needs its own durable cancellation adapter.

Set `PRODUCT_VIDEO_URL` to a rights-cleared customer how-to video (a public HTTPS URL or an owned `/videos/*.mp4` file), and `PRODUCT_VIDEO_CAPTIONS_URL` to its WebVTT captions. Set `PRODUCT_VIDEO_CAPTIONS_LANG` to their language code (for example `he` or `en`). Both values are intentionally sent to the browser and must not contain secrets. Supply permission to use the customer's likeness and testimonial, accurate product claims, and captions in the spoken language. No reference-site video, actor, or fabricated endorsement is included. Without media, the screen clearly says a customer video has not been added. Video errors never block the preview. Playback starts muted, with pause/play, sound and skip controls.

`/qa/processing` is a development-only UI fixture for reviewing working and ready states. It performs no upload or generation.

### Product reveal and gift studio

After a ready result, the reveal shows one large private mockup and leads to the gift gallery. Every product uses the chosen artwork. Current original-image mockups remain explicitly labelled demo layouts; they do not claim character extraction, generated variants or a manufacturing proof.

The floating toolbar opens visual size, background, border and preview panels. Background/border apply across the gallery; only existing catalogue sizes are offered, and clothing requires a size before adding. One selection per product is added to the bag; quantities can be changed there. Selected customization is preserved in each item's variant and customization data.

The editor offers existing HELLO10 (10% off) after 1.4 seconds of idle viewing, once per session. Starting edits suppresses the interruption. Dismissal is remembered. Claiming applies the code to the shared cart; no email is collected or sent and no expiry is invented. The development-only `/qa/product-flow` route uses a labelled generated product example to review reveal, selection, visual controls and discount behavior without uploading or placing orders.

### Local media and Git

Generated product photos live in `public/catalog/`. Customer uploads are private and excluded from Git.
