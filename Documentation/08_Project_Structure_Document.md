# Project Structure Document
## Task Management System

---

## 1. Repository Root Layout

```
task-management-system/
│
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                  # FastAPI app entrypoint
│   │   ├── config.py                # Env config, settings (pydantic-settings)
│   │   ├── database.py              # DB engine/session setup (SQLAlchemy)
│   │   │
│   │   ├── models/                  # SQLAlchemy ORM models
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   ├── employee.py
│   │   │   └── task.py
│   │   │
│   │   ├── schemas/                 # Pydantic request/response schemas
│   │   │   ├── __init__.py
│   │   │   ├── user_schema.py
│   │   │   ├── employee_schema.py
│   │   │   └── task_schema.py
│   │   │
│   │   ├── routers/                 # API route definitions
│   │   │   ├── __init__.py
│   │   │   ├── auth_router.py
│   │   │   ├── employee_router.py
│   │   │   ├── task_router.py
│   │   │   └── dashboard_router.py
│   │   │
│   │   ├── services/                # Business logic layer
│   │   │   ├── __init__.py
│   │   │   ├── auth_service.py
│   │   │   ├── employee_service.py
│   │   │   └── task_service.py
│   │   │
│   │   ├── repositories/            # DB access/query layer
│   │   │   ├── __init__.py
│   │   │   ├── user_repo.py
│   │   │   ├── employee_repo.py
│   │   │   └── task_repo.py
│   │   │
│   │   ├── core/
│   │   │   ├── security.py          # JWT, password hashing
│   │   │   ├── dependencies.py      # Auth/role dependency injection
│   │   │   └── exceptions.py        # Custom exception handlers
│   │   │
│   │   └── utils/
│   │       └── logger.py
│   │
│   ├── alembic/                     # DB migrations
│   │   ├── versions/
│   │   └── env.py
│   │
│   ├── tests/
│   │   ├── test_auth.py
│   │   ├── test_employee.py
│   │   └── test_task.py
│   │
│   ├── requirements.txt
│   ├── alembic.ini
│   ├── Dockerfile
│   └── .env.example
│
├── frontend/
│   ├── index.html                   # Login page
│   ├── dashboard.html
│   ├── employees.html
│   ├── tasks.html
│   │
│   ├── css/
│   │   ├── style.css
│   │   ├── animations.css
│   │   └── responsive.css
│   │
│   ├── js/
│   │   ├── api.js                   # Fetch wrapper / API client
│   │   ├── auth.js
│   │   ├── employees.js
│   │   ├── tasks.js
│   │   └── dashboard.js
│   │
│   └── assets/
│       ├── icons/
│       └── images/
│
├── docs/                            # All project documentation (this set)
│   ├── 01_HLD_Document.md
│   ├── 02_SRS_Document.md
│   ├── 03_Project_Plan_Roadmap.md
│   ├── 04_UI_UX_Design_Document.md
│   ├── 05_System_Architecture_Document.md
│   ├── 06_Database_Schema_ERD_Document.md
│   ├── 07_API_Document.md
│   ├── 08_Project_Structure_Document.md
│   └── 09_Data_Flow_Diagram.md
│
├── docker-compose.yml
├── .gitignore
├── README.md
└── LICENSE
```

---

## 2. Layered Backend Design Rationale

| Layer | Folder | Responsibility |
|---|---|---|
| Presentation/API | `routers/` | Route definitions, request parsing |
| Business Logic | `services/` | Task assignment rules, validations |
| Data Access | `repositories/` | Encapsulated DB queries |
| Data Model | `models/`, `schemas/` | ORM entities & I/O validation |
| Cross-cutting | `core/` | Security, exceptions, DI |

This layering follows the **Separation of Concerns** and **Single Responsibility Principle**, easing unit testing and future scaling.

---

## 3. Key Configuration Files

### 3.1 `requirements.txt` (Backend)
```
fastapi==0.115.0
uvicorn[standard]==0.30.0
sqlalchemy==2.0.30
pymysql==1.1.0
alembic==1.13.0
pydantic-settings==2.3.0
passlib[bcrypt]==1.7.4
python-jose[cryptography]==3.3.0
pytest==8.2.0
motor==3.5.0   # optional, for MongoDB
```

### 3.2 `docker-compose.yml` (Summary)
```yaml
services:
  backend:
    build: ./backend
    ports: ["8000:8000"]
    depends_on: [mysql]
    env_file: ./backend/.env
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_DATABASE: tms_db
      MYSQL_ROOT_PASSWORD: rootpass
    volumes: ["mysql_data:/var/lib/mysql"]
  frontend:
    image: nginx:alpine
    volumes: ["./frontend:/usr/share/nginx/html"]
    ports: ["8080:80"]
volumes:
  mysql_data:
```

---

## 4. Naming & Coding Conventions
- **Python:** PEP8, `snake_case` for variables/functions, `PascalCase` for classes
- **JS:** `camelCase` for variables/functions
- **DB:** `snake_case` table/column names, singular table names optional (project uses plural: `users`, `tasks`)
- **Git branches:** `feature/<name>`, `bugfix/<name>`, `release/<version>`
- **Commit messages:** Conventional Commits format (`feat:`, `fix:`, `docs:`)

---

## 5. Environment Variables (`.env.example`)
```
DATABASE_URL=mysql+pymysql://user:password@mysql:3306/tms_db
SECRET_KEY=your-secret-key
ACCESS_TOKEN_EXPIRE_MINUTES=30
MONGO_URI=mongodb://mongo:27017/tms_logs
```
