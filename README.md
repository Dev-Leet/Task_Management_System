# Task Management System

A full-stack, 3-tier Task Management System built with Python, FastAPI, Vanilla JS, and MySQL. It includes role-based access control (Admin, Manager, Employee) and allows tracking tasks efficiently.

## Prerequisites
- **Docker Desktop** (or Docker Engine + docker-compose)

---

## 🚀 How to Initialize the Project

### 1. Build and Start the Containers
Open your terminal (PowerShell, Command Prompt, or Git Bash), navigate to the root folder of this project (`Task_Management_System`), and run:

```bash
docker-compose up --build -d
```

This command will:
- Download the necessary Docker images.
- Install the Python backend dependencies (FastAPI, SQLAlchemy, etc.).
- Start the Database (`mysql`), Backend (`backend`), and Frontend (`frontend`) containers.
- Automatically create the database tables.

*(Note: The first time you run this, it may take a few minutes to download the base images).*

### 2. Verify the Containers
Check that all three containers are running properly:

```bash
docker-compose ps
```
Ensure `tms_backend`, `tms_mysql`, and `tms_frontend` all have a status of **Up**.

### 3. Create the Initial Admin Account
Because this is a brand-new database, you must create a starting administrator account so you can log in. 

Run the following command in your terminal. It executes a secure Python script inside the backend container to create an admin user with the correct encrypted password:

```bash
docker exec tms_backend python -c "from app.core.security import get_password_hash; from app.database import SessionLocal; from app.repositories.user_repo import user_repo; from app.schemas.user_schema import UserCreate; db = SessionLocal(); user_repo.create(db, UserCreate(username='admin', email='admin@tms.local', password='password', role='admin')) if not user_repo.get_by_username(db, 'admin') else None;"
```

### 4. Access the Dashboard
Everything is now fully set up!
1. Open your web browser.
2. Navigate to: [http://localhost:8080](http://localhost:8080)
3. Log in using the credentials you just generated:
   - **Username**: `admin`
   - **Password**: `password`

---

## 🛠️ Project Structure
* **`/backend`**: FastAPI application containing the `app/` folder (models, schemas, repositories, services, and routers).
* **`/frontend`**: Vanilla HTML, CSS, and JS (including the `api.js` fetch wrapper).
* **`docker-compose.yml`**: The orchestration file that links the Web server, API server, and Database together.

## 🛑 Stopping the Application
To stop the services without losing your database data, run:
```bash
docker-compose down
```

To stop the services **and wipe the database completely clean** (useful if you want to start completely fresh), run:
```bash
docker-compose down -v
```
