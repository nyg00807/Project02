/* Break Point Constant */
window.LAPTOP_BREAK_POINT = 1780;
window.TAB_BREAK_POINT = 1024;
window.MO_BREAK_POINT = 768;

/* Global variable */
window.canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/* Game Id QueryString Function */
function gamesClick(e){
  // e.currentTarget
  // 이벤트 리스너가 걸려있는 요소 지칭
  // 내부에 자식 요소 있는 경우 버블링 현상 방지
  const gameData = e.currentTarget.dataset.game;

  if(!gameData) return;

  window.location.href = `game.html?id=${encodeURIComponent(gameData)}`;
}

/* 페이지 새로고침 시 스크롤 맨 위로 */
// 스크롤 복원 끄기
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

// 새로고침/첫 진입 시 무조건 맨 위로
function forceScrollTop() {
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
}

// DOM 준비 시 1회
document.addEventListener("DOMContentLoaded", forceScrollTop);

// 리소스(이미지/비디오 등) 로드 끝난 뒤 1회
window.addEventListener("load", forceScrollTop);

// 레이아웃이 뒤늦게 바뀌는 경우 대비해서 2~3프레임 더 고정
requestAnimationFrame(() => {
  forceScrollTop();
  requestAnimationFrame(forceScrollTop);
});
