#set page(
  paper: "a4",
  margin: (x: 2.5cm, y: 3cm),
  header: context {
    if counter(page).get().first() > 2 {
      align(right)[#text(size: 9pt, fill: rgb("7a86a0"))[Modul Webapplikationen -- Flow Time]]
    }
  },
  footer: context {
    if counter(page).get().first() > 2 {
      line(length: 100%, stroke: 0.5pt + rgb("e8f2ff"))
      grid(
        columns: (1fr, 1fr),
        text(size: 8pt, fill: rgb("7a86a0"))[Stella Keller & Hanna Stanyak],
        align(right)[#text(size: 8pt, fill: rgb("7a86a0"))[Seite #counter(page).display()]]
      )
    }
  }
)
#set text(
  font: "Liberation Sans",
  size: 11pt,
  lang: "de",
)

#show heading: set text(fill: rgb("4a8fd4"))
#show heading.where(level: 1): it => {
  v(12pt, weak: true)
  it
  v(8pt, weak: true)
}
#show heading.where(level: 2): it => {
  v(10pt, weak: true)
  it
  v(6pt, weak: true)
}

// --- Einfaches Deckblatt ---
#align(center + horizon)[
  #text(size: 26pt, weight: "bold", fill: rgb("4a8fd4"))[Flow Time]
  
  #v(3cm)
  
  #text(size: 12pt)[
    *Projektmitglieder:* \
    Stella Keller (Matrikelnummer: 315158) \
    Hanna Stanyak (Matrikelnummer: 315230)
  ]
  
  #v(2cm)
  
  #text(size: 11pt, fill: rgb("7a86a0"))[
    Abgabedatum: Semesterende (Juli 2026)
  ]
]

#pagebreak()

// --- Inhaltsverzeichnis ---
#outline(
  title: [Inhaltsverzeichnis],
  indent: 1.5em,
)

#pagebreak()
// --- Einleitung ---
= 1. Einleitung
#v(10pt)
Am Anfang haben wir uns einfach gefragt: Welches Projekt würde uns selbst im Alltag wirklich weiterhelfen und was würden wir tatsächlich aktiv nutzen? Da wir als Studierende selbst ständig am Schreibtisch sitzen und durch Berge von Stoff müssen, war die Antwort schnell klar. So entstand die Idee für eine maßgeschneiderte Study-Website, die wir jetzt im Rahmen des Moduls „Webapplikationen“ umsetzen.

Das Herzstück der Plattform ist die Kombination aus einem klassischen Pomodoro-Timer und einem smarten Flow-Tracker. Inspiriert vom psychologischen Prinzip des „Flow-States“ können Nutzer hier während des Lernens festhalten, wie viel Prozent ihres Etappenziels sie bereits erreicht haben. Das System nutzt diese Daten, um die ganz persönliche, optimale Balance zwischen Fokus- und Pausenzeit zu berechnen und das Lernerlebnis komplett zu individualisieren.

Klassische, starre Zeiteinstellungen wie das herkömmliche 25/5-Minuten-Schema der Pomodoro-Technik stoßen im studentischen Alltag oft an ihre Grenzen. Die menschliche Aufmerksamkeitsspanne und Leistungsfähigkeit sind individuell und hängen stark von der jeweiligen Tagesform oder der Art der Aufgabe ab. Das primäre Ziel dieser Web-Applikation ist es daher, die Lerneffizienz durch eine datenbasierte Individualisierung der Fokus- und Pausenzeiten nachhaltig zu steigern.

Zusätzlich liefert ein wöchentlicher Überblick eine clevere Analyse der letzten Tage: Die Plattform zeigt einem zum Beispiel ganz konkret, zu welcher Uhrzeit man am produktivsten war -- also ob man eher der Typ für produktive Morgen-Sessions oder späte Abendstunden ist -- und welche Methoden am besten funktioniert haben.

