## Design System: Atomo Quantico

### Pattern
- **Name:** Hero-Centric + Social Proof
- **CTA Placement:** Above fold
- **Sections:** Hero > Features > CTA

### Style
- **Name:** Soft UI Evolution
- **Keywords:** Evolved soft UI, better contrast, modern aesthetics, subtle depth, accessibility-focused, improved shadows, hybrid
- **Best For:** Modern enterprise apps, SaaS platforms, health/wellness, modern business tools, professional, hybrid
- **Performance:** ÔÜí Excellent | **Accessibility:** Ô£ô WCAG AA+

### Colors
| Role | Hex |
|------|-----|
| Primary | #10B981 |
| Secondary | #34D399 |
| CTA | #8B5CF6 |
| Background | #ECFDF5 |
| Text | #064E3B |

*Notes: Soft pastels (Pink #FFB6C1 Sage #90EE90) + Cream + Gold accents*

### Typography
- **Heading:** Varela Round
- **Body:** Nunito Sans
- **Mood:** soft, rounded, friendly, approachable, warm, gentle
- **Best For:** Children's products, pet apps, friendly brands, wellness, soft UI
- **Google Fonts:** https://fonts.google.com/share?selection.family=Nunito+Sans:wght@300;400;500;600;700|Varela+Round
- **CSS Import:**
```css
@import url('https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@300;400;500;600;700&family=Varela+Round&display=swap');
```

### Key Effects
Improved shadows (softer than flat, clearer than neumorphism), modern (200-300ms), focus visible, WCAG AA/AAA

### Avoid (Anti-patterns)
- Bright neon colors
- Harsh animations
- Dark mode

### Pre-Delivery Checklist
- [ ] No emojis as icons (use SVG: Heroicons/Lucide)
- [ ] cursor-pointer on all clickable elements
- [ ] Hover states with smooth transitions (150-300ms)
- [ ] Light mode: text contrast 4.5:1 minimum
- [ ] Focus states visible for keyboard nav
- [ ] prefers-reduced-motion respected
- [ ] Responsive: 375px, 768px, 1024px, 1440px


============================================================
Ô£à Design system persisted to design-system/atomo-quantico/
   ­ƒôä design-system/atomo-quantico/MASTER.md (Global Source of Truth)

­ƒôû Usage: When building a page, check design-system/atomo-quantico/pages/[page].md first.
   If exists, its rules override MASTER.md. Otherwise, use MASTER.md.
============================================================
