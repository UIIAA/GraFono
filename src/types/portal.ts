export interface PatientPortalUser {
    id: string;
    name: string;
    email: string | null;
    avatarUrl?: string | null;
}

export interface NextAppointment {
    id: string;
    date: Date;
    time: string;
    type: string;
    professionalName: string;
}

export interface PatientFinancialSummary {
    pendingAmount: number;
    nextDueDate?: Date;
    hasOverdue: boolean;
}

export interface TreatmentProgressMetric {
    category: string;
    totalSessions: number;
    completedSessions: number;
    attendanceRate: number;
    progressPercentage: number; // 0-100 derived from goals or timeline
}

export interface PatientDashboardData {
    patient: PatientPortalUser;
    nextAppointment: NextAppointment | null;
    financial: PatientFinancialSummary;
    progress: TreatmentProgressMetric;
}
