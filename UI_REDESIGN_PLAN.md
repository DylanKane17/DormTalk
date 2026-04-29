# DormTalk UI Redesign Plan

## Design Vision

Transform DormTalk into a modern, Instagram-inspired social platform with a clean, minimalist interface using blue and green as primary brand colors.

---

## Color Palette (Blue & Green Theme)

### Primary Colors

- **Primary Blue**: `oklch(0.55 0.15 250)` - Main brand color
- **Primary Green**: `oklch(0.60 0.12 150)` - Accent/success color
- **Blue Gradient**: Linear gradient from blue to green for special elements

### Neutrals (Tinted toward blue)

- **Background**: `oklch(0.98 0.005 250)` - Very light blue-tinted white
- **Surface**: `oklch(0.96 0.008 250)` - Card backgrounds
- **Border**: `oklch(0.90 0.01 250)` - Subtle borders
- **Text Primary**: `oklch(0.20 0.01 250)` - Almost black with blue tint
- **Text Secondary**: `oklch(0.50 0.01 250)` - Gray text
- **Text Tertiary**: `oklch(0.65 0.01 250)` - Lighter gray

### Interactive States

- **Hover**: `oklch(0.50 0.15 250)` - Darker blue
- **Active**: `oklch(0.45 0.15 250)` - Even darker
- **Focus Ring**: `oklch(0.55 0.15 250 / 0.3)` - Transparent blue

---

## Layout Structure

### 1. Navigation Bar (Top)

**Layout**: Fixed top bar, 60px height, white background with subtle shadow

**Structure** (left to right):

```
[Logo] -------- [Central Search Bar] -------- [Profile Avatar + Dropdown]
```

**Components**:

- **Logo** (left): "DormTalk" text or icon, links to home
- **Search Bar** (center):
  - Max width 600px
  - Rounded pill shape
  - Light gray background
  - Search icon on left
  - Placeholder: "Search posts..."
- **Profile Section** (right):
  - Avatar (40px circle)
  - Dropdown menu on click:
    - My Profile
    - My Posts
    - My Comments
    - Messages (with unread badge)
    - Settings
    ***
    - Sign Out

### 2. Main Content Area

**Layout**: Center-aligned, max-width 680px (Instagram feed width)

**Structure**:

```
[Navigation Tabs]
[Post Feed]
```

---

## Component Redesigns

### Post Card

**Inspired by**: Instagram post cards, Reddit cards

**Structure**:

```
┌─────────────────────────────────────┐
│ [@username] • [2h ago]         [...] │ ← Header
├─────────────────────────────────────┤
│                                     │
│  Post Title (bold, larger)          │
│                                     │
│  Post content text...               │
│  Continues here...                  │
│                                     │
├─────────────────────────────────────┤
│ [↑ 125] [↓] [💬 15] [Share]        │ ← Actions
└─────────────────────────────────────┘
```

**Styling**:

- White background
- Rounded corners (12px)
- Subtle shadow
- 16px padding
- Hover: slight elevation increase

### Navigation Tabs

**Style**: Horizontal pills, similar to Instagram stories bar

```
[All] [My Posts] [Liked Posts] [Messages]
```

- Active tab: Blue background, white text
- Inactive: Gray text, transparent background
- Smooth transition on hover

### Buttons

**Primary**: Blue background, white text, rounded
**Secondary**: White background, blue border, blue text
**Danger**: Red background, white text

### Forms & Inputs

- Rounded corners (8px)
- Light gray borders
- Blue focus ring
- Floating labels (Material Design style)

---

## Page-Specific Designs

### Home/Feed Page

```
┌─────────────────────────────────────────────┐
│           [Navigation Bar]                   │
├─────────────────────────────────────────────┤
│                                             │
│     [Navigation Tabs]                       │
│                                             │
│     ┌─────────────────────────┐            │
│     │   Post Card 1           │            │
│     └─────────────────────────┘            │
│                                             │
│     ┌─────────────────────────┐            │
│     │   Post Card 2           │            │
│     └─────────────────────────┘            │
│                                             │
│     ┌─────────────────────────┐            │
│     │   Post Card 3           │            │
│     └─────────────────────────┘            │
│                                             │
└─────────────────────────────────────────────┘
```

### Profile Page

