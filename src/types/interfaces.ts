export interface User {
id: number | string
name: string;
email: string;
password: string ;
}

export interface Session {
    duration: number;
    breakTime: number;
    starttime: number;
    endtime: number;
    progress: number;
    afterFeeling : "red"|"blue"|"grey";
    userId: User["id"];
}