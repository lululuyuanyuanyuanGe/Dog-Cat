# Development Plan: Project 1314 (Love-Timeline)

This document outlines the development plan to transition the `love-story.html` prototype into a full-featured, production-ready Next.js application as specified in the `prd.md`.

---

## Phase 1: Project Scaffolding & Component Migration

**Objective:** Establish the correct Next.js 14+ project structure and migrate the existing prototype's UI components.

1.  **Initialize Next.js Project:**
    *   Task: Create a new Next.js project using the App Router.
    *   Command: `npx create-next-app@latest love-timeline --typescript --tailwind --eslint`
    *   Configuration: Configure Tailwind CSS with the project's custom theme (colors, fonts) from `love-story.html`.

2.  **Establish Directory Structure:**
    *   Create directories for `components`, `app`, `lib`, `styles`, `public`.

3.  **Component Migration & Conversion:**
    *   Task: Systematically migrate each React component from `love-story.html` into its own `.tsx` file inside the `components` directory.
    *   Components to Migrate:
        *   `Icon`
        *   `DoodleArrow`, `DoodleUnderline`
        *   `BackgroundBlobs`, `FloatingSticker`, `BackgroundDecorations`
        *   `ProfileWidget`
        *   `HeroHighlight`, `LoveTimer`, `ContributionHero`
        *   `WashiTape`, `PhotoCard`, `NoteCard`, `VideoCard`, `PdfCard`
        *   `ScrapbookItem`
        *   `TimelineTree`
    *   Convert JavaScript code to TypeScript, adding type definitions for props and state.

4.  **Assemble Main Page:**
    *   Task: Reconstruct the main UI layout in `app/page.tsx` by importing and composing the newly migrated components.
    *   Goal: Achieve the same visual appearance as `love-story.html` but within the Next.js framework.

---

## Phase 2: Library Integration & UI Refinement

**Objective:** Replace prototype-level implementations with the robust libraries specified in the PRD.

1.  **Font Integration:**
    *   Task: Use `next/font` to import and manage the specified fonts: `Clash Display`, `Outfit`, `Gloria Hallelujah`, and `JetBrains Mono`.

2.  **Icon Library:**
    *   Task: Replace the custom `Icon` component with `lucide-react`.
    *   Action: Install `lucide-react` and update all component files to use icons from the library.

3.  **Animation Engine:**
    *   Task: Integrate `Framer Motion` to handle UI animations.
    *   Action: Replace the CSS-based hover effects on scrapbook cards (`ScrapbookItem`) with `Framer Motion`'s `whileHover` prop to implement the specified "Hover Physics" (scale, rotation, shadow).
    *   Action: Use `Framer Motion` for page load animations and other dynamic transitions.

---

## Phase 3: Backend & Database Setup (Supabase)

**Objective:** Create the backend infrastructure to support dynamic data.

1.  **Supabase Project Initialization:**
    *   Task: Create a new project in the Supabase dashboard.
    *   Credentials: Securely store project URL and `anon` key in environment variables (`.env.local`).

2.  **Database Schema Implementation:**
    *   Task: Use the Supabase SQL editor to create the `users`, `memories`, and `comments` tables as defined in `prd.md`.
    *   Define primary keys, foreign keys, enums (`role`, `type`), and appropriate data types.

3.  **Authentication Setup:**
    *   Task: Configure Supabase Auth to allow email/password login for the "admin" couple.
    *   Enable Row Level Security (RLS) policies to control data access (e.g., only admins can create/delete memories, guests can only read and comment).

4.  **File Storage Setup:**
    *   Task: Create a storage bucket in Supabase Storage for media files (photos, videos, PDFs).
    *   Define storage policies to control file access.

---

## Phase 4: API Layer Development

**Objective:** Build the API endpoints that will serve data to the frontend.

1.  **Create API Routes:**
    *   Use Next.js API Routes (within the `app/api/` directory) for all data operations.
    *   Endpoints to create:
        *   `GET /api/memories`: Fetch memories for the timeline.
        *   `POST /api/memories`: Add a new memory item (admin only).
        *   `GET /api/comments?date=[date]`: Fetch comments for a specific day.
        *   `POST /api/comments`: Add a new comment.
        *   `GET /api/config`: Fetch application-level config, like the `START_DATE` for the Love Timer.

2.  **Implement API Logic:**
    *   Task: Write the server-side logic for each API route.
    *   Action: Use the `supabase-js` library to interact with the PostgreSQL database and Supabase Storage.
    *   Ensure all API routes check authentication and enforce RLS policies.

---

## Phase 5: Frontend-Backend Integration

**Objective:** Connect the UI to the live backend, replacing all mock data.

1.  **Data Fetching Service:**
    *   Task: Create a client-side data service (e.g., in `lib/data.ts`) that contains functions for calling the Next.js API routes.
    *   Use `fetch` or a library like `swr` or `react-query` for data fetching, caching, and revalidation.

2.  **Replace Mock Data:**
    *   Task: Update components to fetch data from the API service instead of `RAW_DATA`.
    *   `TimelineTree`: Fetch the list of dates with memories.
    *   `ScrapbookItem`: Load data for the selected day.
    *   `ContributionHero`: Fetch memory statistics to generate the heatmap.

3.  **Implement Mutation Logic:**
    *   Task: Add functionality for creating data.
    *   `Guestbook`: Wire the input field to the `POST /api/comments` endpoint.
    *   `Add Memory` button: Create a form/modal for uploading new memories, which will call the `POST /api/memories` endpoint and handle file uploads to Supabase Storage.

---

## Phase 6: Finalization & Polish

**Objective:** Ensure the application is responsive, performant, and fully aligns with the PRD.

1.  **Mobile Responsiveness:**
    *   Task: Implement the mobile-specific UI changes outlined in the PRD.
    *   Action: Build the slide-over Glassmorphic Drawer for the timeline navigation on mobile.
    *   Action: Adjust grid layouts, font sizes, and component arrangements for smaller screens using Tailwind's responsive prefixes.

2.  **Performance & Optimization:**
    *   Task: Add loading states to provide user feedback during data fetching.
    *   Action: Implement shimmer effects or skeleton loaders for the memory feed and timeline.
    *   Action: Use the Next.js `Image` component for all user-uploaded photos to get automatic optimization.

3.  **Testing:**
    *   Task: Write unit tests for critical components (e.g., `LoveTimer`, data transformation logic) and API routes.
    *   Tools: Use Jest and React Testing Library.

4.  **Deployment:**
    *   Task: Deploy the application to Vercel.
    *   Action: Connect the Vercel project to the GitHub repository.
    *   Action: Configure environment variables for the Supabase connection in the Vercel dashboard.
