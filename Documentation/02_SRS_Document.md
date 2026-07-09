# Software Requirements Specification (SRS)
## Task Management System

**Version:** 1.0 | **Standard Reference:** IEEE 830 / ISO/IEC/IEEE 29148

---

## 1. Introduction

### 1.1 Purpose
This SRS defines the functional and non-functional requirements for the Task Management System, intended for use by Admins/Managers to assign and track tasks for Employees.

### 1.2 Document Conventions
- **Shall** = mandatory requirement
- **Should** = recommended requirement
- **FR** = Functional Requirement, **NFR** = Non-Functional Requirement

### 1.3 Product Scope
A web-based CRUD application with role-based access enabling task delegation and status monitoring, backed by a relational database.

### 1.4 References
- IEEE 830-1998 SRS Standard
- OWASP Application Security Verification Standard

---

## 2. Overall Description

### 2.1 Product Perspective
Standalone 3-tier web application; not dependent on external enterprise systems, though extensible toward email/notification integrations.

### 2.2 User Classes and Characteristics

| User Class | Description | Technical Expertise |
|---|---|---|
| Admin | Full system control, manages users & tasks | Low-Medium |
| Manager | Assigns/tracks tasks for their team | Low-Medium |
| Employee | Views assigned tasks, updates status | Low |

### 2.3 Operating Environment
- Server: Linux (Ubuntu 22.04+), Python 3.12+
- Client: Any modern browser (Chrome, Edge, Firefox — latest 2 versions)
- Database Server: MySQL 8.x

### 2.4 Design & Implementation Constraints
- Must use Python for backend (mandated)
- Must use MySQL as primary DB (mandated); MongoDB optional
- Frontend restricted to HTML/CSS/JS (framework optional but not mandated)

### 2.5 Assumptions and Dependencies
- Users have valid credentials provisioned by Admin
- Stable network connectivity between client and server

---

## 3. Functional Requirements

### 3.1 Authentication Module

| ID | Requirement |
|---|---|
| FR-01 | The system shall allow users to log in using email/username and password |
| FR-02 | The system shall hash and salt all stored passwords (bcrypt) |
| FR-03 | The system shall differentiate access based on role (Admin/Manager/Employee) |
| FR-04 | The system shall issue a JWT token upon successful login |
| FR-05 | The system shall log out users and invalidate tokens on session end |
| FR-06 | The system shall lock accounts after 5 consecutive failed login attempts (recommended) |

### 3.2 Employee & Task Management Module

| ID | Requirement |
|---|---|
| FR-07 | Admin shall be able to create, update, deactivate employee records |
| FR-08 | Manager/Admin shall be able to create a new task and assign it to one or more employees |
| FR-09 | The system shall capture task title, description, priority, due date, and assignee |
| FR-10 | Employee shall be able to update task status (Pending/In Progress/Completed) |
| FR-11 | The system shall track a boolean `completed` flag per task |
| FR-12 | Manager/Admin shall be able to view all tasks filtered by employee, status, or date |
| FR-13 | The system shall timestamp task creation and last update |

### 3.3 Database Module

| ID | Requirement |
|---|---|
| FR-14 | The system shall persist all login credentials in a `users`/login table |
| FR-15 | The system shall maintain an `employees` table linked to `users` |
| FR-16 | The system shall maintain a `tasks` table with FK references to `employees` |
| FR-17 | The system shall enforce referential integrity (ON DELETE/UPDATE CASCADE where applicable) |

### 3.4 UI Module

| ID | Requirement |
|---|---|
| FR-18 | The system shall provide a task creation form with validation |
| FR-19 | The system shall provide dropdown selectors for employee and status fields |
| FR-20 | The system shall provide a True/False (toggle/checkbox) for task completion |
| FR-21 | The system shall provide visual feedback (animations/toasts) on form submission |
| FR-22 | The UI shall be responsive across desktop and tablet viewports |

---

## 4. Non-Functional Requirements

| ID | Category | Requirement |
|---|---|---|
| NFR-01 | Performance | API responses shall complete within 300ms under nominal load |
| NFR-02 | Security | All endpoints (except login) shall require valid JWT |
| NFR-03 | Security | Inputs shall be validated/sanitized server-side (Pydantic schemas) |
| NFR-04 | Usability | UI shall follow WCAG 2.1 AA accessibility guidelines (recommended) |
| NFR-05 | Reliability | System shall maintain data consistency via DB transactions |
| NFR-06 | Maintainability | Code shall follow PEP8 (Python) and modular MVC structure |
| NFR-07 | Portability | System shall be deployable via Docker containers |
| NFR-08 | Scalability | Backend shall be stateless to support horizontal scaling |
| NFR-09 | Auditability | System should log key actions (task creation, status change) |

---

## 5. External Interface Requirements

### 5.1 User Interfaces
- Login Page, Dashboard (role-specific), Task Form, Employee List, Task List/Board view

### 5.2 API Interfaces
- RESTful JSON APIs served over HTTPS (see API Document)

### 5.3 Hardware Interfaces
- None beyond standard client device (browser-capable)

---

## 6. Data Requirements Summary
- Relational schema in 3NF (see Database Schema ERD Document)
- Minimum retention: task records retained indefinitely unless purged by Admin

---

## 7. Appendix: Traceability Matrix (Sample)

| Requirement ID | Module | Test Case Ref |
|---|---|---|
| FR-01 | Auth | TC-AUTH-01 |
| FR-08 | Task Mgmt | TC-TASK-01 |
| FR-16 | Database | TC-DB-01 |
