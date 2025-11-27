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
3. [Architecture](#-architecture)
4. [Controllers](#-controllers)
5. [Services](#-services)
6. [DTOs & Mappers](#-dtos--mappers)
7. [Database & Prisma](#-database--prisma)
8. [Mail Configuration](#-mail-configuration)
9. [How to Run the Project](#-how-to-run-the-project)
10. [Future Improvements](#-future-improvements)

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
│   ├── dto/                   # Data Transfer Layer (DTOs and mappers)
│   │   ├── column.dto.ts      # Column data transfer objects
│   │   ├── task.dto.ts        # Task data transfer objects
│   │   ├── user.dto.ts        # User data transfer objects
│   │   └── mappers/           # Transform Prisma models to DTOs
│   │       ├── column.mapper.ts
│   │       ├── task.mapper.ts
│   │       └── user.mapper.ts
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

## 🏗️ Architecture

This project follows a **clean layered architecture** with clear separation of concerns:

### **Controllers Layer**

- Handle HTTP requests and responses
- Accept and return **DTOs** (Data Transfer Objects)
- Use **mappers** to convert between DTOs and Prisma models
- No direct exposure of database models to clients

### **Service Layer**

- Contains business logic
- Works with **Prisma types** directly
- No knowledge of DTOs
- Returns Prisma models with proper type definitions

### **Data Transfer Layer**

- **DTOs**: Define the shape of request/response data
- **Mappers**: Transform Prisma models to DTOs in controllers
- Provides clean API contracts independent of database structure
- Grouped together in `dto/` directory for better cohesion - DTOs and their mappers are tightly coupled

This architecture ensures:

- ✅ **Decoupling** between API and database layers
- ✅ **Type safety** throughout the application
- ✅ **Easy maintenance** - change database without affecting API
- ✅ **Security** - control exactly what data is exposed

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

## 📦 DTOs & Mappers

### **DTOs (Data Transfer Objects)**

DTOs define the structure of data sent to and received from the API, providing a clean contract between the client and server.

**Location**: `src/dto/`

**Example - Task DTOs**:

```typescript
// Request DTOs (used in POST/PUT requests)
export class CreateTaskDto {
  title: string;
  description?: string;
  ownerId: string;
  columnId: number;
  order?: number;
}

export class UpdateTaskDto {
  title?: string;
  description?: string;
  ownerId?: string;
  columnId?: number;
  order?: number;
}

// Response DTOs (returned from API)
export interface TaskResponseDto {
  id: string;
  title: string;
  description: string | null;
  ownerId: string;
  columnId: number;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskWithOwnerResponseDto extends TaskResponseDto {
  owner: {
    id: string;
    email: string;
    name: string | null;
    lastName: string | null;
  };
}
```

### **Mappers**

Mappers are pure functions that transform Prisma models into DTOs. They are used exclusively in controllers.

**Location**: `src/dto/mappers/`

**Example - Task Mappers**:

```typescript
export function mapToTaskResponseDto(task: Task): TaskResponseDto {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    ownerId: task.ownerId,
    columnId: task.columnId,
    order: task.order,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  };
}

export function mapToTaskWithOwnerResponseDto(
  task: Task & { owner: User },
): TaskWithOwnerResponseDto {
  return {
    ...mapToTaskResponseDto(task),
    owner: {
      id: task.owner.id,
      email: task.owner.email,
      name: task.owner.name,
      lastName: task.owner.lastName,
    },
  };
}
```

**Usage in Controllers**:

```typescript
@Get(':id')
async getTask(@Param('id') id: string): Promise<TaskWithOwnerResponseDto | null> {
  const task = await this.tasksService.task({ id });
  return task ? mapToTaskWithOwnerResponseDto(task) : null;
}

@Post()
async createTask(@Body() data: CreateTaskDto): Promise<TaskResponseDto> {
  const task = await this.tasksService.createTask(data);
  return mapToTaskResponseDto(task);
}
```

**Benefits**:

- 🔒 **Security**: Control exactly what data is exposed to clients
- 🎯 **Type Safety**: Strong typing for request/response contracts
- 🔄 **Flexibility**: Change database schema without breaking API
- 📝 **Documentation**: Clear API structure for frontend developers

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

- **Add validation decorators to DTOs**  
  Use `class-validator` to validate request data automatically (e.g., `@IsEmail()`, `@IsNotEmpty()`, `@MinLength()`).

- **Add authentication and user-specific task filtering**  
  Ensure users can only see and modify their own tasks.

- **Implement role-based access control**  
  Differentiate permissions for admins and regular users.

- **Introduce email templates and better notification customization**  
  Make task notifications more informative and user-friendly.

- **Add logging and error tracking**  
  Improve debugging and monitoring of the application.

- **Add API documentation with Swagger**  
  Generate interactive API docs using `@nestjs/swagger` decorators.
