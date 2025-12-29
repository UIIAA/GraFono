import { PatientDashboardData } from "@/types/portal";
import PortalDashboard from "./_components/portal-client";

export const dynamic = "force-dynamic";

// Mock Data Loader - In production this would come from the database based on the logged-in user
async function getPortalData(): Promise<PatientDashboardData> {
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
        patient: {
            id: "pt-123",
            name: "Alice Wonderland",
            email: "alice@example.com",
            avatarUrl: null
        },
        nextAppointment: {
            id: "apt-001",
            date: new Date(2025, 0, 15), // Jan 15, 2025
            time: "14:30",
            type: "Terapia de Fala",
            professionalName: "Graciele Costa",
            location: "Presencial" // Changed default to Presencial to test the hidden link logic
        },
        financial: {
            pendingAmount: 150.00,
            hasOverdue: true,
            nextDueDate: new Date(2025, 0, 20)
        },
        progress: {
            category: "Geral",
            totalSessions: 48,
            completedSessions: 12,
            attendanceRate: 92,
            progressPercentage: 25
        }
    };
}

export default async function PortalPage() {
    const data = await getPortalData();

    return <PortalDashboard data={data} />;
}
