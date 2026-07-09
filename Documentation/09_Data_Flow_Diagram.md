# Data Flow Diagram (DFD)
## Task Management System

---

## 1. Context Diagram (Level 0 DFD)

```
                    ┌───────────────────────────┐
   Admin/Manager ──▶│                             │◀── Employee
   (Assign Tasks)   │   TASK MANAGEMENT SYSTEM   │   (Update Status)
   Inputs            │                             │   Inputs
                    └───────────────────────────┘
                              │        ▲
                       Reports/Status  │  Task Assignments/
                       Updates ▼        │  Login Credentials
```

---

## 2. Level 1 DFD — Detailed Data Flow

```
┌────────────┐      Credentials      ┌────────────────────┐      Query      ┌─────────────┐
│   User     │ ───────────────────▶ │  1.0 Authenticate   │ ─────────────▶ │  users table │
│ (Browser)  │                       │  (Auth Middleware)  │ ◀───────────── │              │
└─────┬──────┘ ◀─────────────────── │                      │   User Record   └─────────────┘
      │            JWT Token         └──────────┬──────────┘
      │                                          │ Valid Token
      ▼                                          ▼
┌─────────────────────────────────────────────────────────────┐
│                  2.0 Route by Role (Middleware)               │
└───────┬───────────────────────────────────┬───────────────────┘
        │ Admin/Manager                      │ Employee
        ▼                                    ▼
┌───────────────────────┐         ┌───────────────────────────┐
│ 3.0 Task Assignment    │         │ 4.0 Task Status Update     │
│ - Create Task          │         │ - View Assigned Tasks      │
│ - Select Employee       │         │ - Mark Completed/Progress  │
│ - Set Priority/Due Date│         │                            │
└───────────┬───────────┘         └─────────────┬──────────────┘
            │ INSERT                             │ UPDATE
            ▼                                    ▼
      ┌─────────────────────────────────────────────────┐
      │              tasks table (MySQL)                  │
      │   FK: assigned_to → employees.employee_id         │
      │   FK: assigned_by → users.user_id                 │
      └───────────────────────┬───────────────────────────┘
                               │ SELECT (aggregated)
                               ▼
                  ┌─────────────────────────────┐
                  │  5.0 Dashboard/Reporting      │
                  │  - Task counts by status       │
                  │  - Employee performance view  │
                  └───────────────┬───────────────┘
                                  │ JSON Response
                                  ▼
                        ┌───────────────────┐
                        │   User Interface   │
                        │ (Charts/Tables/UI) │
                        └───────────────────┘
```

---

## 3. Process Descriptions

| Process ID | Name | Input | Output |
|---|---|---|---|
| 1.0 | Authenticate | Username/password | JWT token, role |
| 2.0 | Route by Role | JWT token | Access-controlled navigation |
| 3.0 | Task Assignment | Task details, employee selection | New task record |
| 4.0 | Task Status Update | Task ID, new status | Updated task record |
| 5.0 | Dashboard/Reporting | Aggregated task queries | Visual summary (counts, charts) |

---

## 4. End-to-End Sequence (Task Creation Example)

```
User (Manager)
   │  1. Fills task form (title, assignee, due date)
   ▼
Frontend (JS) 
   │  2. Validates form client-side
   │  3. Sends POST /api/v1/tasks with JWT header
   ▼
Python Middleware (FastAPI)
   │  4. Validates JWT & role (Manager/Admin)
   │  5. Validates payload (Pydantic schema)
   │  6. Calls TaskService.create_task()
   ▼
Service Layer
   │  7. Applies business rules (e.g., due date ≥ today)
   ▼
Repository Layer (SQLAlchemy)
   │  8. INSERT INTO tasks (...)
   ▼
MySQL Database
   │  9. Persists record, enforces FK constraint
   ▼
Response flows back: DB → Repository → Service → API → Frontend
   │  10. Frontend shows success toast, refreshes task list
```

---

## 5. Data Flow Summary Table

| Flow | Source | Destination | Data | Protocol |
|---|---|---|---|---|
| Login | Browser | Middleware | Credentials | HTTPS/JSON |
| Auth Response | Middleware | Browser | JWT | HTTPS/JSON |
| Task Create | Browser | Middleware | Task payload | HTTPS/JSON |
| Task Persist | Middleware | MySQL | SQL INSERT | TCP/SQL |
| Task Fetch | MySQL | Middleware | Row data | TCP/SQL |
| Task Display | Middleware | Browser | JSON array | HTTPS/JSON |
| Audit Log (optional) | Middleware | MongoDB | Event document | TCP/BSON |

---

## 6. Notes
- All data flows are secured over HTTPS/TLS in transit.
- MySQL remains the authoritative source of truth for all transactional (task/employee/user) data.
- MongoDB, if used, only receives derivative/log data asynchronously and does not participate in core transactional flow — preserving ACID guarantees for critical operations.
