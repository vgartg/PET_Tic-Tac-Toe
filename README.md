# Tic-Tac-Toe

A full-stack Tic-Tac-Toe pet project. Server-side game logic with two AI opponents,
served over a REST API and played in a React web client

---

<img width="841" height="497" alt="image" src="https://github.com/user-attachments/assets/321cd58b-7241-4cd8-a983-f074798a9468" />

---

## Features

- **Two game modes** — `SOLO` (against the robot) and `DUO` (hot-seat for two players)
- **Two AI difficulties**:
  - `LITE` — picks a random empty cell
  - `HARD` — opens with center or a corner, then completes its own winning line when possible
- **Stateless client** — game state lives on the server, keyed by a session id returned on game creation
- **Validated REST API** with structured error responses
- **Unit-tested** domain and service layers (JUnit 5 + AssertJ)

## Tech stack

| Layer    | Stack                                           |
|----------|-------------------------------------------------|
| Backend  | Java 17, Spring Boot 3.3, Maven (with wrapper)  |
| Frontend | React 18, TypeScript 5, Vite 5                  |
| Storage  | In-memory `ConcurrentHashMap` (one process)     |

## Project structure

```
PET_Tic-Tac-Toe/
├── .github/workflows/ci.yml
├── backend/
│   ├── pom.xml
│   ├── mvnw / mvnw.cmd / mvnw.ps1
│   ├── run.sh / run.cmd
│   ├── .mvn/wrapper/
│   └── src/
│       ├── main/
│       │   ├── java/com/tictactoe/
│       │   │   ├── TicTacToeApplication.java
│       │   │   ├── api/               # REST controllers, DTOs, exception handler
│       │   │   │   ├── GameController.java
│       │   │   │   ├── dto/
│       │   │   │   └── exception/
│       │   │   ├── config/WebConfig.java
│       │   │   ├── domain/            # Pure game model
│       │   │   │   ├── Board.java
│       │   │   │   ├── Game.java
│       │   │   │   ├── Mark.java
│       │   │   │   ├── GameStatus.java
│       │   │   │   ├── GameMode.java
│       │   │   │   ├── Difficulty.java
│       │   │   │   └── ai/
│       │   │   │       ├── RobotPlayer.java
│       │   │   │       ├── LiteRobot.java
│       │   │   │       └── HardRobot.java
│       │   │   └── service/           # Application services
│       │   │       ├── GameService.java
│       │   │       ├── GameSessionStore.java
│       │   │       ├── InMemoryGameSessionStore.java
│       │   │       └── RobotResolver.java
│       │   └── resources/application.yml
│       └── test/java/com/tictactoe/   # JUnit 5 tests
│
├── frontend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts                 # /api proxy to localhost:3000
│   ├── index.html
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── types.ts
│       ├── styles.css
│       ├── api/gameApi.ts
│       ├── components/
│       │   ├── Board.tsx
│       │   ├── Cell.tsx
│       │   ├── GameSetup.tsx
│       │   └── StatusBanner.tsx
│       └── utils/
│           ├── statusMessage.ts
│           └── statusMessage.test.ts
│
├── README.md
└── .gitignore
```

## Prerequisites

- **JDK 17+** (the build targets Java 17)
- **Node.js 18+** and npm (for the frontend)
- Maven is **not** required — the project ships with the Maven Wrapper

## Running the backend

From the project root:

```bash
cd backend
./run.sh           # macOS / Linux
.\run.cmd          # Windows
```

The wrapper script packages the application and launches it with `java -jar`.
The API will be available at `http://localhost:3000`

To run the test suite:

```bash
cd backend
./mvnw test
```

To produce a runnable jar manually:

```bash
cd backend
./mvnw clean package
java -jar target/tictactoe-backend.jar
```

> **Note on `spring-boot:run`** — on Windows the `mvn spring-boot:run` goal does **not** work
> when the project lives under a path that contains non-ASCII characters (e.g. Cyrillic
> `Рабочий стол`). The plugin forks a JVM and passes the classpath via the Windows command
> line, which the OS code page mangles. The `run.cmd` / `java -jar` workflow above avoids
> this entirely because the main class is resolved from the JAR's `MANIFEST.MF`

## Running the frontend

```bash
cd frontend
npm install
npm run dev
```

The dev server runs at `http://localhost:8080` and proxies `/api/*` to the
backend on `:3000`, so start the backend first

Lint and unit tests:

```bash
cd frontend
npm run lint        # ESLint (flat config)
npm run test        # Vitest (run once)
npm run test:watch  # Vitest in watch mode
```

Production bundle:

```bash
cd frontend
npm run build       # outputs to frontend/dist
npm run preview     # serves the production build locally
```

## REST API

Base URL: `http://localhost:3000/api/games` (the React dev server on `:8080` proxies `/api/*` to it)

### Create a game

`POST /api/games`

```json
{
  "mode": "SOLO",
  "difficulty": "HARD",
  "humanMark": "X"
}
```

For `DUO` mode, `difficulty` and `humanMark` may be omitted

Response `201 Created`:

```json
{
  "id": "0c3d...uuid",
  "mode": "SOLO",
  "difficulty": "HARD",
  "humanMark": "X",
  "robotMark": "O",
  "cells": ["EMPTY", "EMPTY", "EMPTY", "EMPTY", "EMPTY", "EMPTY", "EMPTY", "EMPTY", "EMPTY"],
  "currentTurn": "X",
  "status": "IN_PROGRESS",
  "finished": false
}
```

### Fetch a game

`GET /api/games/{id}` → same payload as above

### Make a move

`POST /api/games/{id}/moves`

```json
{ "cellIndex": 4 }
```

`cellIndex` is the 0-based position on the 3x3 board:

```
 0 | 1 | 2
-----------
 3 | 4 | 5
-----------
 6 | 7 | 8
```

In `SOLO` mode the response already reflects the robot's reply (if the game is not finished)

### Delete a game session

`DELETE /api/games/{id}` → `204 No Content`

### Error format

```json
{
  "timestamp": "2026-05-16T09:00:00Z",
  "status": 400,
  "error": "Invalid move",
  "message": "Cell 4 is already occupied"
}
```

## Continuous Integration

GitHub Actions workflow at [`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs on every
push and pull request against `main`. It has two parallel jobs:

- **Backend** — sets up JDK 17, restores the Maven cache, runs `./mvnw test`, then builds the jar. On failure, Surefire reports are uploaded as artifacts
- **Frontend** — sets up Node 20, runs `npm ci`, then `npm run lint`, `npm run test` (Vitest), and finally `npm run build` (which type-checks via `tsc --noEmit` and produces the Vite production bundle)

## Design notes

- **Domain layer (`com.tictactoe.domain`)** is pure Java with no Spring imports — it can be tested in isolation and reused outside Spring
- **`Board`** owns cell state, win detection (8 lines), copy, and snapshot for serialization
- **`Game`** is mutable; it advances the turn only when the move did not end the game
- **AI players** implement a single `RobotPlayer` interface and register themselves as Spring beans. `RobotResolver` exposes them by `Difficulty`, so adding a new level is a one-class change
- **Sessions** are kept in `InMemoryGameSessionStore` (a `ConcurrentHashMap`). The interface is in place to swap in Redis / a database later without touching the controller or service code
- **CORS** origins are configured in `application.yml` under `tictactoe.cors.allowed-origins`

## Origin

This project started as a C# console application. The repository was rewritten end-to-end:
the domain logic was reimplemented in idiomatic Java, exposed over a REST API, and a React
client replaced the console UI. The original C# sources remain available in the Git history
