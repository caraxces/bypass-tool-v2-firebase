# Bypass Tool Pro

Bypass Tool Pro is a full-stack application designed to help you track the SEO ranking of your websites for specific keywords on Google. It provides a modern, user-friendly interface to manage your projects and view historical ranking data.

This project is built as a monorepo using `pnpm workspaces` and includes a Fastify backend, a Next.js frontend, and a PostgreSQL database managed by Prisma.

## Features

- **Project Management**: Create and manage projects, each associated with a specific domain.
- **Keyword Tracking**: Add keywords to your projects to track their ranking on Google.
- **Automated Rank Checking**: The backend uses Puppeteer to perform Google searches and find the rank of your domain for each keyword.
- **Modern Tech Stack**: Built with Fastify, Next.js, Prisma, Tailwind CSS, and Shadcn/ui for a fast, reliable, and beautiful user experience.
- **Monorepo Architecture**: Easy to manage, develop, and share code between the frontend and backend.

## Project Structure

The project is a monorepo located in the `packages` directory:

- `packages/backend`: The Fastify server that handles API requests, interacts with the database via Prisma, and runs the Puppeteer scraping jobs.
- `packages/frontend`: The Next.js application that provides the user interface for managing projects and viewing data.

## Prerequisites

- **Node.js**: v18.x or later is recommended.
- **pnpm**: This project uses `pnpm` as the package manager. Install it globally with `npm install -g pnpm`.
- **PostgreSQL**: You need a running PostgreSQL database instance. You can run one locally using Docker or use a free managed service like the one on [Render.com](https://render.com/).

## Getting Started

### 1. Clone the Repository

First, clone this repository to your local machine.

### 2. Installation

Navigate to the project's root directory and install all dependencies for both the frontend and backend workspaces.

```bash
pnpm install
```

**Note for Windows Users**: The installation process, especially for Puppeteer, can sometimes run into permission issues. If you encounter `EPERM` errors, try running your terminal as an Administrator or temporarily disabling any antivirus software that might be interfering.

### 3. Set Up Environment Variables

The backend requires a connection to a PostgreSQL database.

1.  Navigate to the backend directory: `cd packages/backend`
2.  Create a `.env` file by copying the example: `cp .env.example .env` (if `.env.example` is provided) or create it manually.
3.  Edit the `.env` file and set your `DATABASE_URL`:

    ```env
    DATABASE_URL="postgresql://YOUR_USER:YOUR_PASSWORD@YOUR_HOST:5432/YOUR_DATABASE?schema=public"
    ```

### 4. Database Migration

Once your database connection is configured, you need to apply the database schema. Prisma makes this easy. From the `packages/backend` directory, run:

```bash
pnpm prisma migrate dev --name init
```

This command will create the necessary tables in your database based on the `prisma/schema.prisma` file.

### 5. Running the Application

To run both the backend and frontend servers simultaneously for development, navigate to the **root directory** of the project and run the single `dev` command:

```bash
pnpm dev
```

This will:
- Start the Fastify backend server (usually on `http://localhost:3001`).
- Start the Next.js frontend server (usually on `http://localhost:3000`).

You can now open your browser and navigate to `http://localhost:3000` to use the application.

## Deployment

This application is designed to be easily deployable on platforms like Render.com.

### Deploying the Database

1.  Create a new "PostgreSQL" service on Render.
2.  Render will provide you with a `DATABASE_URL`. Use this URL for your backend's environment variable.

### Deploying the Backend

1.  Create a new "Web Service" on Render and connect it to your Git repository.
2.  Set the **Root Directory** to `packages/backend`.
3.  Set the **Build Command** to `pnpm install && pnpm build`.
4.  Set the **Start Command** to `pnpm start` (you may need to add a `start` script to `packages/backend/package.json` like `"start": "node dist/index.js"`).
5.  Add your `DATABASE_URL` as an environment variable in the Render service settings.

### Deploying the Frontend

1.  Create another new "Web Service" on Render.
2.  Set the **Root Directory** to `packages/frontend`.
3.  Render should automatically detect it as a Next.js application and configure the build and start commands correctly.
4.  Add an environment variable `NEXT_PUBLIC_API_URL` and set it to the public URL of your deployed backend service (e.g., `https://your-backend-service.onrender.com/api`).

---

This README provides a comprehensive guide to getting your new, improved Bypass Tool Pro up and running.
