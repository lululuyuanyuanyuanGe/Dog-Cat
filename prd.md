# Project Requirement Document (PRD)
---
## 1. Executive Summary
**Project 1314** is a high-fidelity, interactive digital scrapbook designed for couples to document their relationship timeline. Unlike standard blog lists, this application utilizes a "Scrapbook Scatter" aesthetic where memories (photos, videos, sticky notes, and documents) appear as if they are physically taped to a desk.

The platform allows the couple to upload daily memories while allowing friends and family (guests) to view the timeline and leave messages in a guestbook. The design focuses on "Kawaii Maximalism"—using pastel colors, floating stickers, glassmorphism, and physics-based animations to create an emotional, immersive experience.

---

## 2. Technology Stack & Tools

### Frontend Architecture
*   **Framework:** **Next.js 14+ (App Router)**
    *   *Why:* Provides server-side rendering (better performance/SEO), built-in routing for the timeline, and API handling.
*   **Language:** **TypeScript**
    *   *Why:* Type safety for the complex data structures (memories, media types).
*   **Styling:** **Tailwind CSS**
    *   *Why:* Rapid UI development.
*   **Animation Library:** **Framer Motion**
    *   *Why:* Essential for the complex "hover physics" (tilting cards), page transitions, and the mobile drawer slide-in effects.
*   **Icons:** **Lucide React** (Standard UI icons) & Custom SVGs (for Doodles).

### Backend & Infrastructure (Serverless)
*   **Backend Logic:** **Next.js API Routes** (Serverless functions).
*   **Database:** **PostgreSQL** (via **Supabase**).
    *   *Why:* Relational data is best for structured timelines (Years > Months > Days > Items).
*   **Authentication:** **Supabase Auth**.
    *   *Why:* Handles secure login for the couple (Google/Email) and anonymous sessions for guests.
*   **File Storage:** **Supabase Storage** (S3 compatible).
    *   *Why:* To store user uploaded photos, videos, and PDFs.

### Deployment
*   **Host:** **Vercel** (Native support for Next.js).

---

## 3. Functional Requirements

### 3.1. Hero & Header Section
*   **Couple Connection Visual:** Display two avatar images (Partner A and Partner B) connected by an animated dashed line and a pulsating heart.
*   **"1314" Typography:** A massive, gradient-text title "LOVE YOU 1314" with a handwritten subtitle "( One Life, One Love, Forever )".
*   **Profile Widget (Fixed):**
    *   A glassmorphic capsule fixed to the top-right corner.
    *   Displays current user avatar and name.
    *   Dropdown menu on click: "Settings", "Log Out".
    *   *Constraint:* Must stay visible while scrolling (`z-index: 100`).

### 3.2. Data Visualization Stats
*   **Love Timer:**
    *   4 Cards (Days, Hours, Mins, Secs).
    *   Each card has a unique pastel background color.
    *   Real-time second-by-second updates.
*   **Contribution Heart Map:**
    *   A grid of dots arranged mathematically into a heart shape.
    *   **Heatmap Logic:** Dots change opacity/color based on the number of memories uploaded on that specific day.
    *   **Total Counter:** A large counter above the heart showing the sum of all memories (e.g., "2,044 Memories Created").

### 3.3. Navigation (The Timeline)
*   **Structure:** Hierarchical Tree (Year → Month → Day).
*   **Behavior:**
    *   **Desktop:** A sticky sidebar on the left rail.
    *   **Mobile:** A "Hamburger" button opens a slide-over Glassmorphic Drawer containing the tree.
*   **Interaction:** Clicking a date scrolls the main view to that specific day's memory collection or loads that day's data.

### 3.4. The Memory Feed (Main Content)
*   **Day Header:** Displays the selected date and daily badges (e.g., "Date Night", "Travel").
*   **"Scrapbook" Grid Layout:**
    *   Instead of a rigid grid, items have randomized slight rotations (-3deg to 3deg) to look "scattered."
    *   **Hover Physics:** On hover, items scale up (`1.05x`), rotate to 0 degrees (straighten), and increase shadow depth (lift up).
