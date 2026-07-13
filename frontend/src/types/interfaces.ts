export interface User {
    id: number | string;
    name: string;
    email: string;
    password: string;
    studyType?: "sprinter" | "marathon" | "hero" | "";
}

export interface Session {
    duration: number;
    breakTime: number;
    starttime: string;
    endtime: string;
    progress: number;
    afterFeeling: "overwhelmed" | "flow" | "tired";
    userId: User["id"];
}

export interface SessionHistory {
    id: number | string;
    sessions: Session[];
    userId: User["id"];
}