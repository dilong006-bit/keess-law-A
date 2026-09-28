import { LEGAL_COPY, LEGAL_COURSES } from '@/data/legal';
import LegalCourseCard from './LegalCourseCard';

/** LF4 과정 라인업 — 표시 순서는 data/legal.ts 의 배열 순서 그대로(고정) */
export default function LegalCourses() {
  const { courses } = LEGAL_COPY;
  return (
    <section className="section" id="legal-courses">
      <div className="wrap">
        <p className="eyebrow r">{courses.eyebrow}</p>
        <h2 className="sec-title r">{courses.title}</h2>
        <p className="lg-sec-sub r">{courses.sub}</p>
        <div className="lg-grid stagger">
          {LEGAL_COURSES.map((c) => (
            <LegalCourseCard course={c} key={c.id} />
          ))}
        </div>
        <p className="samplenote">{courses.note}</p>
      </div>
    </section>
  );
}
