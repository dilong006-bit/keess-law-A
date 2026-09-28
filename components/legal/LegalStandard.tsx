import { AX5 } from '@/data/content';
import { LEGAL_COPY } from '@/data/legal';

/**
 * LF7 법정 기준 — 기존 AX5 데이터와 /content 의 마크업(.timeline/.lawgrid/.difftable)을 그대로 쓴다.
 * 연도별 시리즈는 시리즈명과 연도만 노출한다. AX5.timeline[].cc(외부 작품명)는 렌더하지 않는다.
 * 비교표는 640 이하에서 같은 데이터로 카드형(.lg-diff-m)을 그린다 — 데이터 이중 기재 없음.
 */
export default function LegalStandard() {
  return (
    <section className="section" id="legal-standard">
      <div className="wrap">
        <p className="eyebrow r">{LEGAL_COPY.standard.eyebrow}</p>
        <h2 className="sec-title r">{LEGAL_COPY.standard.title}</h2>

        <div className="substep">{AX5.seriesSub}</div>
        <div className="timeline r">
          {AX5.timeline.map((t) => (
            <div className={`tnode${t.cur ? ' cur' : ''}`} key={t.yr}>
              <div className="dot" />
              <div className="yr">{t.yr}</div>
              <div className="nm">{t.nm}</div>
              {t.cur && <div className="bn">현재 시리즈</div>}
            </div>
          ))}
        </div>

        <div className="substep">{AX5.lawSub}</div>
        <div className="lawgrid stagger">
          {AX5.laws.map((l) => (
            <div className="lawcard" key={l.h3}>
              <span className="must">의무</span>
              <h3>{l.h3}</h3>
              <div className="frow"><dt>근거</dt><dd>{l.근거}</dd></div>
              <div className="frow"><dt>대상</dt><dd>{l.대상}</dd></div>
              <div className="frow"><dt>주기</dt><dd>{l.주기}</dd></div>
            </div>
          ))}
        </div>

        <div className="substep">{AX5.diffSub}</div>
        {/* overflow-x:auto로 가로 스크롤을 의도한 3열 비교표 — 모바일 계측(C2) 예외 표식 */}
        <div className="difftable r" data-hscroll>
          <table>
            <thead><tr>{AX5.diffHead.map((h) => <th key={h}>{h}</th>)}</tr></thead>
            <tbody>{AX5.diff.map((r) => <tr key={r[0]}><td>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td></tr>)}</tbody>
          </table>
        </div>
        {/* 640 이하 전용 카드형 — 표와 같은 AX5.diff 에서 그린다 */}
        <div className="lg-diff-m">
          {AX5.diff.map((r) => (
            <div className="lg-diff-card" key={r[0]}>
              <p className="lg-diff-t">{r[0]}</p>
              <div className="lg-diff-row"><span className="k">{AX5.diffHead[1]}</span><span className="v">{r[1]}</span></div>
              <div className="lg-diff-row own"><span className="k">{AX5.diffHead[2]}</span><span className="v">{r[2]}</span></div>
            </div>
          ))}
        </div>
        <p className="samplenote">{AX5.note}</p>
      </div>
    </section>
  );
}
