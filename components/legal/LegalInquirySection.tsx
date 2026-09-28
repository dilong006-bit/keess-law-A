import HomeInquiry from '@/components/sections/home/HomeInquiry';
import { LEGAL_COPY, LEGAL_COURSE_OPTIONS, LEGAL_ETC_MAX } from '@/data/legal';

/**
 * LF8 도입 문의 — 공유 폼(HomeInquiry)을 그대로 쓰고 선택 prop 두 개만 넘긴다.
 * 관심 영역 '법정 필수'(compliance)를 켠 상태로 시작하고(해제 가능),
 * 제출 페이로드에는 lead_source 를 비노출 필드로 싣는다.
 */
export default function LegalInquirySection() {
  const { inquiry } = LEGAL_COPY;
  return (
    <div id="legal-inquiry" className="lg-inq">
      <HomeInquiry
        presetInterests={['compliance']}
        leadSource="legal"
        courseField={{
          label: inquiry.fieldLabel,
          options: LEGAL_COURSE_OPTIONS,
          etcLabel: inquiry.etcLabel,
          etcPlaceholder: inquiry.etcPlaceholder,
          etcMax: LEGAL_ETC_MAX,
          errRequired: inquiry.errRequired,
          errEtc: inquiry.errEtc,
        }}
        panel={{ title: inquiry.panelTitle, body: inquiry.panelBody }}
      />
    </div>
  );
}
