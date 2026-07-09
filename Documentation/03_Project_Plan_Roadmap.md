# Project Plan & Roadmap
## Task Management System

**Methodology:** Agile (Sprint-based, 2-week sprints) | **Total Estimated Duration:** 8 Weeks

---

## 1. Project Phases Overview

| Phase | Duration | Objective |
|---|---|---|
| Phase 1: Planning & Design | Week 1 | Requirements finalization, HLD/SRS, wireframes, schema design |
| Phase 2: Environment Setup | Week 2 | Repo setup, DB provisioning, base project scaffolding |
| Phase 3: Core Development | Week 3–5 | Auth, Employee, Task modules (backend + frontend) |
| Phase 4: Integration & UI Polish | Week 6 | API-frontend integration, animations, responsive design |
| Phase 5: Testing & QA | Week 7 | Unit/API/UI testing, bug fixing |
| Phase 6: Deployment & Documentation | Week 8 | Deployment, final docs, demo prep |

---

## 2. Detailed Sprint Breakdown

### Sprint 0 — Week 1: Planning & Design
**What:**
- Finalize requirements (SRS sign-off)
- Design ER diagram and database schema
- Create wireframes/mockups for Login, Dashboard, Task Form
- Choose finalized tech stack

**How:**
- Use Figma/draw.io for wireframes and ERD
- Conduct stakeholder (instructor/team) review

**Deliverables:** HLD, SRS, ERD, Wireframes

---

### Sprint 1 — Week 2: Environment Setup
**What:**
- Initialize Git repository with branching strategy (`main`, `dev`, `feature/*`)
- Set up Python virtual environment, install FastAPI/Flask, SQLAlchemy
- Set up MySQL database & schema migration tool (Alembic)
- Configure Docker Compose (app + MySQL)

**How:**
- `git init`, create `.gitignore`, `requirements.txt`
- Configure `docker-compose.yml` with MySQL service
- Set up base FastAPI app with health-check endpoint

**Deliverables:** Working dev environment, empty scaffolded project, CI pipeline skeleton

---

### Sprint 2 — Week 3: Authentication Module
**What:**
- Implement `users` table, password hashing
- Build login API (`/api/auth/login`)
- Implement JWT issuance & middleware for protected routes
- Build frontend login page

**How:**
- Use `passlib[bcrypt]` for hashing, `python-jose`/`PyJWT` for tokens
- Frontend: fetch API calls, store token in memory/httpOnly cookie

**Deliverables:** Functional login with role-based redirect

---

### Sprint 3 — Week 4: Employee Management Module
**What:**
- Implement `employees` table & CRUD APIs
- Admin UI: Add/Edit/Deactivate employee
- Employee listing page with search/filter

**How:**
- SQLAlchemy models + Pydantic schemas
- Frontend table rendering with dynamic JS (fetch + DOM manipulation)

**Deliverables:** Full employee CRUD functional end-to-end

---

### Sprint 4 — Week 5: Task Management Module
**What:**
- Implement `tasks` table (FK to employees)
- Task creation/assignment API
- Task status update API
- Task form UI with dropdowns and completion toggle

**How:**
- Enforce FK constraints in MySQL
- Status enum: `Pending`, `In Progress`, `Completed`
- Frontend validation before submission

**Deliverables:** End-to-end task assignment and tracking flow

---

### Sprint 5 — Week 6: Integration, UI/UX Polish
**What:**
- Connect all modules into a cohesive dashboard
- Add CSS animations/transitions (task card hover, modal slide-in)
- Add toast notifications for success/error states
- Responsive design pass (mobile/tablet breakpoints)

**How:**
- CSS transitions/keyframes, optional AOS.js/GSAP for animation
- Media queries or utility CSS (Tailwind)

**Deliverables:** Polished, integrated UI

---

### Sprint 6 — Week 7: Testing & QA
**What:**
- Unit tests (Pytest) for backend services
- API testing (Postman collection / Newman CI run)
- Manual UI/UX testing across browsers
- Bug fixing & regression testing

**How:**
- Achieve minimum 70% backend test coverage
- Document test cases mapped to SRS requirements (traceability matrix)

**Deliverables:** Test report, bug-fix log

---

### Sprint 7 — Week 8: Deployment & Final Documentation
**What:**
- Dockerize full stack (frontend + backend + MySQL)
- Deploy to a cloud VM / PaaS (Render, Railway, or college server)
- Finalize all documentation (this doc set)
- Prepare demo script/presentation

**How:**
- `docker-compose up` for production-like environment
- Nginx as reverse proxy (optional, for production polish)

**Deliverables:** Live/deployed application, complete documentation package, final presentation

---

## 3. Milestone Timeline (Gantt-style Summary)

| Week | Milestone |
|---|---|
| 1 | Requirements & Design Freeze |
| 2 | Dev Environment Ready |
| 3 | Authentication Live |
| 4 | Employee Module Complete |
| 5 | Task Module Complete |
| 6 | UI Integration Complete |
| 7 | QA Sign-off |
| 8 | Deployment & Final Submission |

---

## 4. Roles & Responsibilities (Team Template)

| Role | Responsibility |
|---|---|
| Project Lead | Coordination, documentation, integration |
| Backend Developer | API development, database logic |
| Frontend Developer | UI/UX implementation |
| QA/Tester | Test case design & execution |

---

## 5. Tools & Tracking

- **Task Board:** Trello / GitHub Projects (Kanban: To Do → In Progress → Review → Done)
- **Version Control:** GitHub with PR reviews
- **Communication:** Weekly standup/sync
- **Documentation:** Markdown in repo `/docs` folder
