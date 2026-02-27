import type { Metadata } from "next";
import { HeroSectionPremium } from "./_components/hero-section-premium";
import { BioSection } from "./_components/bio-section";
import { SpecialtiesGrid } from "./_components/specialties-grid";
import { MethodTimeline } from "./_components/method-timeline";
import { ValuesSection } from "./_components/values-section";
import { ResourcesGrid } from "./_components/resources-grid";
import { CtaSection } from "./_components/cta-section";

export const metadata: Metadata = {
    title: "Graciele Fonoaudiologia | Fonoaudiologia Infantil em Barueri",
    description:
        "Fonoaudióloga infantil especializada em desenvolvimento da fala, linguagem e comunicação. Atendimento humanizado em Barueri - SP. Agende uma avaliação.",
    keywords: [
        "fonoaudióloga infantil",
        "fonoaudiologia Barueri",
        "desenvolvimento da fala",
        "terapia da fala infantil",
        "atraso de linguagem",
        "fonoaudióloga pediátrica",
    ],
};

export default function InstitutionalHome() {
    return (
        <div className="flex flex-col w-full overflow-x-clip">
            <HeroSectionPremium />
            <BioSection />
            <SpecialtiesGrid />
            <MethodTimeline />
            <ValuesSection />
            <ResourcesGrid />
            <CtaSection />
        </div>
    );
}
