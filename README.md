
# Webapplikation
**Team:** Stella Keller (315158), Hanna Stanyak(315230)

**Repository:** https://github.com/stanyaha233/Webapplikation
<<<<<<< Updated upstream

## Setup
bash
```
npm install
npm run dev
```
## Projektidee
Die Idee für dieses Projekt ist es, eine Study-Website für das Modul Webapplikationen zu erstellen. Diese beinhaltet einen Pomodoro-Timer sowie einen Flow-Tracker, in dem man angeben kann, wie viel Prozent des Ziels man erreicht hat, um somit die optimale Study-Time herauszufinden, was das Ganze individualisiert. Man soll außerdem einen wöchentlichen Study-Überblick haben, um zu sehen, wie man über die letzte Woche am besten gelernt hat.
=======
<<<<<<< Updated upstream
## Projektidee

Die Idee für dieses Projekt ist es, eine Study-Website für das Modul Webapplikationen zu erstellen. Diese beinhaltet einen Pomodoro-Timer sowie einen Flow-Tracker, in dem man angeben kann, wie viel Prozent des Ziels man erreicht hat, um somit die optimale Study-Time herauszufinden, was das Ganze individualisiert. Man soll außerdem einen wöchentlichen Study-Überblick haben, um zu sehen, wie man über die letzte Woche am besten gelernt hat. Die Website soll so entwickelt werden, dass sie neurodivergenten Personen einen Vorteil bringt, aber auch „Normaltypischen“.
=======

## Projektidee
Study-Website die, angelehnt an Pomodoro-Timer sowie an das Prinzip des Flow-States, die optimale Study/Break-Ratio herauszufinden soll.
>>>>>>> Stashed changes
>>>>>>> Stashed changes

Optionale Add-ons wären:
Wöchentlicher Study Überblick
Beste Lernzeit (Uhezeit: Morgen vs. Abend)
Equalizer aus YouTube-Videos
RSS-Feed Study-Reminder
<<<<<<< Updated upstream
URL zB Zeitintervalle oder hexCode preset angeben
=======
<<<<<<< Updated upstream
=======
in URL zB Zeitintervalle, Namen oder hexCode pre-set angeben
>>>>>>> Stashed changes
>>>>>>> Stashed changes

## Kriterien-Zuordnung M1
| Kriterium | Datei | Zeile / Hinweis |
|---|---|---|
| Semantische HTML-Struktur | home.html | Z. 1–60 |
| Formular mit Labels   | login.html | Z. 23-31 |
| Responsives Layout (Flexbox/Grid) | styles.css | Z. 15 |
| Konsistente Typografie und Farbgebung | styles.css | Z. 2-10 |
| Media Query | styles.css | Z. 85, Z.98 |
| URL-Struktur | home.html, login.html, register.html, timer.html, dashboard.html | Pfade: /home, /login, /register, /timer, /dashboard|
<<<<<<< Updated upstream
=======
<<<<<<< Updated upstream
=======
>>>>>>> Stashed changes

## Kriterien-Zuordnung M2

| Kriterium | Datei | Zeile / Hinweis |
|---|---|---|
| npm + Vite | package.json | Projekt-Root, npm run dev, npm install |
| TypeScript aktiv genutzt | src/Timer.tsx, src/Header.tsx | Z. 25 (seconds: number), Z. 1 Interface { userName?: string } |
| Komponentenzerlegung | src/Dashboard.tsx, src/Timer.tsx | Z. 12 `<Sidebar />`, Z. 34-35 `<Header />`, `<Sidebar />`|
| Props-Übergabe | src/Home.tsx, src/Header.tsx | Z. 20 Home (userName-Prop), Z. 1 Header (Prop-Empfang) |
| useState | src/Timer.tsx | Z. 8 (step), Z. 9 (timeLeft) |
| useEffect | src/Timer.tsx | Z. 11–23 (Timer-Intervall / Countdown) |
<<<<<<< Updated upstream
| Durchgängige Nutzeraktion | src/Timer.tsx | Z. 58, 71 (Einstellungen -> Deep Work -> Reflection via State step) |
=======
| Durchgängige Nutzeraktion | src/Timer.tsx | Z. 58, 71 (Einstellungen -> Deep Work -> Reflection via State step) |

## Kriterien-Zuordnung M3