*   **Item Types:**
    1.  **Photo Card:** Polaroid style with a CSS "Washi Tape" element on top. Handwritten caption area at bottom.
    2.  **Note Card:** Colored sticky note background. Pin/Tack visual element.
    3.  **Video Card:** Film-strip border effect. Glass play button overlay.
    4.  **Music Card:** Vinyl record style or Spotify card style. Shows album art and "Now Playing" animation.
    5.  **PDF/Document Card:** File folder styling. Shows filename, file size, paperclip icon, and a "Download" button.
*   **Timestamps:** Every item has a timestamp badge fixed to the corner.

### 3.5. Social & Engagement
*   **Guestbook (Per Day):**
    *   Located at the bottom of the memory grid for each day.
    *   List view of comments (Avatar, Name, Timestamp, Message).
    *   Input field for guests to leave messages.
*   **Background Decorations:**
    *   Floating stickers (e.g., "Soulmate", "Love U") fixed to the viewport background (`position: fixed`).
    *   Gradient blobs moving in the background.

---

## 4. UI/UX Design Specifications

### Aesthetic Theme
*   **Name:** "Kawaii Maximalism" / "Digital Scrapbook".
*   **Core Colors:**
    *   Background: Cream (`#FFF9F5`)
    *   Primary: Coral (`#FF6B6B`)
    *   Text: Slate (`#4D5061`)
    *   Accents: Pastel Pink (`#FFD6E0`), Pastel Blue (`#C4E4F7`), Pastel Yellow (`#FEF9C3`).
*   **Typography:**
    *   **Clash Display:** Headlines (Bold, Modern).
    *   **Outfit:** Body text (Clean).
    *   **Gloria Hallelujah / Nanum Pen:** Handwritten notes and stickers.
    *   **JetBrains Mono:** Dates and Metadata.

### Responsiveness Strategy
*   **Mobile Breakpoint (<768px):**
    *   Hide Left Rail Timeline.
    *   Show "Menu" button top-left.
    *   Reduce Title text size (`text-5xl`).
    *   Profile widget compact mode.
    *   Scrapbook Grid becomes 1 column.

---

## 5. Database Schema (Supabase/PostgreSQL)

### `users`
*   `id` (UUID, PK)
*   `email` (String)
*   `display_name` (String)
*   `avatar_url` (String)
*   `role` (Enum: 'admin', 'guest')

### `memories`
*   `id` (UUID, PK)
*   `user_id` (UUID, FK)
*   `date` (Date) - The "Timeline" date.
*   `created_at` (Timestamp)
*   `type` (Enum: 'photo', 'video', 'note', 'music', 'pdf')
*   `media_url` (String) - Link to Supabase Storage.
*   `content` (Text) - For notes or captions.
*   `metadata` (JSONB) - Stores filesize, song artist, sticker rotation, specific styling overrides.

### `comments`
*   `id` (UUID, PK)
*   `memory_date` (Date, FK) - Links comment to a specific timeline day.
*   `author_name` (String)
*   `content` (Text)
*   `created_at` (Timestamp)

---

## 6. Implementation Phases

### Phase 1: Setup & Layout (Frontend)
*   Initialize Next.js project with Tailwind.
*   Implement the "Glassmorphism" and "Washi Tape" CSS classes.
*   Build the Fixed Profile Widget and Background Stickers.
*   Build the Hero Section (Avatars + 1314 Animation).

### Phase 2: Core Components
*   Build the Timeline Tree with Mobile Drawer logic.
*   Develop the **Scrapbook Card Components** (Photo, Note, PDF, etc.) with Hover Physics using Framer Motion.
*   Implement the Heart Heatmap logic (rendering the grid).

### Phase 3: Backend Integration
*   Set up Supabase project.
*   Create Database Tables.
*   Connect "Love Timer" to a config in DB.
*   Replace mock data `RAW_DATA` with `supabase.from('memories').select('*')`.

### Phase 4: Polish
*   Add loading skeletons (Shimmer effects).
*   Optimize images (Next/Image).
*   Final mobile responsiveness check.