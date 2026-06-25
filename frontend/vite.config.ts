<<<<<<< Updated upstream
// frontend/vite.config.ts (Auszug)
import { defineConfig } from "vite";
=======
import { defineConfig } from "vitest/config";
>>>>>>> Stashed changes
import react from "@vitejs/plugin-react";
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
<<<<<<< Updated upstream
            // Leite alle Anfragen, die mit /api beginnen, an Port 3000 weiter
            "/api": "http://localhost:3000",
        },
    },
=======
            "/api": "http://localhost:3000",
        },
    },
    test: {
        environment: "jsdom",
        globals: true,
    },
>>>>>>> Stashed changes
});