== Zielgruppe und Einsatzszenario
Die Plattform richtet sich primär an Studierende und Lernende, die Probleme mit der Einhaltung starrer Zeitvorgaben haben oder deren optimale Konzentrationsspanne ermitteln möchten. Das typische Einsatzszenario ist eine ablenkungsfreie Lernumgebung, bei der der Nutzer seine Lerneinheiten konfiguriert, den Timer startet und anschließend eine kurze, strukturierte Reflexion durchführt.

== Projektziele (Soll-Kriterien)
Für die erfolgreiche Umsetzung wurden folgende Hauptziele definiert:
- *Z1 (Konfigurierbarkeit):* Freie Einstellung von Lernzeit, Pausenzeit, Anzahl der Blöcke und einer Vorbereitungsphase.
- *Z2 (Flow-Tracking):* Manuelle Erfassung des erreichten Ziel-Prozentsatzes und des mentalen Zustands (Flow-Gefühl) nach jeder Lerneinheit.
- *Z3 (Analytisches Dashboard):* Visuelle Aufbereitung der Lernzeiten der letzten 7 Tage und automatische Berechnung der optimalen Fokusdauer sowie der produktivsten Tageszeit.
- *Z4 (Datensicherheit):* Sichere Registrierung und Anmeldung mit verschlüsselter Passwortspeicherung und geschützten API-Routen.

#v(5pt)
*Aufbau der Arbeit:*
Die vorliegende Ausarbeitung ist wie folgt gegliedert:
- *Kapitel 2* stellt den gewählten Technologie-Stack vor und begründet die Auswahl der einzelnen Komponenten sowie erwogene Alternativen.
- *Kapitel 3* beschreibt die Systemarchitektur sowie das Datenmodell und dokumentiert das API- und Datenbankschema.
- *Kapitel 4* dokumentiert die inkrementelle Umsetzung entlang der vier Meilensteine und ordnet die implementierten Features den Vorlesungskonzepten zu.
- *Kapitel 5* widmet sich dem Testing und der Qualitätssicherung, erläutert die Teststrategie und zeigt exemplarische Testergebnisse.
- *Kapitel 6* beschreibt den Betrieb der Anwendung sowie die Schritte zur lokalen Inbetriebnahme.
- *Kapitel 7* reflektiert den Projektverlauf kritisch, fasst die wichtigsten Lerneffekte zusammen und zieht ein abschließendes Fazit.

#pagebreak()

= 2. Unser Technologie-Stack
#v(5pt)
== React + Vite + React Router (SPA-Architektur)
- *Der Timer darf nicht sterben:* Unser wichtigstes Feature ist der Pomodoro-Timer. Wenn wir eine klassische Website bauen würden, bei der sich bei jedem Klick eine neue Seite lädt (MPA), würde der Timer bei jedem Wechsel zum Dashboard oder Profil gnadenlos zurückgesetzt werden. Mit einer Single Page Application (SPA) tauschen wir die Inhalte dynamisch aus. Der Timer läuft im Hintergrund einfach reibungslos weiter.
- *Vite statt Webpack:* Wir wollten beim Entwickeln nicht ewig warten. Vite nutzt moderne Browser-Features, startet in Millisekunden und zeigt Code-Änderungen sofort im Browser an (Hot Module Replacement) -- das spart beim Coden unglaublich viel Zeit und Nerven.
- *Komponenten-Wiederverwendung:* Dank React müssen wir Standard-Layouts wie unsere Sidebar oder den Header nur ein einziges Mal schreiben und können sie überall flexibel einbauen.

== TypeScript (statt JavaScript-Chaos)
- *Fehler finden, bevor sie wehtun:* In JavaScript merkt man oft erst im Browser, dass man irgendwo Mist gebaut hat. TypeScript schlägt uns direkt im Editor auf the Finger -- zum Beispiel, wenn wir der Session-Dauer versehentlich Text statt einer Zahl übergeben wollen.
- *Weniger Suchen, mehr Schreiben:* Dank der Autovervollständigung (IntelliSense) im Editor müssen wir nicht ständig nachschauen, wie unser Datenmodell aufgebaut ist. Sobald wir `.user` eintippen, wissen wir sofort, welche Felder uns zur Verfügung stehen.

