# InspireWrite Improvement Roadmap

This document prioritizes confirmed defects, reliability work, UX improvements, and product features found by reviewing the current frontend, Hono API, shared schemas, and Prisma models.

## Recommended order

| Priority | Outcome | Why it comes first |
| --- | --- | --- |
| P0 | Secure story updates and authentication | Prevents account abuse and unauthorized content changes. |
| P1 | Reliable feed, likes, routing, and errors | Fixes failures users will encounter during normal use. |
| P1 | Drafts, editing, and public story sharing | Completes the core writing workflow and improves growth. |
| P2 | Discovery, author pages, bookmarks, and comments | Makes the community useful after the initial publish. |
| P2 | Tests, CI, observability, and dependency maintenance | Makes future changes safer and production issues diagnosable. |

## P0 — Security and data integrity

### 1. Prevent unauthorized story updates

**Problem:** `PUT /api/v1/blog` updates a post by ID without checking its current author. It also assigns the requesting user as the author. Anyone with a valid account and a known post ID could modify and take ownership of another writer's post.

**Fix:**

- Add `id` to `updateBlogInput`.
- Load or update the post using both `id` and the authenticated `authorId`.
- Never change `authorId` during an update.
- Return `404` when the post is missing and `403` when it belongs to another user.
- Add API tests covering owner and non-owner updates.

**Acceptance:** A user cannot change another user's title, content, topic, author, or publication state.

### 2. Harden JWT handling

**Problem:** Tokens are signed without expiration. Malformed or expired tokens can also make `verify()` throw instead of returning a controlled `401` response.

**Fix:**

- Issue short-lived access tokens containing `exp`, `iat`, and `sub`.
- Wrap token parsing and verification in one reusable authentication middleware.
- Validate the `Bearer <token>` format before splitting it.
- Return the same `401` response for missing, malformed, invalid, and expired tokens.
- Prefer secure, `HttpOnly`, `SameSite` cookies over `localStorage`. If that migration is deferred, enforce a strict Content Security Policy and short token lifetime.

**Acceptance:** Invalid tokens never produce `500`; expired sessions return users to sign-in with a clear message.

### 3. Restrict authentication abuse

**Problem:** Sign-in reveals whether an email or password was wrong. There is no rate limiting. Passwords only require six characters.

**Fix:**

- Return one generic “Email or password is incorrect” response.
- Rate-limit sign-in and sign-up by IP and normalized email.
- Normalize email addresses before lookup.
- Increase password requirements and allow password-manager-friendly long passphrases.
- Add password reset and verified-email flows before supporting sensitive account actions.

**Acceptance:** Repeated login attempts are throttled, and responses cannot be used to enumerate registered emails.

### 4. Lock down cross-origin access

**Problem:** The API currently enables unrestricted CORS for every route.

**Fix:** Allow only configured production and local-development origins, required methods, and required headers. Validate required environment variables at worker startup.

## P1 — Confirmed bugs and reliability fixes

### 5. Make publication state consistent

**Problem:** `Post.published` defaults to `false`, but new posts are immediately returned in feed/detail queries. The field currently has no effect.

**Fix:** Implement real `draft` and `published` states, or remove the column. The recommended option is to keep it and make publish explicit. Feed queries must return only published stories; owners may retrieve their own drafts.

### 6. Add pagination and reduce feed payloads

**Problem:** `/blog/bulk` runs two unbounded queries, returns full story content, merges results in memory, and sorts them afterward. It will become slow and expensive as content grows.

**Fix:**

- Replace the two-query merge with one indexed query.
- Add cursor pagination with a stable order.
- Return a stored/generated excerpt instead of full content.
- Search title, excerpt/content, author, and topic consistently.
- Add indexes for publication state, date, author, and search strategy.

**Acceptance:** The feed returns a fixed page size, exposes `nextCursor`, and does not download complete articles.

### 7. Eliminate stale search results

**Problem:** Debounced requests are not cancelled. A slower earlier search can replace a newer result.

**Fix:** Use `AbortController` or Axios cancellation, pass the filter through `params`, and ignore aborted responses. Preserve the query in the URL so results can be refreshed or shared.

### 8. Make likes concurrency-safe

**Problem:** The API performs “find, then create/delete,” allowing races around the unique constraint. The UI also permits rapid repeated clicks while a request is pending.

**Fix:** Handle the unique constraint atomically, make the desired like state idempotent, disable the control while saving, and roll back optimistic UI when a request fails.

### 9. Fetch story data in one request

**Problem:** Story detail loads the story and then performs a second sequential request for the viewer's like status.

**Fix:** Include `viewerHasLiked` in the authenticated story response, or request both resources concurrently. Return an explicit not-found state instead of silently redirecting to the landing page.

### 10. Add real route protection and a 404 page

**Problem:** Protected pages rely on `Appbar` fetching the current user. Unknown routes render sign-in because the wildcard route points there.

**Fix:**

- Add a protected-route boundary that validates session state before rendering private pages.
- Add a dedicated `/404` experience and wildcard route.
- Preserve the intended destination through sign-in.
- Make landing-page signed-in state depend on validated session data, not token existence.

### 11. Correct date and reading-time behavior

**Problem:** Every date is forced to `Asia/Kolkata`, regardless of the reader. Reading time is based on character count.

