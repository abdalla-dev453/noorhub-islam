# PRD implementation status

This is a code-based status snapshot for the attached v1 PRD. “Partial” means there is a usable foundation, but one or more launch requirements from that section are still missing. It does not mean the feature is production-ready.

## Feature modules

| PRD area | Status | Current coverage / remaining work |
| --- | --- | --- |
| Quran reader | Partial | Full Surah list and Arabic plus Sahih International text/audio use Alquran Cloud; Surah/Juz/Hizb-Rubʿ/page/Rukuʿ/Manzil navigation, ayah jump, reciter selection, continuous playback, bookmarks, highlights, private notes, and section resume are available. Mushaf layouts, more translations, word tools, tajweed, tafsir, cross-device verse sync, downloadable Quran packs, and canonical text checksums are absent. |
| Audio recitation | Partial | Per-ayah audio and optional continuous Surah playback. Playback speed, repeat ranges, timers, queue, download controls, synchronized highlighting, and tested background playback are absent. |
| Tafsir and understanding | Not implemented | No sourced tafsir panel, comparison, asbab al-nuzul, thematic index, or reflect cards. |
| Hifz | Partial | Local plan builder, confidence-based review scheduling, progress counts, and a visual concealment exercise. It does not yet select verified Surah ranges, conceal actual Quran words, provide the listed test modes/heatmap, reminders, freeze days, recitation checking, or teacher/class workflows. |
| Learning hub | Partial | Curated course tracks, lesson player, completion state, and basic progress persistence exist. Structured Qaida, vocabulary flashcards, quizzes, certificates, verified teacher credential profiles, and a complete basics path are absent. |
| Prayer tools | Partial | Offline solar calculation, several calculation methods, Standard/Hanafi Asr, saved coordinates, location lookup, minute adjustments, Qibla bearing/device orientation, and local prayer logs. Mosque timetable overrides, reliable compass calibration/map fallback, adhan/push reminders, qada planning, traveler/Eid/Ramadan guides, mosque discovery, and salah illustrations are absent. |
| Dhikr, duas, daily adhkar | Partial | Three cited remembrances with local counter, adjustable goal, daily habit checklist, and private personal dua list. The sourced adhkar library, Arabic/transliteration/audio catalogue, counter history/reports, scheduled reminders, and 99 Names learning mode are absent. |
| Hadith library | Partial | Browser for three English collections with client-side search and batch rendering. Arabic editions, grading with named grader, isnad/chapter views, broader collections, cross-links, bookmarks, notes, and hadith-of-the-day are absent. |
| Seerah and history | Partial | Seerah course content is included in the learning tracks. A sourced timeline, maps, biography collection, and child-friendly versions are absent. |
| Fiqh and knowledge base | Partial | Introductory learning lessons exist. Reviewed articles with evidence, madhhab comparisons/preferences, reviewer/date metadata, Aqidah primer, and scholar-submitted Q&A workflow are absent. |
| Hijri calendar | Partial | Local tabular Hijri month view, Gregorian dates, selected events, and upcoming-date list. Regional sighting override, personal calendar items, reminders, and downloadable calendar are absent. Dates are estimates and may differ from local moon sighting. |
| Ramadan companion | Partial | Local 30-day fast log and Quran page pacing, qada counter, private reflection, estimated Imsak/Maghrib from saved prayer settings, last-ten-night checklist, calendar export, and user-entered Zakat al-Fitr arithmetic. Missing month-long location-based timetable, Suhoor/Iftar notifications, meal planning, richer worship plans, and reviewed guidance. Times/dates are estimates; the amount is user supplied. |
| Zakat and finance | Partial | Private KES estimate for entered assets/debts, manually entered gold/silver nisab, hawl checkbox, local estimate history, and export. Live prices/currency support, full asset rules, sadaqah tracking, guides, and donation/payment partners are absent. This is not a fiqh ruling. |
| Hajj and Umrah | Not implemented | No journey guide, checklist, maps, duas, or tawaf/Sa'i counter. |
| Halal finder | Not implemented | No food/product data, certification sources, or location-based lookup. |
| Kids zone | Not implemented | No child profiles, parental controls, age-gated content, or story collection. |
| Deen dashboard and habits | Partial | Daily checklist and reflection are stored locally. Goals, private reports, richer history, and cross-device sync for these records are absent. |
| Community | Not implemented | No groups, shared khatm, mosque pages, moderation, or events system. |
| Global search | Partial | Search screen queries English or Arabic Quran text and searches learning tracks, three included Hadith collections, private notes/bookmarks, and personal duas. It lacks tafsir, transliteration/root, article, and public dua search. Hadith collections are selectable to control large downloads. |
| Content and articles | Not implemented | No editorial CMS, newsletter, or article catalogue. |

## Cross-cutting requirements

| Requirement | Status | Remaining work |
| --- | --- | --- |
| Accounts and personalization | Partial | Email/password accounts, rotated/revocable JWT sessions, lesson-progress API, local JSON export, and account deletion (including synced lesson progress) exist. OAuth providers, guest-to-account merge, full profile/settings, and worship-data sync are absent. |
| Languages and RTL | Partial | Arabic reading typography is bundled locally with an OFL notice and RTL Quran text exists; the application interface is English-only and has no i18n framework or language selection. |
| Notifications | Not implemented | No web push/email delivery, quiet hours, or notification controls. |
| Accessibility | Unverified | Responsive layouts and some labelled controls exist, but there is no WCAG 2.2 AA audit or verified keyboard, screen-reader, contrast, and reduced-motion coverage. |
| Offline/performance | Partial | Install manifest and service worker cache the app shell and built assets; Quran and Hadith JSON responses are saved in IndexedDB and reused after network failures. Quran Arabic typography is self-hosted. Full Quran/translation/audio download packs, prayer forecasts beyond on-device calculation, background sync, and a 3G LCP audit are not implemented. |
| Security/privacy | Partial | Password hashing, JWT auth with refresh rotation and token revocation, production configuration guards, CORS, and response security headers exist. Rate limiting, a documented CSRF strategy, encrypted/synced private data, and deployment HTTPS remain unverified. Local practice data is browser storage. |
| Admin/CMS | Not implemented | Admin blueprint currently has a placeholder role check that denies access; there is no role-based editorial workflow, review/publish process, version history, reporting queue, or operational dashboard. |

## Verification snapshot

- `npm run build`: passes (1924 modules transformed, all page routes lazy-loaded cleanly).
- `npm run lint`: passes without errors or warnings.
- `npm run test`: 59 tests pass across 6 files (includes all 21 route smoke tests and utility suites).
- `npm run test:backend`: 3 Python API integration tests pass (health check, user registration & login flow, and lesson progress synchronization).
- Backend environment is configured with `backend/venv` containing all dependencies (`flask`, `flask_cors`, `flask_jwt_extended`, `flask_sqlalchemy`, `pytest`).

## External decisions and dependencies

Completion of the PRD also depends on Quran/translation/tafsir/audio/hadith licensing and a checksummed canonical Quran dataset; named scholarly reviewers and approved fiqh methodology; verified teacher and charity partners; production database, push/email, search, storage/CDN, monitoring, backup, and deployment infrastructure; and the product decisions listed in PRD section 14. These cannot be represented as completed by local UI code alone.
