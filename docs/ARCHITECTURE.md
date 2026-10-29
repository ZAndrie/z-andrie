# Project Architecture & Directory Structure

Welcome to the **Z Andrie Creative Developer Portfolio** codebase. This project is built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS v4**, **GSAP 3 / ScrollTrigger**, and **Three.js / React Three Fiber**.

---

## High-Level Folder Layout

```
z-andrie/
├── .vscode/               # Editor workspace settings & file nesting configuration
├── docs/                  # Architecture specs, feature audit logs & documentation
│   ├── ARCHITECTURE.md    # System architecture and directory reference
│   └── FEATURES_AUDIT.md  # Comprehensive portfolio feature audit
├── public/                # Static public assets (images, profile, icons, downloads)
├── src/                   # Primary application source code
│   ├── app/               # Next.js App Router (pages, layouts, metadata & API routes)
│   │   ├── admin/         # Authenticated admin panel routes
│   │   ├── api/           # Server API routes (auth, contact, blog, uploadthing)
│   │   ├── blog/          # Public blog routes
│   │   ├── certificates/  # Certificates page
│   │   ├── contact/       # Contact page
│   │   ├── expertise/     # Skills & experience trajectory page
│   │   ├── login/         # Admin login route
│   │   ├── works/         # Works showcase page
│   │   ├── globals.css    # Global CSS styling & design tokens
│   │   ├── layout.tsx     # Root HTML layout, audio provider, smooth scroll
│   │   └── page.tsx       # Landing page composing all thematic sections
│   ├── components/        # UI components modularized by purpose
│   │   ├── sections/      # Full-page interactive showcase sections
│   │   │   ├── Hero.tsx         # Theatrical intro & title
│   │   │   ├── About.tsx        # Bio & indie game character dossier
│   │   │   ├── Portfolio.tsx    # Works scrub showcase with projector screen
│   │   │   ├── Expertise.tsx    # Skills & academic/work trajectory
│   │   │   ├── Certificates.tsx # Horizontal credential conveyor
│   │   │   ├── BlogSection.tsx  # Dynamic articles feed
│   │   │   └── Contact.tsx      # Terminal contact form & links
│   │   ├── layout/        # Persistent viewport & layout chrome
│   │   │   ├── Navbar.tsx         # Game Menu & audio toggle HUD
│   │   │   ├── Footer.tsx         # Bottom status & copyright bar
│   │   │   ├── CustomCursor.tsx   # Custom hardware cursor & light tether
│   │   │   ├── SmoothScroll.tsx   # GSAP-synchronized Lenis smooth scroller
│   │   │   ├── SitePreloader.tsx  # Game boot sequence preloader
│   │   │   └── ClientUtilities.tsx# Back-to-top & progress bar
│   │   ├── hero/          # 3D Three.js room scene & WebGL canvas
│   │   │   ├── Global3DScene.tsx  # Fixed background R3F Canvas
│   │   │   ├── RoomScene3D.tsx    # Indie game developer room & spotlight
│   │   │   ├── WebGLHeroScene.tsx # Dynamic scene controller
│   │   │   └── TechParticles.tsx  # Volumetric dust motes particle field
│   │   ├── admin/         # Admin dashboard components
│   │   │   └── ClassicEditor.tsx  # Rich text / WYSIWYG editor
│   │   └── ui/            # Reusable atomic UI components
│   │       └── ProjectCard.tsx    # Standalone project card component
│   ├── data/              # Static dataset fallbacks (blog, certificates)
│   ├── lib/               # Utility libraries & API connectors
│   │   ├── auth.ts          # NextAuth configuration
│   │   ├── github.ts        # GitHub API repository & content fetching
│   │   ├── preloader.ts     # Preloader completion event bus
│   │   ├── smoothScroll.ts  # Shared Lenis instance & scrollToTarget helper
│   │   └── telemetry.ts     # Telemetry helpers
│   ├── types/             # Ambient TypeScript declarations
│   └── utils/             # Third-party integration helpers (UploadThing)
│   └── proxy.ts           # Next.js 16 Proxy handler (formerly middleware)
├── AGENTS.md              # Project rules & Next.js 16 agent guidelines
├── CLAUDE.md              # Agent prompt pointer
├── LICENSE                # Open source license
├── README.md              # Project overview & quick start guide
├── eslint.config.mjs      # ESLint configuration
├── next.config.ts         # Next.js 16 build configuration
├── package.json           # Node package manifest & scripts
├── postcss.config.mjs     # PostCSS / Tailwind CSS configuration
└── tsconfig.json          # TypeScript compiler configuration
```

---

## File Nesting in VS Code

To keep the workspace Explorer completely clean and organized, file nesting is enabled via `.vscode/settings.json`. Configuration and documentation files automatically nest under their primary parent files:

- **`package.json`** nests: `package-lock.json`, `tsconfig.json`, `next.config.ts`, `next-env.d.ts`, `postcss.config.mjs`, `eslint.config.mjs`.
- **`README.md`** nests: `LICENSE`, `AGENTS.md`, `CLAUDE.md`.
- **`docs/`** hosts: in-depth architectural guides and audit logs.
