# 기술명세서: KEESS 법정필수교육 노출 A안 (/legal)

| 항목 | 내용 |
|------|------|
| **Version** | 1.0 |
| **상위 문서** | ref/legal/PRD_KEESS_26827_legal-A_v1.0.md (LF1~LF11) |
| **준수 기준** | CLAUDE.md, ref/design/Design.md, ref/spec/KEESS_모바일대응_고도화_기술명세서_및_프롬프트_v1.0_260810.md |
| **스택** | Next 14 App Router, TypeScript, Tailwind 3.4 + 전역 CSS 토큰, Pretendard self-host |
| **작성일** | 2026-09-28 |

---

## 0. 절대 규칙 (위반 시 작업 중단 후 보고)

1. **발명 금지:** 신규 색·폰트·섀도·라운드·브레이크포인트·버튼 변형 금지. `var(--*)` 토큰과 기존 클래스(`.btn`, `.btn-ink`, `.btn-line-dark`, `.section`, `.wrap`, `.eyebrow`, `.sec-title`, `.lawcard`, `.difftable`, `.ct-hero`)만 사용
2. **브레이크포인트:** 1040 / 940 / 880 / 820 / 760 / 740 / 720 / 640 / 560 만 사용 (`max-width` 기준). 1041~1280 GNB 실측에서 부족하면 코드 수정 전에 보고
3. **원 소스 반응형:** 기기별 컴포넌트·페이지 분기 금지. JS 분기는 `matchMedia`로 동작만
4. **공통 컴포넌트 수정은 선택 prop 추가만:** 기존 호출부(홈, /kium, /content)의 동작·마크업 불변
5. **hover는 `@media (hover:hover) and (pointer:fine)` 안에서만**
6. **`prefers-reduced-motion: reduce` 대응 필수**
7. **카피는 PRD·이 문서 확정본 그대로.** 대시 문자, 느낌표 반복, 반말 금지
8. **외부 작품명(지구오락실, 지구마블, K-POP Demon Hunters) /legal 노출 금지**
9. **백엔드 추가 금지.** 제출은 기존 `submitInquiry` 경로

---

## 1. 파일 맵