**Fix:** Format dates in the browser's locale/time zone, show the author's publication date consistently, and calculate reading time from word count using a documented words-per-minute value.

### 12. Standardize API errors

**Problem:** Status codes and error messages vary across routes. Duplicate sign-up and invalid credentials return `403`; some database failures expose generic or misleading errors.

**Fix:** Adopt a stable error envelope such as `{ code, message, fieldErrors? }`, use `400/401/403/404/409/422/500` correctly, and log an internal request ID without exposing stack details.

## P1 — Core product completion

### 13. Draft autosave and recovery

- Autosave title, topic, and content after idle changes.
- Show “Saving”, “Saved”, and actionable failure states.
- Restore an unsent local draft after refresh or a temporary network failure.
- Warn before leaving only when unsaved changes remain.

### 14. Edit published stories

- Add an owner-only Edit action on story pages.
- Reuse the writing studio with existing content loaded.
- Keep publication date and author unchanged; add `updatedAt` and display “Updated” when relevant.
- Optionally maintain revision history after the basic workflow is stable.

### 15. Public, shareable story pages

**Current limitation:** Reading requires authentication, which blocks sharing and discovery.

- Make published story detail publicly readable.
- Keep liking, publishing, and profile editing authenticated.
- Add canonical metadata, Open Graph fields, descriptive page titles, and a share action.
- Keep drafts and private account data inaccessible.

### 16. Author profile pages

- Add `/writers/:id` with bio, occupation, publication count, and published stories.
- Link author names and avatars from feed and story pages.
- Keep profile editing separate from the public profile.

## P2 — Community and discovery features

### 17. Topic discovery

- Normalize topics instead of accepting unrestricted spelling variants.
- Add topic pages, topic filters, and popular/recent sorting.
- Keep search, filters, and sort reflected in the URL.

### 18. Bookmarks and reading history

- Let readers save stories without using a like as a substitute.
- Add a private reading list and recently viewed history.
- Provide useful empty states and removal controls.

### 19. Comments with moderation controls

- Start with flat comments; defer threaded discussions.
- Include edit/delete for comment owners, report controls, rate limits, and author moderation.
- Define blocking and abuse-handling rules before launch.

### 20. Following and notifications

- Follow writers from story and profile pages.
- Notify readers about new stories from followed writers and responses to their comments.
- Provide per-notification preferences and an unread state.

### 21. Daily prompts, only after the writing core is reliable

The README promises daily prompts, but the product does not currently implement them. Add prompts after drafts and editing exist so a prompt can open a recoverable draft. Prompts should be optional and should not replace community stories as the primary experience.

## UX and accessibility improvements

- Close the mobile menu on Escape, move focus into it when opened, and return focus to the trigger when closed.
- Announce async save, publish, like, and delete results consistently.
- Add field-level validation rather than only a form-level error.
- Prevent duplicate publish, update, like, and delete requests.
- Add password visibility controls and caps-lock guidance.
- Keep article text selectable even when surrounding rows are clickable.
- Test zoom at 200%, narrow 320–390px layouts, keyboard-only use, and screen-reader landmarks.
- Add an account deletion/export flow with explicit irreversible-action confirmation.

## Engineering quality

### Automated tests

Add tests before expanding community features:

- **API integration:** authentication, ownership, validation, pagination, likes, draft visibility, and error codes.
- **Frontend component:** auth validation, protected routes, search races, editor recovery, like rollback, and delete confirmation.
- **End-to-end:** sign up → publish → read → like → edit → delete, plus an unauthorized-user scenario.

### Continuous integration

Run on every pull request:

1. Install with the lockfile.
2. Type-check and lint all packages.
3. Run unit and integration tests.
4. Build frontend and worker.
5. Run dependency and migration checks.

### Dependency maintenance

The current frontend install reports dependency audit findings and stale Browserslist data. Review them individually, upgrade direct dependencies deliberately, and avoid automatic major-version audit fixes without regression testing.

### Observability

- Add structured server logs with request IDs and sanitized error context.
- Track authentication failures, API latency, error rates, publish failures, and database query duration.
- Add frontend error reporting and lightweight product analytics with a documented privacy policy.
- Never log passwords, JWTs, full private drafts, or authorization headers.

## Suggested delivery milestones

### Milestone 1 — Safe foundation

- Fix story-update ownership.
- Centralize JWT middleware and add expiration.
- Restrict CORS and add rate limits.
- Standardize errors.
- Add API tests for authentication and authorization.

### Milestone 2 — Reliable reading

- Add feed pagination and excerpts.
- Fix search cancellation and like races.
- Add protected routes, 404, local dates, and accurate reading time.
- Make published story pages public and shareable.

### Milestone 3 — Complete writing workflow

- Add drafts, autosave, recovery, editing, and `updatedAt`.
- Add author pages and SEO metadata.
- Add end-to-end coverage for the full writing lifecycle.

### Milestone 4 — Community growth

- Add normalized topics, bookmarks, comments with moderation, following, and notifications.
- Measure retention before building personalized recommendations.

## Definition of done

A change is complete only when authorization is enforced server-side, API and UI failure states are covered, keyboard/mobile behavior is verified, relevant tests pass, migrations are reversible, and user-facing copy explains what happened and how to recover.
