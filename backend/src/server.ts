import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcrypt";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
export const prisma = new PrismaClient({ adapter });

const app = express();
const PORT = 3000;

app.use(cors({
    origin: "http://localhost:5173", // Frontend dev server
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

const JWT_SECRET = process.env.JWT_SECRET || "super-secure-jwt-secret-key-123456";

interface AuthRequest extends Request {
    user?: { id: number; email: string };
    session?: { id: number; duration: number; breakTime: number, starttime: number, endtime: number, date: Date, progress: number, afterFeeling: string, userId: number };

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

app.post("/api/register", async (req: Request, res: Response) => {
    const { name, email, password, studyType } = req.body;

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });
        if (existingUser) {
            return res.status(400).json({ error: "Email is already in use." });
        }

        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                passwordHash,
                studyType: studyType || null
            }
        });

        res.status(201).json({
            success: true,
            user: { id: user.id, name: user.name, email: user.email }
        });
    } catch (error) {
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



app.get("/api/sessions", authenticateToken, async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({ error: "Nicht autorisiert." });
    }

    try {
        const sessions = await prisma.session.findMany({
            where: { userId: userId },
            orderBy: { starttime: "desc" }
        });
        res.json(sessions);
    } catch (error) {
        console.error("Fehler beim Abrufen der Sessions:", error);
        res.status(500).json({ error: "Datenbankfehler beim Abrufen der Sessions." });
    }
});


app.post("/api/session", authenticateToken, async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id; // Der authentifizierte User aus dem JWT-Cookie
    if (!userId) {
        return res.status(401).json({ error: "Nicht autorisiert." });
    }
    const { duration, breakTime, starttime, endtime, progress, afterFeeling } = req.body;
    try {
        const newSession = await prisma.session.create({
            data: {
                duration: parseInt(duration) || 0,
                breakTime: parseInt(breakTime) || 0,
                starttime: starttime ? new Date(starttime) : new Date(),
                endtime: endtime ? new Date(endtime) : new Date(),
                progress: parseInt(progress) || 0,
                afterFeeling: afterFeeling || "flow",
                user: { connect: { id: userId } },
            },
        });
        res.status(201).json(newSession);
    } catch (error) {
        console.error("Fehler beim Speichern der Session:", error);
        res.status(500).json({ error: "Session konnte nicht gespeichert werden." });
    }
});
if (process.env.NODE_ENV !== "production") {
    app.listen(PORT, () => {
        console.log(`Backend Server running on http://localhost:${PORT}`);
    });
}
export default app;