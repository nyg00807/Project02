/* ========================================
Define Variables
======================================== */
let _resizeTimer = null;  // 디스플레이 너비 변경 시 gsap 초기화

/* Benefit video src map */
const BENEFIT_VIDEO = {
  fantasyGame: "https://s1.pearlcdn.com/cd/brand/contents_cd/video/main/combat1.webm",
  fastSpeed: "https://gmedia.playstation.com/is/content/SIEPDC/global_pdc/en/games/pdps/l/lo/lost-soul-aside/videos/Lost-Souls-Aside-Sword-Video-02-15aug25.mp4",
  immersion: "https://gmedia.playstation.com/is/content/SIEPDC/global_pdc/en/games/pdps/r/ra/ratchet-and-clank--rift-apart/web-assets/tips/ratchet-and-clank-rift-apart-tips-video-hammer-en-12may21.mp4",
  environment: "https://gmedia.playstation.com/is/content/SIEPDC/global_pdc/en/games/pdps/0/00/007-first-light/video/007-First-Light-video-block-01-en-08jul25.mp4",
  graphic: "https://gmedia.playstation.com/is/content/SIEPDC/global_pdc/en/games/pdps/i/in/indiana-jones-and-the-great-circle/video/Indiana-Jones-and-The-Great-Circle-Spirit-Of-Discovery-Video-01-19mar25.mp4",
};

let _lastIndex = -1;  // 듀얼센스 비디오 재생
let _benefitSwiper = null;

let _popularTopSwiper = null;
let _popularBottomSwiper = null;
let _newTopSwiper = null;
let _newBottomSwiper = null;
let _promoTopSwiper = null;
let _promoBottomSwiper = null;

let _exclusiveThumbSwiper = null;
let _exclusiveRowSwiper = null;
let _planSwiper = null;



/* ========================================
DOM Element
======================================== */
const $consoleSec = document.querySelector("#consoleSec");
const $consoleContent = document.querySelector(".console__content");
const $consoleContentTitle = document.querySelector(".console__content__title");
const $consoleContentVisual = document.querySelector(".console__content__visual");

const $controllerSec = document.querySelector("#controllerSec");
const $controllerCards = document.querySelectorAll(".controller__content__info");
const $controllerVideos = document.querySelectorAll(".content__info__video video");

const $audioSec = document.querySelector("#audioSec");
const $audioMask = document.querySelector(".audio");
const $audioInner = document.querySelector("#audioSec .inner");

const $benefitSec = document.getElementById('psBenefitSec');
const $benefitVideo = document.getElementById('benefitVideo');
const $benefitSwiperEl = document.getElementById('benefitSwiper');
const $benefitSlides = document.querySelectorAll('.swiper-slide.benefit');
const $benefitPlayBtns = document.querySelectorAll('.benefit__play');

const $gameCDSlides = document.querySelectorAll('.gameCD__display-wrap .swiper-slide');

const $exclusiveSec = document.querySelector("#exclusiveSec");
const $exclusiveTitle = document.querySelector("#exclusiveAni");
const $exclusiveSlides = document.querySelectorAll('#exclusiveThumbSwiper .swiper-slide');

const $planSec = document.querySelector("#psPlusSec");
const $planBottoms = document.querySelectorAll(".content__card__bottom");

const $newsCards = document.querySelectorAll('.mainNews__card');



/* ========================================
Execute Functions
======================================== */
// 로드 시 초기화
gsap.registerPlugin(ScrollTrigger);

// 페이지 전체 gsap
window.addEventListener('resize', () => {
  clearTimeout(_resizeTimer);
  _resizeTimer = setTimeout(screenResize, 250); // 디바운스 적용
});

/* === section: 메인 비주얼 === */
const mainswiper = new Swiper("#mainSwiper", {
  loop: true,
  effect:'fade',
  navigation: {
    nextEl: "#mainSwiper .swiper-button-next",
    prevEl: "#mainSwiper .swiper-button-prev",
  },
  pagination: {
    el: ".swiper-pagination",
  },
});

/* === section: PS5 기기 애니메이션 === */

/* === section: 듀얼센스 애니메이션 === */

/* === section: 헤드셋 애니메이션 === */

/* === section: PlayStation 장점 === */
destroyBenefitSwiper(); // pc 기준 초기 상태

