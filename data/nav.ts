// GNB 라우팅 (Design.md §0.5-1 · 무동작 금지 · 실제 페이지 이동)
export type NavKey = 'home' | 'ax-ai' | 'leadership' | 'hrd' | 'content' | 'legal';

export interface NavItem {
  key: NavKey;
  label: string;
  href: string;
}

// AX·AI→/ax-ai, 리더십·조직→/leadership, HRD 통합→/hrd, 콘텐츠→/content
// (정부지원 GNB 진입점은 제거 — /hrd#gov 섹션 및 타 위치 링크는 유지)
export const NAV_ITEMS: NavItem[] = [
  { key: 'ax-ai', label: 'AX·AI 전환', href: '/ax-ai' },
  { key: 'leadership', label: '리더십·조직', href: '/leadership' },
  { key: 'hrd', label: 'HRD 통합 솔루션', href: '/hrd' },
  { key: 'content', label: '콘텐츠 솔루션', href: '/content' },
];

// 홈 로고 = 홈(/) (Design.md §0.5-2)
export const LOGO = { label: 'KEESS', href: '/' };

// GNB 우측 이벤트 칩 — 정식 메뉴 아님(기술명세서 최종 v2.0 §6-8: GNB 정식 메뉴 추가 금지).
// NAV_ITEMS와 분리해 두어 aria-current 대상·모바일 메뉴 구성에서 제외된다.
// 칩은 2개 이상이 될 수 있으므로 배열이 원본이다(LF1). 순서 = 노출 순서.
// tone 은 칩 식별자 — tone-p2(인재키움)에는 CSS 규칙을 추가하지 않아 기존 스타일이 그대로 유지된다.
export interface EventChip {
  key: 'kium' | 'legal';
  label: string;
  /** 941~1040px 축약 라벨 */
  shortLabel: string;
  href: string;
  tone: 'p2' | 'p4';
  gaId: string;
}

export const EVENT_CHIPS: readonly EventChip[] = [
  { key: 'kium', label: '인재키움 프리미엄', shortLabel: '인재키움', href: '/kium', tone: 'p2', gaId: 'nav-kium' },
  { key: 'legal', label: '2026 법정필수교육', shortLabel: '법정필수', href: '/legal', tone: 'p4', gaId: 'nav-legal' },
];

/** 하위호환: 기존 참조 유지 */
export const EVENT_CHIP = EVENT_CHIPS[0];
