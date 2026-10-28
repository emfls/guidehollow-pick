# GuideHollow Pick | 검증 우선 상품 선정·쿠팡파트너스 운영 기준

이 규칙은 새 원고, 기존 원고 수정, 제품 비교표, 쿠팡 링크·HTML 입력, 수시 발행 모두에 적용한다. **제품을 찾은 다음에 수익 링크를 붙이는 것**이지 링크 수를 늘리기 위해 추천할 제품을 고르지 않는다.

## 제품 추천 6단계

1. **검색 의도와 조건**: 독자가 해결하려는 문제, 공간, 안전, 예산, 유지 관리, 사용 빈도, 용량·크기를 먼저 정의한다. 저렴함·판매량·수수료 순서로 시작하지 않는다.
2. **후보 수집**: 제조사 공식 제품/설명서(정확한 모델번호), 독립 기관 시험·평가(있으면 우선), 전문 리뷰 및 사용자 후기의 반복 이슈를 구분해 확보한다. 출처별 날짜를 기록한다.
3. **실제 검증**: 공식 스펙과 독립 자료를 교차 확인한다. 장점뿐 아니라 단점·소모품·내구 관리·안전·A/S·호환/옵션 제약을 정리한다. 사용해 보지 않았으면 실사용 후기처럼 쓰지 않는다. 확인되지 않는 구매처 평점과 리뷰 수, 할인율, 가격을 만들지 않는다.
4. **명확한 추천 근거**: 누구에게 적합하고 누구에게 부적합한지, 비교 대상보다 나은 근거와 불리한 조건을 쓴다. 적합한 제품이 없으면 추천하지 않으며 제휴 링크도 붙이지 않는다.
5. **정확히 동일한 상품 링크**: 쿠팡파트너스에서 만든 제휴 URL이 **검증한 모델번호·상품 상세와 옵션/구성까지 동일한지** 확인한다. 쿠팡 재고·가격·판매 조건과 링크 작동 여부를 발행 직전 확인한다. 다른 모델·세트·용량으로 이어지면 연결하지 않는다.
6. **경제적 이해관계 공개**: 링크가 있으면 원고 첫머리에 쿠팡파트너스 광고 고지. 각 링크는 `rel="sponsored nofollow noopener noreferrer"`를 붙인다. 클릭 유도용 과장, 오클릭 유도, 무관한 동적배너 금지.

## 원고·상품 필수 정보

`products`에 넣는 모든 **공개 제품**에는 `name`, `modelNumber`, `label`, `bestFor`, `strengths`, `limitations`, `officialUrl`, `independentSources`, `verificationNotes`, `verified: true`, `checkedAt`이 필요하다. 독립 출처가 없거나 실제로 검증하지 못했다면 제품을 추천 카드로 공개하지 않고 **정보형 설명**만 게시한다.

쿠팡 링크를 넣을 제품은 `partnerProductMatched: true`까지 필요하다. 이는 링크 상세 페이지에서 모델번호와 옵션을 사람이 확인한 후에만 부여한다.

예시(아래 주소는 **형식 예시일 뿐 실제 링크가 아니다**, 공개 원고에 복사 금지):

```yaml
products:
  - name: "검증 완료된 제품명"
    modelNumber: "정확한 모델번호"
    label: "이런 조건에 적합"
    bestFor: "소음과 물통 세척을 우선하는 사용 환경에 적합"
    strengths:
      - "공식 자료로 확인된 장점"
    limitations:
      - "공식 자료로 확인된 제한 사항"
    officialUrl: "https://manufacturer.example.com/product"
    independentSources:
      - "https://independent.example.org/review"
    verificationNotes: "시험 조건, 비교 대상, 모델과 옵션, 단점 및 실제 사용 환경의 근거를 40자 이상 기록"
    verified: true
    partnerProductMatched: true
    checkedAt: 2026-10-28
    affiliateUrl: "https://link.coupang.com/a/replace-with-real-generated-link"
```

`affiliateUrl` 대신 **쿠팡파트너스에서 복사한 단일 상품 `a` HTML 태그**를 원고 `partnerHtml` 블록 문자열로 받을 수 있다.

```yaml
    partnerHtml: |
      <a href="https://link.coupang.com/a/replace-with-real-generated-link" target="_blank"><img src="https://static.coupangcdn.com/image/affiliate/replace.jpg" alt="상품명"></a>
```

위 코드는 설명용 가상 예시이며 실제 제휴를 연결하지 않는다. `affiliateUrl`과 `partnerHtml`을 함께 주면 추출한 링크가 같아야 한다.

## HTML 코드 처리 안전 규칙

- 단일 상품 **정적 `<a href="...">` HTML**에서 파트너스 URL을 추출하고, 이미지가 있다면 **HTTPS 쿠팡 CDN 출처**만 선택적으로 표시한다. 제3자 HTML 원문은 웹페이지에 직접 삽입하지 않는다.
- **`<iframe>`, `<script>` 또는 다이나믹 배너**는 특정 제품·옵션 일치 여부를 보장하지 않으므로 추천 카드 자동 등록을 거부한다. 실제 검증 제품으로 연결되는 단일 상품 제휴 링크를 발급받아 교체한다.
- `html` 태그에 포함된 판매 가격이나 이미지 문구는 최신 사실의 증거가 아니다. 글의 제품명, 모델번호, 옵션 및 출처 검증은 별개로 수행한다.
- 정적 HTML에 `onclick` 등 이벤트 속성, 쿠팡 이외 링크, 허용되지 않은 이미지 서버가 있으면 차단한다.
- `draft: false`인 원고는 공개 상태의 모든 제품 카드에 검증 근거가 없거나 `affiliate` 상태가 실제 링크 존재 여부와 다르면 **빌드 실패**한다.

## 독자 중심 원칙

독립적인 평가기관 시험이 없는 카테고리는 공식 사양·제조사 설명서를 검증하고 전문 리뷰의 구체적인 확인 사항을 함께 살펴본다. 독립 출처 자체가 불충분하면 검증 완료 제품으로 단정하지 않는다. 제휴 링크 없이 의사결정 가이드 형태로 발행한다.

선정 우선순위는 `실제 적합성·안전·근거 > A/S와 사용 편의·소모품 > 가격·재고 조건 > 수수료`이다. **추천 제품이 0개일 수 있다.**

## 참고 문서

- 쿠팡파트너스 공식 링크·배너 가이드: https://partners.coupangcdn.com/partners-guide/partners-guide-20241202161107.pdf
- 공정거래위원회 경제적 이해관계 공개 지침: https://case.ftc.go.kr/com/dscv/dscvHtmlView.do?docCnvrMnNo=14914&docId=20251203165009524429
- 쿠팡파트너스 운영정책: https://coupang-partners.tistory.com/entry/쿠팡-마케팅-제휴-프로그램-운영정책
