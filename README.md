# Vyper Guard Website

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

## Notes

- The visual language intentionally avoids generic purple/black styling.
- Chart data for detector/severity/scoring is based on Vyper Guard references.
- Live telemetry gracefully falls back if external APIs are unavailable.
