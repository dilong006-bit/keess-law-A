# Claude Code 빌드 프롬프트: 법정필수교육 노출 A안 (/legal)

- 사용법: 아래 블록을 **단계별로 하나씩** Claude Code 채팅창에 붙여 넣기
- 각 단계는 끝나면 멈추고 보고. 보고를 확인한 뒤 다음 단계 입력
- 기준 문서: `ref/legal/PRD_KEESS_26827_legal-A_v1.0.md`, `ref/legal/TECHSPEC_KEESS_26827_legal-A_v1.0.md`

---

## 단계 0. 문서 숙지 및 환경 정리

```
KEESS 법정필수교육 노출 A안(/legal) 빌드를 시작합니다.

[먼저 읽을 문서, 이 순서대로]
1. CLAUDE.md
2. ref/design/Design.md
3. ref/legal/PRD_KEESS_26827_legal-A_v1.0.md
4. ref/legal/TECHSPEC_KEESS_26827_legal-A_v1.0.md
5. ref/spec/KEESS_모바일대응_고도화_기술명세서_및_프롬프트_v1.0_260810.md

[최우선 원칙]
- 원 소스 반응형: 하나의 마크업·CSS로 PC·태블릿·모바일 모두 자연스럽게. 기기별 분기 금지
- 기술명세서 §0 절대 규칙 9개 준수. 위반이 필요해 보이면 코드를 쓰지 말고 먼저 보고
- /legal 카피는 기술명세서의 LEGAL_COPY 확정본 그대로. 대시 문자 사용 금지

[이번 단계 작업: 환경 정리만, 코드 수정 금지]
1. git status 확인 후 미커밋 변경을 보관: git stash push -u -m "kium-wip-before-legal-a"
2. 원격 추가: git remote add law-a https://github.com/dilong006-bit/keess-law-A.git
3. 기존 원격 푸시 차단: origin, newscope, pedu, b-type 각각 git remote set-url --push <name> no_push
4. git push law-a main
5. git checkout -b feat/legal-a
6. npm ci → npm run build 로 기준 빌드가 통과하는지 확인
7. public/images/legal/ 에 임시 썸네일 7개(harassment, sexual, disability, ethics, pension, privacy, aml .jpg)가 있는지 확인

[보고 형식]
- 문서 이해 요약 5줄 이내 (LF1~LF11 범위, 절대 규칙 중 이번 작업에 영향 큰 것)
- 환경 정리 결과 (각 명령 성공 여부)
- 기준 빌드 결과
- 착수 전 질문 (있을 때만)
이후 멈추고 대기하세요.
```

---

## 단계 1. 데이터 (커밋 1)

```
기술명세서 §2에 따라 data/legal.ts 를 만드세요.
- LegalCourse 타입, LEGAL_COURSES(7개, 순서 고정), previewUrl, lawOf, LEGAL_COURSE_OPTIONS, LEGAL_ETC_MAX, LEGAL_COPY, LEGAL_CARDNEWS
- AX5 값은 새로 적지 말고 data/content.ts 에서 가져오기
- lawOf 결과가 성희롱·괴롭힘·장애인·퇴직연금·개인정보 5개에서 정상 조회되는지 간단히 확인

확인: npx tsc --noEmit, npm run lint
커밋: chore(legal): 법정 데이터·임시 썸네일
보고 후 멈추세요.
```

---

## 단계 2. GNB 법정 칩 (커밋 2, 실측 게이트 포함)

