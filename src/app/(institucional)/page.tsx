"use client";

import { HeroSectionPremium } from "./_components/hero-section-premium";
import { BioSection } from "./_components/bio-section";
import { SpecialtiesGrid } from "./_components/specialties-grid";
import { MethodTimeline } from "./_components/method-timeline";
import { ValuesSection } from "./_components/values-section";
import { ResourcesGrid } from "./_components/resources-grid";
import { CtaSection } from "./_components/cta-section";

export default function InstitutionalHome() {
    return (
        <div className="flex flex-col w-full overflow-hidden">
            {/* 1. Hero: Cinematic Intro */}
            <HeroSectionPremium />

            {/* 2. Bio: The Specialist */}
            <BioSection />

            {/* 3. Specialties: Our Expertise */}
            <SpecialtiesGrid />

            {/* 4. Methodology: The Process with Scrollytelling */}
            <MethodTimeline />

            {/* 5. Values: Our Principles */}
            <ValuesSection />

            {/* 6. Resources: Educational Content */}
            <ResourcesGrid />

            {/* 7. CTA: Final Call to Action */}
            <CtaSection />
        </div>
    );
}
