/* Common script loader
- 순서 보장
- 중복 로드 방지
- 로드 실패 시 콘솔에서 바로 확인
*/

const CDN = {
  jquery: "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js",
  swiper: "https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.js",
  gsap: "https://cdn.jsdelivr.net/npm/gsap@3.14.1/dist/gsap.min.js",
  scrolltrigger: "https://cdn.jsdelivr.net/npm/gsap@3.14.1/dist/ScrollTrigger.min.js",
  //fpscrolloverflow: "https://cdnjs.cloudflare.com/ajax/libs/fullPage.js/2.9.7/vendors/scrolloverflow.min.js",
  //fullpage: "https://cdnjs.cloudflare.com/ajax/libs/fullPage.js/2.9.7/jquery.fullpage.min.js",
};

function alreadyLoaded(src){
  return Array.from(document.scripts).some((s) => s.src === src);
}

function loadScript(src, { attrs = {} } = {}){
  return new Promise((resolve, reject) => {
    if (alreadyLoaded(src)) return resolve();

    const s = document.createElement("script");
    s.src = src;
    s.defer = true;

    // 필요한 경우 attribute 추가 (예: integrity, crossorigin 등)
    Object.entries(attrs).forEach(([k, v]) => s.setAttribute(k, v));

    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load: ${src}`));

    document.head.appendChild(s);
  });
}

// 페이지 공통 요소
function loadInclude(selector, url){
  return new Promise((resolve, reject) => {
    $(selector).load(url, function(_response, status){
      if (status === "error") reject(`Failed to load ${url}`);
      else resolve();
    });
  });
}

(async () => {
  try{
    // 1. CDN 라이브러리
    await loadScript(CDN.jquery);
    await loadScript(CDN.swiper);
    await loadScript(CDN.gsap);
    await loadScript(CDN.scrolltrigger);
    //await loadScript(CDN.fpscrolloverflow);
    //await loadScript(CDN.fullpage);

    // 2. DOM 준비
    if (document.readyState === "loading"){
      await new Promise((res) => document.addEventListener("DOMContentLoaded", res));
    }

    // 3. 공통 요소 include
    await loadInclude("#header", "include/header.html");
    await loadInclude("#footer", "include/footer.html");
    await loadInclude("#mobileMenu", "include/mobile-menu.html");

    // 4. 프로젝트 공통 js 실행
    await loadScript("js/data/global.js");
    await loadScript("js/data/games.js");
    await loadScript("js/common/header.js");
    await loadScript("js/common/footer.js");
    
    // 로드 확인용
    /* console.log("Loaded:", {
      jQuery: !!window.jQuery,
      Swiper: !!window.Swiper,
      gsap: !!window.gsap,
    }); */

    // 5. 각 페이지별 js 파일 연결
    const bodyId = document.body.id || '';

    if(bodyId.endsWith('Body')){
      const pageName = bodyId.replace('Body', '');
      await loadScript(`js/pages/${pageName}.js`);
    }
  }
  catch(err){
    console.error("[import.js] Script loading error:", err);
  }
})();