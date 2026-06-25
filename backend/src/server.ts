import "dotenv/config";
import express from "express";
import cors from "cors";
<<<<<<< Updated upstream
import type { Request, Response } from "express";
=======
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
>>>>>>> Stashed changes
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcrypt";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const app = express();
const PORT = 3000;
<<<<<<< Updated upstream
app.use(cors());
app.use(express.json());

// Registrierungs-Route hinzufügen
=======

app.use(cors({
    origin: "http://localhost:5173", // Frontend dev server
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

const JWT_SECRET = process.env.JWT_SECRET || "super-secure-jwt-secret-key-123456";

interface AuthRequest extends Request {
    user?: { id: number; email: string };
}

const authenticateToken = (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: "Please log in." });
    }

    jwt.verify(
        token,
        JWT_SECRET,
        (err: jwt.VerifyErrors | null, decoded: any) => {
            if (err) {
                return res.status(403).json({ error: "Invalid token." });
            }

            req.user = decoded as { id: number; email: string };
            next();
        },
    );
};

>>>>>>> Stashed changes
app.post("/api/register", async (req: Request, res: Response) => {
    const { name, email, password, studyType } = req.body;

    try {
<<<<<<< Updated upstream
        // Prüfen, ob der Benutzer bereits existiert
=======
>>>>>>> Stashed changes
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });
        if (existingUser) {
<<<<<<< Updated upstream
            return res.status(400).json({ error: "E-Mail wird bereits verwendet." });
        }

        // Passwort hashen (für mehr Sicherheit)
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // In der Datenbank speichern
=======
            return res.status(400).json({ error: "Email is already in use." });
        }

        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

>>>>>>> Stashed changes
        const user = await prisma.user.create({
            data: {
                name,
                email,
                passwordHash,
<<<<<<< Updated upstream
                // studyType: studyType // Falls im Prisma-Schema hinzugefügt
=======
                studyType: studyType || null
>>>>>>> Stashed changes
            }
        });

        res.status(201).json({
            success: true,
            user: { id: user.id, name: user.name, email: user.email }
        });
    } catch (error) {
<<<<<<< Updated upstream
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
=======
        console.error("Registration error:", error);
        res.status(500).json({ error: "Error saving user." });
    }
});

app.post("/api/login", async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials." });
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid credentials." });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
            expiresIn: "1h",
        });

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
            maxAge: 3600000,
        });

        res.json({
            success: true,
            message: "Login successful",
            user: { id: user.id, name: user.name, email: user.email }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Error during login." });
    }
});

app.post("/api/logout", (req: Request, res: Response) => {
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
    });
    res.json({ success: true, message: "Logout successful" });
});

app.get("/api/user", authenticateToken, async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
        return res.status(400).json({ error: "User ID not found in token." });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true, name: true, studyType: true },
        });
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }
        res.json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "Error fetching user." });
    }
});

app.get("/api/health", (_req: Request, res: Response) => {
    res.json({ ok: true, message: "Hello from our backend!" });
});

app.get("/api/userName", authenticateToken, async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        res.json({ userName: user?.name || "Unknown", userID: userId });
    } catch {
        res.json({ userName: "Unknown", userID: userId });
    }
});

app.get("/api/userPassword", authenticateToken, (_req: Request, res: Response) => {
    res.json({ password: "[SECRET_HIDDEN]" });
});

app.get("/api/getsession", authenticateToken, (req: AuthRequest, res: Response) => {
    res.json({ 
        sessionId: 123456, 
        duration: 25, 
        breakTime: 5, 
        starttime: Date.now(), 
        endtime: Date.now() + 30 * 60 * 1000, 
        date: new Date(), 
        progress: 80, 
        afterFeeling: "blue", 
        userId: req.user?.id || 123 
    });
});

app.listen(PORT, () => {
    console.log(`Backend Server running on http://localhost:${PORT}`);
>>>>>>> Stashed changes
});