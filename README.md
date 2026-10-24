# Z Andrie — Portfolio v1: The Foundation

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-success?style=for-the-badge&logo=vercel)](https://website-portfolio-murex-eight.vercel.app)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![GSAP](https://img.shields.io/badge/GSAP-3.15-green?style=for-the-badge&logo=greensock)](https://greensock.com/gsap/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)

An editorial, responsive, component-driven web portfolio designed and developed to showcase modern frontend engineering, high-performance UI/UX design, and interactive animations.

---

## 🌐 Live URL
- **Production URL:** [https://website-portfolio-murex-eight.vercel.app](https://website-portfolio-murex-eight.vercel.app)
- **GitHub Repository:** [https://github.com/ZAndrie/z-andrie](https://github.com/ZAndrie/z-andrie)

---

## 📖 Project Overview

This portfolio fulfills the requirements for **Q2 — Portfolio v1: The Foundation**, prioritizing clean code architecture, smooth entrance animations, mobile-first responsiveness, and modular component design.

### Key Sections:
- **Hero Section**: Distinctive editorial hero displaying name, role tagline, profile photo, and dual call-to-action buttons (*"View My Work"* and *"Contact Me"*), brought to life with a **GSAP** timeline entrance animation.
- **About Section**: Comprehensive 1–2 paragraph bio detailing who I am, where I am based (Philippines), and what technologies and architecture patterns I am currently mastering.
- **Projects Showcase**: Interactive card grid powered by a reusable `ProjectCard` component featuring 3 Q1 React/GSAP mini-projects with title, short description, tech stack tags, screenshot previews, and direct links to both the **GitHub Repository** and **Live Demo**.
- **Contact Section**: Streamlined communication hub featuring a direct message form, verified Gmail delivery, contact details, vCard QR code, and direct links to **GitHub** and **LinkedIn**.
- **Footer**: Dynamic copyright notice paired with interactive social media icons (GitHub, LinkedIn, Instagram, Wattpad).

---

## 🛠️ Tech Stack

- **Core Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **UI Library:** [React 19](https://react.dev/)
- **Animation Engine:** [GSAP](https://greensock.com/gsap/) (`gsap` & `@gsap/react`), [Framer Motion](https://www.framer.com/motion/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons & Typography:** FontAwesome 6, Lucide React, Playfair Display & Inter
- **Language:** TypeScript
- **Deployment Platform:** [Vercel](https://vercel.com/)

---

## 🧩 Component Architecture

```text
src/
├── app/
│   ├── layout.tsx         # Root layout with fonts, navigation, and footer
│   ├── page.tsx           # Home page (Hero + About narrative flow)
│   ├── works/page.tsx     # Dedicated projects showcase route
│   ├── expertise/page.tsx # Skills, education, and experience route
│   ├── contact/page.tsx   # Contact page route
│   └── globals.css        # Tailwind theme variables and global styles
├── components/
│   ├── Hero.tsx           # Hero with GSAP entrance animations and CTAs
│   ├── About.tsx          # 1-2 paragraph bio, location & learning focus
│   ├── ProjectCard.tsx    # Modular project card (screenshot, tags, dual links)
│   ├── Portfolio.tsx      # Projects filterable gallery grid
│   ├── Contact.tsx        # Contact section with form, email, GitHub, LinkedIn
│   ├── Footer.tsx         # Footer with copyright and social icons
│   ├── Navbar.tsx         # Responsive navbar with mobile drawer
│   └── TechParticles.tsx  # Dynamic floating canvas particles
└── lib/
    └── github.ts          # Project data management & Q1 project catalog
```

---

## 🚀 Getting Started

Follow these steps to run the portfolio locally on your machine:

### 1. Clone the repository
```bash
git clone https://github.com/ZAndrie/z-andrie.git
cd z-andrie
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### 4. Build for production
```bash
npm run build
npm run start
```

---

## 👤 Author

**Z Andrie Barraba**  
- **GitHub:** [@ZAndrie](https://github.com/ZAndrie)  
- **LinkedIn:** [Z Andrie Barraba](https://www.linkedin.com/in/z-andrie-barraba-474428401/)  
- **Email:** [zandriebarraba.1305@gmail.com](mailto:zandriebarraba.1305@gmail.com)  

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
