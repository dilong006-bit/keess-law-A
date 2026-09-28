# KEESS 26827 법정필수교육 노출 A안 프로토타입 제작 전략 v1.0

- 업무번호: 26827 / 태스크: [26827-01 기획]
- 작성: 2026-09-28 / HRD사업지원팀 임지홍
- 작업 폴더: `C:\오피스키퍼 예외\workspace\KEESS_law-A`
- 푸시 대상: https://github.com/dilong006-bit/keess-law-A
- 이 문서의 지위: 법정 페이지 카피·구성의 원본(source of truth). CLAUDE.md의 '카피 = ref/prototype 원본' 규칙은 /legal에 한해 이 문서로 대체

---

## 0. 목적과 성공 기준

### 목적
- 요청자(HRD사업팀)가 **노출 A안**(GNB 칩 + 별도 페이지)을 실제 화면으로 보고 B안과 비교 판단
- 명칭: 기존 'A-Type/B-Type 사이트'와 구분하기 위해 **노출 A안 / 노출 B안**으로 표기

### 성공 기준
- GNB에 칩 2개(인재키움 + 법정)가 놓였을 때의 실제 모습 확인 가능 (PC 폭별, 모바일 드로어)
- 요청 구성안 3섹션 + 메모 5건이 모두 동작하는 수준으로 구현
- 법정 콘텐츠를 **재사용 가능한 모듈**로 제작 → 노출 B안(/content 섹션)에서 그대로 조립 가능

### 핵심 전략
- **모듈 우선:** 콘텐츠·폼·슬라이더를 `components/legal/*` + `data/legal.ts`로 만들고, A안은 이를 /legal 페이지로 조립
- **노출 B안 제작 시간 단축:** 같은 모듈을 /content 법정 섹션과 홈 캠페인 카드로 재조립
- **운영 코드 호환:** 폼 제출 구조(payload)를 바꾸지 않음 → 운영 개발 이관이 쉬움

---

## 1. 작업 환경 정리 (착수 전 1회)

| 순서 | 작업 | 명령(예) |
|---|---|---|
| 1 | 인재키움 미커밋 변경 보관 (법정 작업과 분리) | `git stash push -u -m "kium-wip-before-legal-a"` |
| 2 | 푸시 대상 원격 추가 | `git remote add law-a https://github.com/dilong006-bit/keess-law-A.git` |
| 3 | 기존 원격 4개 푸시 차단 (실수 방지) | `git remote set-url --push origin no_push` (newscope, pedu, b-type 동일) |
| 4 | 기준 브랜치 푸시 | `git push law-a main` |
| 5 | 작업 브랜치 생성 | `git checkout -b feat/legal-a` |
| 6 | 의존성·빌드 확인 | `npm ci` → `npm run build` → `npm run dev` (포트 3001) |

- 미리보기 공유가 필요하면 keess-law-A를 Vercel에 연결해 브랜치 미리보기 URL 사용 (선택)

---

## 2. 정보 구조 (노출 A안)

### GNB
- 기존 `EVENT_CHIP`(단일 객체) → `EVENT_CHIPS`(배열)로 확장
  - 1: 인재키움 프리미엄 (/kium, 기존 그대로)
  - 2: 2026 법정필수교육 (/legal, 신규)
- 정식 메뉴(NAV_ITEMS) 추가 금지 규칙 유지 → 칩 방식
- 법정 칩 표현: 기존 `.nav-chip` 구조 재사용, 색만 `--p4` 파생 변형 (신규 컴포넌트 발명 금지)
- 모바일 드로어: 칩 2개를 순서대로 노출
- **의도:** A안의 단점(칩 2개 경쟁, 폭 부족)을 숨기지 않고 그대로 보여줌. 1024~1280px 구간 줄바꿈·겹침은 결함이 아니라 비교 관찰 포인트로 기록

