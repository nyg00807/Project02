/* ========================================
Define Variables
======================================== */
const $mediaGallery = document.getElementById('mediaGallery');
const mediaGallSwiper = new Swiper("#mediaGallSwiper", {
  effect: "fade",
  pagination: {
    el: "#mediaGallSwiper .swiper-pagination",
    clickable: true,
  },
  on: {
    init(){
      syncBgWithActiveSlide(this);
    },
    slideChangeTransitionEnd(){
      syncBgWithActiveSlide(this);
    },
  },
});



/* ========================================
DOM Element
======================================== */
const $gameMainVideo = document.getElementById('gameMainVideo');
const $gameMainLogo = document.getElementById('gameMainLogo');
const $gameMainDev = document.getElementById('gameMainDev');
const $originalPrice = document.getElementById('originalPrice');
const $discountPercent = document.getElementById('discountPercent');
const $totalPrice = document.getElementById('totalPrice');
const $gameStarPoint = document.getElementById('gameStarPoint');


const $mediaGall01 = document.getElementById('mediaGall01');
const $mediaGall02 = document.getElementById('mediaGall02');
const $mediaGall03 = document.getElementById('mediaGall03');
const $mediaGall04 = document.getElementById('mediaGall04');
const $mediaGall05 = document.getElementById('mediaGall05');
const $mediaGall06 = document.getElementById('mediaGall06');
const $mediaGallSwiper_PaginationBullets = document.querySelectorAll('#mediaGallery .swiper-pagination-bullet');

const $mustPlay01 = document.querySelector('.must-play01');
const $mustPlay02 = document.querySelector('.must-play02');
const $mustPlay03 = document.querySelector('.must-play03');

const $reviewSec = document.getElementById('reviewSec');
const $perfectScore = document.getElementById('perfectScore');
const $playerNum = document.getElementById('playerNum');
const $allReview = document.getElementById('allReview');
const $award = document.getElementById('award');
const $moreReviewBtn = document.getElementById('moreReviewBtn');



/* ========================================
Execute Functions
======================================== */
/* 쿼리스트링으로 게임 정보 렌더링 */
renderGameInfo();

/* 미디어 갤러리 텍스트 페이지네이션 생성 */
function createMediaGallSwiperPagination(bullet){
  const $realBullet = document.createElement('span');
  const $bulletTxt = document.createElement('span');
  const $bulletArrow = document.createElement('i');

  $realBullet.classList.add('real-bullet');
  $bulletTxt.classList.add('bullet-text');
  $bulletArrow.classList.add('bi', 'bi-chevron-double-right', 'icon--medium');

  bullet.append($realBullet, $bulletTxt, $bulletArrow);
}


/* === section: 캐릭터 소개 === */
// 세로형 캐릭터 슬라이드
const crVerticalSwiper = new Swiper(".cr-vertical-swiper", {
  loop: true,
  direction: "vertical",
  centeredSlides: true,
  slidesPerView: 1,
  navigation: {
    nextEl: ".cr-vertical-swiper .swiper-button-next",
    prevEl: ".cr-vertical-swiper .swiper-button-prev",
  },
  pagination: {
    el: ".cr-vertical-swiper .swiper-pagination",
    clickable: true,
  },
  breakpoints: {
    1025: {
      slidesPerView: 3,
      spaceBetween: 48
    },
    769: {
      slidesPerView: 1,
      spaceBetween: 20
    },
  },
  on: {
    init(sw){
      toggleCrUI(sw);
    },
    breakpoint(sw){
      toggleCrUI(sw);
    },
  },
});

// 가로형 캐릭터 슬라이드
const crHorizontalSwiper = new Swiper(".cr-horizontal-swiper", {
  loop: true,
  slidesPerView: 1.5,
  spaceBetween: 12,
  navigation: {
    nextEl: ".cr-horizontal-swiper .swiper-button-next",
    prevEl: ".cr-horizontal-swiper .swiper-button-prev",
  },
  pagination: {
    el: ".cr-horizontal-swiper .swiper-pagination",
    clickable: true,
  },
  breakpoints: {
    1025: {
      slidesPerView: 3,
      spaceBetween: 24
    },
    769: {
      slidesPerView: 2,
      spaceBetween: 20
    },
  },
  on: {
    init(sw){
      toggleCrUI(sw);
    },
    breakpoint(sw){
      toggleCrUI(sw);
    },
  },
});


/* === section: 게임을 해야 하는 이유 === */
observeOnce($mustPlay01, () => $mustPlay01.classList.add('active'));
observeOnce($mustPlay02, () => $mustPlay02.classList.add('active'));
observeOnce($mustPlay03, () => $mustPlay03.classList.add('active'));

/* === section: 게임 리뷰 === */
observeReview();

