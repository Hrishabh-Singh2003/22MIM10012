# Notification System Design

---

## Overview
This repository contains the Campus Notification Platform, addressing two stages of development:
1. **Stage 1**: Core Priority Algorithm and Logging Middleware.
2. **Stage 2**: Responsive React/Next.js Frontend with Material UI and real-time API integration.

---

## Stage 1: Core Logic
- **Priority Scoring**: `score = typeWeight × 10¹³ + timestamp_ms`.
- **Weights**: `Placement (3) > Result (2) > Event (1)`.
- **Min-Heap Algorithm**: Efficiently maintains the top-N notifications in `O(M log N)` time.
- **Logging**: Custom structured `Logger` class used across the stack to replace `console.log`.

---

## Stage 2: Unified Frontend
The frontend is a **Next.js** application styled exclusively with **Material UI**.

### Architecture
- **Server-Side API Route**: `/api/local-notifications` handles secure fetching from the protected evaluation API, bypassing CORS and protecting credentials.
- **Priority Inbox**: Integrated the Min-Heap algorithm into the React lifecycle to rank notifications from the live stream.
- **Persistence**: Notification "Read" status is persisted in `localStorage`.
- **Responsive Layout**: Sidebar for desktop and hamburger menu for mobile devices.

---

## Final Project Structure
```
22MIM10012/
├── Notification_System_Design.md
├── logging_middleware/
│   └── logger.js             ← Logging Middleware
├── notification_app_be/
│   └── priority_inbox.js     ← Backend Priority Logic
└── notification_app_fe/      ← Unified React Frontend
    ├── src/
    │   ├── app/
    │   │   ├── api/          ← API Proxy
    │   │   ├── priority/     ← Priority View
    │   │   └── page.js       ← Main Dashboard
    │   ├── components/       ← MUI Notification Components
    │   ├── services/         ← API Service Layer
    │   └── utils/            ← Priority Utility (Heap)
    └── public/
        ├── legacy-demo.html  ← Stage 1 Static Demo
        └── screenshots/      ← Implementation Screenshots
```

---

## Execution
To run the frontend:
1. `cd notification_app_fe`
2. `npm install`
3. `npm run dev`
4. Open `http://localhost:3000`
