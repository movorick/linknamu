export type LinkItem = {
  /** 클릭 수 집계 키 (DB 문서 _id) — 한 번 정하면 바꾸지 마세요 */
  id: string;
  label: string;
  url: string;
};

/** TODO: 진짜 내용으로 교체 — 지금은 화면 확인용 더미 값입니다. */
export const profile = {
  name: "양영호",
  bio: "수학, AI, 영어공부를 좋아함",
  /** 원형 아바타에 표시할 이니셜. 비우면 이름 첫 글자를 씁니다. */
  initials: "양",
  /** public/ 아래 이미지 경로. 비어 있으면 위 이니셜을 보여줍니다. */
  avatarUrl: "",
};

/** TODO: 진짜 URL로 교체 */
export const links: LinkItem[] = [
  { id: "github", label: "GitHub", url: "https://github.com/" },
  { id: "linkedin", label: "LinkedIn", url: "https://www.linkedin.com/" },
  { id: "blog", label: "Blog", url: "https://example.com/blog" },
];