| 구분 | 경로 | LF |
|---|---|---|
| 신규 | `data/legal.ts` | 공통 |
| 신규 | `app/legal/page.tsx` | LF2 |
| 신규 | `components/legal/LegalHero.tsx` | LF3 |
| 신규 | `components/legal/LegalCourses.tsx` | LF4 |
| 신규 | `components/legal/LegalCourseCard.tsx` | LF4 |
| 신규 | `components/legal/LegalCardNews.tsx` | LF5 |
| 신규 | `components/legal/LegalResources.tsx` | LF5, LF6 |
| 신규 | `components/legal/LegalStandard.tsx` | LF7 |
| 신규 | `components/legal/LegalCourseField.tsx` | LF8 |
| 신규 | `styles/legal.css` | 전체 |
| 신규 | `public/images/legal/{harassment,sexual,disability,ethics,pension,privacy,aml}.jpg` | LF3, LF4 (임시 370×207, 제공됨) |
| 신규 | `scripts/verify-legal.mjs` | LF10 |
| 수정 | `data/nav.ts` | LF1 |
| 수정 | `components/common/Nav.tsx` | LF1 |
| 수정 | `styles/components.css` (`.nav-chip` 변형·축약 라벨) | LF1 |
| 수정 | `components/sections/home/HomeInquiry.tsx` (선택 prop `courseField`) | LF8 |
| 수정 | `components/sections/content/ContentModals.tsx` (다운로드 자산 선택 prop) | LF6 |
| 수정 | `components/sections/content/Sections.tsx` (#ax5 하단 링크 1개) | LF9 |

---

## 2. 데이터 (`data/legal.ts`)

```ts
import { AX5 } from '@/data/content';

export type LegalCourseId =
  | 'harassment' | 'sexual' | 'disability' | 'ethics' | 'pension' | 'privacy' | 'aml';

export interface LegalCourse {
  id: LegalCourseId;
  order: number;
  name: string;           // 카드·접근성 라벨용 정식명
  option: string;         // 희망과정 체크박스 라벨
  classkey: string;
  thumb: string;
  lawKey: string | null;  // AX5.laws[].h3 와 일치할 때만 값, 없으면 null
}

export const LEGAL_COURSES: readonly LegalCourse[] = [
  { id: 'harassment', order: 1, name: '법정헌터스 직장 내 괴롭힘 예방 교육편', option: '직장 내 괴롭힘 예방 교육', classkey: '403888', thumb: '/images/legal/harassment.jpg', lawKey: '직장 내 괴롭힘 예방' },
  { id: 'sexual',     order: 2, name: '법정헌터스 성희롱 예방 교육편',         option: '성희롱 예방 교육',         classkey: '403886', thumb: '/images/legal/sexual.jpg',     lawKey: '성희롱 예방' },
  { id: 'disability', order: 3, name: '법정헌터스 장애인 인식개선 교육편',     option: '장애인 인식개선 교육',     classkey: '403887', thumb: '/images/legal/disability.jpg', lawKey: '장애인 인식개선' },
  { id: 'ethics',     order: 4, name: '법정헌터스 윤리경영 교육편',            option: '윤리경영 교육',            classkey: '403890', thumb: '/images/legal/ethics.jpg',     lawKey: null },
  { id: 'pension',    order: 5, name: '법정헌터스 퇴직연금가입자 교육편',      option: '퇴직연금 가입자 교육',     classkey: '403889', thumb: '/images/legal/pension.jpg',    lawKey: '퇴직연금' },
  { id: 'privacy',    order: 6, name: '[김경식×with.선] 개인정보보호 및 정보보안교육', option: '개인정보보호 및 정보보안 교육', classkey: '404463', thumb: '/images/legal/privacy.jpg', lawKey: '개인정보보호' },
  { id: 'aml',        order: 7, name: '꼭 알아야 하는 자금세탁방지법',          option: '자금세탁방지 교육',        classkey: '404905', thumb: '/images/legal/aml.jpg',        lawKey: null },
];

/** KGESA 오픈 시 이 함수만 교체 */
export const previewUrl = (classkey: string) =>
  `https://samplezone.campus21.co.kr/classpreview.asp?classkey=${classkey}`;

/** lawKey → AX5.laws 조회 (값 재기입 금지) */
export const lawOf = (key: string | null) => (key ? AX5.laws.find((l) => l.h3 === key) ?? null : null);
```

### 희망과정 옵션 표시 순서 (PC 2열 가로 읽기 순서)
`직장 내 괴롭힘 예방 교육 → 장애인 인식개선 교육 → 성희롱 예방 교육 → 윤리경영 교육 → 퇴직연금 가입자 교육 → 개인정보보호 및 정보보안 교육 → 자금세탁방지 교육 → 기타`

```ts
export const LEGAL_COURSE_OPTIONS = [
  '직장 내 괴롭힘 예방 교육', '장애인 인식개선 교육', '성희롱 예방 교육', '윤리경영 교육',
  '퇴직연금 가입자 교육', '개인정보보호 및 정보보안 교육', '자금세탁방지 교육',
] as const;
export const LEGAL_ETC_MAX = 50;
```

### 카피 상수 (확정본, 변경 금지)

```ts
export const LEGAL_COPY = {
  meta: { title: '2026 법정필수교육 | KEESS', description: '성희롱 예방부터 자금세탁방지까지 2026년 최신 법정필수교육. 과정 미리보기, 과정소개서, 도입 문의를 한 곳에서.' },
  hero: {
    badge: '2026 법정필수교육',
    h1: ['법정필수교육,', 'KG에듀원에서 한 번에'],
    lead: '연 1회 이상 받아야 하는 재직자 필수 교육을 최신 콘텐츠로 준비했습니다. 과정 확인부터 운영까지 한 곳에서 관리하세요.',
    points: ['연 1회 이상 의무 이수 대상 과정', '매년 자체 제작하는 2026년 최신 콘텐츠', '권장교육까지 기업 맞춤 구성'],
    ctaPrimary: '도입 문의하기',
    ctaSecondary: '과정소개서 받기',
    moreTile: { t: '권장교육 과정도 함께', a: '전체 과정 리스트 보기', href: '/content#download' },
  },
  subnav: [
    { id: 'legal-courses', label: '과정 라인업' },
    { id: 'legal-resources', label: '자료' },
    { id: 'legal-standard', label: '법정 기준' },
    { id: 'legal-inquiry', label: '도입 문의' },
  ],
  courses: {
    eyebrow: 'Courses', title: '2026 법정필수교육 과정', sub: '과정별 미리보기로 콘텐츠를 먼저 확인해 보세요.',
    tag: '법정의무', preview: '미리보기',
    note: '미리보기는 새 창에서 열립니다. 맛보기 강의는 연결된 페이지의 \'맛보기 강의\' 버튼으로 재생됩니다.',
  },
  resources: {
    eyebrow: 'Resources', title: '카드뉴스와 과정소개서',
    cardNewsLabel: '법정교육 카드뉴스', placeholder: '디자인 재제작 예정',
    brochureTitle: '(KG에듀원) 2026 법정필수교육 과정소개서',
    brochureDesc: '과정 구성, 학습 목표, 강사 정보를 한 번에 확인할 수 있습니다. 간단한 정보 입력 후 바로 받아보세요.',
    brochureCta: '과정소개서 받기',
    previewLink: '과정 미리보기로 이동',
  },
  standard: { eyebrow: 'Compliance', title: '법정 기준은 정확하게, 콘텐츠는 매년 새롭게' },
  inquiry: {
    panelTitle: ['매년 받는 법정교육,', 'KG에듀원에서 한 번에 관리하세요'],
    panelBody: '우리 기업에 필요한 법정교육을 한 번에 안내합니다. 문의를 남겨주시면 담당자가 영업일 기준 1일 내 회신드립니다.',
    fieldLabel: '희망과정', etcLabel: '기타', etcPlaceholder: '희망 과정을 입력해 주세요',
    errRequired: '희망과정을 1개 이상 선택해 주세요.', errEtc: '기타 과정명을 입력해 주세요.',
  },
  contentLink: '법정필수교육 과정·미리보기 전체 보기',
} as const;
```

### 카드뉴스 데이터
```ts
export const LEGAL_CARDNEWS: { src: string | null; alt: string }[] =
  Array.from({ length: 7 }, (_, i) => ({ src: null, alt: `법정교육 카드뉴스 ${i + 1} / 7` }));
// 재제작본 수령 시 src만 '/images/legal/cardnews-0N.jpg' 로 교체 (1080×1350)
```

---

## 3. LF1 GNB 법정 칩

### data/nav.ts
```ts
export interface EventChip { key: 'kium' | 'legal'; label: string; shortLabel: string; href: string; tone: 'p2' | 'p4'; gaId: string }
export const EVENT_CHIPS: readonly EventChip[] = [
  { key: 'kium',  label: '인재키움 프리미엄',   shortLabel: '인재키움', href: '/kium',  tone: 'p2', gaId: 'nav-kium' },
  { key: 'legal', label: '2026 법정필수교육', shortLabel: '법정필수', href: '/legal', tone: 'p4', gaId: 'nav-legal' },
];
/** 하위호환: 기존 참조 유지 */
export const EVENT_CHIP = EVENT_CHIPS[0];
```
- 인재키움 칩의 기존 색·NEW 표기·반짝임·배지 로직은 그대로 (tone 'p2'는 현재 스타일을 의미하는 식별자일 뿐, 스타일 변경 금지)
- 법정 칩: NEW 표기 없음, 반짝임 없음 (칩 2개가 동시에 반짝이는 경쟁 방지)

### Nav.tsx
- 데스크톱: `EVENT_CHIPS.map` 렌더, 순서 인재키움 → 법정
- 각 칩 내부: `<span className="chip-full">{label}</span><span className="chip-short" aria-hidden="true">{shortLabel}</span>`, 링크에 `aria-label={label}`
- 현재 경로가 칩 href면 `aria-current="page"`
- 드로어: 두 칩 모두 전체 라벨, 각 44px 이상

### CSS (components.css 추가분)
```css
.nav-chip.tone-p4{background-color:color-mix(in srgb,var(--p4) 88%,#000)}
@media (hover:hover) and (pointer:fine){.nav-chip.tone-p4:hover{background-color:color-mix(in srgb,var(--p4) 78%,#fff)}}
.nav-chip .chip-short{display:none}
@media(max-width:1040px){.nav-chip .chip-full{display:none}.nav-chip .chip-short{display:inline}}
.nav-chip[aria-current="page"]{box-shadow:inset 0 0 0 2px rgba(255,255,255,.7)}
```
- 941px 이하는 기존 규칙으로 데스크톱 칩 영역 숨김, 드로어 사용

### 실측 게이트 (구현 직후)
- 1041, 1100, 1180, 1280px에서 `.nav` 내부 요소 줄바꿈·겹침 검사
- 실패 시 코드 수정 중단, 결과 보고 (브레이크포인트 개정 필요 여부 결정 대기)

---

## 4. LF2 라우트 (`app/legal/page.tsx`)

```tsx
import type { Metadata } from 'next';
import '@/styles/content.css';   // .ct-hero, .lawcard, .difftable, 다운로드 모달 재사용
import '@/styles/home.css';      // HomeInquiry 스타일 (/kium과 동일 방식)
import '@/styles/legal.css';
// Nav, RevealInit, SubNav, ContentModalProvider, HomeInquiry, Legal* import
export const metadata: Metadata = { title: LEGAL_COPY.meta.title, description: LEGAL_COPY.meta.description };

export default function LegalPage() {
  return (
    <div className="tint-p4">
      <Nav current="legal" consultHref="#legal-inquiry" />
      <RevealInit />
      <ContentModalProvider>
        <main id="main" tabIndex={-1}>
          <LegalHero />
          <SubNav items={[...LEGAL_COPY.subnav]} />
          <LegalCourses />
          <LegalResources />
          <LegalStandard />
          <LegalInquirySection />   {/* HomeInquiry 래핑, id="legal-inquiry" */}
        </main>
      </ContentModalProvider>
    </div>
  );
}
```
- `NavKey`에 `'legal'` 추가 (NAV_ITEMS에는 추가하지 않음, 메뉴 활성 표시 없음)
- Footer는 layout 공통

---

## 5. LF3 히어로 (`LegalHero`)

### 구조
```
section.ct-hero.section#legal-hero
  .hero-scrim
  .wrap > .ct-hero-in
    div.lg-hero-copy
      span.ct-eyebrow > span.d + badge
      h1 (2줄, 두 번째 줄 .hl)
      p.lead
      ul.lg-points > li x3 (체크 SVG 1.5 stroke)
      .hero-cta > a.btn.btn-ink(#legal-inquiry) + button.btn.btn-glass(openDownload('legal'))
    div.lg-mosaic (role="list", aria-label="2026 법정필수교육 과정")
      a.lg-mosaic-tile x7 (href="#legal-courses", 썸네일 + 시각적 숨김 과정명)
      a.lg-mosaic-more (moreTile)
```
- `.ct-hero` 배경 이미지 없음, `.ct-hero::before` P4 방사형 톤 그대로 사용
- 모자이크 타일은 과정 섹션으로 이동하는 앵커 (미리보기는 라인업에서만)

### CSS
```css
.lg-points{margin-top:22px;display:grid;gap:10px}
.lg-points li{display:flex;gap:10px;align-items:flex-start;font-size:15px;color:rgba(255,255,255,.9);word-break:keep-all}
.lg-mosaic{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}
.lg-mosaic-tile,.lg-mosaic-more{aspect-ratio:16/9;border-radius:12px;overflow:hidden;position:relative}
.lg-mosaic-tile img{width:100%;height:100%;object-fit:cover}
.lg-mosaic-more{display:flex;flex-direction:column;justify-content:center;padding:10px 12px;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.28);color:#fff;font-size:12.5px;font-weight:700}
@media(max-width:880px){.lg-mosaic{order:2}}
@media(max-width:640px){.hero-cta{display:grid;grid-template-columns:1fr;gap:10px}.hero-cta .btn{width:100%;min-height:48px}}
```
- `.ct-hero` 기존 `min-height:88vh`는 /legal에서 `min-height:auto` + 상하 패딩으로 조정 (`#legal-hero.ct-hero{min-height:auto;padding-top:140px;padding-bottom:84px}`, 640 이하 `padding-top:112px;padding-bottom:60px`)
- 390px 첫 화면에 H1과 1차 CTA 노출 확인 (모자이크는 CTA 아래)

---

## 6. LF4 과정 라인업

### LegalCourseCard 계약
```ts
interface LegalCourseCardProps { course: LegalCourse }
```
```
article.lg-card
  .lg-card-thumb (aspect-ratio:16/9) > Img(src, alt="", loading lazy) + 실패 시 .lg-card-fallback
  .lg-card-body
    .lg-card-tags > span.lg-tag (lawOf(lawKey) 있을 때만 '법정의무')
    h3.lg-card-title (2줄 말줄임)
    p.lg-card-meta (lawOf 있을 때: '대상 ' + 대상)
    a.btn.btn-line-dark.lg-card-cta
      href=previewUrl(classkey) target="_blank" rel="noopener noreferrer"
      aria-label="{name} 미리보기 (새 창)" data-ga-id="legal-preview-{id}"
      '미리보기' + 새창 아이콘 SVG
```

### 그리드
```css
.lg-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;margin-top:34px}
@media(max-width:1040px){.lg-grid{grid-template-columns:repeat(3,1fr)}}
@media(max-width:880px){.lg-grid{grid-template-columns:repeat(2,1fr);gap:14px}}
@media(max-width:560px){
  .lg-grid{grid-template-columns:1fr;gap:12px}
  .lg-card{display:grid;grid-template-columns:40% 1fr;align-items:stretch}
  .lg-card-thumb{aspect-ratio:auto;height:100%;min-height:96px}
}
.lg-card{background:#fff;border:1px solid var(--line);border-radius:var(--r);overflow:hidden;box-shadow:var(--shadow-1);display:flex;flex-direction:column}
.lg-card-body{padding:16px 16px 18px;display:flex;flex-direction:column;gap:8px;flex:1}
.lg-card-title{font-size:15px;font-weight:800;line-height:1.45;word-break:keep-all;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.lg-card-cta{margin-top:auto;min-height:44px;width:100%}
.lg-tag{font-size:11px;font-weight:800;color:var(--p4);background:color-mix(in srgb,var(--p4) 10%,#fff);border-radius:6px;padding:3px 9px}
@media (hover:hover) and (pointer:fine){.lg-card{transition:transform .3s var(--ease),box-shadow .4s var(--ease)}.lg-card:hover{transform:translateY(-3px);box-shadow:var(--shadow-2)}}
```
- 560 이하 가로형에서 버튼은 본문 하단, 전체 폭
- 섹션 하단 `p.samplenote`에 courses.note

---

## 7. LF5·LF6 자료 섹션 (`LegalResources`)

### 레이아웃
```css
.lg-res{display:grid;grid-template-columns:minmax(0,480px) 1fr;gap:40px;align-items:start;margin-top:34px}
@media(max-width:880px){.lg-res{grid-template-columns:1fr;justify-items:center}.lg-res>*{width:100%;max-width:480px}}
```
- 우측 자료 패널: 소개서 카드(제목, 설명, `btn-ink` '과정소개서 받기'), 보조 링크 '과정 미리보기로 이동'(#legal-courses)
- 이 섹션의 1차 버튼은 소개서 받기 (페이지 1차는 히어로 문의)

### LegalCardNews 계약
```ts
interface LegalCardNewsProps { slides: { src: string | null; alt: string }[]; intervalMs?: number } // 기본 5000
```
- 마크업: `section[aria-roledescription="carousel"][aria-label="법정교육 카드뉴스"]` > 트랙 > `div[role="group"][aria-roledescription="slide"][aria-label="n / 7"]`
- 비율 박스 `aspect-ratio:4/5`, 너비 100% (최대 480px)
- `src === null` → 자리 표시: 점선 테두리(`var(--line)`), 중앙 텍스트 `카드뉴스 0n / 07`, 하단 `디자인 재제작 예정`
- 컨트롤: 이전·다음 버튼(44×44), 점 7개(버튼, 각 탭 영역 44px 확보), 일시정지 상태 표시 불필요 (자동 정지 규칙으로 대체)
- 상태 안내: `div[aria-live="polite"]` 시각적 숨김, 자동 전환 중에는 `off`, 사용자 조작 시 `polite`
- 동작 규칙

| 입력 | 동작 |
|---|---|
| 자동 | 5초 간격, IntersectionObserver 가시 30% 이상일 때만, 탭 비활성 시 정지 |
| 마우스 | 트랙 위에 있으면 정지 (fine pointer만) |
| 터치 | pointerdown 동안 정지, 가로 이동 40px 이상이면 이전·다음, 세로 스크롤 우선 (`touch-action:pan-y`) |
| 키보드 | 슬라이더 포커스 시 정지, ←/→ 이동 |
| reduced-motion | 자동 전환 없음, 전환 애니메이션 없음 |

- 전환: `transform: translateX()` 0.45s `var(--ease)`, 1초 초과 금지
- JS 미동작 시 첫 장만 표시

### LF6 다운로드 모달 일반화 (ContentModals.tsx)
- `openDownload(asset?: 'courseList' | 'legalBrochure')` 로 확장, 기본값 `'courseList'` → /content 기존 호출 불변
- 자산 설정
```ts
const DOWNLOAD_ASSETS = {
  courseList:    { kind: '과정리스트', ...DOWNLOAD_CONFIG },                  // 기존 그대로
  legalBrochure: { kind: '법정 과정소개서', FILE_URL: null, FILE_NAME: 'KG에듀원_2026_법정필수교육_과정소개서.pdf', FILE_SIZE_LABEL: 'PDF' },
} as const;
```
- `FILE_URL === null` → 제출 성공 후 다운로드 단계 생략, 문구 `자료 준비 중입니다. 입력하신 이메일로 보내드립니다.`
- 제출 payload에 `material: kind` 추가 (기존 mock 경로, 필드명 기존 lead 구조와 충돌 없음 확인 후 적용)
- 표시 방식: 기존 모달 그대로, 640 이하에서 바텀시트 규칙이 기존에 없으면 모바일대응 명세의 바텀시트 패턴 적용 (`max-height:92dvh`, 하단 `env(safe-area-inset-bottom)`)

---

## 8. LF7 법정 기준 (`LegalStandard`)
- 데이터: `AX5.timeline`(nm, yr, cur만), `AX5.laws`, `AX5.diffHead`, `AX5.diff`, `AX5.note`
- **`cc` 필드는 렌더하지 않음** (외부 작품명)
- 마크업: 기존 `.timeline/.tnode`, `.lawgrid/.lawcard`, `.difftable` 재사용
- 모바일 보강 (legal.css, /legal 범위로 한정 `#legal-standard` 선택자)
```css
@media(max-width:640px){
  #legal-standard .difftable{border:none;overflow:visible}
  #legal-standard .difftable table,#legal-standard .difftable thead{display:none}
  #legal-standard .lg-diff-m{display:grid;gap:10px}
}
#legal-standard .lg-diff-m{display:none}
```
- `.lg-diff-m`: 항목별 블록 (항목명 / 일반 교육 / KG에듀원 3행), 640 이하에서만 표시. 같은 데이터에서 렌더 (원 소스, 데이터 이중 기재 없음)
- 법정 카드 그리드는 기존 반응형(940 이하 2열) 유지, /legal에서 560 이하 1열 추가

---

## 9. LF8 법정 문의 폼

### HomeInquiry 선택 prop
```ts
interface CourseFieldConfig {
  label: string;
  options: readonly string[];
  etcLabel: string;
  etcPlaceholder: string;
  etcMax: number;
  errRequired: string;
  errEtc: string;
}
// HomeInquiryProps 에 추가
courseField?: CourseFieldConfig;
panel?: { title: readonly string[]; body: string };   // 좌측 안내 패널 카피 교체 (미지정 시 기존)
```
- `courseField` 미지정 시 기존 렌더·검증·payload 100% 동일
- 렌더 위치: 관심 영역 칩 다음, 문의 내용 위
- 컴포넌트: `LegalCourseField` (fieldset + legend, 체크박스 8개, 기타 입력)

### 직렬화
```ts
const picked = options.filter((o) => sel[o]);
const etc = etcOn ? etcText.trim() : '';
const token = `[희망과정: ${[...picked, ...(etc ? [`기타(${etc})`] : [])].join('·')}]`;
message = `${token}\n${v.message.trim()}`.trim();
```
- 문의 내용 최대 길이: 기존 `INQ_MAX.message` 유지, 입력 가능 길이 = `INQ_MAX.message - token.length - 1` (카운터도 이 값 기준)
- 기존 프리필 제거 규칙(`PREFILL_STRIP`)에 `\[희망과정: [^\]]*\]\n?` 추가

### 검증
| 케이스 | 결과 |
|---|---|
| 0개 선택 | fieldset 오류 문구 errRequired, 첫 체크박스 포커스 |
| 기타만 체크, 빈칸 | 입력칸 오류 errEtc, 입력칸 포커스 |
| 기타 51자 | maxLength 50으로 입력 차단 |
| 선택 후 해제 | 오류 즉시 재평가 |
| 정상 | 기존 성공 화면 |
- 오류 해제는 입력 즉시 (기존 라이브 인라인 검증 규칙)
- 제출 시 오류 포커스 순서: 기존 필드 → 희망과정 → 동의

### 호출 (/legal)
```tsx
<section className="section" id="legal-inquiry">
  <HomeInquiry
    presetInterests={['compliance']}
    leadSource="legal"
    courseField={{ label, options: LEGAL_COURSE_OPTIONS, etcLabel, etcPlaceholder, etcMax: LEGAL_ETC_MAX, errRequired, errEtc }}
    panel={{ title: LEGAL_COPY.inquiry.panelTitle, body: LEGAL_COPY.inquiry.panelBody }}
  />
</section>
```

### 반응형
```css
.lg-course-field{display:grid;grid-template-columns:1fr 1fr;gap:4px 16px}
.lg-course-field label{display:flex;align-items:center;gap:10px;min-height:44px;font-size:14.5px;cursor:pointer}
.lg-course-field input[type=checkbox]{width:20px;height:20px;flex:none;accent-color:var(--ink)}
.lg-etc-input{font-size:16px}
@media(max-width:560px){.lg-course-field{grid-template-columns:1fr}}
```
- '기타' 항목: 560 초과에서는 체크박스 오른쪽 인라인 입력, 560 이하에서는 체크박스 아래 전체 폭
- 입력칸 전부 16px 이상 (iOS 확대 방지)

---

## 10. LF9 /content 연결
- `Sections.tsx` #ax5 `samplenote` 다음에 `<a className="btn-line-dark" href="/legal" data-ga-id="content-to-legal">{LEGAL_COPY.contentLink}</a>` 1개
- 그 외 #ax5 변경 없음

---

## 11. LF10 반응형 검증 (`scripts/verify-legal.mjs`)

### 실행
- `npm run build && npm run start` 후 Playwright로 `/legal`, `/`, `/kium`, `/content` 검사
- 기준 폭: 1920, 1440, 1280, 1180, 1024, 820, 768, 390, 360 (390·360은 `hasTouch:true, isMobile:true`)
- 경계 폭: 1041/1040, 941/940, 881/880, 641/640, 561/560

### 자동 검사 항목
| 항목 | 판정 |
|---|---|
| 가로 스크롤 | `document.documentElement.scrollWidth <= innerWidth` (`[data-hscroll]` 내부 제외) |
| GNB 한 줄 | `.nav` 자식 요소들의 top 값 편차 4px 이내 (941px 이상) |
| 겹침 | `.nav` 내 칩·메뉴·CTA 박스 교차 없음 |
| 터치 영역 | 390·360에서 `a,button,input[type=checkbox],label` 표시 요소 44×44 이상 (인라인 텍스트 링크 제외 목록 관리) |
| 입력 글자 | `input,select,textarea` computed font-size 16px 이상 (390·360) |
| 이미지 비율 | `.lg-card-thumb, .lg-mosaic-tile, [aria-roledescription=slide]` 로드 전후 높이 동일 |
| 미리보기 링크 | 7개 `target=_blank`, rel에 `noopener`, href classkey 일치 |
| 외부 작품명 | /legal 본문에 '지구오락실', '지구마블', 'Demon Hunters' 0건 |
| 폼 | §9 검증 5케이스 + 제출 payload message 토큰 확인 |
| 회귀 | 홈·/kium 문의 폼에 희망과정 필드 없음, 제출 payload 기존과 동일 |
| 모션 | `reducedMotion:'reduce'`에서 6초 후 슬라이드 인덱스 불변 |

### 캡처
- `test-results/legal/{width}.png` 전체 페이지, full-page-screenshot 스킬 사용
- 요청자 비교용: 1280·1024·390 GNB 확대 캡처 별도 저장

### 실기기 (최종 1회, 수동)
- iPhone Safari, Android Chrome, iPad Safari 가로·세로
- 확인: 드로어 칩, 슬라이더 스와이프, 바텀시트, 키보드 올라온 상태의 제출 버튼

---

## 12. LF11 측정 태깅
| 요소 | data-ga-id |
|---|---|
| GNB 법정 칩 (데스크톱/드로어) | `nav-legal` / `drawer-legal` |
| 히어로 1차·2차 CTA | `legal-hero-inquiry` / `legal-hero-brochure` |
| 미리보기 | `legal-preview-{id}` |
| 자료 섹션 소개서 버튼 | `legal-res-brochure` |
| 소개서 제출 | `legal-brochure-submit` |
| 문의 제출 | 기존 폼 제출 id + lead_source `legal` |

---

## 13. 커밋 계획 (브랜치 `feat/legal-a`, 원격 `law-a`)

| # | 커밋 | 포함 | 커밋 전 확인 |
|---|---|---|---|
| 1 | chore(legal): 법정 데이터·임시 썸네일 | data/legal.ts, public/images/legal/* | 타입 검사 |
| 2 | feat(nav): 이벤트 칩 배열화·법정 칩·폭별 라벨 (노출 A안) | nav.ts, Nav.tsx, components.css, NavKey | 1041·1180·1280·1040·940·390 실측, 본문에 결과 기록 |
| 3 | feat(legal): /legal 라우트·히어로·과정 라인업 | page.tsx, LegalHero, LegalCourses, LegalCourseCard, legal.css | 390·1440 |
| 4 | feat(legal): 카드뉴스 슬라이더·소개서 다운로드 | LegalResources, LegalCardNews, ContentModals | 390·1440, /content 다운로드 회귀 |
| 5 | feat(legal): 법정 기준 (외부 작품명 제외) | LegalStandard, legal.css | 390·1440 |
| 6 | feat(inquiry): 희망과정 선택 필드·/legal 문의 | HomeInquiry, LegalCourseField | 390·1440, 홈·/kium 회귀 |
| 7 | chore(content): #ax5 → /legal 링크 | Sections.tsx | 390·1440 |
| 8 | test(legal): 반응형·폼 검증 스크립트와 결과 | scripts/verify-legal.mjs, test-results/legal | 전 항목 통과 |

- 각 커밋 전 `npm run lint`, `npx tsc --noEmit`
- 푸시: `git push law-a feat/legal-a`

---

## 14. 완료 정의 (DoD)
- PRD LF1~LF8, LF10 Done 조건 충족
- §11 자동 검사 전 항목 통과, 9폭 캡처 저장
- 홈·/kium·/content 회귀 없음
- 빌드·린트·타입 오류 0
- 보고: 변경 파일 목록, 실측 결과(GNB), 미해결 사항