```
┌─────────────────────────────────────────────┐
│           [Navigation Bar]                   │
├─────────────────────────────────────────────┤
│                                             │
│     ┌─────────────────────────┐            │
│     │  [Avatar]               │            │
│     │  @username              │            │
│     │  Bio text here...       │            │
│     │                         │            │
│     │  [Stats Row]            │            │
│     │  125 Posts | 45 Comments│            │
│     │                         │            │
│     │  [Edit Profile Button]  │            │
│     └─────────────────────────┘            │
│                                             │
│     [User's Posts Grid]                     │
│                                             │
└─────────────────────────────────────────────┘
```

### Messages Page

**Inspired by**: Instagram DMs

**Two-column layout**:

```
┌──────────────┬──────────────────────────┐
│ Conversations│  Active Conversation     │
│              │                          │
│ [@user1]     │  [@user2]                │
│ [@user2] ●   │  ┌────────────────────┐ │
│ [@user3]     │  │ Message bubble     │ │
│              │  └────────────────────┘ │
│              │  ┌────────────────────┐ │
│              │  │ Your message       │ │
│              │  └────────────────────┘ │
│              │                          │
│              │  [Type message...]       │
└──────────────┴──────────────────────────┘
```

---

## Typography

### Font Stack

```css
font-family:
  -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue",
  Arial, sans-serif;
```

### Scale

- **Heading 1**: 32px, bold (Page titles)
- **Heading 2**: 24px, bold (Section headers)
- **Heading 3**: 20px, semibold (Card titles)
- **Body**: 16px, regular (Main content)
- **Small**: 14px, regular (Metadata, timestamps)
- **Tiny**: 12px, regular (Labels, badges)

### Line Heights

- Headings: 1.2
- Body: 1.6
- Small: 1.4

---

## Spacing System

Use 4px base unit:

- **xs**: 4px
- **sm**: 8px
- **md**: 16px
- **lg**: 24px
- **xl**: 32px
- **2xl**: 48px

---

## Animations

### Transitions

- **Fast**: 150ms (hover states)
- **Normal**: 250ms (most transitions)
- **Slow**: 350ms (page transitions)

### Easing

- Use `ease-out` for most transitions
- Cubic bezier: `cubic-bezier(0.16, 1, 0.3, 1)` for smooth feel

### Hover Effects

- Cards: Slight elevation increase + subtle scale (1.01)
- Buttons: Darken background color
- Links: Underline appears

---

## Implementation Order

### Phase 1: Core Components (Week 1)

1. ✅ Update color system in globals.css
2. ✅ Redesign Navigation component
3. ✅ Create new Button variants
4. ✅ Update Input/Textarea components
5. ✅ Redesign Card component

### Phase 2: Main Pages (Week 2)

6. ✅ Redesign Home/Feed page
7. ✅ Redesign PostCard component
8. ✅ Update Profile page layout
9. ✅ Redesign Messages page

### Phase 3: Polish (Week 3)

10. ✅ Add animations and transitions
11. ✅ Responsive design adjustments
12. ✅ Accessibility improvements
13. ✅ Performance optimization

---

## Responsive Breakpoints

```css
/* Mobile */
@media (max-width: 640px) {
  /* Stack navigation, hide search on mobile */
}

/* Tablet */
@media (min-width: 641px) and (max-width: 1024px) {
  /* Adjust spacing, smaller max-width */
}

/* Desktop */
@media (min-width: 1025px) {
  /* Full layout as designed */
}
```

---

## Key Design Principles

1. **Clean & Minimal**: Remove unnecessary elements, focus on content
2. **Consistent Spacing**: Use spacing system religiously
3. **Subtle Interactions**: Smooth transitions, no jarring animations
4. **Content First**: Design serves the content, not the other way around
5. **Mobile Friendly**: Touch targets ≥44px, readable text sizes
6. **Accessible**: Proper contrast ratios, keyboard navigation, ARIA labels

---

## Anti-Patterns to Avoid

❌ Side-stripe borders on cards
❌ Gradient text
❌ Glassmorphism effects
❌ Identical card grids
❌ Overuse of shadows
❌ Too many colors
❌ Inconsistent spacing

---

## Next Steps

1. Review and approve this plan
2. Begin Phase 1 implementation
3. Test each component as it's built
4. Iterate based on feedback
5. Move to Phase 2 once Phase 1 is solid

---

**Status**: Ready for implementation
**Last Updated**: April 26, 2026
