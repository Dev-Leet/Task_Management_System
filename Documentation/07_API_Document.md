# API Documentation
## Task Management System

**Base URL:** `https://api.tms.local/api/v1`
**Format:** JSON | **Auth:** Bearer JWT | **Spec:** OpenAPI 3.0 (auto-generated via FastAPI `/docs`)

---

## 1. Authentication Endpoints

### 1.1 Login
`POST /auth/login`

**Request Body:**
```json
{
  "username": "admin01",
  "password": "SecurePass123!"
}
```
**Response 200:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "expires_in": 1800,
  "role": "admin"
}
```
**Errors:** `401 Unauthorized` (invalid credentials), `403 Forbidden` (inactive account)

### 1.2 Logout
`POST /auth/logout` — Requires Bearer token. Invalidates/blacklists token (or client discards it if pure JWT stateless mode).

### 1.3 Get Current User
`GET /auth/me` — Requires Bearer token.
**Response 200:**
```json
{ "user_id": 1, "username": "admin01", "role": "admin" }
```

---

## 2. Employee Endpoints

| Method | Endpoint | Description | Role Access |
|---|---|---|---|
| GET | `/employees` | List all employees (paginated, filterable) | Admin, Manager |
| GET | `/employees/{id}` | Get employee by ID | Admin, Manager |
| POST | `/employees` | Create new employee | Admin |
| PUT | `/employees/{id}` | Update employee details | Admin |
| DELETE | `/employees/{id}` | Deactivate employee (soft delete) | Admin |

**Sample: Create Employee**
`POST /employees`
```json
{
  "full_name": "Jane Smith",
  "email": "jane@tms.com",
  "department": "Marketing",
  "designation": "Content Lead",
  "phone": "9876543210"
}
```
**Response 201:**
```json
{ "employee_id": 12, "message": "Employee created successfully" }
```

---

## 3. Task Endpoints

| Method | Endpoint | Description | Role Access |
|---|---|---|---|
| GET | `/tasks` | List tasks (filters: status, employee, date) | All (scoped) |
| GET | `/tasks/{id}` | Get task detail | All (scoped) |
| POST | `/tasks` | Create/assign new task | Admin, Manager |
| PUT | `/tasks/{id}` | Update task (reassign, edit fields) | Admin, Manager |
| PATCH | `/tasks/{id}/status` | Update task status/completion | Employee (own), Admin, Manager |
| DELETE | `/tasks/{id}` | Delete task | Admin |

**Sample: Create Task**
`POST /tasks`
```json
{
  "title": "Prepare Q3 report",
  "description": "Compile sales data for Q3",
  "assigned_to": 12,
  "priority": "High",
  "due_date": "2026-08-01"
}
```
**Response 201:**
```json
{ "task_id": 45, "status": "Pending", "message": "Task assigned successfully" }
```

**Sample: Update Task Status**
`PATCH /tasks/45/status`
```json
{ "status": "Completed", "completed": true }
```
**Response 200:**
```json
{ "task_id": 45, "status": "Completed", "completed": true, "updated_at": "2026-07-09T14:32:00Z" }
```

**Sample: List Tasks with Filters**
`GET /tasks?status=Pending&assigned_to=12&page=1&limit=20`
```json
{
  "total": 4,
  "page": 1,
  "results": [
    { "task_id": 45, "title": "Prepare Q3 report", "status": "Pending", "due_date": "2026-08-01" }
  ]
}
```

---

## 4. Dashboard/Reporting Endpoint (Recommended Addition)

`GET /dashboard/summary` — Requires Bearer token (Admin/Manager)
```json
{
  "total_tasks": 120,
  "completed": 80,
  "pending": 30,
  "overdue": 10,
  "by_employee": [
    { "employee_id": 12, "name": "Jane Smith", "completed": 8, "pending": 2 }
  ]
}
```

---

## 5. Standard Error Response Format

```json
{
  "error": {
    "code": 404,
    "message": "Task not found",
    "details": "No task exists with id 999"
  }
}
```

| HTTP Code | Meaning |
|---|---|
| 400 | Bad Request — validation failure |
| 401 | Unauthorized — missing/invalid token |
| 403 | Forbidden — insufficient role permission |
| 404 | Resource not found |
| 409 | Conflict — duplicate entry |
| 422 | Unprocessable Entity — schema validation error (Pydantic) |
| 500 | Internal Server Error |

---

## 6. Authentication Header Format
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

---

## 7. Rate Limiting (Recommended)
- Login endpoint: max 5 requests/minute per IP
- General API: 100 requests/minute per authenticated user

---

## 8. Versioning Strategy
- URI versioning: `/api/v1/...`
- Future breaking changes introduced under `/api/v2/`

---

## 9. Interactive Documentation
Since FastAPI is recommended, live interactive API docs are auto-generated at:
- Swagger UI: `/docs`
- ReDoc: `/redoc`
- Raw OpenAPI schema: `/openapi.json`
