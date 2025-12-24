export type Patient = {
    id: string;
    name: string;
    email: string;
    phone: string;
    status: string;
    history: any[];
    negotiatedValue?: number;
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
