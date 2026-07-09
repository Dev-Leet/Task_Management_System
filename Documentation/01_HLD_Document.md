# High-Level Design (HLD) Document
## Task Management System

**Version:** 1.0 | **Status:** Draft | **Classification:** Internal

---

## 1. Introduction

### 1.1 Purpose
This document describes the high-level design of the **Task Management System (TMS)**, a web-based application that enables Managers/Admins to assign tasks to employees and track their completion status in real time.

### 1.2 Scope
The system covers user authentication, role-based access control (Admin/Manager vs Employee), task lifecycle management, and a persistent relational data store. It is designed as a 3-tier web application.

### 1.3 Intended Audience
Developers, project reviewers/evaluators, QA engineers, and academic panel members.

### 1.4 Definitions & Acronyms
| Term | Description |
|---|---|
| HLD | High-Level Design |
| RBAC | Role-Based Access Control |
| CRUD | Create, Read, Update, Delete |
| JWT | JSON Web Token |
| ORM | Object Relational Mapping |
| FK | Foreign Key |

---

## 2. System Overview

The Task Management System follows a **3-tier client-server architecture**:

1. **Presentation Tier** — HTML5, CSS3, JavaScript (ES6+), optionally enhanced with a lightweight framework (Alpine.js/vanilla JS) or React for scalability.
2. **Application/Middleware Tier** — Python backend using **FastAPI** (recommended over legacy Flask for its async support, automatic OpenAPI docs, and built-in data validation via Pydantic) or Flask/Django REST Framework as alternatives.
3. **Data Tier** — MySQL (primary, relational, ACID-compliant) with optional MongoDB for unstructured logs/audit trails.

---

## 3. Design Goals

| Goal | Description |
|---|---|
| Usability | Simple, intuitive UI for both Admin and Employee roles |
| Security | Password hashing (bcrypt/argon2), JWT-based session management |
| Scalability | Stateless API layer allows horizontal scaling |
| Maintainability | Modular codebase, clear separation of concerns (MVC) |
| Reliability | Referential integrity via foreign keys, transactional operations |
| Extensibility | New modules (notifications, reporting) can be added without core rewrite |

---

## 4. High-Level Module Breakdown

### 4.1 Authentication Module
- Secure login with hashed credentials
- Role differentiation: `admin`, `manager`, `employee`
- Session/token management (JWT recommended over server-side sessions for statelessness)
- Password reset / forgot password (recommended enhancement)

### 4.2 Employee & Task Management Module
- Employee CRUD (profile, department, designation)
- Task creation, assignment, reassignment
- Task status tracking: `Pending`, `In Progress`, `Completed`, `Overdue`
- Due-date and priority tagging

### 4.3 Database Module
- Normalized relational schema (3NF)
- Tables: `users`, `employees`, `tasks`, with FK relationships
- Optional MongoDB collection for activity logs/notifications

### 4.4 UI Module
- Responsive task form with validation
- Dropdowns for employee selection, status, priority
- Boolean completion toggle
- CSS/JS-based transitions, toast notifications, loading skeletons

### 4.5 Reporting/Dashboard Module (Recommended Addition)
- Task completion analytics (charts via Chart.js)
- Filter by employee, date range, status

---

## 5. High-Level Architecture Diagram (Textual)

```
┌─────────────────────────────┐
│   Presentation Layer (UI)   │
│  HTML5 / CSS3 / JavaScript  │
└───────────────┬─────────────┘
                │ REST API (JSON over HTTPS)
┌───────────────▼─────────────┐
│   Application Layer         │
│  Python (FastAPI/Flask)     │
│  - Auth Service             │
│  - Task Service             │
│  - Employee Service         │
└───────────────┬─────────────┘
                │ ORM (SQLAlchemy) / PyMongo
┌───────────────▼─────────────┐
│   Data Layer                │
│  MySQL (Primary)            │
│  MongoDB (Optional - Logs)  │
└──────────────────────────────┘
```

---

## 6. Technology Stack (Latest Recommended)

| Layer | Technology | Version/Notes |
|---|---|---|
| Frontend | HTML5, CSS3, JavaScript ES6+ | Optionally Tailwind CSS for styling |
| Backend | Python 3.12+ | FastAPI 0.115+ (or Flask 3.x) |
| ORM | SQLAlchemy 2.x | Async support |
| Database | MySQL 8.x | InnoDB engine |
| NoSQL (optional) | MongoDB 7.x | Via PyMongo/Motor |
| Auth | JWT (PyJWT), bcrypt/passlib | Stateless auth |
| API Docs | Swagger/OpenAPI (auto via FastAPI) | Interactive docs |
| Testing | Pytest, Postman/Newman | Unit + API testing |
| Deployment | Docker, Uvicorn/Gunicorn, Nginx | Containerized |
| Version Control | Git + GitHub | CI/CD via GitHub Actions |

---

## 7. Non-Functional Requirements Summary

- **Performance:** API response < 300ms for standard CRUD operations
- **Security:** OWASP Top 10 compliance, input sanitization, parameterized queries
- **Availability:** 99% uptime target (academic/demo scope)
- **Portability:** Fully containerized via Docker for environment consistency

---

## 8. Assumptions & Constraints

- Single organization/tenant (no multi-tenancy required)
- Internet-facing but with restricted CORS origins
- MySQL is the primary source of truth; MongoDB usage is optional and supplementary

---

## 9. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| SQL Injection | Use ORM/parameterized queries |
| Weak Passwords | Enforce password policy + hashing |
| Data Loss | Regular DB backups |
| Scope Creep | Fixed sprint-based roadmap (see Project Plan doc) |
