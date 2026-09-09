/**
 * 첫 페인트 전에 저장된 테마를 적용해 다크모드 깜빡임을 막습니다.
 * 클라이언트 번들이 로드되기 전에 실행되어야 하므로 인라인 스크립트로 넣습니다.
 */
const script = `
(function () {
  try {
    var stored = localStorage.getItem("theme");
    var isDark = stored
      ? stored === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.toggle("dark", isDark);
  } catch (e) {}
})();
`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
