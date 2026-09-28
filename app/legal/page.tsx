import type { Metadata } from 'next';
import '@/styles/content.css';
import '@/styles/legal.css';
import Nav from '@/components/common/Nav';
import RevealInit from '@/components/common/RevealInit';
import SubNav from '@/components/common/SubNav';
import ContentModalProvider from '@/components/sections/content/ContentModals';
import LegalHero from '@/components/legal/LegalHero';
import LegalCourses from '@/components/legal/LegalCourses';
import LegalResources from '@/components/legal/LegalResources';
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
          {/* 서브내비 항목은 구현된 섹션까지만 노출한다 — 무동작 앵커를 만들지 않기 위해서다 */}
          <SubNav items={LEGAL_COPY.subnav.filter((s) => s.id === 'legal-courses' || s.id === 'legal-resources').map((s) => ({ ...s }))} />
          <LegalCourses />
          <LegalResources />
        </main>
      </ContentModalProvider>
    </div>
  );
}
