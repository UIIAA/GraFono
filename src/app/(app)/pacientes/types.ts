export type Patient = {
    id: string;
    name: string;
    email: string;
    phone: string;
    status: string;
    imageUrl?: string;
    history: PatientHistoryEntry[];
    negotiatedValue?: number;
    financialSource?: string;
    insuranceName?: string;
    insuranceNumber?: string;
    authorizationStatus?: string;
    progress?: {
        completedSessions: number;
        cycleStart?: Date | string;
    };
    appointments?: { date: Date | string }[];
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
    financialSource?: string;
    patientId: string;
    tags: string[];
    nextReevaluation?: Date | string;
    patient: Patient;
};
