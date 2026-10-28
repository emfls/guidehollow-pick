export const categories = [
  {
    id: 'appliances',
    eyebrow: '01 / 생활가전',
    title: '생활가전',
    headline: '가습기부터 소형 가전까지',
    description: '세척과 관리, 설치 공간, 유지 비용을 포함한 제품 선택 기준을 정리합니다.',
    example: '가습기 선택 체크리스트',
  },
  {
    id: 'cleaning',
    eyebrow: '02 / 청소',
    title: '청소·집안 관리',
    headline: '고르기 전에 유지 관리를',
    description: '무게와 보관 방식, 배터리 및 소모품 교체 가능 여부를 함께 살펴봅니다.',
    example: '무선청소기 구매 체크리스트',
  },
  {
    id: 'kitchen',
    eyebrow: '03 / 주방',
    title: '주방·살림',
    headline: '사용 환경부터 확인하는 주방용품',
    description: '설치 제약, 관리 주기, 소비전력과 소모품 비용 등 실제 사용 조건을 비교합니다.',
    example: '음식물처리기 선택 기준',
  },
] as const;
export type CategoryId = (typeof categories)[number]['id'];