/* 장점 버튼 클릭 */
$benefitPlayBtns.forEach(btn => {
  btn.addEventListener('click',  benefitPlayBtnsClick);
});

/* === section: 게임 cd 전시 === */
const bannerSwiper = new Swiper("#bannerSwiper", {
  loop: true,
  autoplay: {
    delay: 5000,              
    disableOnInteraction: false, 
  },
  navigation: {
    nextEl: "#bannerSwiper .swiper-button-next",
    prevEl: "#bannerSwiper .swiper-button-prev",
  },
});

destroyCdSwiper();  // pc 기준 초기 상태

/* 슬라이드 클릭 시 게임 상세로 이동 */
$gameCDSlides.forEach(slide => {
  slide.addEventListener('click', gamesClick);
});

/* === section: 독점작 게임 === */
destroyExclusiveSwiper(); // pc 기준 초기 상태

/* 슬라이드 클릭 시 게임 상세로 이동 */
$exclusiveSlides.forEach(slide => {
  slide.addEventListener('click', gamesClick);
});

/* === section: 요금제 안내 === */
destroyPlanSwiper(); // pc 기준 초기 상태

/* === section: 소식과 뉴스 === */
$newsCards.forEach(card => {
  card.addEventListener('click', newsCardClick);
});




/* ========================================
Define Functions
======================================== */
/* gsap 초기화 */
function initAll() {
  // 1. 모든 ScrollTrigger 인스턴스 제거 (revert가 있어야 핀 여백이 삭제됨)
  ScrollTrigger.getAll().forEach(st => {
    st.revert();
    st.kill();
  });

  // 2. GSAP이 오염시킨 인라인 스타일 완전 청소
  gsap.set([
    $consoleContentTitle, $consoleContentVisual, $consoleContent,
    $controllerCards, $audioMask, $audioInner,
    $exclusiveTitle, $planBottoms
  ], { clearProps: "all" });

  gsap.set($exclusiveTitle, { x: -800, opacity: 0, autoAlpha: 0 });
  gsap.set($planBottoms, { height: 0, opacity: 0 });

  _lastIndex = -1;
  // 3. 공통 애니메이션 실행 (콘솔 섹션은 모든 기기 공통이므로 여기서 실행)
  initConsoleAnimation();
}

/* === section: 메인 비주얼 === */

/* === section: PS5 기기 애니메이션 === */
/* PS5 기기 텍스트, 이미지 교차, 원 애니메이션 */
function initConsoleAnimation() {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: $consoleSec,
      start: "top 50%",
      toggleActions: "play none none none",
    },
  });

  tl.from($consoleContentTitle, { y: -100, opacity: 0, duration: 1, ease: "power2.out" }, 0)
    .from($consoleContentVisual, { y: 100, opacity: 0, duration: 1, ease: "power2.out" }, 0);

  gsap.to($consoleContent, {
    "--circle-scale": 1,
    duration: 1.2,
    ease: "back.out(1.7)",
    scrollTrigger: {
      trigger: $consoleSec,
      start: "top 80%",
      toggleActions: "play none none none",
    },
  });
}

/* === section: 듀얼센스 애니메이션 === */
/* PC 기준 섹션 가로 스크롤 애니메이션 */
function initControllerPc() {
  gsap.set($controllerCards, { x: 600, opacity: 0, autoAlpha: 0 });
  gsap.set($controllerCards[0], { x: 0, opacity: 1, autoAlpha: 1 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: $controllerSec,
      start: "top top",
      end: "+=2000",
      pin: true,
      scrub: 1,
      anticipatePin: 1,
      onUpdate: (self) => {
        const currentIndex = Math.min(
          Math.floor(self.progress * $controllerCards.length),
          $controllerCards.length - 1
        );

        if (currentIndex !== _lastIndex) {
          controlVideo(currentIndex);
          _lastIndex = currentIndex;
        }
      },
    },
  });

  $controllerCards.forEach((card, index) => {
    if (index === 0) return;

    const prevCard = $controllerCards[index - 1];

    // 이전 카드가 먼저 나가기 시작
    tl.to(prevCard, {
      x: -300,
      autoAlpha: 0,
      duration: 0.6,
      ease: "power2.in"
    }, index)
      // 약간의 간격을 두고 새 카드 등장 (overlap 조절)
      .fromTo(card,
        { x: 600, autoAlpha: 0 },
        { x: 0, autoAlpha: 1, duration: 0.6, ease: "power4.out" },
        index + 0.7  // 0.3초 지연 (이 값을 조절해서 여백 조정)
      );
  });
}

