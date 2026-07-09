# System Architecture Document
## Task Management System

---

## 1. Architectural Style
The system adopts a **3-Tier Layered Architecture** combined with a **RESTful API** communication pattern between the presentation and application layers, and the **Repository/Service pattern** within the backend for separation of concerns.

```
┌────────────────────────────────────────────────────────────┐
│                     CLIENT (Browser)                        │
│  HTML5 + CSS3 + JavaScript (ES6+) / Fetch API / LocalStorage│
└───────────────────────────┬──────────────────────────────────┘
                             │ HTTPS (JSON/REST)
┌───────────────────────────▼──────────────────────────────────┐
│                  APPLICATION SERVER (Python)                 │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────┐  │
│  │ API Layer   │  │ Service Layer│  │ Repository/DAO Layer│  │
│  │ (FastAPI    │→ │ (Business    │→ │ (SQLAlchemy ORM)     │  │
│  │  Routers)   │  │  Logic)      │  │                      │  │
│  └─────────────┘  └──────────────┘  └──────────┬───────────┘  │
│  ┌─────────────────────────────────────────────┼───────────┐ │
│  │  Middleware: Auth (JWT), CORS, Logging, Error Handling   │ │
│  └────────────────────────────────────────────────────────┘ │
└───────────────────────────┬──────────────────────────────────┘
                             │ SQL / TCP
┌───────────────────────────▼──────────────────────────────────┐
│                    DATA LAYER                                │
│   MySQL 8.x (Primary RDBMS)   |  MongoDB 7.x (Optional Logs) │
└────────────────────────────────────────────────────────────┘
```

---

## 2. Component Breakdown

### 2.1 Presentation Layer
- Static HTML/CSS/JS served via the backend (Jinja2 templates) or a separate static file server/CDN
- Communicates exclusively via REST API calls (`fetch`/`XHR`)
- Client-side state managed via vanilla JS objects or lightweight state (no heavy SPA framework required, though React/Vue is a valid future upgrade)

### 2.2 Application Layer (Python Middleware)

| Sub-Component | Responsibility |
|---|---|
| **API/Router Layer** | Defines REST endpoints, request/response schemas (Pydantic) |
| **Service Layer** | Core business logic — task assignment rules, validation |
| **Repository Layer** | Database access abstraction via SQLAlchemy ORM |
| **Auth Middleware** | JWT validation, role-based access enforcement |
| **Exception Handler** | Centralized error responses (400/401/403/404/500) |
| **Logging Middleware** | Request/response logging for observability |

### 2.3 Data Layer
- **MySQL**: Source of truth for users, employees, tasks (ACID transactions)
- **MongoDB (Optional)**: Stores unstructured audit logs, notification history, or activity feeds — chosen for flexible schema and high write throughput on log-type data

---

## 3. Deployment Architecture

```
                     ┌─────────────────┐
                     │   Nginx (Proxy) │
                     │  SSL Termination│
                     └────────┬────────┘
                              │
                 ┌────────────┴────────────┐
                 │                         │
        ┌────────▼────────┐      ┌─────────▼────────┐
        │  App Container   │      │  Static Assets    │
        │  (Uvicorn/Gunicorn)     │  (Nginx/CDN)       │
        │  FastAPI App)   │      └───────────────────┘
        └────────┬────────┘
                 │
        ┌────────▼────────┐      ┌───────────────────┐
        │ MySQL Container  │      │ MongoDB Container  │
        │  (Persistent Vol)│      │ (Optional, Persist) │
        └──────────────────┘      └───────────────────┘

        All orchestrated via Docker Compose
```

---

## 4. Communication Protocol
- **Client ↔ Server:** HTTPS REST, JSON payloads
- **Auth:** Bearer token (`Authorization: Bearer <JWT>`) on all protected routes
- **Server ↔ MySQL:** TCP via SQLAlchemy connection pool (pool size configurable, default 5–10)
- **Server ↔ MongoDB (optional):** Motor (async driver) over TCP

---

## 5. Security Architecture
- **Transport:** TLS/HTTPS enforced (via Nginx SSL termination)
- **Authentication:** JWT with short-lived access tokens (15–30 min) + refresh token strategy
- **Authorization:** RBAC middleware checks `role` claim per endpoint
- **Password Storage:** bcrypt/argon2 hashing, never plaintext
- **Input Validation:** Pydantic schema validation at API boundary
- **SQL Injection Prevention:** ORM-parameterized queries only
- **CORS Policy:** Whitelisted origins only
- **Rate Limiting (recommended):** SlowAPI/Nginx-level throttling on login endpoint

---

## 6. Scalability Considerations
- Stateless API design (JWT, no server-side session) enables horizontal scaling behind a load balancer
- Database connection pooling to handle concurrent requests
- Caching layer (Redis, optional future enhancement) for frequently accessed task lists
- Read-replica MySQL setup possible for reporting-heavy queries at scale

---

## 7. Logging & Monitoring
- Application logs: structured JSON logging (Python `logging` module)
- Optional integration: Prometheus + Grafana for metrics, or simple log aggregation via Docker logs
- Error tracking: Sentry SDK integration (recommended for production)

---

## 8. Architecture Decision Records (ADR Summary)

| Decision | Rationale |
|---|---|
| FastAPI over Flask | Async support, auto-generated OpenAPI docs, built-in validation |
| JWT over server sessions | Statelessness, scalability, mobile-client friendliness |
| MySQL as primary DB | Strong relational integrity needed for task-employee FK relationships |
| MongoDB as optional | Only for unstructured, high-volume log/activity data |
| Docker Compose | Simplifies multi-service local & demo deployment |
