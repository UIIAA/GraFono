import { Sidebar } from "@/components/sidebar";
import { MobileSidebar } from "@/components/mobile-sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="h-full relative">
            <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80]">
                <Sidebar />
            </div>
            <main className="md:pl-72 h-full">
                {/* Mobile Header */}
                <div className="md:hidden flex items-center p-4 border-b bg-white/50 backdrop-blur-sm sticky top-0 z-50">
                    <MobileSidebar />
                    <span className="font-bold text-lg ml-2 text-slate-800">FonoIA</span>
                </div>
                {children}
            </main>
        </div>
    );
}