/* 가로 스크롤에서 가운데 위치 시에만 영상 재생 */
function controlVideo(activeIndex) {
  $controllerVideos.forEach((video, idx) => {
    if (idx === activeIndex) {
      const playPromise = video.play();
      if (playPromise) playPromise.catch(() => {});
    } else {
      video.pause();
    }
  });
}

/* 모바일 기준 설명 카드 위로 플로팅 */
function initControllerMobile() {
  $controllerCards.forEach((card, index) => {
    gsap.from(card, {
      y: 50,
      opacity: 0,
      duration: 1,
      scrollTrigger: {
        trigger: card,
        start: "top 85%",
        toggleActions: "play none none none",
        onEnter: () => $controllerVideos[index]?.play(),
      },
    });
  });
}


/* === section: 헤드셋 애니메이션 === */
/* PC 기준 오디오 섹션 백그라운드 클립 원 애니메이션 */
function initAudioPc() {
  gsap.set($audioMask, { clipPath: "circle(0% at 50% 50%)" });

  gsap.to($audioMask, {
    clipPath: "circle(100% at 50% 50%)",
    duration: 1.5,
    ease: "power2.inOut",
    scrollTrigger: {
      trigger: $audioSec,
      start: "top 80%",
      toggleActions: "play none none none",
      once: true,
    },
  });
}

/* 모바일 기준 오디오 섹션 백그라운드 클립 원 애니메이션 */
function initAudioMobile() {
  gsap.set($audioMask, { clipPath: "circle(0% at 50% 50%)" });

  gsap.to($audioMask, {
    clipPath: "circle(150% at 50% 50%)",
    duration: 2.5,
    ease: "power2.inOut",
    scrollTrigger: {
      trigger: $audioSec,
      start: "top 80%",
      once: true,
    },
  });
}

/* === section: PlayStation 장점 === */
/* 장점 재생 버튼 클릭 */
function benefitPlayBtnsClick(){
  const dataBenefit = this.closest('.benefit').dataset.benefit;
  const videoSrc = BENEFIT_VIDEO[dataBenefit];

  if(!videoSrc) return;

  // active 토글
  $benefitPlayBtns.forEach(i => i.classList.remove('active'));
  this.classList.add('active');

  // 비디오 변경
  changeVideo(videoSrc);

  // autoplay 재생
  autoplayVideo();
}

/* 장점 비디오 변경 */
function changeVideo(videoSrc){
  $benefitVideo.pause();
  $benefitVideo.removeAttribute('autoplay');
  $benefitVideo.src = videoSrc;
  $benefitVideo.load();
}

/* 장점 비디오 재생 */
function autoplayVideo(){
  $benefitVideo.setAttribute('autoplay', '');
  $benefitVideo.muted = true;
  $benefitVideo.play().catch(() => {});
}

/* 장점 비디오 썸네일 스와이퍼와 맞추기 */
function syncBenefitVideoWithActiveSlide(){
  if(!_benefitSwiper || !$benefitSwiperEl || !$benefitVideo) return;

  const $activeSlide = $benefitSwiperEl.querySelector('.swiper-slide-active');
  if(!$activeSlide) return;

  const key = $activeSlide.dataset.benefit;
  const videoSrc = BENEFIT_VIDEO[key];
  if(!videoSrc) return;

  // 썸네일 변경
  changeVideo(videoSrc);

  // 바뀐 슬라이드의 play 버튼에 active 클래스 추가
  $benefitPlayBtns.forEach(i => i.classList.remove('active'));
  const $btn = $activeSlide.querySelector('.benefit__play');
  if($btn) $btn.classList.add('active');
}

/* 장점 스와이퍼 재생성 */
function initBenefitSwiper(){
  if(_benefitSwiper) return;

  _benefitSwiper = new Swiper("#benefitSwiper", {
    direction: "vertical",
    slidesPerView: 1,
    speed: 600,
    mousewheel: true,
  });

  syncBenefitVideoWithActiveSlide(); // 썸네일 초기화

  // 활성화 슬라이드가 완전히 바뀐 후 비디오 썸네일 변경
  _benefitSwiper.on('slideChangeTransitionEnd', function(){
    syncBenefitVideoWithActiveSlide();
  });
}