== Vanilla CSS (und stolz drauf)
- *Verstehen, wie es wirklich funktioniert:* Weil das ein Hochschulprojekt ist, wollten wir uns nicht hinter Frameworks wie Tailwind oder Bootstrap verstecken. Mit reinem CSS zeigen wir, dass wir Layouts mit Flexbox und Grid wirklich durchdrungen haben.
- *Eigenes Designsystem mit CSS-Variablen:* Wir nutzen Variablen wie `--blue` oder `--paper`. So können wir globale Farben und Stylings an einer zentralen Stelle definieren und das Design später mit minimalem Aufwand anpassen.

== Node.js + Express (Backend)
- *Eine Sprache für alles:* Da wir im Team alle ohnehin mit JavaScript/TypeScript arbeiten, mussten wir uns für das Backend nicht extra in eine neue Sprache wie Java, Python oder PHP reinfuchsen. Wir schreiben einfach überall TypeScript und können sogar Typdefinitionen zwischen Frontend und Backend teilen.
- *Schnell und unkompliziert:* Node.js ist extrem flink bei Datenbankabfragen, und Express liefert uns ein super schlankes Gerüst ohne unnötigen Ballast, den wir gar nicht brauchen würden.

== PostgreSQL + Prisma ORM (Datenbank)
- *Struktur für unsere Daten:* Unser Datengemälde hängt stark zusammen -- ein User hat viele Sessions, die wiederum bestimmte Ergebnisse haben. Dafür ist eine klassische relationale Datenbank wie PostgreSQL perfekt und absolut ausfallsicher.
- *Prisma statt SQL-Kopfschmerzen:* Anstatt SQL-Queries mühsam von Hand zu tippen und uns Sorgen um Sicherheitslücken (wie SQL-Injections) zu machen, nutzen wir das Prisma ORM. Abfragen wie `prisma.session.findMany()` sind komplett typensicher und extrem intuitiv zu schreiben.

== JWT und HttpOnly Cookies (Sicherheit)
- *Schutz vor Datendiebstahl:* Wenn man Login-Tokens einfach im `localStorage` des Browsers speichert, können Angreifer sie über Schadcode (XSS) leicht auslesen. Wir packen unsere JSON Web Tokens (JWT) in ein HttpOnly-Cookie. Dadurch ist es für JavaScript im Browser komplett unsichtbar und extrem sicher.
- *Kein Server-Ballast:* Der Server muss sich nicht für jeden eingeloggten Nutzer eine Session im Arbeitsspeicher merken. Das JWT im Cookie enthält bereits alle wichtigen Infos und wird bei jeder Anfrage automatisch mitgeschickt.

== Vitest + Testing Library + Supertest
- *Lieber testen lassen als selber klicken:* Wir haben keine Lust, nach jeder kleinen Code-Änderung manuell im Browser zu prüfen, ob der Login oder die Registrierung noch klappt. Unsere automatisierten Tests prüfen die wichtigsten Funktionen (zum Beispiel in `server.test.ts`) in Sekundenbruchteilen im Hintergrund ab.