### 라우트
- `/legal` 신설, wrapper `.tint-p4`
- SubNav 앵커: 과정 라인업 / 법정 기준 / 카드뉴스 / 자료 / 도입 문의
- `/content` 기존 법정 섹션(#ax5)에 '법정필수교육 전체 보기 → /legal' 링크 1개만 추가
- 홈: 변경 없음 (A안 정의상 GNB만으로 진입)

---

## 3. /legal 페이지 구성

| ID | 섹션 | 구성 | 출처 |
|---|---|---|---|
| L1 | 히어로 | 배지 '2026 법정필수교육', 헤드라인 '법정필수교육, KG에듀원에서 한 번에', 강점 3줄, CTA 2개(도입 문의 / 소개서 받기) | 요청 구성안 섹션 1 ('!!' 제거) |
| L2 | 과정 라인업 | 과정 카드 7개: 썸네일, 과정명, 대상·근거 태그, '미리보기' 버튼(새 탭) | 구성안 섹션 1 썸네일 + 섹션 2 미리보기 표 통합 |
| L3 | 법정 기준 | 공통 법정의무교육 5종 표(근거·대상·주기) + 일반 교육 대비 차별점 표 | 기존 data/content.ts AX5 재사용 |
| L4 | 카드뉴스 | 4:5 슬라이더, 7칸 자리 표시 '디자인 재제작 예정' | 메모 ①, 이미지 미사용 |
| L5 | 자료 | 과정소개서 다운로드 라이트 게이트 | 메모 ④, 기존 다운로드 모달 패턴 |
| L6 | 도입 문의 | HomeInquiry 재사용 + 희망과정 8개 | 구성안 섹션 3, 메모 ⑤ |
| 공통 | 푸터 | 홈 다크 푸터 (부정훈련 모달 포함) | CLAUDE.md §5-1 |

### L2 과정 라인업 판단 근거
- 구성안의 '썸네일 그리드'와 '미리보기 표'를 카드 하나로 합침
  - 썸네일을 보고 바로 미리보기로 이어지는 동선
  - 표는 모바일에서 가독성이 낮음
- 요청 기능(과정 7개 미리보기)은 그대로 충족
- 근거 태그는 AX5.laws 5종에만 표기. 윤리경영·자금세탁방지는 근거를 표기하지 않음 (요청자 확인 전 단정 금지)

### L3 외부 작품명 제외
- 기존 AX5.timeline의 cc('지구오락실 컨셉', '지구마블 세계여행 컨셉', 'K-POP Demon Hunters 컨셉')는 /legal에서 사용하지 않음
- 시리즈명(nm)과 연도만 노출
- 운영 사이트 동일 문구는 RD 계열 결함으로 별도 보고

---

## 4. 데이터 설계 (`data/legal.ts`, 단일 원본)

```ts
export const LEGAL_COURSES = [
  { id: 'harassment', order: 1, name: '법정헌터스 직장 내 괴롭힘 예방 교육편', classkey: '403888', thumb: '/images/legal/harassment.jpg', lawKey: '직장 내 괴롭힘 예방' },
  { id: 'sexual',     order: 2, name: '법정헌터스 성희롱 예방 교육편',         classkey: '403886', thumb: '/images/legal/sexual.jpg',     lawKey: '성희롱 예방' },
  { id: 'disability', order: 3, name: '법정헌터스 장애인 인식개선 교육편',     classkey: '403887', thumb: '/images/legal/disability.jpg', lawKey: '장애인 인식개선' },
  { id: 'ethics',     order: 4, name: '법정헌터스 윤리경영 교육편',            classkey: '403890', thumb: '/images/legal/ethics.jpg',     lawKey: null },
  { id: 'pension',    order: 5, name: '법정헌터스 퇴직연금가입자 교육편',      classkey: '403889', thumb: '/images/legal/pension.jpg',    lawKey: '퇴직연금' },
  { id: 'privacy',    order: 6, name: '[김경식×with.선] 개인정보보호 및 정보보안교육', classkey: '404463', thumb: '/images/legal/privacy.jpg', lawKey: '개인정보보호' },
  { id: 'aml',        order: 7, name: '꼭 알아야 하는 자금세탁방지법',          classkey: '404905', thumb: '/images/legal/aml.jpg',        lawKey: null },
] as const;

export const previewUrl = (classkey: string) =>
  `https://samplezone.campus21.co.kr/classpreview.asp?classkey=${classkey}`; // KGESA 오픈 시 이 함수만 교체

export const LEGAL_COURSE_OPTIONS = [
  '직장 내 괴롭힘 예방 교육', '장애인 인식개선 교육', '성희롱 예방 교육', '윤리경영 교육',
  '퇴직연금 가입자 교육', '개인정보보호 및 정보보안 교육', '자금세탁방지 교육',
] as const; // + 기타(직접 입력)
```

- 미리보기 링크: `target="_blank" rel="noopener noreferrer"` 필수 (캠퍼스21 페이지의 맛보기 팝업 자동 실행 방지)
- 썸네일: 1차는 요청 PPTX의 썸네일 그리드(1498×422)를 잘라 임시 사용, 원본은 콘텐츠개발팀 수급 후 교체
- 근거 표기: `lawKey`로 AX5.laws를 조회 (값을 새로 적지 않음)

---

## 5. 컴포넌트 설계

```
components/legal/
  LegalHero.tsx          L1
  LegalLineup.tsx        L2 (LegalCourseCard 반복)
  LegalCourseCard.tsx    썸네일 + 과정명 + 태그 + 미리보기 버튼
  LegalCompliance.tsx    L3 (AX5 표 재사용)
  LegalCardNews.tsx      L4 슬라이더 (슬라이드 배열을 prop으로 받음 → 이미지 교체만으로 완성)
  LegalBrochure.tsx      L5 다운로드 게이트
  LegalCourseField.tsx   L6 희망과정 체크박스 + 기타 입력
app/legal/page.tsx       조립
styles/legal.css         토큰(var(--*))만 사용
```

### L4 카드뉴스 슬라이더 동작
- 자동 전환 5초, 마우스 올림·포커스 시 정지, 이전·다음 버튼, 점 표시기, 모바일 스와이프
- 화면에 보일 때만 자동 전환 (IntersectionObserver)
- `prefers-reduced-motion` 시 자동 전환 끔
- 자리 표시 슬라이드: 4:5 비율, '카드뉴스 01 / 07 · 디자인 재제작 예정'

### L6 희망과정 필드 (payload 구조 불변)
- HomeInquiry에 선택 prop 1개 추가: `courseField?: { options: readonly string[]; etcMaxLength: number }`
  - 미지정 페이지(홈, /kium 등)는 기존 동작 100% 유지
- 호출: `<HomeInquiry presetInterests={['compliance']} leadSource="legal" courseField={...} />`
- 제출 시 문의 내용 앞에 토큰으로 직렬화: `[희망과정: 성희롱 예방 교육·기타(산업안전보건)]`
  - 기존 '[관심 과정: ...]' 프리필 방식과 같은 규칙 → 운영 API 필드 추가 없이 접수 가능
- 검증
  - 희망과정 1개 이상 필수
  - 기타 체크 시 입력 필수, 50자 이내
  - 입력 즉시 오류 해제 (기존 라이브 인라인 검증 규칙)
- 예상 교육인원·회사규모·이메일·동의: 기존 폼 그대로 (운영과 동일 선택지)

### L5 소개서 다운로드
- 기존 과정리스트 다운로드 모달 패턴 재사용, 자료 구분만 추가
- 파일: `public/downloads/legal-brochure.pdf` 자리. 최종 PDF(9p 수정본) 수령 전에는 성공 상태 화면까지만 시연

---

## 6. 디자인 규칙
- 발명 금지: 기존 토큰·버튼·카드·섀도·라운드만 사용
- 필러색 `--p4`는 포인트에만, 페이지 바탕은 `.tint-p4` 4값
- 풀채도 블록은 L6 좌측 패널 1개
- 구성안의 다크 히어로(/kium 캡처 재활용)는 따르지 않음 → /content 톤 승계
- 느낌표 반복, 반말, 과장 수식어 사용 금지

---

## 7. 검증 기준

| 구분 | 항목 |
|---|---|
| 빌드 | `npm run build`, `npm run lint` 무오류 |
| 반응형 | 1440 / 1280 / 1024 / 768 / 390px 전체 화면 캡처. GNB 칩 2개 줄바꿈·겹침 여부는 관찰 기록 |
| 링크 | 미리보기 7개 새 탭, noopener 적용 확인 |
| 폼 | 필수값 누락, 희망과정 0개, 기타 빈칸, 50자 초과, 정상 제출(mock) 5개 케이스 |
| 접근성 | 키보드로 슬라이더·체크박스·모달 조작, 포커스 링, 슬라이더 aria-live |
| 모션 | reduced-motion에서 자동 전환 정지 |
| 회귀 | 홈·/kium 문의 폼 동작 불변 (courseField 미지정) |

- 스킬 활용: full-page-screenshot(반응형 캡처), playwright-skill(폼·링크 검증)

---

## 8. 커밋·푸시 단위 (feat/legal-a)

| 순서 | 커밋 메시지(예) |
|---|---|
| 1 | chore(legal): 법정 데이터·임시 썸네일 추가 (data/legal.ts) |
| 2 | feat(nav): 이벤트 칩 배열화 · 법정필수교육 칩 추가 (노출 A안) |
| 3 | feat(legal): /legal 페이지 L1~L3 (히어로·라인업·법정 기준) |
| 4 | feat(legal): 카드뉴스 슬라이더 자리 · 소개서 다운로드 게이트 (L4·L5) |
| 5 | feat(inquiry): 희망과정 필드 선택 prop · /legal 문의 연결 (L6) |
| 6 | chore(content): #ax5 → /legal 바로가기 링크 |
| 7 | test(legal): 반응형 캡처 · 폼 검증 결과 |

- 푸시: `git push law-a feat/legal-a` → 확인 후 main 병합

---

## 9. 확인 필요

| 구분 | 항목 | 착수 영향 |
|---|---|---|
| 요청자 | 윤리경영·자금세탁방지 대상·근거 표기 여부 | 없음 (미표기로 진행) |
| 요청자 | 근로자 안전보건교육 포함 여부 | 없음 (제외로 진행, 기타 입력으로 흡수) |
| 요청자 | 과정소개서 최종 PDF | L5는 성공 화면까지만 시연 |
| 콘텐츠개발팀 | 썸네일 원본 7종 | 임시 크롭본 사용 |
| 디자인 | 카드뉴스 재제작본 (1080×1350 기준) | 자리 표시로 진행 |
| 내부 | 운영 사이트 외부 작품명 문구 | RD 결함 별도 등록 |
