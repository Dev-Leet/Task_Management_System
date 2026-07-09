# UI/UX Design Document
## Task Management System

---

## 1. Design Philosophy
The UI follows a **clean, minimal, task-focused** design emphasizing clarity, quick scanning of task status, and low cognitive load for non-technical users (managers/employees). Design principles applied: **consistency, feedback, visibility of system status, and error prevention** (Nielsen's Heuristics).

---

## 2. Design System

### 2.1 Color Palette
| Purpose | Color | Hex |
|---|---|---|
| Primary (Brand/Actions) | Indigo | `#4F46E5` |
| Secondary | Slate Gray | `#64748B` |
| Success (Completed) | Green | `#22C55E` |
| Warning (Pending) | Amber | `#F59E0B` |
| Danger (Overdue) | Red | `#EF4444` |
| Background | Off-white | `#F8FAFC` |
| Surface/Card | White | `#FFFFFF` |
| Text Primary | Slate 900 | `#0F172A` |

### 2.2 Typography
- **Font Family:** `Inter`, `Segoe UI`, sans-serif (modern, highly legible for UI)
- **Headings:** 600–700 weight, sizes 24px/20px/16px (H1/H2/H3)
- **Body:** 400 weight, 14–16px
- **Line height:** 1.5 for readability

### 2.3 Spacing & Grid
- 8px base spacing unit (8/16/24/32px scale)
- 12-column responsive grid for dashboard layout
- Card-based layout with 16px border radius for modern soft-UI feel

### 2.4 Components Library
- Buttons (Primary/Secondary/Danger, with hover & active states)
- Input fields (with floating labels, inline validation messages)
- Dropdown/Select menus
- Toggle switch (for True/False completion status)
- Modal dialogs (task creation/edit)
- Toast notifications (success/error, auto-dismiss)
- Status Badges (color-coded chips: Pending/In Progress/Completed/Overdue)
- Data table with sortable columns and pagination

---

## 3. Key Screens

### 3.1 Login Page
- Centered card layout, logo, email/username + password fields
- "Remember Me" checkbox, error message area
- Subtle fade-in animation on load

### 3.2 Admin/Manager Dashboard
- Sidebar navigation: Dashboard, Employees, Tasks, Reports, Logout
- Top summary cards: Total Tasks, Completed, Pending, Overdue (animated count-up)
- Task table/board view with filters (by employee, status, date)
- Floating "+ New Task" button (bottom-right FAB style)

### 3.3 Task Creation/Edit Form (Modal)
Fields:
- Task Title (text input)
- Description (textarea)
- Assign To (searchable dropdown of employees)
- Priority (dropdown: Low/Medium/High)
- Due Date (date picker)
- Status/Completed (toggle switch True/False)
- Submit / Cancel buttons with hover animation

### 3.4 Employee List Page
- Table: Name, Department, Email, Assigned Task Count, Actions (Edit/Deactivate)
- Add Employee modal form

### 3.5 Employee Task View
- Simplified read-focused list of "My Tasks"
- Quick status update via inline dropdown/toggle
- Progress bar or completion percentage indicator

---

## 4. Interaction & Animation Guidelines

| Element | Animation |
|---|---|
| Page Load | Fade-in (200ms ease-in) |
| Modal Open/Close | Slide-up + fade (250ms) |
| Button Hover | Scale 1.02 + shadow elevation |
| Task Status Change | Color transition on badge (300ms) |
| Toast Notification | Slide-in from top-right, auto-dismiss after 3s |
| Form Validation Error | Shake animation (subtle, 200ms) |
| Table Row | Hover highlight + row expand for details |

*Recommended libraries:* CSS `@keyframes` and `transition` for micro-interactions; optional AOS.js (Animate On Scroll) for dashboard entrance effects; avoid heavy animation libraries for performance.

---

## 5. Responsive Design Strategy

| Breakpoint | Target | Layout Adjustment |
|---|---|---|
| < 640px | Mobile | Sidebar collapses to hamburger menu; table → card list |
| 640–1024px | Tablet | 2-column dashboard summary cards |
| > 1024px | Desktop | Full sidebar + multi-column layout |

---

## 6. Accessibility (A11y)
- Sufficient color contrast (WCAG AA, min 4.5:1 for text)
- All form inputs have associated `<label>` elements
- Keyboard navigability (tab order, focus states visible)
- ARIA roles for modals and toasts (`role="dialog"`, `aria-live="polite"`)

---

## 7. User Flow Diagram (Textual)

```
Login → Role Check
   ├── Admin/Manager → Dashboard → [Create Task | View Tasks | Manage Employees]
   │        └── Create Task → Fill Form → Submit → Toast Success → Dashboard Updates
   └── Employee → My Tasks → Update Status → Toast Success → List Refreshes
```

---

## 8. Wireframe Notes (To be prototyped in Figma)
- Low-fidelity wireframes recommended before high-fidelity mockups
- Maintain 8px grid alignment across all screens
- Prioritize above-the-fold visibility of key actions (New Task, Status Filters)