== Erwogene Alternativen und Abwägungen
Für das Systemdesign wurden im Vorfeld verschiedene technologische Alternativen evaluiert und gegeneinander abgewogen:
- *SPA (Vite/React) vs. SSR (z. B. Next.js):* Ein Server-Side-Rendering-Framework wie Next.js bietet Vorteile bei der Suchmaschinenoptimierung (SEO). Da es sich bei unserer Plattform jedoch um eine rein personalisierte Anwendung hinter einer Authentifizierungsschranke handelt, ist SEO irrelevant. Eine klassische React-SPA ermöglicht ein deutlich einfacheres und robusteres State-Management für den durchlaufenden Pomodoro-Timer im Frontend (z. B. via React Context), ohne dass komplexe Server-Client-Synchronisationen oder Hydration-Fehler auftreten.
- *Relational (PostgreSQL) vs. NoSQL (z. B. MongoDB):* Unsere Anwendungsdaten sind stark strukturiert und relational (z. B. besitzt ein Benutzer $N$ Lernsitzungen). Eine relationale Datenbank wie PostgreSQL garantiert über Fremdschlüsselbedingungen und Transaktionen die referenzielle Integrität der Daten und verhindert verwaiste Session-Einträge, was bei NoSQL-Datenbanken manuell im Applikationscode hätte gelöst werden müssen.
- *Prisma ORM vs. Raw SQL / TypeORM:* Prisma wurde gewählt, weil das deklarative Schema (`schema.prisma`) als zentrale *Single Source of Truth* dient. Es generiert automatisch exakte TypeScript-Typen für das Frontend und Backend. Im Vergleich zu klassischem SQL schützt Prisma standardmäßig vor SQL-Injections, und im Vergleich zu schwerfälligeren ORMs wie TypeORM oder Sequelize ist der Einrichtungsaufwand minimal.
- *REST-API vs. GraphQL:* Für den Datenaustausch wurde eine klassische REST-Architektur gewählt. Ein komplexerer Ansatz wie GraphQL oder tRPC wurde als Overkill eingestuft, da die Datenabfragen überschaubar sind und klassische REST-Endpoints (GET/POST) in Express ressourcenschonend und schnell implementiert werden können.

== Grenzen und Kompromisse des Stacks
Jede Architekturentscheidung bringt auch technische Einschränkungen mit sich, die wir im Projekt bewusst in Kauf genommen haben:
- *Zustandslosigkeit (Statelessness) von JWT:* Da wir JWTs in HttpOnly-Cookies speichern, ist das System zustandslos und entlastet den Server-Arbeitsspeicher. Die Kehrseite ist, dass einmal ausgestellte Token bis zu ihrem Ablaufdatum gültig bleiben und nicht einfach serverseitig widerrufen werden können (z. B. bei einem erzwungenen Logout oder Passwortwechsel). Um dieses Sicherheitsrisiko zu minimieren, haben wir die Lebensdauer der Token kurz gehalten und auf eine komplexe Blacklist-Infrastruktur im Backend (z. B. via Redis) verzichtet.
- *Vanilla CSS vs. CSS-Frameworks:* Das Schreiben von purem CSS erfordert mehr manuellen Aufwand und bietet keine automatische Typensicherheit für Klassennamen (wie es z. B. Tailwind CSS oder CSS Modules tun). Wir haben dies kompensiert, indem wir ein strenges Designsystem auf Basis von CSS-Variablen etabliert haben, um Redundanzen zu vermeiden.
- *Single-Threaded Node.js-Backend:* Express läuft auf einer Node.js-Laufzeitumgebung und verarbeitet Anfragen in einer einzigen Ereignisschleife (Event Loop). CPU-intensive Berechnungen (z. B. komplexe statistische Analysen der wöchentlichen Lernzeiten) könnten den Server blockieren. Für die aktuelle Nutzerzahl und Datenmenge ist dieser Flaschenhals vernachlässigbar; bei einer Skalierung müsste diese Logik in separate Microservices oder Worker-Threads ausgelagert werden.

#v(20pt)
#rect(
  width: 100%,
  fill: rgb("e8f2ff"),
  stroke: 1pt + rgb("95c2ff"),
  radius: 6pt,
  inset: 12pt,
  [
    *Zusammenfassung & Fazit:* Durch die bewusste Auswahl moderner, aufeinander abgestimmter Full-Stack-Technologien haben wir eine hochperformante, sichere und benutzerfreundliche Lernplattform geschaffen. Die Kombination aus reibungslosem SPA-Timer, relationaler PostgreSQL-Datenhaltung und einem sicheren JWT-Auth-Verfahren erfüllt alle Kriterien an eine moderne Web-Anwendung.
  ]
)

#pagebreak()

= 3. Systemarchitektur und Design

Die Architektur dieses Webprojekts wurde mit dem Fokus auf Modularität, Skalierbarkeit und Sicherheit entworfen. Durch die konsequente Trennung von Frontend (Client) und Backend (Server) ist das System lose gekoppelt und kommuniziert ausschließlich über standardisierte REST-Schnittstellen. Im Folgenden werden die Komponentenstruktur des Frontends, das API-Design, das relationale Datenbankschema sowie die zentralen Kontroll- und Datenflüsse detailliert dokumentiert.

