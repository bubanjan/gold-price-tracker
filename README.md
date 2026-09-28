# Gold Price Tracker

A full-stack application for tracking gold prices, viewing historical price data, and creating personalized price alerts.

The project was built as a practical exploration of modern **ASP.NET Core** and **React/TypeScript** development, with a focus on background processing, asynchronous messaging, server-state management, authentication, resilience, and automated testing.

## Features

- Live gold price tracking from an external API
- Historical price data and charts
- User registration and cookie-based authentication
- User-specific price alerts
- Notifications when target prices are reached
- Responsive React UI
- Backend health check endpoint
- HTTP retry and resilience handling

## Architecture

```text
External Gold API
        ↓
ASP.NET Core BackgroundService
        ↓
EF Core / SQLite
        ↓
ASP.NET Core Web API
        ↓
React + TypeScript
        ↓
TanStack Query
        ↓
Material UI / Recharts
```

Price alerts are processed in the background. When an alert is triggered, a message is published through a .NET `Channel<T>` and consumed by a separate notification background service.

## Tech Stack

**Backend:** ASP.NET Core (.NET 10), C#, Entity Framework Core, SQLite, BackgroundService, `Channel<T>`, HttpClient resilience, Health Checks, cookie authentication

**Frontend:** React, TypeScript, Vite, TanStack Query, React Router, Material UI, Recharts

**Testing:** xUnit, EF Core SQLite in-memory testing, `WebApplicationFactory`, Vitest, React Testing Library, Playwright



## Key Concepts

This project demonstrates practical use of background workers, producer/consumer messaging, dependency injection, configuration with `IOptions`, HTTP resilience, authentication and authorization, asynchronous programming, TanStack Query server-state management, and full-stack automated testing.

## How to Run the Application

### Backend

1. Open `GoldPriceTracker.slnx` in Visual Studio.
2. Set `GoldPriceTracker.Api` as the startup project.
3. Run the application.

### Frontend

1. Navigate to the `GoldPriceTrackerFrontend` folder.
2. Install the dependencies:

```bash
npm install
```

3. Start the Vite development server:

```bash
npm run dev
```

The frontend will be available at `https://localhost:5173`.