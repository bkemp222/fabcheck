# FabCheck Project Instructions

FabCheck is a mobile-first Next.js app for helping customers submit visual fabrication requests to Get Up Creative.

Core principle:
The app should reduce customer back-and-forth, not create a long questionnaire.

Primary user:
Busy event producers uploading renders, references, logos, and floorplans.

Current AI direction:
AI should quietly analyze each uploaded asset, infer project type, scale clues, branding, lighting, finishes, and visible fabricated elements, then generate simple editable callout pins.

Do not make AI output overly technical for customers.
Internal fabrication detail is useful later, but customer-facing notes should stay simple.

Current stack:
- Next.js 16
- React 19
- TypeScript
- Tailwind v4
- OpenAI Responses API
- Resend
- pdf-lib
- browser-image-compression

Important files:
- src/hooks/use-project.ts is the current project state source.
- src/app/api/ai-asset-review/route.ts handles per-asset AI review.
- src/app/api/ai-review/route.ts is the older package-level AI review prototype.
- src/components/mobile/mobile-workspace.tsx controls mobile workflow.
- src/components/mobile/mobile-markup.tsx controls pin editing.
- src/types/project.ts defines project, asset, callout, and AI review types.

Current workflow:
Upload asset → compress/read file → run AI asset review → generate AI inventory and starter callouts → open markup → customer edits/deletes/adds callouts → save asset → upload more or continue.

Current priority:
Stabilize the AI upload workflow with explicit FabChecking states and a clean mobile UX.