/* 장점 스와이퍼 해제 */
function destroyBenefitSwiper(){
  if(!_benefitSwiper) return;

  _benefitSwiper.destroy(true, true);
  _benefitSwiper = null;
}

/* === section: 게임 cd 전시 === */
/* 게임 CD 분류 탭 사이즈 조절 */
function setCdTabSize(size){ // size: 'small' 또는 'medium'
  const $cdTab = document.querySelector('#gameCDSec .tab-wrap--dark');
  if(!$cdTab) return;

  $cdTab.classList.remove('tab-wrap--small', 'tab-wrap--medium');
  $cdTab.classList.add(size === 'small' ? 'tab-wrap--small' : 'tab-wrap--medium');
}

/* 게임 CD 스와이퍼 재생성 템플릿 */
function initCdSwipersFunc(swVar, swId){
  swVar = new Swiper(swId, {
    loop: true,
    slidesPerView: 1,
    centeredSlides: true,
    spaceBetween: 24,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    breakpoints: {
      414: {
        slidesPerView: 1.2,
        centeredSlides: false,
      },
      600: {
        slidesPerView: 1.5,
        centeredSlides: false,
      },
      769: {
        slidesPerView: 2,
        centeredSlides: false,
      },
      960: {
        slidesPerView: 3,
        centeredSlides: false,
      },
      1025: {
        slidesPerView: 3.5,
        centeredSlides: false,
      },
    },
  });
}

/* 게임 CD 스와이퍼 해제 템플릿 */
function destroyCdSwipersFunc(sw){
  sw.destroy(true, true);
  sw = null;
}

function initCdSwiper(){
  if(_popularTopSwiper || _popularBottomSwiper || _newTopSwiper || _newBottomSwiper || _promoTopSwiper|| _promoBottomSwiper) return;

  initCdSwipersFunc(_popularTopSwiper, "#popularTopSwiper");
  initCdSwipersFunc(_popularBottomSwiper, "#popularBottomSwiper");
  initCdSwipersFunc(_newTopSwiper, "#newTopSwiper");
  initCdSwipersFunc(_newBottomSwiper, "#newBottomSwiper");
  initCdSwipersFunc(_promoTopSwiper, "#promoTopSwiper");
  initCdSwipersFunc(_promoBottomSwiper, "#promoBottomSwiper");
}

/* 게임 CD 스와이퍼 해제 */
function destroyCdSwiper(){
  if(!_popularTopSwiper || !_popularBottomSwiper || !_newTopSwiper || !_newBottomSwiper || !_promoTopSwiper|| !_promoBottomSwiper) return;

  destroyCdSwipersFunc(_popularTopSwiper);
  destroyCdSwipersFunc(_popularBottomSwiper);
  destroyCdSwipersFunc(_newTopSwiper);
  destroyCdSwipersFunc(_newBottomSwiper);
  destroyCdSwipersFunc(_promoTopSwiper);
  destroyCdSwipersFunc(_promoBottomSwiper);
}

/* === section: 독점작 게임 === */
/* 독점작 섹션 타이틀 */
function initExclusiveTitleAnimation() {
  // 초기 상태 설정
  gsap.set($exclusiveTitle, { x: -800, opacity: 0, autoAlpha: 0 });

  gsap.to($exclusiveTitle, {
    x: 0,
    opacity: 1,
    autoAlpha: 1,
    duration: 1.2,
    ease: "power3.out",
    scrollTrigger: {
      trigger: $exclusiveSec,
      start: "top 50%", // 섹션이 화면 50% 지점에 도달하면 시작
      toggleActions: "play none none none", // 한 번만 실행
    }
  });
}

/* 독점작 스와이퍼 재생성 */
function initExclusiveSwiper(){
  if(_exclusiveThumbSwiper || _exclusiveRowSwiper) return;

  _exclusiveRowSwiper = new Swiper("#exclusiveRowSwiper", {
    loop: true,
    slidesPerView: 2.5,
    spaceBetween: 12,
    centeredSlides: true,
    centeredSlidesBounds: true,
    slideToClickedSlide: true,
    watchSlidesProgress: true,
    breakpoints: {
      769: {
        spaceBetween: 20
      },
    }
  });

  _exclusiveThumbSwiper = new Swiper("#exclusiveThumbSwiper", {
    loop: true,
    effect: "fade",
    fadeEffect: {
      crossFade: true,
    },
    thumbs: {
      swiper: _exclusiveRowSwiper,
    },
  });
}