== Komponentenstruktur des Frontends

Das Frontend ist als Single-Page-Application (SPA) auf Basis von React strukturiert. Die Komponenten sind hierarchisch organisiert und werden durch clientseitiges Routing gesteuert. Die folgende Baumstruktur verdeutlicht die Dateiorganisation und die Beziehung zwischen den verschiedenen Seiten und Komponenten:

```text
src/
├── main.tsx                      (Einstiegspunkt, Router-Definition)
├── App.tsx                       (Root-Komponente, injiziert AuthProvider)
├── context/
│   └── JWTAuthContext.tsx         (Globaler Authentifizierungs-Zustand)
├── components/
│   ├── Header.tsx                (Kopfzeile mit Benutzername & Streak)
│   ├── Sidebar.tsx               (Navigation & Monats-Kalender-Streak)
│   ├── Footer.tsx                (Standardisierte Fußzeile)
│   ├── ProtectedRoute.tsx        (Route-Guard für authentifizierte Seiten)
│   └── ScrollPicker.tsx          (Interaktives Scroll-Rad für Timer-Werte)
└── pages/
    ├── Home.tsx                  (Startseite mit Wochen-Statistik in Minuten)
    ├── Timer.tsx                 (Authentifizierter Pomodoro-Timer + Reflexion)
    ├── DemoTimer.tsx             (Gast-Zugang ohne API-Anbindung)
    ├── Login.tsx                 (Nutzer-Anmeldung)
    └── Register.tsx              (Nutzer-Registrierung)
```

#v(10pt)

=== Datenfluss im Frontend (React Context & State Management)
Der `JWTAuthContext` dient als zentrale Datenquelle für den Authentifizierungs-Zustand der Anwendung. Er stellt allen tieferliegenden Komponenten wichtige Informationen bereit:
- *Globaler State:* `user` (Enthält `id`, `name`, `email` und den optionalen `studyType` des aktuell angemeldeten Benutzers) sowie einen `loading`-Zustand.
- *Methoden:* `login(email, password)`, `register(name, email, password, studyType)` und `logout()`.
- *Lokaler State:* In den Seiten wird lokaler React-State (`useState`) für temporäre UI-Zustände genutzt. Im `Timer.tsx` wird beispielsweise der Countdown, der Pausenzustand und der Reflexionsschritt über lokale Hooks verwaltet.

Seiten wie das Dashboard oder der Timer sind über die `ProtectedRoute`-Komponente geschützt. Versucht ein nicht authentifizierter Benutzer diese Pfade aufzurufen, erfolgt eine automatische Umleitung (`Redirect`) auf die Login-Seite.

#pagebreak()

== REST-API-Design

Das Node.js-Backend stellt eine REST-Schnittstelle zur Verfügung, die JSON-Daten verarbeitet und zurückgibt. Alle Anfragen, die sich auf Benutzerdaten oder Lernsitzungen beziehen, erfordern eine vorherige Validierung über ein JWT-Token, welches im HttpOnly-Cookie übermittelt wird.

Die folgende Tabelle dokumentiert die implementierten API-Endpoints:

#v(8pt)
#table(
  columns: (auto, 1.2fr, 1.2fr, 2fr),
  inset: 7pt,
  align: horizon,
  [*Methode*], [*Pfad*], [*Authentifizierung*], [*Beschreibung / Payload*],
  [POST], [/api/register], [Nein], [Registriert einen neuen Benutzer. \ _Payload: {name, email, password, studyType}_],
  [POST], [/api/login], [Nein], [Authentifiziert den Nutzer und setzt das HttpOnly-Cookie. \ _Payload: {email, password}_],
  [POST], [/api/logout], [Ja], [Löscht das HttpOnly-Token-Cookie im Browser.],
  [GET], [/api/user], [Ja (JWT)], [Gibt das Profil des angemeldeten Benutzers zurück. \ _Response: {id, email, name, studyType}_],
  [GET], [/api/userName], [Ja (JWT)], [Gibt den Benutzernamen und die ID zurück.],
  [GET], [/api/sessions], [Ja (JWT)], [Ruft alle gespeicherten Lerneinheiten des Nutzers ab. \ _Response: Array von Session-Objekten_],
  [POST], [/api/session], [Ja (JWT)], [Speichert eine abgeschlossene Lernsitzung in der DB. \ _Payload: {duration, breakTime, starttime, endtime, progress, afterFeeling}_],
  [GET], [/api/health], [Nein], [Health-Check-Endpoint zur Überprüfung der Serveraktivität.]
)

