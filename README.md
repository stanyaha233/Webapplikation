
# Webapplikation
**Team:** Stella Keller (315158), Hanna Stanyak(315230)

**Repository:** https://github.com/stanyaha233/Webapplikation

## Setup
bash
```
npm install
npm run dev
```
## Projektidee
Die Idee für dieses Projekt ist es, eine Study-Website für das Modul Webapplikationen zu erstellen. Diese beinhaltet einen Pomodoro-Timer sowie einen Flow-Tracker, in dem man angeben kann, wie viel Prozent des Ziels man erreicht hat, um somit die optimale Study-Time herauszufinden, was das Ganze individualisiert. Man soll außerdem einen wöchentlichen Study-Überblick haben, um zu sehen, wie man über die letzte Woche am besten gelernt hat.

Optionale Add-ons wären:
Equalizer aus YouTube-Videos
RSS-Feed Study-Reminder
URL zB Zeitintervalle oder hexCode preset angeben

## Kriterien-Zuordnung M1
| Kriterium | Datei | Zeile / Hinweis |
|---|---|---|
| Semantische HTML-Struktur | home.html | Z. 1–60 |
| Formular mit Labels   | login.html | Z. 23-31 |
| Responsives Layout (Flexbox/Grid) | styles.css | Z. 15 |
| Konsistente Typografie und Farbgebung | styles.css | Z. 2-10
| Media Query | styles.css | Z. 85, Z.98 |
| URL-Struktur | home.html, login.html, register.html, timer.html, dashboard.html | Pfade: /home, /login, /register, /timer, /dashboard|

## Kriterien-Zuordnung M2

| Kriterium | Datei | Zeile / Hinweis |
|---|---|---|
| npm + Vite | package.json | Projekt-Root, npm run dev, npm install |
| TypeScript aktiv genutzt | src/Timer.tsx, src/Header.tsx | Z. 25 (seconds: number), Z. 1 Interface { userName?: string } |
| Komponentenzerlegung | src/Dashboard.tsx, src/Timer.tsx | Z. 12 `<Sidebar />`, Z. 34-35 `<Header />`, `<Sidebar />`|
| Props-Übergabe | src/Home.tsx, src/Header.tsx | Z. 20 Home (userName-Prop), Z. 1 Header (Prop-Empfang) |
| useState | src/Timer.tsx | Z. 8 (step), Z. 9 (timeLeft) |
| useEffect | src/Timer.tsx | Z. 11–23 (Timer-Intervall / Countdown) |
| Durchgängige Nutzeraktion | src/Timer.tsx | Z. 58, 71 (Einstellungen -> Deep Work -> Reflection via State step) |