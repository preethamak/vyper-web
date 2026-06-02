# Vyper Guard Website
[![PyPI Downloads](https://static.pepy.tech/personalized-badge/vyper-guard?period=total&units=INTERNATIONAL_SYSTEM&left_color=GREY&right_color=ORANGE&left_text=downloads)](https://pepy.tech/projects/vyper-guard)

Custom Next.js website for **Vyper Guard** with:

- Non-generic visual design (glassmorphism + multi-tone gradients)
- Multi-page documentation and detector catalog
- Animated command-focused hero experience
- Recharts analytics from real detector/scoring data
- Live telemetry from PyPI + GitHub APIs

## Tech Stack

- Next.js 16 (App Router, TypeScript)
- Tailwind CSS v4
- Framer Motion (animations)
- Recharts (data visualization)
- Lucide icons
- Google Fonts: Sora + Space Grotesk + JetBrains Mono

## Pages

- `/` Experience page with animated sections and analytics
- `/docs` Documentation-centric page built from Vyper Guard references
- `/detectors` Full detector catalog with severity taxonomy
- `/dashboard` Live metrics + analysis dashboards
- `/api/project-intel` API route exposing normalized project telemetry

## Data Sources

- Static project data: `src/lib/vyper-data.ts`
- Live telemetry: `src/lib/live-intel.ts`
	- PyPI metadata API
	- PyPIStats downloads API
	- GitHub repository API

## Run Locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Production Validation

```bash
npm run build
npm run start
```

## Environment Variables

Keep local development values in `.env.local`.

For deployed environments, set the same variables in your hosting provider's project or service settings instead of committing them to the repo.

Server-side variables used by this app:

- `SARVAM_API_KEY`
- `SARVAM_CHAT_MODEL` (optional)
- `SARVAM_TTS_MODEL` (optional)
- `PEPY_API_KEY` (optional)
- `VYPER_GUARD_BIN` (recommended for workbench)
- `VYPER_GUARD_DISABLE_BOOTSTRAP` (optional)

## Workbench Deployment

The `/workbench` page does not only need env vars. Its API routes spawn a real CLI process from the server runtime in `src/app/api/terminal-run/route.ts` and `src/app/api/terminal-run/stream/route.ts`.

Production therefore needs all of the following on the server that runs Next.js:

- Node.js runtime for the app
- Python (`python3` or `python`)
- `vyper-guard` installed globally, or `VYPER_GUARD_BIN` set to its absolute path
- Permission to run child processes with `spawn(...)`
- Writable temporary storage for `/tmp`

If your platform only provides serverless functions without a stable system Python / CLI runtime, the workbench will not behave like local development even if env vars are set correctly. In that case, deploy this app on a VM, container, or another host where you control the OS packages and executable paths.

## Notes

- The visual language intentionally avoids generic purple/black styling.
- Chart data for detector/severity/scoring is based on Vyper Guard references.
- Live telemetry gracefully falls back if external APIs are unavailable.

Good. Atleast now its looking better. Now the changes. The main part. Listen properly:
--> So, We nned to keep this open soruce? But how much. In this codebase if we implement the billing or api keys system then anyone can clone and bypass right??
--> And in premium, They should get much more access.. Without that basics should be free.. Like not allowed scan or analyse entire repo.. But single file should be allowed.. Like that something. And Commands to show the status and other things. Not like messing up things badly
