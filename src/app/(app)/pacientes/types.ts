export type Patient = {
    id: string;
    name: string;
    email: string;
    phone: string;
    status: string;
    history: PatientHistoryEntry[];
    negotiatedValue?: number;
};

export type PatientHistoryEntry = {
    id: string;
    content: string;
    date: Date | string;
};

export type Column = {
    id: string;
    title: string;
};

export type Task = {
    id: string;
    columnId: string;
    content: string;
    patientId: string;
    tags: string[];
};
