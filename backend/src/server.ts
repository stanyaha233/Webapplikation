import "dotenv/config";
import express from "express";
import cors from "cors";
import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcrypt";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const app = express();
const PORT = 3000;
app.use(cors());
app.use(express.json());

// Registrierungs-Route hinzufügen
app.post("/api/register", async (req: Request, res: Response) => {
    const { name, email, password, studyType } = req.body;

    try {
        // Prüfen, ob der Benutzer bereits existiert
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });
        if (existingUser) {
            return res.status(400).json({ error: "E-Mail wird bereits verwendet." });
        }

        // Passwort hashen (für mehr Sicherheit)
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // In der Datenbank speichern
        const user = await prisma.user.create({
            data: {
                name,
                email,
                passwordHash,
                // studyType: studyType // Falls im Prisma-Schema hinzugefügt
            }
        });

        res.status(201).json({
            success: true,
            user: { id: user.id, name: user.name, email: user.email }
        });
    } catch (error) {
        console.error("Registrierungsfehler:", error);
        res.status(500).json({ error: "Fehler beim Speichern des Nutzers." });
    }
});

// Unsere erste Test-Route
app.get("/api/health", (_req: Request, res: Response) => {
    res.json({ ok: true, message: "Hallo vom eigenen Backend!" });
});
app.get("/api/userName", (_req: Request, res: Response) => {
    res.json({ userName: "Stella", userID: 123 });
});
app.get("/api/userPassword", (_req: Request, res: Response) => {
    res.json({password: "geheim" });
});
app.get("/api/getsession", (_req: Request, res: Response) => {
    res.json({ sessionId: 123456, 
                duration:25, 
                breakTime:5, 
                starttime: Date.now(), 
                endtime: Date.now() + 30*60*1000, 
                date: new Date(), 
                progress: 80, 
                afterFeeling: "blue", 
                userId: 123 });
});
app.listen(PORT, () => {
    console.log(`Backend Server laeuft auf http://localhost:${PORT}`);
});