// frontend/vite.config.ts (Auszug)
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            // Leite alle Anfragen, die mit /api beginnen, an Port 3000 weiter
            "/api": "http://localhost:3000",
        },
    },
});