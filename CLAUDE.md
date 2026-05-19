# Targetly AI Mobile (Chatwoot fork)

React Native + Expo mobile client for the Chatwoot/Targetly platform. Use the reference docs below before making structural changes.

## Reference documentation (`/ref`)

| Document | Use when |
|----------|----------|
| [ref/README.md](./ref/README.md) | Index, versions, entry points |
| [ref/architecture.md](./ref/architecture.md) | Bootstrap, layers, WebSocket, push |
| [ref/project-structure.md](./ref/project-structure.md) | Where to put new code |
| [ref/navigation.md](./ref/navigation.md) | Routes, deep links, auth gating |
| [ref/state-management.md](./ref/state-management.md) | Redux slices, persist, logout |
| [ref/api-and-services.md](./ref/api-and-services.md) | HTTP client, auth headers |
| [ref/theming.md](./ref/theming.md) | Tailwind, fonts, colors |
| [ref/environment-and-build.md](./ref/environment-and-build.md) | `.env`, EAS, local dev |
| [ref/screens.md](./ref/screens.md) | Screen modules and responsibilities |

## Quick commands

```bash
pnpm install && pnpm start
pnpm run:ios | pnpm run:android
pnpm test && pnpm lint
```

## Key paths

- Entry: `App.tsx` → `src/app.tsx` → `src/navigation/`
- State: `src/store/` (see `reducers.ts` for slice list)
- API: `src/services/APIService.ts`
- UI kit: `src/components-next/`
- Path alias: `@/*` → `src/*`

## Other docs

- [README.md](./README.md) — product overview
- [.env.example](./.env.example) — required env vars
- [.cursor/rules/about.mdc](./.cursor/rules/about.mdc) — detailed coding conventions (theme, Redux, RN patterns)

## Branding

Shipped as **Targetly AI** (`app.config.ts`). Many internal names still say Chatwoot (packages, types, comments).
