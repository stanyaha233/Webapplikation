import express from "express";
import cors from "cors";
import type { Request, Response } from "express";

const app = express();
const PORT = 3000;
app.use(cors());
app.use(express.json());
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