| Kriterium | Datei | Zeile / Hinweis |
| :--- | :--- | :--- |
| **React Router** | | |
| 2–3 Routen vorhanden | frontend/src/main.tsx | Z. 14–28: /, /home, /dashboard, /timer, /login, /register (6 Routen) |
| Navigation über `<Link>` | frontend/src/Sidebar.tsx, frontend/src/Home.tsx | Z. 20–25: `<Link>` zu /home, /login, /timer, /dashboard; Z. 34: `<Link>` zu /timer |
| **Datenfetching & REST** | | |
| Fetch gegen eigenes Backend | frontend/src/context/JWTAuthContext.tsx | Z. 26 (GET /api/user), Z. 47 (POST /api/login), Z. 86 (POST /api/register) |
| GET Methode | backend/src/server.ts, frontend/src/context/JWTAuthContext.tsx | Z. 144: GET /api/user; Z. 26: fetch("/api/user") |
| Schreibende Methode | backend/src/server.ts, frontend/src/context/JWTAuthContext.tsx | Z. 60: POST /api/register, Z. 97: POST /api/login, Z. 134: POST /api/logout |
| **Fehler- & Ladezustände** | | |
| Ladeindikator | frontend/src/Register.tsx, frontend/src/Login.tsx | Z. 39–43: loading State mit Text; Z. 43–47: „Logging in...“ |
| Fehlermeldung | frontend/src/Register.tsx, frontend/src/Login.tsx | Z. 33–37 & Z. 37–41: Dynamische Anzeige von error-Boxen |
| **Geteilter State** | | |
| React Context | frontend/src/context/JWTAuthContext.tsx | Z. 15: createContext, Z. 17: AuthProvider, Z. 140: useAuth |
| Feature: Eingeloggter User | frontend/src/context/JWTAuthContext.tsx | Z. 18: user State, login(), logout(), register() |
| **Tests** | | |
| 3–5 Tests vorhanden | frontend/src/context/JWTAuthContext.test.tsx, backend/src/server.test.ts | 5 Tests im Frontend, 4 Tests im Backend (9 Tests gesamt) |
| Vitest + Testing Library | frontend/package.json, frontend/vite.config.ts | package.json Z. 29–34 (DevDependencies), vite.config.ts Z. 13–16 |
| Kernlogik getestet | frontend/src/context/JWTAuthContext.test.tsx, backend/src/server.test.ts | Profil-Check, Register/Login/Logout API, JWT Verifizierung |
| npm test Befehl | frontend/package.json, backend/package.json | Z. 9 (frontend) & Z. 11 (backend): "test": "vitest run" |
| **Backend** | | |
| Node.js + Express | backend/src/server.ts | Z. 16–25: Express App Instanz, Middleware-Setup (CORS, Cookie-Parser) |
| Frontend spricht Backend an | frontend/vite.config.ts | Z. 7–10: Proxy /api an http://localhost:3000 |
| **Datenbank** | | |
| Persistente Datenhaltung | backend/prisma/schema.prisma | Prisma ORM mit PostgreSQL-Datenbank |
| Nicht data.json | backend/prisma/schema.prisma | Z. 11–28: Relationales Prisma-Datenbankschema (User & Session) |
| **Authentifizierung** | | |
| Login & Registrierung | backend/src/server.ts | Z. 60: POST /api/register (Bcrypt Hashing), Z. 97: POST /api/login |
| JWT-basierte Authentifizierung | backend/src/server.ts | Z. 111: jwt.sign(); Z. 115–120: Speicherung im HttpOnly-Cookie |
| Geschützte Route | backend/src/server.ts, frontend/src/components/ProtectedRoute.tsx | Z. 34–57: authenticateToken; ProtectedRoute schützt /dashboard & /timer |

## Architektur (VL 12)

 Anwendung ist als klassische **Single Page Application (SPA)** mit einem getrennten **REST API-Backend** konzipiert:

```text
┌─────────────────────────────────────────────────────────────┐
│ Frontend (React SPA)                                        I
I - Vite Dev Server (Port 5173)                               │
│ - React Router Navigation                                   I
I - JWTAuthContext für Auth-State                             │
│ - Komponenten: Home, Dashboard, Timer, Login, Register      I
└────────────────────┬────────────────────────────────────────┘
                     │ fetch() + HttpOnly Cookies
                     │ (credentials: "include")
                     V
┌─────────────────────────────────────────────────────────────┐
I Backend (Node.js/Express + PostgreSQL)                      │
│- API Endpoints: POST/GET/DELETE                             I
I - authenticateToken Middleware                              │
│ - JWT Token in HttpOnly Cookie                              I
I - Prisma ORM ↔ PostgreSQL DB                                │
└─────────────────────────────────────────────────────────────┘
```

React-SPA kommuniziert über Fetch mit Express-Backend
-> Anfragen per JWT-Cookie autorisiert
-> Daten per Prisma in PostgreSQL speichert (statt LqLite wegen Vercel)

**Begründung (kein SSR/SSG):** 
alle Kernfeatures (Timer, Statistiken) passwortgeschützt und dynamisch personalisiert 
-> ist SEO irrelevant
-> SPA bietet die flüssigste UX

## Setup & Befehle

| Bereich | Aktion | Befehl | Details |
| :--- | :--- | :--- | :--- |
| **Setup** | UI einrichten | `cd frontend && npm install` | Installiert Frontend & Test-Module |
| | Server einrichten | `cd backend && npm install` | Installiert Express-Dependencies & Prisma |
| **Dev Run** | Backend starten | `cd backend && npm run dev` | Server läuft auf Port 3000 |
| | Frontend starten | `cd frontend && npm run dev` | Vite Dev Server läuft auf Port 5173 (proxied `/api`) |
| **Build** | UI kompilieren | `cd frontend && npm run build` | Erstellt das produktionsreife SPA-Bundle |
| | UI vorschauen | `cd frontend && npm run preview` | Lokale Vorschau des Builds |
| **Testen** | Frontend-Tests | `cd frontend && npm test` | Vitest + RTL (Zustand & Auth-Flow) |
| | Backend-Tests | `cd backend && npm test` | Vitest + Supertest (Middleware & Endpunkte) |
>>>>>>> Stashed changes
>>>>>>> Stashed changes
