# App Comuna BC

Web application for managing a rural community. It combines a public-facing site (institutional info + news) with a private dashboard for day-to-day administrative operations such as member registry, annual fees, documents, cash management, and role-based access control.

Spanish version: [README.es.md](README.es.md)

## Screenshots

### Public website

![Home (light)](docs/screenshots/home-light.png)

![News listing (light)](docs/screenshots/notices-light.png)

![News detail (light)](docs/screenshots/notice-detail-light.png)

![About (light)](docs/screenshots/about-light.png)

![Contact (light)](docs/screenshots/contact-light.png)

![Not found (light)](docs/screenshots/not-found-light.png)

![Home (dark)](docs/screenshots/home-dark.png)

![News listing (dark)](docs/screenshots/notices-dark-updated.png)

![News detail (dark)](docs/screenshots/notice-detail-dark.png)

### Dashboard

![Overview (light)](docs/screenshots/dashboard-overview-light.png)

![People registry (light)](docs/screenshots/dashboard-persons-light.png)

![Cash management (light)](docs/screenshots/dashboard-cash-management-light.png)

![Overview (dark)](docs/screenshots/dashboard-overview-collapsed.png)

## Key Features

### Public website

- Home page with institutional information and community highlights
- News/posts listing and SEO-friendly detail pages
- About and Contact pages
- Dark mode support

### Private dashboard (RBAC)

- People registry (persons) and community members management
- Annual fees tracking and member payments
- Requirements and document types catalog management
- Neighborhoods catalog management
- News backoffice (create, edit, preview, publish) with rich text editor
- Cash management (income/expense history, receipts/invoicing)
- Users and roles management with module/action permissions
- Reports/exports utilities

## Tech Stack

- Next.js (App Router) + React + TypeScript
- Tailwind CSS + shadcn/ui (Radix UI)
- Auth.js (NextAuth v5 beta)
- TanStack Query + TanStack Table
- React Hook Form + Zod
- next-themes (theme switcher)
- Optional storage providers: MinIO (S3-compatible) and ImageKit

## Project Structure

```text
src/
  app/
    (page)/                 # Public site (home, notices, about, contact)
    auth/                   # Auth pages (login, reset password, etc.)
    dashboard/              # Private admin dashboard
    api/                    # Next.js API routes (e.g. images proxy)
  components/               # Shared and page/dashboard UI components
  features/                 # Feature modules (overview, profile, products, kanban, etc.)
  hooks/                    # Shared hooks (react-query hooks, utilities)
  lib/                      # Core utilities (api client, auth config, helpers)
  services/                 # API service layer (persons, members, notices, cash, etc.)
  constants/                # App constants (permissions, navigation, translations)
  types/                    # Shared TypeScript types
```

## Getting Started (Local)

### Prerequisites

- Node.js + pnpm
- Backend API running (default: `http://localhost:8000/api`)
- (Optional) MinIO running (default: `http://localhost:9000`) if `STORAGE_PROVIDER=minio`

### Install

```bash
pnpm install
```

### Environment Variables

Copy the example file and edit values as needed:

```bash
cp .env.example .env.local
```

Common variables:

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_APP_URL` | Public app URL (used for SEO/canonical) |
| `NEXT_PUBLIC_API_URL` | Backend API base URL |
| `NEXT_PUBLIC_CACHE_REVALIDATE` | Cache revalidation interval (seconds) |
| `STORAGE_PROVIDER` | `minio` or other provider |
| `NEXT_IMAGE_REMOTE_HOSTS` | Allowed remote hosts for images |
| `MINIO_ENDPOINT` | MinIO endpoint URL |
| `MINIO_PUBLIC_URL` | Public URL used to resolve objects |
| `MINIO_ACCESS_KEY` | MinIO access key |
| `MINIO_SECRET_KEY` | MinIO secret key |
| `MINIO_BUCKET` | Bucket name |
| `MINIO_REGION` | Bucket region |
| `IMAGEKIT_URL_ENDPOINT` | ImageKit endpoint (optional) |
| `IMAGEKIT_PUBLIC_KEY` | ImageKit public key (optional) |
| `IMAGEKIT_PRIVATE_KEY` | ImageKit private key (optional) |

### Run

```bash
pnpm dev
```

Open `http://localhost:3000`.

## Scripts

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
pnpm lint:fix
pnpm format
```

## Notes

- The UI design system uses Tailwind theme tokens (`bg-background`, `text-foreground`, etc.) to ensure consistent light/dark modes.
- Avoid committing secrets. Keep `.env.local` local and use `.env.example` as a reference.
