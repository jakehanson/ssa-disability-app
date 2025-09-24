## SSA Disability Assessment UI

This project is a Next.js application that guides applicants through a disability assessment and provides curated resources such as lawyer recommendations.

## Getting Started

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` to view the app locally.

## Design System Overview

- **Globals**
  - Design tokens (colors, spacing, typography, shadows) are defined in `src/app/globals.css` using CSS variables and the Tailwind `@theme inline` hook.
  - Shared layout utilities include `.app-container`, `.section-stack`, `.card-surface`, and semantic color/background helpers.

- **Reusable Components** (`src/app/components/ui/`)
  - `Button`: Primary/secondary/subtle/ghost variants with consistent focus handling.
  - `Card`: Surface wrapper with tone and elevation options.
  - `SectionHeader`: Eyebrow/title/lead pattern for hero and section intros.
  - `BadgeIcon`: Circular icon badge supporting semantic tones.
  - `MessageBubble`: Chat bubble styling for assistant/user exchanges.
  - `InputField`: Labeled input with helper and error messaging.

- **Pages**
  - `src/app/page.js`: Landing hero with CTA built from `SectionHeader`, `Button`, `Card`, and `BadgeIcon` components.
  - `src/app/assessment/page.js`: Guided conversation layout using `MessageBubble`, `Card`, and `InputField` primitives.
  - `src/app/lawyers/page.js`: Search + results grid leveraging the shared components for coherent styling.

## Development Workflow

```bash
npm run lint
```

Run linting before committing changes to ensure consistent code style.

## Contributing

- Prefer composing UI with the shared components and tokens rather than ad-hoc Tailwind class lists.
- Introduce new tokens via `globals.css` when extending the design language so they remain centrally documented.
- Keep variants and states accessible: ensure focus styles remain visible and meet contrast guidelines.
