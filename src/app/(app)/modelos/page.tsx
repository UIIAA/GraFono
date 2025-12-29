import { db } from "@/lib/db";
import TemplatesClient from "./_components/templates-client";
import { getTemplates } from "@/app/actions/template";
import { getProfessionalProfile } from "@/app/actions/settings";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ModelosPage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        redirect("/login");
    }

    const user = await db.user.findUnique({
        where: { email: session.user.email }
    });

    if (!user) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <div className="text-center">
                    <h1 className="text-xl font-bold">Usuário não encontrado.</h1>
                    <p className="text-slate-500">Faça login novamente.</p>
                </div>
            </div>
        );
    }

    // 2. Fetch Data
    const [templatesRes, profile] = await Promise.all([
        getTemplates(user.id),
        getProfessionalProfile(user.id)
    ]);

    const templates = templatesRes.success && templatesRes.data ? templatesRes.data : [];

    return (
        <div className="min-h-screen p-6 bg-slate-50/50">
            <TemplatesClient
                initialTemplates={templates}
                user={{
                    id: user.id,
                    name: user.name,
                    digitalSignature: user.digitalSignature,
                    crfa: user.crfa,
                    specialty: user.specialty,
                    address: user.address
                }}
            />
        </div>
    );
}