```
기술명세서 §3에 따라 GNB 이벤트 칩을 배열화하고 법정 칩을 추가하세요.
- data/nav.ts: EVENT_CHIPS 배열, 하위호환 EVENT_CHIP 유지
- Nav.tsx: 데스크톱 칩 2개, 드로어 칩 2개, chip-full / chip-short 라벨, aria-label, aria-current
- 인재키움 칩의 기존 스타일·NEW·반짝임·배지 로직은 절대 변경 금지
- 법정 칩: NEW 없음, 반짝임 없음, tone-p4
- NavKey 에 'legal' 추가 (NAV_ITEMS 에는 추가 금지)

[실측 게이트]
npm run dev 후 Playwright로 1280, 1180, 1100, 1041, 1040, 941, 940, 390px 에서 홈과 /kium 의 GNB를 검사하세요.
- 판정: .nav 안 요소 줄바꿈 없음(top 편차 4px 이내), 요소 겹침 없음, 가로 스크롤 없음
- 각 폭 GNB 영역 캡처를 test-results/legal/gnb-{폭}.png 로 저장

1041~1280 중 하나라도 실패하면 수정하지 말고 결과만 보고하고 멈추세요 (브레이크포인트 개정 여부를 결정해야 함).
모두 통과하면 커밋: feat(nav): 이벤트 칩 배열화·법정 칩·폭별 라벨 (노출 A안)
커밋 본문에 폭별 실측 결과를 적고, 보고 후 멈추세요.
```

---

## 단계 3. /legal 라우트·히어로·과정 라인업 (커밋 3)

```
기술명세서 §4, §5, §6에 따라 구현하세요.
- app/legal/page.tsx (tint-p4, Nav current="legal", consultHref="#legal-inquiry", SubNav, ContentModalProvider)
- LegalHero: .ct-hero 패턴 재사용, 배경 이미지 없음, 썸네일 모자이크 2×4 (7 + 권장교육 타일)
- LegalCourses / LegalCourseCard: 4열 → 1040 이하 3열 → 880 이하 2열 → 560 이하 1열 가로형
- 미리보기 버튼만 링크, target=_blank, rel="noopener noreferrer", aria-label "(새 창)"
- 이 단계에서 아직 없는 섹션(자료, 법정 기준, 문의)은 빈 section 자리만 두고 SubNav 앵커가 동작하게

작성 순서: 390px 먼저 완성 → 넓혀 가며 확인
확인: 390, 560, 561, 880, 881, 1040, 1041, 1440 캡처. 390px 첫 화면에 H1과 '도입 문의하기' 버튼이 스크롤 없이 보이는지
커밋: feat(legal): /legal 라우트·히어로·과정 라인업
보고 후 멈추세요.
```

---

## 단계 4. 카드뉴스 슬라이더·소개서 다운로드 (커밋 4)

```
기술명세서 §7에 따라 구현하세요.
- LegalResources: 좌 슬라이더(최대 480px) / 우 소개서 패널, 880 이하 세로 쌓기
- LegalCardNews: 자리 표시 7장(4:5), 자동 5초, 가시 30% 이상일 때만, 마우스·포커스·터치 누름 시 정지,
  스와이프 40px, touch-action:pan-y, ←/→ 키, reduced-motion 시 자동 전환 없음, aria carousel 패턴
- ContentModals: openDownload(asset) 선택 인자, 기본 'courseList' 로 /content 동작 불변
  legalBrochure 는 FILE_URL null → 성공 후 '자료 준비 중입니다. 입력하신 이메일로 보내드립니다.'
- 모바일(640 이하) 모달이 바텀시트가 아니면 모바일대응 명세의 바텀시트 패턴 적용 (dvh, safe-area)

확인
- 390(터치 에뮬레이션)에서 스와이프·정지 동작, 1440에서 마우스 정지·키보드 이동
- /content 과정리스트 다운로드가 이전과 동일하게 동작 (회귀)
커밋: feat(legal): 카드뉴스 슬라이더·소개서 다운로드
보고 후 멈추세요.
```

---

## 단계 5. 법정 기준 (커밋 5)

