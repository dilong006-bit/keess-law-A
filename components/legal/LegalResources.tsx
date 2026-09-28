'use client';

import { LEGAL_CARDNEWS, LEGAL_COPY } from '@/data/legal';
import { useContentModal } from '@/components/sections/content/ContentModals';
import LegalCardNews from './LegalCardNews';

/**
 * LF5·LF6 자료 섹션 — 좌측 카드뉴스, 우측 자료 패널.
 * 이 섹션의 1차 행동은 소개서 받기다(페이지 1차 CTA 는 히어로의 도입 문의).
 */
export default function LegalResources() {
  const { openDownload } = useContentModal();
  const { resources } = LEGAL_COPY;

  return (
    <section className="section" id="legal-resources">
      <div className="wrap">
        <p className="eyebrow r">{resources.eyebrow}</p>
        <h2 className="sec-title r">{resources.title}</h2>
        <div className="lg-res r">
          <LegalCardNews slides={LEGAL_CARDNEWS} />
          <div className="lg-res-panel">
            <div className="lg-bro">
              <h3>{resources.brochureTitle}</h3>
              <p>{resources.brochureDesc}</p>
              <button
                type="button"
                className="btn btn-ink lg-bro-cta"
                data-ga-id="legal-res-brochure"
                onClick={() => openDownload('legalBrochure')}
              >
                {resources.brochureCta}
              </button>
            </div>
            <a className="lg-res-link" href="#legal-courses">{resources.previewLink}</a>
          </div>
        </div>
      </div>
    </section>
  );
}
