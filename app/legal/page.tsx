import type { Metadata } from 'next';
import '@/styles/content.css';
import '@/styles/home.css';
import '@/styles/legal.css';
import Nav from '@/components/common/Nav';
import RevealInit from '@/components/common/RevealInit';
import SubNav from '@/components/common/SubNav';
import ContentModalProvider from '@/components/sections/content/ContentModals';
import LegalHero from '@/components/legal/LegalHero';
import LegalCourses from '@/components/legal/LegalCourses';
import LegalResources from '@/components/legal/LegalResources';
import LegalStandard from '@/components/legal/LegalStandard';
import LegalInquirySection from '@/components/legal/LegalInquirySection';
import { LEGAL_COPY } from '@/data/legal';

export const metadata: Metadata = {
  title: LEGAL_COPY.meta.title,
  description: LEGAL_COPY.meta.description,
};

export default function LegalPage() {
  return (
    <div className="tint-p4">
      <Nav current="legal" consultHref="#legal-inquiry" />
      <RevealInit />
      <ContentModalProvider>
        <main id="main" tabIndex={-1}>
          <LegalHero />
          <SubNav items={LEGAL_COPY.subnav.map((s) => ({ ...s }))} />
          <LegalCourses />
          <LegalResources />
          <LegalStandard />
          <LegalInquirySection />
        </main>
      </ContentModalProvider>
    </div>
  );
}