#v(10pt)

=== Authentifizierungs-Middleware (`authenticateToken`)
Bei jeder geschützten Route wird vor dem eigentlichen Route-Handler die Middleware `authenticateToken` ausgeführt. Der Ablauf gestaltet sich wie folgt:
1. Die Middleware extrahiert das Token aus dem Request-Cookie: `req.cookies.token`.
2. Ist kein Cookie vorhanden, bricht die Anfrage mit dem HTTP-Statuscode `401 (Unauthorized)` ab.
3. Ist ein Cookie vorhanden, wird das Token mit dem geheimen Server-Schlüssel (`JWT_SECRET`) überprüft (`jwt.verify`).
4. Schlägt die Verifizierung fehl (z. B. bei Manipulation oder Ablauf des Tokens), wird der Status `403 (Forbidden)` zurückgegeben.
5. Ist das Token gültig, werden die Benutzerinformationen (`id`, `email`) an das Request-Objekt angehängt (`req.user = decoded`) und der Route-Handler aufgerufen.

#pagebreak()

== Datenbankschema und Relationen

Zur persistenten Speicherung der Benutzer und Lerneinheiten wird ein relationales Datenbanksystem (PostgreSQL) verwendet. Das Schema besteht aus zwei Kern-Tabellen (`User` und `Session`), die über einen Fremdschlüssel miteinander in Beziehung stehen.

Die Beziehungen sind als **1:N-Relation** (One-to-Many) definiert: Ein Benutzer kann beliebig viele Lerneinheiten speichern, während jede Lerneinheit exakt einem registrierten Benutzer zugeordnet sein muss.

=== Tabellenschema: `User`
Die Tabelle `User` speichert die Anmelde- und Profildaten der Benutzer.

#v(5pt)
#table(
  columns: (auto, auto, auto, 2fr),
  inset: 6pt,
  align: horizon,
  [*Feldname*], [*Datentyp*], [*Key*], [*Beschreibung / Constraints*],
  [id], [Int], [Primary], [Autoincrement, Eindeutiger Identifikator],
  [email], [String], [Unique], [Eindeutige E-Mail-Adresse des Nutzers],
  [name], [String], [-], [Vollständiger Name des Benutzers],
  [passwordHash], [String], [-], [Mit bcrypt verschlüsseltes Passwort],
  [studyType], [String?], [-], [Optionaler Lerntyp (Onboarding: sprinter, marathon, hero)],
  [createdAt], [DateTime], [-], [Registrierungszeitpunkt (Default: now())]
)

=== Tabellenschema: `Session`
Die Tabelle `Session` dokumentiert die vom Timer aufgezeichneten Lerneinheiten.

#v(5pt)
#table(
  columns: (auto, auto, auto, 2fr),
  inset: 6pt,
  align: horizon,
  [*Feldname*], [*Datentyp*], [*Key*], [*Beschreibung / Constraints*],
  [id], [String], [Primary], [Eindeutige UUID (Universally Unique Identifier)],
  [createdAt], [DateTime], [-], [Speicherungszeitpunkt (Default: now())],
  [duration], [Int], [-], [Lernzeit in Sekunden],
  [breakTime], [Int], [-], [Pausenzeit in Sekunden],
  [starttime], [DateTime], [-], [Startzeitpunkt der Lernsitzung],
  [endtime], [DateTime], [-], [Endzeitpunkt der Lernsitzung],
  [progress], [Int], [-], [Manueller Zielerreichungsgrad (0--100%)],
  [afterFeeling], [String], [-], [Mentaler Zustand nach dem Lernen (flow, tired, overwhelmed)],
  [userId], [Int], [Foreign], [Referenziert `User.id` (Kaskadierendes Löschen)]
)

