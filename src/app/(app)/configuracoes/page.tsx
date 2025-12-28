import SettingsClient from "./_components/settings-client";

export default function ConfiguracoesPage() {
    return (
        <div className="min-h-screen p-8 bg-[url('/grid-pattern.svg')] bg-fixed bg-cover relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#fff1f2] via-[#fff7ed] to-white -z-10" />
            <SettingsClient />
        </div>
    );
}
