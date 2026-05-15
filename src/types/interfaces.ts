export interface User {
    id: number | string;
    name: string;
    email: string;
    password: string ;
    studyType: '';
}

export interface Session {
    duration: number;
    breakTime: number;
    starttime: number;
    endtime: number;
    date: Date;
    progress: number;
    afterFeeling : "red"|"blue"|"grey";
    userId: User["id"];
}

export interface SessionHistory {
    id: number | string;
    sessions: Session[];
    userId: User["id"];
}