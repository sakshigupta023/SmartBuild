# SmartBuild – Smart Building Management System

[![Java 21](https://img.shields.io/badge/Java-21-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.x-38B2AC.svg)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue.svg)](https://www.postgresql.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**SmartBuild** is a full-stack, web-based smart building management system designed to streamline property operations, monitor infrastructure, and optimize energy utilization. It provides facility managers, administrators, and residents with an integrated platform to manage physical spaces, monitor connected IoT devices, track energy metrics, handle maintenance workflows, and manage role-based user access.

---

## Live Links

- **Frontend Deployment:** [https://smart-build-eight.vercel.app](https://smart-build-eight.vercel.app)
- **Source Code:** [https://github.com/sakshigupta023/SmartBuild](https://github.com/sakshigupta023/SmartBuild)

---

## Features

- **JWT-Based Authentication:** Secure token-based authentication mechanism with stateless session management.
- **Role-Based Access Control (RBAC):** Granular authorization and endpoint protection supporting `ADMIN`, `MANAGER`, and `RESIDENT` roles.
- **Building Management:** Comprehensive management of building metadata, addresses, and total capacity.
- **Floor & Unit Management:** Structured hierarchy organizing floors within buildings and individual units within floors.
- **Smart Device Management:** Inventory, status monitoring, and management for connected smart devices (thermostats, smart meters, lighting controllers, security sensors).
- **Energy Consumption Tracking:** Real-time and historical power usage monitoring with date-based filtering and cost analytics.
- **Maintenance Request Management:** End-to-end ticketing system for logging, assigning, updating, and resolving building maintenance issues.
- **User Management:** Administrative control to manage user accounts, assign roles, and maintain tenant/staff directories.
- **Dashboard with Analytics:** Interactive overview displaying high-level statistics, occupancy rates, device statuses, recent maintenance items, and energy consumption trends.
- **REST API Backend:** Clean RESTful architectural design with consistent response structures and error handling.
- **JSON-Based API Communication:** Standardized data exchange format between client and server layers.
- **Responsive Web Interface:** Modern, accessible user interface optimized for desktop, tablet, and mobile browsers.

---

## Technology Stack

### Backend
- **Language & Runtime:** Java 21
- **Framework:** Spring Boot 3
- **Security:** Spring Security & JSON Web Tokens (JWT)
- **Data Access & ORM:** Spring Data JPA & Hibernate
- **Validation:** Jakarta Bean Validation
- **Build Tool:** Apache Maven
- **API Documentation:** OpenAPI 3.0 / Swagger UI (`springdoc-openapi`)

### Frontend
- **Library:** React
- **Build Tool:** Vite
- **Styling:** Tailwind CSS & Lucide Icons
- **Routing:** React Router
- **HTTP Client:** Axios
- **Data Visualization:** Recharts

### Database
- **Database Engine:** PostgreSQL

### Deployment & Infrastructure
- **Backend Hosting:** Render
- **Frontend Hosting:** Vercel
- **Database Hosting:** Neon PostgreSQL

---

## Architecture

SmartBuild follows a clean **Modular Monolith** architecture with strict separation of concerns across multiple layers:

```text
┌────────────────────────────────────────────────────────┐
│                   Frontend (React + Vite)              │
└───────────────────────────┬────────────────────────────┘
                            │ REST API / JSON (HTTPS)
┌───────────────────────────▼────────────────────────────┐
│                    Controller Layer                    │
│    (REST Endpoints, Request Validation, HTTP Codes)    │
├────────────────────────────────────────────────────────┤
│                       DTO Layer                        │
│          (Request & Response Payload Mapping)          │
├────────────────────────────────────────────────────────┤
│                     Service Layer                      │
│      (Business Logic, Transaction Management, RBAC)    │
├────────────────────────────────────────────────────────┤
│                    Repository Layer                    │
│             (Spring Data JPA Data Access)              │
├────────────────────────────────────────────────────────┤
│                    Database Layer                      │
│                     (PostgreSQL)                       │
└────────────────────────────────────────────────────────┘
```

### Key Design Principles
- **Controller Layer:** Exposes RESTful endpoints, handles HTTP requests/responses, and enforces preliminary input validation.
- **DTO (Data Transfer Object) Layer:** Decouples internal database entities from external API contracts, preventing over-exposure of sensitive fields.
- **Service Layer:** Houses all business rules, orchestration logic, and role authorization checks.
- **Repository Layer:** Encapsulates data persistence operations using Spring Data JPA abstractions.

---

## Authentication & Authorization

SmartBuild implements stateless authentication using JSON Web Tokens (JWT):

1. **Authentication Flow:** Users authenticate via `/api/v1/auth/login` using their email and password. Upon successful verification, the server issues a signed JWT token containing user identity and role claims.
2. **Request Authorization:** The client attaches the JWT token in the `Authorization: Bearer <token>` header on subsequent requests.
3. **Role-Based Access Control (RBAC):**
   - **`ADMIN`:** Full administrative access to manage users, buildings, infrastructure, devices, and global settings.
   - **`MANAGER`:** Operational access to manage floors, units, maintenance tickets, and energy logs.
   - **`RESIDENT`:** Restricted self-service access to view assigned unit details, submit maintenance requests, and track personal utility consumption.

---

## API & Documentation

The backend exposes a standardized RESTful API returning structured JSON payloads:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... }
}
```

### Interactive API Documentation (Swagger / OpenAPI)
When running the backend locally, interactive API documentation is accessible at:
- **Swagger UI:** `http://localhost:8080/swagger-ui.html`
- **OpenAPI Specification:** `http://localhost:8080/v3/api-docs`

---

## Project Structure

```text
SmartBuild/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/smartbuild/
│   │   │   │   ├── config/              # Security, CORS, OpenAPI configurations
│   │   │   │   ├── controller/          # REST API Controllers
│   │   │   │   ├── dto/                 # Request and Response DTOs
│   │   │   │   ├── entity/              # JPA Data Entities
│   │   │   │   ├── exception/           # Global Exception Handling
│   │   │   │   ├── mapper/              # Entity-DTO Mappers
│   │   │   │   ├── repository/          # Spring Data JPA Repositories
│   │   │   │   ├── security/            # JWT Filters, Token Provider, UserDetails
│   │   │   │   └── service/             # Business Logic Services
│   │   │   └── resources/
│   │   │       └── application.yml      # Spring Application Configuration
│   │   └── test/                        # Unit and Integration Tests
│   ├── pom.xml                          # Maven Dependencies & Configuration
│   └── Dockerfile                       # Container Deployment Specification
├── frontend/
│   ├── public/                          # Static assets and icons
│   ├── src/
│   │   ├── api/                         # Axios client configuration & API services
│   │   ├── components/                  # Reusable UI components & layouts
│   │   ├── context/                     # Application & Authentication context
│   │   ├── hooks/                       # Custom React hooks
│   │   ├── pages/                       # Application views and dashboard modules
│   │   └── utils/                       # Helper functions and formatters
│   ├── package.json                     # Frontend dependencies & scripts
│   ├── vercel.json                      # Vercel SPA routing configuration
│   └── vite.config.js                   # Vite bundler configuration
├── .env.example                         # Environment variable template
├── .gitignore                           # Git ignore rules
└── README.md                            # Project documentation
```

---

## Getting Started

### Prerequisites
- **Java Development Kit (JDK):** Version 21 or higher
- **Node.js:** Version 18 or higher (with npm)
- **PostgreSQL:** Version 14 or higher (or cloud database instance)
- **Git**

---

### Step-by-Step Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/sakshigupta023/SmartBuild.git
cd SmartBuild
```

#### 2. Configure Database
Create a PostgreSQL database named `smartbuild`:
```sql
CREATE DATABASE smartbuild;
```

#### 3. Configure Environment Variables
Create a `.env` file in the project root by copying the template:
```bash
cp .env.example .env
```
Fill in the configuration parameters with your local or cloud credentials (refer to the [Environment Variables](#environment-variables) section below).

#### 4. Run the Backend
Navigate to the `backend` directory and start the Spring Boot application:
```bash
cd backend
./mvnw spring-boot:run
```
*(On Windows Command Prompt / PowerShell, use `mvnw.cmd spring-boot:run`)*

The backend server will start on `http://localhost:8080`.

#### 5. Run the Frontend
In a new terminal window, navigate to the `frontend` directory, install dependencies, and start the development server:
```bash
cd frontend
npm install
npm run dev
```

The frontend application will start on `http://localhost:5173`.

#### 6. Access the Application
Open your web browser and navigate to:
```text
http://localhost:5173
```

---

## Environment Variables

Configure the following environment variables in your `.env` file:

| Variable | Description | Example / Placeholder |
| :--- | :--- | :--- |
| `DB_URL` | PostgreSQL JDBC connection URL | `jdbc:postgresql://localhost:5432/smartbuild` |
| `DB_USERNAME` | PostgreSQL database user | `postgres` |
| `DB_PASSWORD` | PostgreSQL database password | `your_database_password` |
| `JWT_SECRET` | 256-bit or 512-bit secret for signing tokens | `your_secure_base64_jwt_secret_key` |
| `JWT_EXPIRATION` | JWT expiration duration in milliseconds | `86400000` *(24 hours)* |
| `SERVER_PORT` | Port for Spring Boot backend | `8080` |
| `CORS_ORIGINS` | Allowed frontend origin URLs (comma-separated) | `http://localhost:5173` |
| `VITE_API_BASE_URL` | Base REST API endpoint for the frontend | `http://localhost:8080/api/v1` |

---

## Screens & Dashboard Modules

- **Executive Dashboard:** High-level metrics summarizing building count, active units, registered devices, total monthly power usage, and quick-action maintenance queues.
- **Building & Infrastructure Management:** Complete directory of physical properties with detailed floor plans and occupancy metrics.
- **Unit & Tenant Management:** Detailed status tracking (Occupied, Vacant, Maintenance) and tenant assignment.
- **Smart Device Hub:** Real-time online/offline monitoring, device type filtering, and unit association.
- **Energy Analytics:** Interactive line charts and bar charts displaying power consumption trends over selectable time periods.
- **Maintenance Ticketing Portal:** Status-driven ticketing lifecycle (`OPEN`, `IN_PROGRESS`, `RESOLVED`, `CANCELLED`) with priority indicators (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`).
- **User & Access Control:** Administrator management panel for updating roles, account statuses, and profiles.

---

## Future Improvements

- **IoT Telemetry Integration:** Direct MQTT and CoAP protocol ingestion for live sensor telemetry and automated device discovery.
- **Automated Alerts & Push Notifications:** Automated notifications for threshold spikes in energy consumption or critical maintenance escalations.
- **Predictive Energy Analytics:** Machine learning models for forecasting energy demands and anomaly detection.
- **Mobile Native Application:** Dedicated iOS and Android client applications for on-site facility personnel and residents.

---

## Author

**Sakshi Gupta**
- **GitHub:** [https://github.com/sakshigupta023](https://github.com/sakshigupta023)

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
