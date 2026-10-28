# GuideHollow Pick Notion 원고 대기열

- 데이터베이스: https://app.notion.com/p/f84bd960bef542dc8649881b7d4b839f
- 데이터 소스 ID: `28c3c89a-de0d-48a1-9d32-85431590ed62`
- 기존 GuideHollow 메인 원고 DB와 별도이며 이 저장소에서만 사용합니다.
- URL: https://pick.guidehollow.com

## 상태 및 발행 기준

`아이디어 → 작성중 → 검수대기 → 발행대기 → 발행완료`

검증 실패 시 `발행실패`로 옮기고 오류 사유를 기록합니다. 재검수 후에만 `발행대기`로 되돌립니다.

필수: `발행순서` 양의 정수, `슬러그` 영어 소문자/하이픈, `제목`, `카테고리`, `품질검수 완료` 체크. 가격·출처·제휴 정보가 있는지 별도로 검수해야 합니다.

## GitHub 연결 전 필수 설정

Notion 내부 통합(Integration)을 생성하고 해당 통합에 **이 전용 데이터베이스** 읽기 권한을 부여합니다. 토큰은 공개하지 않고 `emfls/guidehollow-pick` 저장소의 Settings → Secrets and variables → Actions → New repository secret에 `NOTION_PICK_TOKEN`으로 등록합니다.

연결 테스트는 GitHub Actions의 `GuideHollow Pick — Notion queue preview (read only)`를 수동 실행합니다. 이 워크플로는 Notion을 읽고 검증 결과만 표시하며 원고 발행, 상태 변경, GitHub 코드 수정은 전혀 하지 않습니다.

현재는 토큰이 없으므로 외부 Notion API 연결 테스트가 완료된 상태가 아닙니다. Notion 커넥터로 DB를 만드는 것과 GitHub Actions에서 해당 DB를 읽는 것은 권한이 별개입니다.

## 다음 단계 (미구현)

- 검수된 첫 원고 10편 생산 및 등록
- 메타데이터·원고 본문 블록 추출과 공식 출처 검증
- 발행 원장·중복 방지·실패 격리·Pages 배포 확인을 포함한 실제 발행기
- 게시 승인 전에는 예약 자동 발행 절대 활성화하지 않음
