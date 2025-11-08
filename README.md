# 🗂️ Task Management Backend (NestJS + Prisma + PostgreSQL)

## 📘 Overview

This project is a **backend service for a Trello-like task management application**.  
It manages **columns** and **tasks**, supports **reordering**, **bulk movement**, and sends **email notifications** when tasks are marked as _Completed_.

The backend is built using **TypeScript**, **NestJS**, and **Prisma ORM**, connected to a **PostgreSQL** database.  
It also includes a **Mailtrap-integrated mailing service** to handle completion notifications safely during development.

---

## 📑 Index

1. [Tech Stack](#-tech-stack)
2. [Project Structure](#-project-structure)
3. [Controllers](#-controllers)
4. [Services](#-services)
5. [Database & Prisma](#-database--prisma)
6. [Mail Configuration](#-mail-configuration)
7. [How to Run the Project](#-how-to-run-the-project)
8. [Future Improvements](#-future-improvements)

---

## ⚙️ Tech Stack

| Component       | Technology                |
| --------------- | ------------------------- |
| Language        | **TypeScript**            |
| Framework       | **NestJS**                |
| ORM             | **Prisma**                |
| Database        | **PostgreSQL**            |
| Mailing         | **Nodemailer + Mailtrap** |
| Package Manager | **npm**                   |

---

## 🧭 Project Structure

```bash
nest-first/
│
├── prisma/
│   ├── schema.prisma          # Prisma schema definition (PostgreSQL models)
│   ├── seed.ts                # Script for populating the database with sample data
│   └── migrations/            # Auto-generated migration files
│
├── src/
│   ├── controllers/           # RESTful API endpoints
│   │   ├── app.controller.ts
│   │   ├── column.controller.ts
│   │   ├── task.controller.ts
│   │   └── user.controller.ts
│   │
│   ├── services/              # Business logic and data operations
│   │   ├── app.service.ts
│   │   ├── column.service.ts
│   │   ├── mail.service.ts
│   │   ├── prisma.service.ts
│   │   ├── tasks.service.ts
│   │   └── users.service.ts
│   │
│   ├── app.module.ts          # Root module registering all controllers and services
│   └── main.ts                # Application entry point
│
├── .env                       # Environment variables (Mailtrap & DB config)
├── package.json
├── tsconfig.json
└── README.md

```

---

## 🎮 Controllers

### `column.controller.ts`

Handles all column-related operations:

- `POST /columns` — create a new column
- `PATCH /columns/:id` — update a column
- `DELETE /columns/:id` — delete a column

Delegates logic to **ColumnService**.

---

### `task.controller.ts`

Manages task lifecycle and ordering:

- `POST /tasks` — create a task
- `PATCH /tasks/:id` — update task info
- `DELETE /tasks/:id` — delete a task
- `PUT /tasks/reorder` — reorder tasks within a column
- `PUT /tasks/bulk-move` — move multiple tasks between columns

When a task reaches the **Completed** column, the controller triggers an email notification via **MailService**.

---

### `user.controller.ts`

Provides endpoints for user management (basic or placeholder for future expansion).

---

## 🧠 Services

### `prisma.service.ts`

- Centralized Prisma client instance.
- Manages DB connection lifecycle for dependency injection across the app.

---

### `column.service.ts`

- Performs CRUD operations on columns.
- Ensures correct cascading behavior when deleting columns with tasks.

---

### `tasks.service.ts`

- Handles CRUD operations and bulk actions for tasks.
- Supports reordering and cross-column movement.
- Detects when a task is moved to the **Completed** column and triggers **MailService**.

---

### `mail.service.ts`

- Implements email notifications using **Nodemailer**.
- Configured for development with **Mailtrap**.
- Uses `.env` variables for authentication and sender info.

**Mailtrap — Sent Email Preview**

[![Mailtrap sent email preview](./docs/assets/mailtrap-sent-email.png)](./docs/assets/mailtrap-sent-email.png)  
_Click the image to view full size._

---

### `users.service.ts`

- Manages user data (future feature for task ownership and permissions).

---

### `app.service.ts`

- High-level shared or app-wide logic (currently minimal).

---

## 🗄️ Database & Prisma

- **Prisma** defines the data models for columns, tasks, and users in `schema.prisma`.
- **PostgreSQL** is used as the main database.
- Each **Column** can contain multiple **Tasks**, linked by `columnId`.

### Database Setup

```bash
# Apply migrations
npx prisma migrate dev --name init

# Seed the database with initial columns and user
npx ts-node prisma/seed.ts
```

## 🧩 Database Seed

The `seed.ts` file populates the database with example columns such as:

- **To Do**
- **In Progress**
- **Completed**

It helps initialize your PostgreSQL database with the basic column states for the task board.

---

## 📬 Mail Configuration

The project uses **Mailtrap** to send task completion notifications safely in a development environment.

### 1. Create a `.env` file in the project root

```bash
DATABASE_URL="postgresql://<user>:<password>@localhost:5432/<database_name>?schema=public"

MAILTRAP_HOST="sandbox.smtp.mailtrap.io"
MAILTRAP_PORT=2525
MAILTRAP_USER="your-mailtrap-username"
MAILTRAP_PASS="your-mailtrap-password"
DEFAULT_FROM="Task App <no-reply@taskapp.com>"
```

### 2. Mail Service Setup (`mail.service.ts`)

The mail transporter is configured through NestJS `MailerModule` using the `.env` variables:

```ts
this.transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port: Number(process.env.MAILTRAP_PORT),
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});
```

---

### 📧 Task Completion Notification

When a task is moved to the **"COMPLETED"** column, the application automatically sends an email notification to the task owner.

---

## 🚀 How to Run the Project

**Install dependencies**

```bash
npm install
```

**Generate Prisma client**

```bash
npx prisma generate
```

**Run database migrations**

```bash
npx prisma migrate dev
```

**Seed the database (optional)**

```bash
npx ts-node prisma/seed.ts
```

**Start the development server (with hot-reloading to watch for changes)**

```bash
npm run start:dev
```

**Server will be available at:**  
👉 [http://localhost:3000](http://localhost:3000)

---

## 🔮 Future Improvements

- **Use DTOs for data validation and security**  
  Instead of exposing database models directly, create DTOs to control exactly what data is sent to and received from clients.

- **Add authentication and user-specific task filtering**  
  Ensure users can only see and modify their own tasks.

- **Implement role-based access control**  
  Differentiate permissions for admins and regular users.

- **Introduce email templates and better notification customization**  
  Make task notifications more informative and user-friendly.

- **Add logging and error tracking**  
  Improve debugging and monitoring of the application.
