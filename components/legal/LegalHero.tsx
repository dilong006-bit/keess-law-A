'use client';

import Link from 'next/link';
import { LEGAL_COPY, LEGAL_COURSES } from '@/data/legal';
import { useContentModal } from '@/components/sections/content/ContentModals';

/** 강점 3줄 체크 아이콘 — 기존 인라인 SVG·1.5 stroke 규칙 그대로 */
const IcCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

/**
 * LF3 히어로 — /content 히어로(.ct-hero)와 같은 패턴을 쓴다.
 * 배경 이미지는 없고 .ct-hero::before 의 P4 방사형 톤 + 스크림만 사용한다.
 * 모자이크 타일은 과정 섹션으로 가는 앵커다(미리보기는 라인업 카드에서만).
 */
export default function LegalHero() {
  const { openDownload } = useContentModal();
  const { hero } = LEGAL_COPY;

  return (
    <section className="ct-hero section" id="legal-hero">
      <div className="hero-scrim" />
      <div className="wrap">
        <div className="ct-hero-in">
          <div className="lg-hero-copy">
            <span className="ct-eyebrow">
              <span className="d" aria-hidden="true" />
              {hero.badge}
            </span>
            <h1>
              {hero.h1[0]}
              <br />
              <span className="hl">{hero.h1[1]}</span>
            </h1>
            <p className="lead">{hero.lead}</p>
            <ul className="lg-points">
              {hero.points.map((p) => (
                <li key={p}><IcCheck />{p}</li>
              ))}
            </ul>
            <div className="hero-cta">
              <a className="btn btn-ink" href="#legal-inquiry" data-ga-id="legal-hero-inquiry">
                {hero.ctaPrimary}
              </a>
              <button type="button" className="btn btn-glass" data-ga-id="legal-hero-brochure" onClick={() => openDownload()}>
                {hero.ctaSecondary}
              </button>
            </div>
          </div>

          <div className="lg-mosaic" role="list" aria-label="2026 법정필수교육 과정">
            {LEGAL_COURSES.map((c) => (
              <a className="lg-mosaic-tile" role="listitem" href="#legal-courses" key={c.id}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.thumb} alt="" loading="lazy" decoding="async" />
                <span className="lg-sr">{c.name}</span>
              </a>
            ))}
            <Link className="lg-mosaic-more" role="listitem" href={hero.moreTile.href}>
              <span>{hero.moreTile.t}</span>
              <span className="a">{hero.moreTile.a}</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
