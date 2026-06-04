<div align="center">

# FutureTech Frontend

**Production-grade frontend for a full-stack retail & computer shop management system**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square\&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square\&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38BDF8?style=flat-square\&logo=tailwind-css)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?style=flat-square\&logo=docker)](https://www.docker.com/)

</div>

---

## Overview

`futuretech-frontend` is the client-facing layer of the **FutureTech** platform, a production-style, full-stack retail and computer shop management system developed as a Final Year Software Engineering project.

Built with modern frontend architecture using Next.js 16 and TypeScript, the application provides role-based interfaces for administrators and cashiers, supporting inventory management, point-of-sale workflows, reporting, invoice generation, supplier handling, expense management, and dashboard analytics within a responsive and containerized environment.

This repository is one of three in a multi-repository architecture:

| Repository                 | Responsibility                                |
| -------------------------- | --------------------------------------------- |
| [`futuretech-frontend`](.) | Next.js 16 frontend application (this repo)   |
| `futuretech-backend`       | Express.js REST API, business logic, database |
| `futuretech-infra`         | Infrastructure and deployment configuration   |

---

## Tech Stack

| Layer            | Technology                      | Purpose                                            |
| ---------------- | ------------------------------- | -------------------------------------------------- |
| Framework        | Next.js 16 (App Router)         | Routing and frontend architecture                  |
| Language         | TypeScript 5.x                  | Type safety across the application                 |
| Styling          | Tailwind CSS 3.x                | Utility-first responsive UI                        |
| HTTP Client      | Axios                           | API communication with interceptors                |
| Authentication   | JWT Authentication with Cookies | Stateless authentication & route protection        |
| State Management | React Context API + Zustand     | Global and local state management                  |
| Containerization | Docker                          | Consistent development and deployment environments |

---

## Features

### Authentication & Authorization

* JWT-based authentication with secure cookie handling
* Role-based access control for `Admin` and `Cashier`
* Route protection and unauthorized access handling
* Session persistence and middleware-based authentication

### Dashboard & Analytics

* Admin dashboard with KPI cards and analytics
* Cashier dashboard with revenue insights
* Sales, supplier, inventory, and expense reports
* Interactive charts and business statistics

### Inventory & Product Management

* Product inventory management
* Stock monitoring and tracking
* Supplier management
* Purchase invoice management
* Return management workflows

### Sales & Invoice System

* Point-of-sale (POS) workflow
* Zustand-powered sales cart management
* Invoice generation and PDF export
* Sales history and invoice management
* Return invoice processing

### User & Expense Management

* Cashier user management
* Expense management and tracking
* Supplier payment handling
* Notification management system

### Infrastructure & Developer Experience

* Fully Dockerized frontend setup
* Modular service-based API architecture
* Reusable component-driven UI system
* Responsive desktop and tablet interface
* Centralized Axios API handling and interceptors

---

## Project Structure

```bash
futuretech-frontend/
├── src/
│   ├── app/                    # Next.js App Router pages and layouts
│   ├── components/             # Reusable UI and feature components
│   ├── constants/              # Shared constants
│   ├── context/                # React Context providers
│   ├── lib/                    # Utilities and API configuration
│   ├── services/               # API service layer
│   ├── stores/                 # Zustand stores
│   ├── tests/                  # Testing utilities
│   ├── types/                  # Global TypeScript types
│   └── proxy.ts                # Authentication and route handling
│
├── public/                     # Static assets
├── Dockerfile                  # Docker file
├── .env.example                # Environment variable template.
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## Local Development Setup

### Prerequisites

* Node.js `>= 20.x`
* npm `>= 10.x`
* Docker Desktop
* Running `futuretech-backend` instance

### 1. Clone & Install

```bash
git clone https://github.com/FutureTech-Labs/FutureTech-Frontend.git
cd FutureTech-Frontend
npm install
```

### 2. Configure Environment

Create a `.env.local` file for development or `.env.production` for production:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
JWT_VERIFY_SECRET=
NODE_ENV=development
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at:

```txt
http://localhost:3000
```

---

## Docker Setup

### Build Docker Image

```bash
docker build -t futuretech-frontend:latest .
```

### Run Container

```bash
docker run -p 3000:3000 futuretech-frontend:latest
```

> Full-stack orchestration and deployment configuration are managed through the `futuretech-infra` repository.

---

## NPM Scripts

| Script          | Description                              |
| --------------- | ---------------------------------------- |
| `npm run dev`   | Start development server with hot reload |
| `npm run build` | Build production application             |
| `npm run start` | Run production build locally             |
| `npm run lint`  | Run ESLint across the project            |

---

## Architecture Overview

```text
┌──────────────────────────────┐
│     futuretech-frontend      │
│    Next.js 16 · TypeScript   │
│   Tailwind · JWT Auth        │
└──────────────┬───────────────┘
               │ REST API
┌──────────────▼───────────────┐
│      futuretech-backend      │
│   Express.js · MongoDB       │
│ Authentication · Business API│
└──────────────┬───────────────┘
               │
┌──────────────▼───────────────┐
│       futuretech-infra       │
│ Infrastructure & Deployment  │
└──────────────────────────────┘
```

The frontend communicates with the backend through a centralized REST API architecture using Axios service modules and JWT-based authentication workflows.

---

## Production Considerations

* Optimized using the Next.js App Router architecture
* Responsive layouts designed for desktop and tablet interfaces
* Dockerized for consistent development and deployment workflows
* Modular frontend structure for scalability and maintainability
* Centralized API communication through reusable Axios services
* Route-level authentication and role-based access protection

---

## Related Repositories

* **futuretech-backend** — Express.js REST API and backend services
* **futuretech-infra** — Infrastructure and deployment configuration

---

<div align="center">
  <sub>Built as a Final Year Software Engineering project and later evolved with modern full-stack and DevOps-oriented architecture to explore infrastructure and deployment practices.</sub>
</div>
