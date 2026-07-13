// Basis-Funktion für alle API-Anfragen
export async function apiFetch(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(endpoint, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
        credentials: "include", // Für Cookies/Sessions
    });

    if (!response.ok) {
        const text = await response.text();
        let errorMsg = "Ein Fehler ist aufgetreten";
        try {
            const json = JSON.parse(text);
            errorMsg = json.error || errorMsg;
        } catch { }
        throw new Error(errorMsg);
    }

    return response.json();
}
