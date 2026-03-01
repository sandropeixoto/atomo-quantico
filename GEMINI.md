# Átomo Quântico - Project Overview & Instructions

## ⚛️ Project Overview
**Átomo Quântico** is a gamified social platform for gratitude, built as a modern web and mobile application. Inspired by quantum mechanics principles, it transforms positive interactions into "Photons" (points), allowing users to evolve through 7 "Levels of Consciousness".

### 🛠 Tech Stack
- **Frontend**: React 19 (Functional Components, Hooks), TypeScript, Vite.
- **Styling**: Tailwind CSS 4 (Modern, Dark Mode, Edge-to-Edge mobile layout).
- **State Management**: Zustand (`userProgressStore` for gamification).
- **Backend**: Firebase (Firestore for data, Auth for user management, Analytics).
- **Mobile**: Capacitor (Cross-platform bridge for Android/iOS).
- **Animations**: Framer Motion (Transitions, rewards, micro-interactions).

### 🏗 Architecture
- **`/src/pages`**: Main application views (Home, Public Feed, Profile, Journey).
- **`/src/components`**: Reusable UI components (Cards, Spinners, Sidebar).
- **`/src/services`**: External service integrations (Firebase).
- **`/src/stores`**: Global state management using Zustand.
- **`/android`**: Native Android project files (Capacitor).

---

## 🚀 Building and Running

### Development
1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Start Vite development server**:
   ```bash
   npm run dev
   ```
3. **Lint the project**:
   ```bash
   npm run lint
   ```

### Production Build
1. **Build web assets**:
   ```bash
   npm run build
   ```
2. **Preview production build**:
   ```bash
   npm run preview
   ```

### Mobile (Android)
1. **Sync web build to Android project**:
   ```bash
   npx cap sync android
   ```
2. **Generate Signed Android App Bundle (.aab)**:
   *Ensure `android/key.properties` is configured with valid credentials.*
   ```bash
   export JAVA_HOME=/path/to/jdk-21 # Required for Gradle 8.14
   cd android && ./gradlew bundleRelease
   ```

---

## 💎 Development Conventions

### Coding Style
- **TypeScript**: Mandatory type safety for all components and stores.
- **Components**: Functional components using Arrow Functions.
- **Styling**: Utility-first approach with Tailwind CSS. Follow "Edge-to-Edge" rules for mobile (minimal horizontal padding).
- **Naming**: PascalCase for components, camelCase for variables and functions.

### Gamification Logic (`userProgressStore.ts`)
- **Action Rewards**:
  - Create Entry: `+10 Photons`
  - Give Like: `+1 Photon`
  - Comment: `+3 Photons`
  - Receive Like: `+2 Photons` (to the author)
- **Evolution**: 7 levels ranging from "Observador Quântico" (0+) to "Entidade de Luz" (2500+).
- **Streaks**: Daily consistency increases the "Current Streak" and "Longest Streak".

### Firebase Structure
- **`users`**: Documents named by `uid`. Stores `photons`, `currentStreak`, `longestStreak`, `lastPostedDate`.
- **`entries`**: Main post collection.
- **`entries/{id}/likes`**: Subcollection for unique user likes.
- **`entries/{id}/comments`**: Subcollection for entry discussions.

### Mobile-First Principles
- Minimum touch target: `44x44px`.
- Interactive elements must use `whileTap={{ scale: 0.8 }}` or similar feedback via Framer Motion.
- Transparent Sticky Headers for contextual navigation.
- **Safe Area Insets**: Must always use `env(safe-area-inset-*)` for fixed elements (Header, Footer, Sidebar) to avoid system UI overlap.

## 🎨 Visual Identity & Animations

### ⚛️ Quantum Logo (The Core)
- **Format**: Native SVG integrated with Framer Motion.
- **Visuals**: A central nucleus with 3 elliptical orbits.
- **Animation**: 
  - Elétrons must follow orbit paths with staggered durations (2s, 2.5s, 3s).
  - Central nucleus pulses with an `easeInOut` scale effect.
- **Colors**: Use `nucleusGradient` (#A78BFA to #7C3AED) and `orbitGradient` with transparency.
- **Scalability**: Must support sizes `sm` (Header), `md`, `lg` (Splash/Hero), and `xl`.

### 🌌 Immersive SplashScreen
- **Duration**: ~3.5 seconds.
- **Layout**: Full-screen `#0D0B1A` background with radial glow effects (`secondary/10` and `accent/10`).
- **Typography**: "ÁTOMO QUÂNTICO" in Black Italic uppercase with wide tracking (`0.2em`).
- **Transition**: Smooth `opacity` and `scale` exit to reveal the main app content.

### ✨ Animation Principles
- **Library**: Framer Motion is the standard.
- **Feedback**: Every interaction should trigger a micro-interaction (scale or subtle glow).
- **Smoothness**: Use `spring` transitions for layout changes and `linear` for continuous orbital movements.