```
기술명세서 §8에 따라 LegalStandard 를 구현하세요.
- AX5 timeline(yr, nm, cur만), laws, diff, note 재사용
- timeline 의 cc 필드는 렌더 금지 (외부 작품명)
- 640 이하: 차별점 표를 같은 데이터로 만든 항목별 블록(.lg-diff-m)으로 전환
- 560 이하: 법정 카드 1열
- 스타일은 #legal-standard 범위로 한정해 /content #ax5 에 영향 없게

확인: /legal 본문에 '지구오락실', '지구마블', 'Demon Hunters' 0건, /content #ax5 화면 변화 없음
커밋: feat(legal): 법정 기준 (외부 작품명 제외)
보고 후 멈추세요.
```

---

## 단계 6. 법정 문의 폼 (커밋 6)

```
기술명세서 §9에 따라 구현하세요.
- HomeInquiry 에 선택 prop courseField, panel 추가. 미지정 시 기존 렌더·검증·payload 완전히 동일
- LegalCourseField: fieldset/legend, 체크박스 8개(7 + 기타), 2열 → 560 이하 1열, 각 행 44px 이상
- 기타: 체크 시 입력 필수, 50자, 560 초과 인라인 / 이하 아래 줄, 입력칸 16px
- 직렬화: 문의 내용 앞 [희망과정: …] 토큰, 입력 가능 길이는 INQ_MAX.message 에서 토큰 길이만큼 차감
- PREFILL_STRIP 에 희망과정 토큰 패턴 추가
- /legal 호출: presetInterests=['compliance'], leadSource="legal"

확인
- 검증 5케이스(0개, 기타 빈칸, 51자 입력 차단, 선택 후 해제 재평가, 정상 제출)와 제출 payload.message 확인
- 홈·/kium 폼: 희망과정 필드 없음, payload 기존과 동일 (회귀)
커밋: feat(inquiry): 희망과정 선택 필드·/legal 문의
보고 후 멈추세요.
```

---

## 단계 7. /content 연결 (커밋 7)

```
기술명세서 §10에 따라 /content #ax5 하단에 /legal 링크 1개만 추가하세요 (data-ga-id="content-to-legal").
그 외 #ax5 변경 금지.
커밋: chore(content): #ax5 → /legal 링크
보고 후 멈추세요.
```

---

## 단계 8. 반응형·품질 검증 (커밋 8)

```
기술명세서 §11에 따라 scripts/verify-legal.mjs 를 작성하고 실행하세요.
- npm run build && npm run start 기준
- 폭 9개(1920, 1440, 1280, 1180, 1024, 820, 768, 390, 360) + 경계 10개(1041/1040, 941/940, 881/880, 641/640, 561/560)
- 390·360은 hasTouch, isMobile
- 검사: 가로 스크롤, GNB 한 줄, 겹침, 터치 44px, 입력 16px, 이미지 비율 흔들림, 미리보기 링크 7개, 외부 작품명 0건, 폼 5케이스, 홈·/kium 회귀, reduced-motion
- 전체 페이지 캡처: test-results/legal/{폭}.png (full-page-screenshot 스킬)
- 요청자 비교용 GNB 확대 캡처: 1280, 1024, 390

실패 항목은 원인과 수정 내용을 적고 수정 후 재실행. 기술명세서 규칙과 충돌하는 수정이 필요하면 멈추고 보고.
모두 통과하면 커밋: test(legal): 반응형·폼 검증 스크립트와 결과
그다음 git push law-a feat/legal-a

[최종 보고]
- 변경·신규 파일 목록
- 검사 결과 표 (항목 × 폭)
- GNB 실측 결과
- 미해결·확인 필요 사항 (썸네일 원본, 카드뉴스 재제작본, 소개서 PDF, 실기기 확인 대기)
```

---

## 공통 주의 (모든 단계에 적용)
- 한 단계에서 다음 단계 범위를 미리 구현하지 않기
- 공통 컴포넌트 수정은 선택 prop 추가만, 기존 호출부 수정 금지
- 새 색·섀도·라운드·브레이크포인트가 필요해 보이면 코드 작성 전 보고
- 커밋 전 항상 390px와 1440px 확인
- 기존 원격(origin, newscope, pedu, b-type)으로 푸시 금지