$moreReviewBtn.addEventListener('click', moreReviewBtnClick);



/* ========================================
Define Functions
======================================== */
/* 화면에 게임 정보 렌더링 */
function renderGameInfo(){
  // url에서 게임 id값 읽기
  const queryString = new URLSearchParams(window.location.search);
  const urlGameId = String(queryString.get('id'));

  // 아이디값이 없는 경우
  if(!urlGameId){
    alert('존재하지 않는 게임입니다.');
    return;
  }
  else{
    // find: return 조건에 만족하는 첫 번째 요소 반환
    const gameObj = window.games.find(game => {
      return urlGameId == String(game.id);
    });

    // section: 게임 메인 비디오와 정보
    $gameMainVideo.src = `${gameObj.mainVideo}`;
    $gameMainLogo.src = `assets/img/games/${gameObj.id}/logo.${gameObj.logoExtension}`;
    $gameMainDev.innerText = `${gameObj.dev}`;
    $originalPrice.innerText = `${gameObj.originalPrice.toLocaleString()}`;
    $discountPercent.innerText = `${gameObj.discount}`;
    $totalPrice.innerText = (gameObj.originalPrice * (1 - gameObj.discount*0.01)).toLocaleString();
    $gameStarPoint.innerText = `${gameObj.star}`;

    // section: 미디어 갤러리와 유튜브 영상
    for(let i = 1; i <= 6; i++){
      document.getElementById(`mediaGall0${i}`).src = gameObj[`mediaGall0${i}`];
    }

    mediaGallSwiper.update();
    syncBgWithActiveSlide(mediaGallSwiper);

    $mediaGallSwiper_PaginationBullets.forEach(bullet => createMediaGallSwiperPagination(bullet));

    for(let i = 1; i <= 6; i++){
      const bulletText = document.querySelector(`#mediaGallSwiper .swiper-pagination-bullet:nth-child(${i}) .bullet-text`);

      if(bulletText){
        bulletText.innerText = gameObj[`dataMedia0${i}`];
      }
    }
    
    const $iframeWrap = document.createElement('div');
    const iframeCount = gameObj.iframeClass;   // 4 or 6

    $iframeWrap.classList.add(`iframe-wrap--${iframeCount}`);

    let iframeHTML = '';
    for(let i = 1; i <= iframeCount; i++){
      iframeHTML += gameObj[`iframe0${i}`];
    }

    $iframeWrap.innerHTML = iframeHTML;
    //트래픽 문제때문에 잠시 주석 처리
    document.querySelector('#mediaGallSec .inner').appendChild($iframeWrap);

    // section: 캐릭터 소개
    const $characterSwiper = document.querySelector('#characterSec .swiper');
    $characterSwiper.classList.add(`cr-${gameObj.crSlideDirection}-swiper`);

    const $leftQuotes = $characterSwiper.querySelectorAll('img[alt="quote"]:first-child');
    const $rightQuotes = $characterSwiper.querySelectorAll('img[alt="quote"]:last-child');

    if($characterSwiper.classList.contains('cr-vertical-swiper')){
      $leftQuotes.forEach(i => i.src = `assets/img/pages/game/quote_left.svg`);
      $rightQuotes.forEach(i => i.src = `assets/img/pages/game/quote_right.svg`);
    }
    else if($characterSwiper.classList.contains('cr-horizontal-swiper')){
      $leftQuotes.forEach(i => i.src = `assets/img/pages/game/quote_left_g.svg`);
      $rightQuotes.forEach(i => i.src = `assets/img/pages/game/quote_right_g.svg`);
    }

    for(let i = 1; i <= 5; i++){
      const $slide = $characterSwiper.querySelector(`.swiper-slide:nth-child(${i})`);

      $slide.querySelector('img').src = gameObj[`cr0${i}Img`];
      $slide.querySelector('.cr__name').innerText = gameObj[`cr0${i}Name`];
      $slide.querySelector('.line').innerText = gameObj[`cr0${i}Line`];
      $slide.querySelector('.cr__desc').innerText = gameObj[`cr0${i}Desc`];
    }

    // section: 게임을 해야 하는 이유
    const mustPlayList = [
      { el: $mustPlay01, idx: 1 },
      { el: $mustPlay02, idx: 2 },
      { el: $mustPlay03, idx: 3 },
    ];

    mustPlayList.forEach(({ el, idx }) => {
      const srcObj = gameObj[`mustPlay0${idx}Src`];
      const $video = el.querySelector('video');

      if(srcObj.type === 'video'){
        $video.src = srcObj.url;
      }else{
        $video.style.display = 'none';
        el.style.backgroundImage = `url(${srcObj.url})`;
      }

      el.querySelector('.must-play__title').innerText =
        gameObj[`mustPlay0${idx}Title`];

      el.querySelector('.must-play__desc').innerText =
        gameObj[`mustPlay0${idx}Desc`];
    });

    // 게임별 마우스 커서 커스텀
    if(gameObj.cursorSrc){
      document.body.style.cursor = `url('${gameObj.cursorSrc}') 20 20, auto`;
    }
  }
}

