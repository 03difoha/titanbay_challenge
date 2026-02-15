# Titanbay Take-Home Challenge -- Backend API

## Overview

This project is a RESTful backend service for managing private market funds, investors, and investments. It was built as part of a software engineering take-home task, with AI-assisted development explicitly encouraged.

The application is written in TypeScript, runs on Bun, uses PostgreSQL for persistence, Drizzle ORM for database access, and Zod for runtime validation.

* * *

## Tech Stack

-   **Runtime:** Bun  
-   **Language:** TypeScript  
-   **Database:** PostgreSQL  
-   **ORM:** Drizzle ORM  
-   **Validation:** Zod  
-   **Testing:** Vitest (integration tests)  
-   **Architecture:** Modular, repository-based REST API  

* * *

## Project Structure

    src/
      app.ts                # Request router
      server.ts             # Server bootstrap
      db/
        client.ts           # Drizzle + Postgres client
        schema.ts           # Database schema
        createTables.ts     # One-time table creation
        seed.ts             # Idempotent seed script
        destroy.ts          # Deletes all data (not tables)
      modules/
        funds/
        investors/
        investments/
          *.routes.ts       # HTTP handlers
          *.dto.ts          # Zod DTOs
          *.repository.ts   # DB access layer
    tests/
      api.test.ts           # Integration tests

* * *

## API Design

The API follows standard REST conventions and matches the provided specification.

### Funds

| Method | Endpoint   | Description         |
| ------ | ---------- | ------------------- |
| GET    | /funds     | List all funds      |
| GET    | /funds/:id | Get a specific fund |
| POST   | /funds     | Create a fund       |
| PUT    | /funds     | Update a fund       |

### Investors

| Method | Endpoint       | Description             |
| ------ | -------------- | ----------------------- |
| GET    | /investors     | List all investors      |
| GET    | /investors/:id | Get a specific investor |
| POST   | /investors     | Create an investor      |
| PUT    | /investors     | Update an investor      |

### Investments

| Method | Endpoint                    | Description                 |
| ------ | --------------------------- | --------------------------- |
| GET    | /funds/:fund_id/investments | List investments for a fund |
| POST   | /funds/:fund_id/investments | Create investment for fund  |

* * *

## Validation & Error Handling

-   All incoming data is validated using Zod DTOs  
-   Partial updates are supported for PUT  
-   Database constraints (e.g., unique emails, foreign keys) are translated into clear API errors  
-   Proper HTTP status codes are used:

    -   `400` -- Validation or constraint errors  
    -   `404` -- Resource not found  
    -   `201` -- Resource created  
    -   `500` -- Unexpected server errors  

**Example error response:**

```json
{
  "error": "An investor with email 'alice@example.com' already exists"
}
```

## Setup

### Install PostgreSQL

```
### macOS (using Homebrew)

bash
brew update
brew install postgresql
brew services start postgresql

### Ubuntu/ Debian

sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql

```

Windows:

-   Download from <https://www.postgresql.org/download/windows/>

-   Use the installer and follow prompts

-   Start the Postgres service

### Log into Postgres

`psql postgres`

Create the DB and user

    CREATE DATABASE challenge_db;
    CREATE USER api_user WITH PASSWORD 'securepassword';
    GRANT ALL PRIVILEGES ON DATABASE challenge_db TO api_user;

### Create a `.env` file 

    DATABASE_URL=postgres://api_user:securepassword@localhost:5432/challenge_db


### Ensure bun is installed

    ### MacOS & Linux
    curl -fsSL https://bun.com/install | bash

    ### Windows
    powershell -c "irm bun.sh/install.ps1|iex"

then from inside the main directory run
`bun install`

### Create DB Tables

```bash
bun create_db
```

### Seed Database with test data

```bash
bun seed
```

Safe to run multiple times -- existing records are reused.

### Delete DB

```bash
bun destroy
```

This script prompts for confirmation before deleting all rows.

* * *

## Running the Server

```bash
bun dev
```

Server runs on: <http://localhost:3000>

* * *

### Run Tests

```bash
bun test
```

Tests cover:

-   Create and update funds
-   Create investors with unique emails
-   Reject duplicate investors
-   Create investments tied to funds
-   Retrieve related investments

The tests run against a real database and clean up after themselves.

* * *

## Design Decisions & Assumptions

-   Thin API layer: Minimal business logic in handlers; validation + persistence are explicit
-   DTO → Repository pattern: Clear separation of concerns
-   Database constraints are authoritative, but errors are surfaced cleanly at the API layer
-   No migrations: Tables are created directly for speed and simplicity

## Further improvements

If I had more time I would like to extend the tests to test every type of error possible with the endpoints. As it stands right now the tests are just kicking the tires. 

* * *

## AI Usage

AI tools (ChatGPT) were used to:

-   Accelerate boilerplate creation
-   Discuss architectural tradeoffs
-   Refine validation and error handling
-   Improve test coverage

All design decisions and final implementation choices were reviewed and adjusted manually.