/* 독점작 스와이퍼 해제 */
function destroyExclusiveSwiper(){
  if(!_exclusiveThumbSwiper || !_exclusiveRowSwiper) return;

  _exclusiveRowSwiper.destroy(true, true);
  _exclusiveRowSwiper = null;

  _exclusiveThumbSwiper.destroy(true, true);
  _exclusiveThumbSwiper = null;
}


/* === section: 요금제 안내 === */
/* 영역에 도달 시 회색 박스 아래로 슬라이딩 */
function initPlanAnimation() {
  gsap.to($planBottoms, {
    height: 1200,
    opacity: 1,
    duration: 1,
    ease: "power2.inOut",
    stagger: 0.2,
    scrollTrigger: {
      trigger: $planSec,
      start: "top 40%",
      toggleActions: "play none none none",
    }
  });
}

/* 요금제 스와이퍼 초기화 */
function initPlanSwiper() {
  if (_planSwiper) return;

  _planSwiper = new Swiper("#planSwiper", {
    initialSlide: 1,
    centeredSlides: true,
    slidesPerView: 1.2,
    spaceBetween: 12,
    pagination: {
      el: "#planSwiper .swiper-pagination",
    },
    breakpoints: {
      500: {
        slidesPerView: 2.1,
        spaceBetween: 24,
        centeredSlides: true,
        allowTouchMove: true,
      },
    }
  });
}

/* 요금제 스와이퍼 해제 */
function destroyPlanSwiper(){
  if(!_planSwiper) return;

  _planSwiper.destroy(true, true);
  _planSwiper = null;
}



/* === section: 소식과 뉴스 === */
function newsCardClick(){
  $newsCards.forEach(i => i.classList.remove('active'));
  this.classList.add('active');
};



/* ========================================
Responsive - Execute function
======================================== */
window.addEventListener('resize', screenResize);
screenResize();

function screenResize(){
  const screenW = window.innerWidth;

  initAll();  // gsap 초기화

  if(screenW <= MO_BREAK_POINT){
    enterMo();
  }
  else if(MO_BREAK_POINT < screenW && screenW <= TAB_BREAK_POINT){
    enterTab();
  }
  else if(TAB_BREAK_POINT < screenW && screenW <= LAPTOP_BREAK_POINT){
    enterLaptop();
  }
  else{
    enterPc();
  }

  ScrollTrigger.refresh();
}

/* 기기 사이즈별 기능 분리 */
function enterMo(){
  initControllerMobile();
  initAudioMobile();
  initBenefitSwiper();
  setCdTabSize('small');
  initCdSwiper();
  initExclusiveSwiper();
  initPlanAnimation();
  initPlanSwiper();
}

function enterTab(){
  initControllerMobile();
  initAudioMobile();
  destroyBenefitSwiper();
  setCdTabSize('medium');
  initCdSwiper();
  initExclusiveSwiper();
  initPlanAnimation();
  initPlanSwiper();
};

function enterLaptop(){
  initControllerPc();
  initAudioPc();
  destroyBenefitSwiper();
  setCdTabSize('medium');
  initCdSwiper();
  initExclusiveTitleAnimation();
  destroyExclusiveSwiper();
  initPlanAnimation();
  destroyPlanSwiper();
}

function enterPc(){
  initControllerPc();
  initAudioPc();
  destroyBenefitSwiper();
  setCdTabSize('medium');
  destroyCdSwiper();
  initExclusiveTitleAnimation();
  destroyExclusiveSwiper();
  initPlanAnimation();
  destroyPlanSwiper();
}




/* if (window.jQuery && jQuery.fn && jQuery.fn.fullpage) {
  $('#indexFullPage').fullpage({
    sectionSelector: '.fp-section', // fullpage 단위 클래스명
    autoScrolling: false,
    scrollBar: true,
    scrollingSpeed: 750,
    scrollOverflow: false, // 섹션 높이가 100vh 넘는 경우
    fitToSection: false,
    normalScrollElements: '#benefitSwiper, #bannerSwiper',  // 해당 영역에선 fullpage가 스크롤 가로채지 않음
  });
} else {
  console.error('fullPage(jQuery plugin) not loaded');
} */