/* IntersectionObserver 공통 함수 */
function observeOnce(targetEl, callback) {
  if (!targetEl) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      callback();
      obs.disconnect(); // 1회 실행
    });
  }, {
    threshold: 0,
    rootMargin: "-30% 0px 0px 0px"
  });

  observer.observe(targetEl);
}


/* === section: 미디어 갤러리와 유튜브 영상 === */
/* 미디어 갤러리 슬라이드와 배경 연동 */
function syncBgWithActiveSlide(sw){
  const $activeSlide = sw.slides[sw.activeIndex];
  const imgUrl = $activeSlide.querySelector('img').getAttribute('src');
  if(!imgUrl) return;

  $mediaGallery.style.backgroundImage = `url("${imgUrl}")`;
}

/* 모바일 - 미디어 갤러리 사진 제목 요소 추가 */
function createMobileMediaGallData(){
  const $mediaGallSwiper = document.getElementById('mediaGallSwiper');

  // 이미 만들어졌으면 재생성 방지
  if($mediaGallSwiper.querySelector('.media-data--mo')) return;

  const $mediaData = document.createElement('div');
  $mediaData.classList.add('media-data--mo', 'title--m');

  $mediaGallSwiper.prepend($mediaData);

  // 최초 1회 텍스트 세팅
  updateMobileMediaText($mediaData);

  mediaGallSwiper.off('slideChange');
  
  // 슬라이드 변경 시 텍스트 변경
  mediaGallSwiper.on('slideChange', function(){
    updateMobileMediaText($mediaData);
  });
}

/* 모바일 - 미디어 갤러리 사진 제목에 텍스트 추가 */
function updateMobileMediaText($mediaData){
  const activeBullet = document.querySelector(
    '#mediaGallSwiper .swiper-pagination-bullet-active .bullet-text'
  );

  if(!activeBullet) return;

  $mediaData.innerHTML = activeBullet.innerText;
}

/* === section: 캐릭터 소개 === */
/* 캐릭터 스와이퍼 보조 요소 토글 */
function toggleCrUI(sw) {
  const w = window.innerWidth;

  if (w <= 768){
    sw.navigation.disable();
    sw.pagination.enable();
  }
  else{
    sw.pagination.disable();
    sw.navigation.enable();
  }
}

/* 가로 캐릭터 슬라이드 클릭 */
function horizontalSlidesClick(){
  if(crHorizontalSwiper){
    const $horizontalSlides = document.querySelectorAll('.cr-horizontal-swiper .swiper-slide');

    $horizontalSlides.forEach(slide => {
      slide.addEventListener('click', function(){
        if(!slide.classList.contains('active')){
          $horizontalSlides.forEach(i => i.classList.remove('active'));
          slide.classList.add('active');
        }
        else{
          $horizontalSlides.forEach(i => i.classList.remove('active'));
        }
      });
    });
  }
}


/* === section: 게임 리뷰 === */
function observeReview(){
  if(!$reviewSec) return;

  const observer = new IntersectionObserver((entries, obs) => {
    const entry = entries[0];
    if(!entry.isIntersecting) return;

    gradeCount($perfectScore, 95, 5);
    gradeCount($playerNum, 72, 3);
    gradeCount($allReview, 32, 2);
    gradeCount($award, 10, 1);

    obs.disconnect();
  },{
    threshold: 0.25,
    rootMargin: "0px 0px -20% 0px"
  });

  observer.observe($reviewSec);
}

function gradeCount(counter, targetNum, plusUnit){
  const target = targetNum;
  const speed = 50;
  let count = 0;

  const timer = setInterval(() => {
    count += plusUnit;  // 증가폭
    counter.innerText = count;

    if(count >= target){
      clearInterval(timer);
    }
  }, speed);
}

function moreReviewBtnClick(){
  document.querySelectorAll('.review').forEach(i => i.style.display = 'block');
  $moreReviewBtn.style.display = 'none';
}



/* ========================================
Responsive - Execute function
======================================== */
window.addEventListener('resize', screenResize);
screenResize();

function screenResize(){
  const screenW = window.innerWidth;

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
}

/* 기기 사이즈별 기능 분리 */

function enterMo(){
  createMobileMediaGallData();
  horizontalSlidesClick();
}

function enterTab(){
  horizontalSlidesClick();
}

function enterLaptop(){
  
}

function enterPc(){
  
}




