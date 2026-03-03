/* PS5게임 카드 섹션 / 그래픽 카드 섹션 */
const ps5GameSec_THRESHOLD = 0.4;
const ps5GraphicSec_THRESHOLD = 0.5;
const $ps5GameSec = document.getElementById('ps5GameSec');
const $ps5GraphicSec = document.getElementById('ps5GraphicSec');

observeOnce($ps5GameSec, moveGameCardAni, ps5GameSec_THRESHOLD);
observeOnce($ps5GraphicSec, moveGraphicCardAni, ps5GraphicSec_THRESHOLD);

function observeOnce(targetEl, playFunc, reachPercent) {
  // targetEl : 관찰 대상 DOM 요소
  // playFunc : 해당 영역에 들어왔을 때 실행시킬 함수
  // reachPercent : 해당 영역에 몇 % 들어왔을 때 콜백함수 실행시킬지 결정

  if (!targetEl) return;  // targetEl 없을 시 return

  let hasPlayed = false;

  // IntersectionObserver 생성자
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;  // 해당 섹션이 intersection되지 않았다면 rerutn
      if (hasPlayed) return;  // hasPlayed = true면 return

      hasPlayed = true;
      playFunc();

      observer.disconnect();  // 1회 실행 후 감시 해제
    });
  }, {
    threshold: reachPercent
  });

  // 대상 요소에 대한 감시 실행
  observer.observe(targetEl);
}

function moveGameCardAni(){
  const Gamecards = [
    document.getElementById('ps5GameCard03'),
    document.getElementById('ps5GameCard05'),
    document.getElementById('ps5GameCard09'),
  ]

  Gamecards.forEach(function(c){
    c.classList.add('active');
  })
}

function moveGraphicCardAni(){
  const GraphicCards = [
  document.getElementById('ps5GraphicCard01'),
  document.getElementById('ps5GraphicCard02'),
  document.getElementById('ps5GraphicCard03'),
  document.getElementById('ps5GraphicCard04'),
  document.getElementById('ps5GraphicCard05'),
]

  GraphicCards.forEach(function(g){
    g.classList.add('active');
  })
}



/* 무선 컨트롤러 섹션 */
gsap.registerPlugin(ScrollTrigger);

