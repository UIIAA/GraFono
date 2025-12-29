import { withAuth } from "next-auth/middleware";

export default withAuth({
    pages: {
        signIn: "/login",
    },
});

export const config = {
    // Protect all routes under /dashboard, /agenda, /pacientes, /financeiro, etc.
    // Exclude /api/auth, /login, /start (landing page if exists), /portal (public access for patients?)
    // For now, protecting the main app routes.
    matcher: [
        "/dashboard/:path*",
        "/agenda/:path*",
        "/pacientes/:path*",
        "/financeiro/:path*",
        "/configuracoes/:path*",
        "/relatorios/:path*",
        "/metricas/:path*",
        "/modelos/:path*"
    ],
};
