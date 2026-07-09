# Database Schema & ERD Document
## Task Management System

**Database Engine:** MySQL 8.x (InnoDB) | **Normalization Level:** 3NF

---

## 1. Entity Relationship Diagram (Textual/ASCII)

```
┌───────────────────────┐        ┌──────────────────────────┐        ┌──────────────────────────┐
│        users           │        │        employees          │        │          tasks             │
├───────────────────────┤        ├──────────────────────────┤        ├──────────────────────────┤
│ PK user_id (INT)       │1      1│ PK employee_id (INT)       │1      N│ PK task_id (INT)            │
│    username (VARCHAR)  ├────────┤ FK user_id (INT) → users   ├────────┤ FK assigned_to (INT)→employees│
│    email (VARCHAR)     │        │    full_name (VARCHAR)     │        │ FK assigned_by (INT)→users     │
│    password_hash (VARCHAR)│     │    department (VARCHAR)    │        │    title (VARCHAR)          │
│    role (ENUM)          │        │    designation (VARCHAR)   │        │    description (TEXT)       │
│    created_at (DATETIME)│        │    phone (VARCHAR)         │        │    priority (ENUM)          │
│    is_active (BOOLEAN)  │        │    date_joined (DATE)      │        │    status (ENUM)            │
└───────────────────────┘        │    is_active (BOOLEAN)     │        │    completed (BOOLEAN)      │
                                  └──────────────────────────┘        │    due_date (DATE)          │
                                                                       │    created_at (DATETIME)    │
                                                                       │    updated_at (DATETIME)    │
                                                                       └──────────────────────────┘
```

**Relationships:**
- `users` (1) —— (1) `employees`: one login account maps to one employee profile (Admin/Manager accounts may not have an employee row)
- `employees` (1) —— (N) `tasks`: one employee can have many assigned tasks
- `users` (1) —— (N) `tasks`: one manager/admin (`assigned_by`) can assign many tasks

---

## 2. Table Definitions (DDL)

### 2.1 `users` (Login/Auth Table)

```sql
CREATE TABLE users (
    user_id        INT AUTO_INCREMENT PRIMARY KEY,
    username       VARCHAR(50)  NOT NULL UNIQUE,
    email          VARCHAR(100) NOT NULL UNIQUE,
    password_hash  VARCHAR(255) NOT NULL,
    role           ENUM('admin','manager','employee') NOT NULL DEFAULT 'employee',
    is_active      BOOLEAN NOT NULL DEFAULT TRUE,
    created_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at     DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;
```

### 2.2 `employees` (Employee Details Table)

```sql
CREATE TABLE employees (
    employee_id    INT AUTO_INCREMENT PRIMARY KEY,
    user_id        INT NOT NULL UNIQUE,
    full_name      VARCHAR(100) NOT NULL,
    department     VARCHAR(50),
    designation    VARCHAR(50),
    phone          VARCHAR(15),
    date_joined    DATE,
    is_active      BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_employee_user
        FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;
```

### 2.3 `tasks` (Task Table with FK Relationships)

```sql
CREATE TABLE tasks (
    task_id        INT AUTO_INCREMENT PRIMARY KEY,
    title          VARCHAR(150) NOT NULL,
    description    TEXT,
    assigned_to    INT NOT NULL,
    assigned_by    INT NOT NULL,
    priority       ENUM('Low','Medium','High') DEFAULT 'Medium',
    status         ENUM('Pending','In Progress','Completed','Overdue') DEFAULT 'Pending',
    completed      BOOLEAN NOT NULL DEFAULT FALSE,
    due_date       DATE,
    created_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at     DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_task_employee
        FOREIGN KEY (assigned_to) REFERENCES employees(employee_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_task_assigner
        FOREIGN KEY (assigned_by) REFERENCES users(user_id)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;
```

### 2.4 Optional: `activity_logs` (MongoDB Collection Schema)

```json
{
  "_id": "ObjectId",
  "task_id": 101,
  "user_id": 5,
  "action": "STATUS_CHANGE",
  "old_value": "Pending",
  "new_value": "Completed",
  "timestamp": "2026-07-09T10:15:00Z"
}
```
*Rationale: MongoDB's flexible schema suits variable-structure audit events without requiring migrations for every new event type.*

---

## 3. Indexing Strategy

| Table | Index | Purpose |
|---|---|---|
| users | UNIQUE(email), UNIQUE(username) | Fast lookup during login |
| employees | INDEX(department) | Filtering by department |
| tasks | INDEX(assigned_to), INDEX(status), INDEX(due_date) | Fast filtering for dashboards |

---

## 4. Normalization Notes
- **1NF:** All attributes atomic (no repeating groups)
- **2NF:** No partial dependency (all non-key attributes depend on full PK)
- **3NF:** No transitive dependency — e.g., `department` stored once in `employees`, not duplicated in `tasks`

---

## 5. Sample Seed Data

```sql
INSERT INTO users (username, email, password_hash, role) VALUES
('admin01', 'admin@tms.com', '$2b$12$hashedpassword1', 'admin'),
('mgr01', 'manager@tms.com', '$2b$12$hashedpassword2', 'manager'),
('emp01', 'employee1@tms.com', '$2b$12$hashedpassword3', 'employee');

INSERT INTO employees (user_id, full_name, department, designation) VALUES
(3, 'John Doe', 'Engineering', 'Software Developer');

INSERT INTO tasks (title, description, assigned_to, assigned_by, priority, status, due_date) VALUES
('Fix login bug', 'Resolve JWT expiry issue', 1, 2, 'High', 'Pending', '2026-07-15');
```

---

## 6. Backup & Maintenance Recommendations
- Daily automated `mysqldump` backups
- Enable binary logging for point-in-time recovery
- Periodic `ANALYZE TABLE` for query optimizer statistics
