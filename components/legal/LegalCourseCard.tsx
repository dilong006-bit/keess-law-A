'use client';

import { useState } from 'react';
import { LEGAL_COPY, lawOf, previewUrl, type LegalCourse } from '@/data/legal';

/** 새 창 이동 아이콘 — 버튼이 새 탭으로 나간다는 사실을 아이콘으로도 표시한다 */
const IcExternal = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M14 4h6v6M20 4l-8.5 8.5M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
  </svg>
);

interface LegalCourseCardProps {
  course: LegalCourse;
}

/**
 * LF4 과정 카드. 카드 전체가 아니라 '미리보기' 버튼만 링크다 —
 * 새 탭으로 나가는 이동을 사용자가 분명히 인지한 상태에서만 누르게 한다(PRD LF4).
 * 법정 근거(대상·태그)는 AX5 에서 조회한 값이 있을 때만 표기한다(윤리경영·자금세탁은 근거 미확정).
 */
export default function LegalCourseCard({ course }: LegalCourseCardProps) {
  const [thumbFailed, setThumbFailed] = useState(false);
  const law = lawOf(course.lawKey);

  return (
    <article className="lg-card">
      <div className="lg-card-thumb">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={course.thumb} alt="" loading="lazy" decoding="async" onError={() => setThumbFailed(true)} />
        {thumbFailed && <span className="lg-card-fallback">{course.name}</span>}
      </div>
      <div className="lg-card-body">
        <div className="lg-card-tags">
          {law && <span className="lg-tag">{LEGAL_COPY.courses.tag}</span>}
        </div>
        <h3 className="lg-card-title">{course.name}</h3>
        {law && <p className="lg-card-meta">대상 {law.대상}</p>}
        <a
          className="btn-line-dark lg-card-cta"
          href={previewUrl(course.classkey)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${course.name} 미리보기 (새 창)`}
          data-ga-id={`legal-preview-${course.id}`}
        >
          {LEGAL_COPY.courses.preview}
          <IcExternal />
        </a>
      </div>
    </article>
  );
}