#v(10pt)
#rect(
  width: 100%,
  stroke: 0.5pt + rgb("7a86a0"),
  fill: rgb("fafafa"),
  inset: 8pt,
  [
    *Datenbankintegrität (Cascade Delete):* Um verwaiste Sitzungsdaten zu vermeiden, ist die Relation so konfiguriert, dass beim Löschen eines Benutzerkontos (`User`) automatisch alle damit verknüpften Sitzungen (`Session`) kaskadierend aus der Datenbank entfernt werden (`onDelete: Cascade`).
  ]
)

#pagebreak()

== Kontroll- und Datenflüsse

Um die Interaktion zwischen den drei Schichten (Client, Server, Datenbank) zu verdeutlichen, werden nachfolgend zwei wesentliche Use-Case-Datenflüsse Schritt für Schritt beschrieben.

=== 1. Ablauf beim Beenden und Speichern einer Lernsitzung
Sobald der Timer abgelaufen ist oder der Benutzer die Sitzung vorzeitig beendet, wechselt das Frontend in die Reflexionsphase:
1. *Nutzerinteraktion:* Der Benutzer bewertet das Gefühl während des Lernens (z. B. „In the flow“) und stellt den Slider für den erreichten Ziel-Prozentsatz ein (z. B. 80%). Er klickt auf „Save & Back to Settings“.
2. *API-Anfrage:* Die Frontend-Funktion `saveSession` sendet einen asynchronen HTTP-POST-Request an `/api/session`. Das Payload enthält:
   ```json
   {
     "duration": 1800,
     "breakTime": 300,
     "starttime": "2026-07-16T15:00:00.000Z",
     "endtime": "2026-07-16T15:30:00.000Z",
     "progress": 80,
     "afterFeeling": "flow"
   }
   ```
3. *Authentifizierung:* Die Express-Middleware `authenticateToken` liest das JWT-Cookie und entschlüsselt die `userId` des anfragenden Benutzers.
4. *Persistierung:* Der Server wandelt die Daten um und übergibt sie an Prisma:
   ```typescript
   prisma.session.create({
     data: { duration, breakTime, starttime, endtime, progress, afterFeeling, userId }
   })
   ```
5. *API-Antwort:* Nach erfolgreichem Schreiben in die PostgreSQL-Datenbank sendet der Server den HTTP-Status `201 (Created)` mit der gespeicherten Session im JSON-Format zurück.
6. *UI-Update:* Das Frontend fängt die Antwort ab, löst ein benutzerdefiniertes Event (`session-saved`) aus, damit die Sidebar-Kalenderdaten neu geladen werden, und navigiert den Nutzer zurück auf den Einstellungsbildschirm.

=== 2. Laden des Dashboards und Auswertung
Beim Aufruf der Dashboard-Seite erfolgt eine dynamische Aggregation der historischen Nutzerdaten:
1. *Abruf:* Die Dashboard-Komponente fragt im Hook `useEffect` über the API `GET /api/sessions` alle vergangenen Sessions des angemeldeten Benutzers ab.
2. *Aggregation der Grafiken:* Das Frontend ermittelt die Sessions der letzten 7 Tage und berechnet pro Tag die Summe der Lernminuten sowie den durchschnittlichen Zielerreichungsgrad. Daraus wird dynamisch das CSS-Säulendiagramm gezeichnet.
3. *Berechnung der optimalen Study-Time:* Die JavaScript-Logik filtert Sessions, die mit „flow“ bewertet wurden und eine Zielerreichung von mindestens 70% hatten. Aus der Dauer dieser Einheiten wird das arithmetische Mittel berechnet, welches als optimale Lernzeit vorgeschlagen wird.
4. *Uhrzeitanalyse:* Sessions werden nach Startzeit in drei Klassen eingeteilt (Morgen, Nachmittag, Abend/Nacht). Der Klassenmittelwert der Zielerreichung (`progress`) entscheidet, welche Tageszeit als produktivste Lerneinheit auf dem Dashboard ausgegeben wird.

