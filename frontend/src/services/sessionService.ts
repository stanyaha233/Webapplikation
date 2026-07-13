import { apiFetch } from "./apiClient";

export interface SessionData {
    duration: number;
    breakTime: number;
    starttime: string;
    endtime: string;
    progress: number;
    afterFeeling: string;
}

export const sessionService = {
    // Session speichern
    saveSession: async (data: SessionData) => {
        return apiFetch("/api/session", {
            method: "POST",
            body: JSON.stringify(data),
        });
    },

    getSessions: async () => {
        return apiFetch("/api/sessions");
    }
};