window.addEventListener("load", () => {
  // =========================
  // 1) Swiper
  // =========================
  const textSwiper = new Swiper("#textSwiper", {
    direction: "vertical",
    speed: 700,
    allowTouchMove: false,
    slidesPerView: 1,
    centeredSlides: false,
    breakpoints: {
      769: { slidesPerView: 3, centeredSlides: true },
    },
  });

  const videoSwiper = new Swiper("#videoSwiper", {
    direction: "vertical",
    speed: 700,
    allowTouchMove: false,
  });

  // =========================
  // 2) Common DOM
  // =========================
  const sectionEl = document.querySelector("#ps5DualSenseSec");
  const swiperWrap = document.querySelector(".ps5-dualsense__swiper");
  const totalSlides = videoSwiper.slides.length;

  // PC 버튼 요소
  const btnRect = document.querySelector(".btn-rect");
  const btnX = document.querySelector(".btn-x");
  const btnCircle = document.querySelector(".btn-circle");
  const btnWrap = document.querySelector(".ps5-dualsense__btn");

  // 오른쪽(3시)=0, 아래(6시)=90, 왼쪽(9시)=180, 위(12시)=270
  const BASE_ANGLES = { rect: 270, x: 0, circle: 180 };

  const normDeg = (d) => ((d % 360) + 360) % 360;
  const angDiff = (a, b) => {
    const diff = Math.abs(normDeg(a) - normDeg(b));
    return Math.min(diff, 360 - diff);
  };

  function updateButtonsOpacity(rotationDeg) {
    if (!btnWrap) return;

    const rot = normDeg(rotationDeg);
    const LEFT = 180;
    const threshold = 8;

    const rectAngle = normDeg(BASE_ANGLES.rect + rot);
    const xAngle = normDeg(BASE_ANGLES.x + rot);
    const circleAngle = normDeg(BASE_ANGLES.circle + rot);

    gsap.to(btnRect, { opacity: angDiff(rectAngle, LEFT) <= threshold ? 1 : 0.3, duration: 0.2, overwrite: true });
    gsap.to(btnX, { opacity: angDiff(xAngle, LEFT) <= threshold ? 1 : 0.3, duration: 0.2, overwrite: true });
    gsap.to(btnCircle, { opacity: angDiff(circleAngle, LEFT) <= threshold ? 1 : 0.3, duration: 0.2, overwrite: true });
  }

  function killAll() {
    ScrollTrigger.getById("dualSensePinDesktop")?.kill(true);
    ScrollTrigger.getById("dualSenseMobileLock")?.kill(true);

    // pin 잔상 제거
    gsap.set(swiperWrap, { clearProps: "all" });

    // 버튼 초기화
    if (btnWrap) {
      gsap.set(btnWrap, { "--after-op": 0.3, clearProps: "transform,rotation" });
      updateButtonsOpacity(0);
    }

    ScrollTrigger.refresh();
  }

  // =========================
  // 3) Desktop/Tablet (PC 버튼 효과 유지)
  // =========================
  function enableDesktopTablet() {
    killAll();

    // PC/탭에서는 controller로 텍스트-비디오 동기화
    videoSwiper.controller.control = textSwiper;
    textSwiper.controller.control = videoSwiper;

    let afterLocked = false;

    ScrollTrigger.create({
      id: "dualSensePinDesktop",
      trigger: swiperWrap,
      start: "top top",
      end: "+=3000",
      pin: true,
      pinSpacing: true,
      scrub: 1,

      onEnter: () => {
        if (btnWrap && !afterLocked) {
          gsap.set(btnWrap, { "--after-op": 0.3 });
          afterLocked = true;
        }
        const r = (btnWrap && gsap.getProperty(btnWrap, "rotation")) || 0;
        updateButtonsOpacity(r);
      },

      onEnterBack: () => {
        if (btnWrap && !afterLocked) {
          gsap.set(btnWrap, { "--after-op": 0.3 });
          afterLocked = true;
        }
        const r = (btnWrap && gsap.getProperty(btnWrap, "rotation")) || 0;
        updateButtonsOpacity(r);
      },

      onUpdate: (self) => {
        let targetIndex = Math.floor(self.progress * totalSlides);
        if (targetIndex >= totalSlides) targetIndex = totalSlides - 1;

        if (videoSwiper.activeIndex !== targetIndex) {
          videoSwiper.slideTo(targetIndex);

          // 버튼 회전 + 투명도 하이라이트
          if (btnWrap) {
            const rotation = targetIndex * -90;

            gsap.to(btnWrap, {
              rotation,
              duration: 0.8,
              overwrite: true,
              onUpdate: () => {
                const r = gsap.getProperty(btnWrap, "rotation") || 0;
                updateButtonsOpacity(r);
              },
              onComplete: () => {
                const r = gsap.getProperty(btnWrap, "rotation") || 0;
                updateButtonsOpacity(r);
              },
            });
          }
        }
      },
    });

    // 초기 상태
    if (btnWrap) {
      gsap.set(btnWrap, { "--after-op": 0.3 });
      updateButtonsOpacity(0);
    }

    ScrollTrigger.refresh();
  }

  // =========================
  // 4) Mobile (한 번에 1칸 + 확 내려감 방지)
  // =========================
  const textEl = document.querySelector("#textSwiper");
  const wrapper = textEl.querySelector(".swiper-wrapper");
  const slides = Array.from(textEl.querySelectorAll(".swiper-slide"));

  let lock = false;
  let busy = false;
  let idx = 0;
  const transitions = Math.max(totalSlides - 1, 1);

  const getStep = () => {
    const first = slides[0];
    const mb = parseFloat(getComputedStyle(first).marginBottom) || 0;
    return first.offsetHeight + mb;
  };

  const applyIndex = (i) => {
    gsap.to(wrapper, { y: -i * getStep(), duration: 0.25, overwrite: true });
    videoSwiper.slideTo(i);
    textSwiper.slideTo(i);
  };

  const unlockToNext = (dir) => {
    lock = false;
    window.scrollBy({ top: dir > 0 ? 2 : -2, left: 0, behavior: "auto" });
  };

  const stepOnce = (dir) => {
    if (!lock || busy) return;

    // 마지막에서 아래로 더 내리면 풀고 다음 섹션
    if (dir > 0 && idx >= transitions) {
      unlockToNext(dir);
      return;
    }
    // 첫 카드에서 위로 더 올리면 풀고 위로 이동
    if (dir < 0 && idx <= 0) {
      unlockToNext(dir);
      return;
    }

    busy = true;
    idx = Math.min(transitions, Math.max(0, idx + dir));
    applyIndex(idx);
    setTimeout(() => (busy = false), 480);
  };

  const onWheel = (e) => {
    if (!lock) return;
    e.preventDefault();
    stepOnce(e.deltaY > 0 ? 1 : -1);
  };

  let touchStartY = 0;

  const onTouchStart = (e) => {
    if (!lock) return;
    touchStartY = e.touches[0].clientY;
  };

  const onTouchMove = (e) => {
    if (!lock) return;
    e.preventDefault();
  };

  const onTouchEnd = (e) => {
    if (!lock) return;
    const endY = e.changedTouches?.[0]?.clientY ?? touchStartY;
    const diff = touchStartY - endY;
    if (Math.abs(diff) < 18) return;
    stepOnce(diff > 0 ? 1 : -1);
  };

  function bindMobileCapture() {
    // 섹션에서만 가로채기 (다음 섹션 영향 X)
    sectionEl.addEventListener("wheel", onWheel, { passive: false });
    sectionEl.addEventListener("touchstart", onTouchStart, { passive: false });
    sectionEl.addEventListener("touchmove", onTouchMove, { passive: false });
    sectionEl.addEventListener("touchend", onTouchEnd, { passive: false });
  }

  function unbindMobileCapture() {
    sectionEl.removeEventListener("wheel", onWheel);
    sectionEl.removeEventListener("touchstart", onTouchStart);
    sectionEl.removeEventListener("touchmove", onTouchMove);
    sectionEl.removeEventListener("touchend", onTouchEnd);
  }

  function enableMobile() {
    killAll();

    // 모바일에서는 Swiper controller 끄기(translate3d 간섭 방지)
    videoSwiper.controller.control = null;
    textSwiper.controller.control = null;

    // 이벤트 바인딩
    unbindMobileCapture();
    bindMobileCapture();

    // 초기화
    lock = true;      
    busy = false;
    idx = 0;

    gsap.set(wrapper, { y: 0 });
    videoSwiper.slideTo(0, 0);
    textSwiper.slideTo(0, 0);

    // 섹션을 벗어나면 lock 해제 (ScrollTrigger는 판정만 사용)
    ScrollTrigger.create({
      id: "dualSenseMobileLock",
      trigger: sectionEl,
      start: "top bottom",
      end: "bottom top",
      onEnter: () => { lock = true; },
      onEnterBack: () => { lock = true; },
      onLeave: () => { lock = false; },
      onLeaveBack: () => { lock = false; },
    });

    ScrollTrigger.refresh();
  }

  // =========================
  // 5) Apply
  // =========================
  function applyByWidth() {
    if (window.matchMedia("(max-width: 768px)").matches) {
      enableMobile();
    } else {
      unbindMobileCapture();
      enableDesktopTablet();
    }
  }

  applyByWidth();
  window.addEventListener("resize", applyByWidth);
});







/* 나에게 맞는 콘솔기기 섹션 */
const $consoleWrap = document.querySelector('.console__wrap');
const $consoleCards = document.querySelectorAll('.console__card');

$consoleCards.forEach(card => {
  card.addEventListener('click', consoleCardClick);
});

function consoleCardClick(){
  $consoleCards.forEach(i => i.classList.remove('active'));
  this.classList.add('active');

  // not(.active) 효과 켜기
  $consoleWrap.classList.add('is-active');
}