= 4. Umsetzung pro Meilenstein
In diesem Kapitel geht es um die genauen Meilensteine und was gefragt war und wie man das im Projekt einsehen kann 
Was wurde umgesetzt? Welche VL-Konzepte wo im Code? 
~6–8 Seiten
(1-2 Seiten pro Meilenstein?)

== Meilenstein 1:
=== Aufgabestellung:
In dem ersten Meilenstein sollten wir uns erstmal mit HTML auseinander setzen und ausserdem ein Git-Repository machen ausserdem sollte man bereichts in die HTML einbauen damit man ein gefühl für das ganze bekommen könnte und ausserdem sollten wir uns eine Klare URL-Strukturen überlegen
=== Umsetzung:
==== Repository
  Erstmal wurde ein Git-Repository angelegt und alle Teammitglieder hinzugeefügt und als Contributor sichtbar dann wurde eine Readme mit kurzer Projektidee und Teamübersicht erstellt. 
==== HTML (HTML)
Es wurde mehrere HTML Dateien erstellt die eine Semantische Struktur hat:
- header
- main
- nav
- article
- section
- footer
Und ein Formular mit label und name Attribut:

```html
//register.html
<form>
    <div class="card">
        <h2>Registrierung</h2>
        <input type="text" placeholder="Name" required>
        <br />
        <input type="email" placeholder="E-Mail-Adresse" required>
        <input type="password" placeholder="Passwort" required>
    </div>

    <div class="card">
        <h2>Wie lernst du normalerweise?</h2>
        <label class="radio-option">
            <input type="radio" name="study-type" value="sprinter">
            <span><strong style="color:var(--blue-dark);">Sprinter:</strong> Kurz und intensiv</span>
        </label>
        <br /><br />
        <label class="radio-option">
            <input type="radio" name="study-type" value="marathon">
            <span><strong style="color:var(--blue-dark);">Marathonläufer:</strong> Stundenlang und stetig</span>
        </label>
        <br /><br />
        <label class="radio-option">
            <input type="radio" name="study-type" value="hero">
            <span><strong style="color:var(--blue-dark);">Last-Minute-Hero:</strong> Hoher Druck nötig</span>
        </label>
    </div>

    <button type="submit" class="submit-btn">Account erstellen</button>
    <button type="button" onclick="window.location.href='login.html'"
        style="background:none; border:1px solid var(--blue-dark); color:var(--blue-dark);">
        Already have an account? Log in
    </button>
</form>
```



==== CSS
- Wir sollten eine CSS Datei machen die das Layaut an die grösse des Bildschirm anpasst je nachdem wie gross das fenster ist das kann man mit Flexbox oder Grid erzeugen.
- Dann sollten wir die Farbgebung und die Typografie konsistent halten und das wurde dann auch in der CSS gemacht 
- Als Nächstes war noch die Media Query die wir dort hinzufügen sollte für zBs die mobile Ansicht also die ansicht auf dem Handy

==== HTTP-Bewusstsein (Tabelle hinzufügen)
Wir sollten uns eine klare URL Struktur für die seiten uns Ressourcen überlegen das ist bei uns so:

#v(10pt)
=== Meilenstein 2: 
=== Aufgabestellung:
=== Umsetzung:

#v(10pt)
=== Meilenstein 3: 
=== Aufgabestellung:
=== Umsetzung:

#v(10pt)
=== Meilenstein 4: 
=== Aufgabestellung:
=== Umsetzung:

= 5. Testing & Qualitätssicherung ~2 Seiten
Teststrategie, was wird getestet, exemplarische Ergebnisse

= 6. Betrieb ~1–2 Seiten


= 7. Reflexion & Fazit ~2 Seiten

= Anhang  ~2–3 Seiten
