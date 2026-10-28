# GuideHollow Pick 원고 제작 및 검수 가이드

## 현재 상태

- 사이트는 준비 단계이므로 모든 페이지에 `noindex`가 적용됩니다. 검수된 원고가 충분히 확보되고 검색 공개를 결정할 때 `src/config.ts`의 `indexingEnabled`를 변경합니다.
- `src/content/guides/sample-draft.md`는 실제 상품을 추천하지 않는 비공개 초안입니다.
- 쿠팡파트너스 링크, API 키, Notion 통합은 아직 연결하지 않았습니다.
- 기존 `emfls/guidehollow`의 배포·Notion·DNS(루트 도메인) 구성은 수정하지 않습니다.

## 비교 원고 구조

```yaml
---
title: "가열식과 초음파 가습기를 비교할 때 확인할 기준"
description: "물통 세척 방식, 공간, 유지관리 조건을 비교하는 가이드"
category: appliances
publishedDate: 2026-10-28
updatedDate: 2026-10-28
draft: true
affiliate: false
sources:
  - "https://example.org/official"
keyTakeaways:
  - "실제 설치 공간과 관리 가능 시간을 먼저 확인합니다"
products: []
---
```

출처 URL은 예시이므로 실제 원고에서는 검증된 HTTPS 공식 자료로 교체해야 합니다. 정보가 검증되기 전에는 `draft: true`를 유지합니다.

제품이 준비되면 `products` 항목에 `name`, `label`, `bestFor`, `strengths` (1~5개), `limitations` (1~5개), `officialUrl`, `checkedAt`을 넣습니다. 해당 제품에 제휴 링크가 있다면 `affiliateUrl`을 추가하고 원고 전체의 `affiliate: true`를 설정합니다. 제휴 링크가 있는 원고에는 광고 문구가 첫 부분에 자동 표시되며, 제휴 링크에는 `rel=sponsored nofollow`가 붙습니다.

금지: 허위 후기, 미검증 사양·가격·할인율, 출처 없는 상품 추천, 같은 의도를 반복한 대량의 템플릿 글.

## 검증 우선 상품 선정 및 HTML 태그

**모든 제품 링크는 공식 사양·독립 평가·사용환경 검증 이후에만** 추가합니다. 먼저 `docs/product-verification.ko.md`의 6단계 및 모델번호 일치 검사를 따릅니다. 쿠팡파트너스가 제공하는 정적 `<a>` HTML 코드도 `partnerHtml`로 받을 수 있으며 안전한 링크와 공식 CDN 이미지만 추출합니다. iframe·자바스크립트 동적 배너는 특정 검증 모델을 보장하지 않으므로 자동 노출하지 않습니다. 추천할 제품이 없다면 링크 없이 정보 글만 게시합니다.

## 공개 전 체크

1. 실제 출처·상품 모델명·스펙·관리법을 확인했는가?
2. 제품의 단점 및 추천하지 않는 조건이 있는가?
3. 경제적 이해관계가 정확히 표시되는가?
4. 모바일에서 비교표를 좌우 스크롤할 수 있는가?
5. `npm run check && npm run build && npm run verify`가 통과하는가?
6. Notion 자동 발행은 2단계에서 별도 데이터베이스·실패 격리·배포 검증을 구현한 이후에만 활성화한다.
