# 링크나무 🌳

내 모든 링크를 한 페이지에 모아두고, 하나의 URL로 공유하는 서비스입니다.

- 프로필 표시 (이름, 한 줄 소개, 프로필 사진)
- 링크 카드 목록
- 다크모드 토글
- 링크별 클릭 수 집계

## 요구 사항

- Node.js 18.17 이상 (권장: 20 이상)
- npm
- MongoDB Atlas 계정 — 클릭 수 집계를 쓸 때만 필요합니다

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정 (선택)

클릭 수 집계를 사용하려면 `.env.local.example`을 복사해 `.env.local`을 만들고 값을 채웁니다.

```bash
cp .env.local.example .env.local
```

```bash
MONGODB_URI="mongodb+srv://<user>:<password>@<cluster>/?retryWrites=true&w=majority"
MONGODB_DB="linknamu"
```

`MONGODB_URI`가 없어도 앱은 정상 동작합니다. 이 경우 클릭 집계만 건너뛰고 카운트는 0으로 표시됩니다.

> `.env.local`은 `.gitignore`에 포함되어 있습니다. 절대 커밋하지 마세요.

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 http://localhost:3000 을 엽니다.

## 내 정보로 바꾸기

`src/data/profile.ts` 한 파일만 수정하면 됩니다.

```ts
export const profile = {
  name: "양영호",
  bio: "수학, AI, 영어공부를 좋아함",
  initials: "양",  // 원형 아바타에 표시할 이니셜 (비우면 이름 첫 글자)
  avatarUrl: "", // 사진을 쓰려면 public/ 아래 경로. 비어 있으면 이니셜을 보여줍니다
};

export const links: LinkItem[] = [
  {
    id: "github",   // 클릭 수 집계 키 — 한 번 정하면 바꾸지 마세요 (기존 집계가 끊깁니다)
    label: "GitHub",
    url: "https://github.com/",
  },
];
```

기본값은 이니셜 아바타입니다. 사진을 쓰려면 파일을 `public/` 아래에 넣고
`avatarUrl: "/me.jpg"`처럼 경로를 적으면 이니셜 대신 사진이 나옵니다.
외부 URL을 쓰려면 `next.config.mjs`에 `images.remotePatterns` 설정을 추가해야 합니다.

## 스크립트

| 명령 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버 실행 (http://localhost:3000) |
| `npm run build` | 프로덕션 빌드 |
| `npm run start` | 빌드 결과 실행 |
| `npm run lint` | 린트 검사 |

## 프로젝트 구조

```
src/
├── app/
│   ├── api/clicks/route.ts   # 클릭 수 기록(POST) / 조회(GET)
│   ├── layout.tsx            # 공통 레이아웃, 다크모드 초기화
│   ├── page.tsx              # 메인 페이지
│   └── globals.css
├── components/
│   ├── LinkCard.tsx          # 링크 카드 (클릭 시 집계 전송)
│   ├── LinkList.tsx          # 클릭 수를 읽어 카드 목록 렌더링
│   ├── Profile.tsx           # 프로필 영역 (이니셜 또는 사진)
│   ├── ThemeScript.tsx       # 첫 페인트 깜빡임 방지 스크립트
│   └── ThemeToggle.tsx       # 다크모드 토글 버튼
├── data/profile.ts           # 프로필 · 링크 데이터 (지금은 더미 값)
└── lib/mongodb.ts            # MongoDB 연결
```

## 클릭 수 집계 동작

- 카드를 클릭하면 `navigator.sendBeacon`으로 `POST /api/clicks`에 링크 `id`를 보냅니다.
  새 탭으로 이동하는 중에도 요청이 끊기지 않습니다. (미지원 브라우저는 `keepalive` fetch로 대체)
- 서버는 `clicks` 컬렉션에서 `_id`가 링크 `id`인 문서의 `count`를 1 증가시킵니다(upsert).
- `src/data/profile.ts`에 없는 `id`는 400으로 거절합니다.
- DB 연결이 실패해도 링크 목록은 그대로 보입니다. 집계는 부가 기능으로만 취급합니다.

```bash
# 누적 클릭 수 확인
curl http://localhost:3000/api/clicks
```

## 배포 (Vercel)

1. GitHub 저장소에 푸시합니다.
2. Vercel에서 저장소를 import 합니다. Next.js 프로젝트로 자동 인식됩니다.
3. Project Settings → Environment Variables 에 `MONGODB_URI`, `MONGODB_DB`를 추가합니다.
4. MongoDB Atlas → Network Access 에서 Vercel의 접근을 허용합니다 (`0.0.0.0/0` 또는 지정 IP).
5. Deploy 합니다.

## 기술 스택

Next.js 14 (App Router) · TypeScript · Tailwind CSS · MongoDB Atlas · Vercel
