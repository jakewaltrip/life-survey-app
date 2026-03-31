# Life Survey

## Description

Life Survey is a reflective, single-page web application that asks users six thoughtful questions about what matters most in their lives — from the one word that defines their values, to how they weigh career against other priorities. All responses are stored directly in a Supabase database with no custom backend required, making the app lightweight and easy to deploy. A dedicated results page visualises aggregated response data as interactive bar charts so anyone can explore patterns across all submissions. It is designed for students, researchers, or individuals who want a simple, beautiful tool for gathering and displaying qualitative life-values data.

## Badges

![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-2.100-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

## Features

- **Six-question life-values survey** — covers a single defining word, most important life area, career priority, a multi-select of meaningful things with an optional "Other" free-text field, and a personal explanation
- **Client-side Supabase integration** — form responses are inserted directly into a `survey_responses` Supabase table; no Express or REST API layer needed
- **Live success and error feedback** — the form displays an inline success message on submission or an exact error message from Supabase if something goes wrong
- **Aggregated results page** — navigate to `/results` to see the total number of responses and three horizontal bar charts summarising the most important area, career importance, and meaningful values
- **Warm, calm visual design** — Playfair Display serif headings paired with Outfit body text on a cream background with a muted warm-brown accent palette
- **Full form validation** — all fields are validated with Zod schema and React Hook Form before any data is sent to Supabase
- **Accessible, composable UI** — built on shadcn/ui and Radix UI primitives for keyboard navigation and screen-reader support out of the box
- **Smooth page transitions** — enter animations via `tw-animate-css` give every route a polished slide-in feel

## Tech Stack

| Technology | Purpose |
|---|---|
| React 18 | UI component model and state management |
| Vite 6 | Dev server, HMR, and production bundler |
| TypeScript 5.9 | Static typing across the entire codebase |
| Tailwind CSS 4 | Utility-first styling and theming |
| shadcn/ui + Radix UI | Accessible, unstyled UI primitives (form, checkbox, select, radio group, card, toast) |
| React Hook Form + Zod | Client-side form state management and schema validation |
| Supabase JS Client v2 | Database reads and writes directly from the browser |
| Recharts | Responsive horizontal bar charts on the results page |
| Wouter | Lightweight client-side routing (`/` and `/results`) |
| Framer Motion | Animation utilities |
| pnpm Workspaces | Monorepo package management |

## Getting Started

### Prerequisites

| Tool | Version | Download |
|---|---|---|
| Node.js | 20 LTS or later | https://nodejs.org |
| pnpm | 9 or later | https://pnpm.io/installation |
| Supabase account | — | https://supabase.com |

You will also need a Supabase project with a `survey_responses` table containing the following columns:

```sql
create table survey_responses (
  id            uuid primary key default gen_random_uuid(),
  life_word     text not null,
  important_area text not null,
  career_importance text not null,
  meaningful_values text[] not null,
  other_value   text,
  explanation   text not null,
  created_at    timestamptz default now()
);
```

Enable Row Level Security and add an insert policy for anonymous users if you want public submissions:

```sql
alter table survey_responses enable row level security;
create policy "Allow anonymous inserts" on survey_responses
  for insert to anon with check (true);
create policy "Allow anonymous selects" on survey_responses
  for select to anon using (true);
```

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/life-survey.git
cd life-survey
```

2. Install all workspace dependencies:

```bash
pnpm install
```

3. Create a `.env` file inside `artifacts/survey-app/` (or set these as environment variables in your hosting provider):

```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

> The anon key is a long JWT starting with `eyJhbGciOiJIUzI1NiIs`. Copy it from your Supabase project → Settings → API.

## Usage

### Running locally

Start the survey app development server:

```bash
pnpm --filter @workspace/survey-app run dev
```

The app will be available at `http://localhost:5173` (or the port printed in the terminal).

### Navigating the app

| Route | What you see |
|---|---|
| `/` | The six-question survey form |
| `/results` | Total response count + three aggregated bar charts |

- Fill in all six fields on the survey page and click **Submit**. A green success message confirms the row was saved to Supabase.
- Click **View results** (below the survey subtitle) to jump to the results dashboard.
- Click **Home** (top-right of the results page) to return to the survey.

### Environment variables

| Variable | Required | Description |
|---|---|---|
| `VITE_SUPABASE_URL` | Yes | Full URL of your Supabase project (e.g. `https://abc.supabase.co`) |
| `VITE_SUPABASE_ANON_KEY` | Yes | Public anon key from Supabase project API settings |

All `VITE_` prefixed variables are inlined at build time by Vite. **Restart the dev server after changing them.**

### Building for production

```bash
pnpm --filter @workspace/survey-app run build
```

Static output is written to `artifacts/survey-app/dist/`.

## Project Structure

```
life-survey/
├── artifacts/
│   └── survey-app/                  # Main React + Vite web application
│       ├── src/
│       │   ├── App.tsx              # Root component; defines /  and /results routes
│       │   ├── main.tsx             # Vite entry point; mounts <App />
│       │   ├── index.css            # Global styles, Tailwind directives, CSS variables, Google Fonts
│       │   ├── pages/
│       │   │   ├── home.tsx         # Survey form — six questions, Zod validation, Supabase insert
│       │   │   ├── results.tsx      # Results page — aggregated counts + Recharts bar charts
│       │   │   └── not-found.tsx    # 404 fallback page
│       │   ├── lib/
│       │   │   ├── supabase.ts      # Supabase client initialised from VITE_ env vars
│       │   │   └── utils.ts         # Tailwind class merging utility (clsx + tailwind-merge)
│       │   ├── components/
│       │   │   └── ui/              # shadcn/ui component library (button, card, form, select, etc.)
│       │   └── hooks/
│       │       ├── use-toast.ts     # Toast notification hook
│       │       └── use-mobile.tsx   # Responsive breakpoint detection hook
│       ├── package.json             # App-level dependencies (Supabase, Recharts, shadcn, etc.)
│       └── vite.config.ts           # Vite configuration (path aliases, plugins, port)
├── lib/
│   ├── api-spec/                    # OpenAPI specification (unused at runtime; for codegen)
│   ├── api-client-react/            # Auto-generated React Query API client hooks
│   ├── api-zod/                     # Zod schemas auto-generated from OpenAPI spec
│   └── db/                          # Drizzle ORM schema and database utilities
├── artifacts/api-server/            # Express API server (scaffolded; Supabase used directly instead)
├── package.json                     # Workspace root; pnpm scripts and shared dev tooling
└── pnpm-workspace.yaml              # pnpm monorepo workspace definition
```

## Changelog

### v1.0.0 — 2026-03-30

- Initial release
- Six-question life-values survey form with Zod validation
- Direct Supabase JS client integration (no custom API server)
- Form fields: free text, dropdown, radio group, multi-select checkboxes with conditional "Other" input, textarea
- Success and error feedback inline on the survey page
- Results page at `/results` with total response count
- Horizontal bar charts for Most Important Area, Career Importance, and Meaningful Things
- Warm and calm visual theme: Playfair Display + Outfit typography, cream background, muted warm-brown accents
- "View results" link on the survey page; "Home" button on the results page

## Known Issues / To-Do

- [ ] The results page does not auto-refresh when new submissions arrive — a manual page reload is required to see updated counts
- [ ] The `life_word` free-text field is collected but not visualised on the results page (word cloud or top-N list would be valuable)
- [ ] Row Level Security must be configured manually in Supabase before the app will accept anonymous submissions; there is no in-app setup guide
- [ ] No pagination or date-range filter on the results page — charts will become noisy as response volume grows
- [ ] The survey has no duplicate-submission guard; the same user can submit unlimited times

## Roadmap

- **Word cloud for free-text responses** — visualise the most common `life_word` values using a tag-cloud component
- **Real-time results** — subscribe to the Supabase `survey_responses` table with `supabase.channel()` so charts update live as new responses arrive
- **Date-range filter on the results page** — allow viewers to see responses from a specific time window (e.g. last 7 days, last month)
- **Response export** — add a "Download CSV" button on the results page so researchers can run their own analysis
- **Admin authentication** — protect the results page with Replit Auth or Supabase Auth so only authorised users can view aggregated data

## Contributing

Contributions are welcome. Please open an issue first to discuss what you would like to change, then follow the steps below. Keep pull requests focused on a single concern and include a clear description of what was changed and why.

1. Fork the repository on GitHub
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit with a descriptive message: `git commit -m "feat: add word cloud to results page"`
4. Push to your fork: `git push origin feature/your-feature-name`
5. Open a pull request against the `main` branch of this repository

## License

This project is licensed under the [MIT License](LICENSE).

## Author

Your Name | Your Institution | Your Course

## Contact

[GitHub Profile](https://github.com/your-username)

## Acknowledgements

- [Supabase](https://supabase.com) — for the instant Postgres backend and generous free tier
- [shadcn/ui](https://ui.shadcn.com) — for the beautifully composable, accessible component primitives
- [Recharts](https://recharts.org) — for the declarative, React-native charting library
- [Radix UI](https://www.radix-ui.com) — for the unstyled, accessible headless UI components that power the form fields
- [Tailwind CSS](https://tailwindcss.com) — for the utility-first CSS system that made theming fast and consistent
- [Vite](https://vitejs.dev) — for the blazing-fast dev server and build tooling
- [Replit](https://replit.com) — for the cloud development environment used to build and host this project
- [Claude (Anthropic)](https://anthropic.com) — AI assistant that helped design, scaffold, and debug the application
