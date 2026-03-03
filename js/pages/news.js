/* 버튼 링크 연결 */
const buttons = document.querySelectorAll('.btnLink');

buttons.forEach(btn => {
  btn.addEventListener('click', function () {
    const url = this.dataset.url;
    window.open(url, '_blank');
  });
});



/* 블로그 최신 뉴스 섹션 */
const cards = document.querySelectorAll('#recentNewsSec .recentNews__card');

cards.forEach(card => {
  card.addEventListener('click', () => {
    card.classList.toggle('is-open');
  });
});



/* 최신 월간 게임 섹션 */
let _monthGameSwiper = null;

const $monthGameSec = document.querySelector("#monthGameSec");
const $monthGameSwiperEl = document.getElementById("monthGameSwiper");
const $monthGameSwiperSlides = document.querySelectorAll('#monthGameSwiper .swiper-slide');


/* 최신 월간 게임 스와이퍼 활성화 */
function initMonthGameSwiper() {
  if (_monthGameSwiper || !$monthGameSwiperEl) return;

  _monthGameSwiper = new Swiper("#monthGameSwiper", {
    loop: true,
    slidesPerView: 1,       
    spaceBetween: 20,
    centeredSlides: true,  
    autoplay: {
      delay: 5000,              
      disableOnInteraction: false, 
    },  
    pagination: {
      el: "#monthGameSec .swiper-pagination",
      clickable: true,
    },
    breakpoints: {
      768: {
        slidesPerView: 2.2,
        spaceBetween: 20,
      },
    },
  });
}

function destroyMonthGameSwiper() {
  if (!_monthGameSwiper) return;

  _monthGameSwiper.destroy(true, true);
  _monthGameSwiper = null;
}

function enterMo(){
  initMonthGameSwiper();
}
function enterTab(){
  initMonthGameSwiper();
};
function enterLaptop(){
  destroyMonthGameSwiper();
}
function enterPc(){
  destroyMonthGameSwiper();
}


const TAB_MAX = 1024;

function handleResize() {
  const width = window.innerWidth;

  if (width <= TAB_MAX) {
    initMonthGameSwiper();
  } else {
    destroyMonthGameSwiper();
  }
}
window.addEventListener('load', handleResize);
window.addEventListener('resize', handleResize);

// 최신 월간 게임 섹션 클릭 시 게임 상세로 이동
$monthGameSwiperSlides.forEach(slide => {
  slide.addEventListener('click', gamesClick);
});


/* 에디터 초이스 섹션 */
const $choiceGrid = document.querySelector('#choiceSec .choice__grid');
const $choiceCards = document.querySelectorAll('#choiceSec .choice__card');

let _activeChoiceCard = null;

$choiceCards.forEach(card => {
  card.addEventListener('click', function (e) {
    const isTabOrMo = window.innerWidth <= window.TAB_BREAK_POINT; 
    const isSameCard = _activeChoiceCard === this;

    // PC: 바로 이동
    if (!isTabOrMo) {
      gamesClick(e); 
      return;
    }
    if (isSameCard) {
      // 두 번째 탭: 이동
      gamesClick(e);
      return;
    }

    // 첫 번째 탭: active 처리
    _activeChoiceCard = this;

    $choiceCards.forEach(i => i.classList.remove('active'));
    this.classList.add('active');

    // not(.active) 효과 켜기
    if ($choiceGrid) $choiceGrid.classList.add('is-active');
  });
});

/* 카드 밖 클릭하면 active 해제 */
/* document.addEventListener('click', (e) => {
  const isTabOrMo = window.innerWidth <= window.TAB_BREAK_POINT;
  if (!isTabOrMo) return;

  if (!e.target.closest('#choiceSec .choice__grid')) {
    _activeChoiceCard = null;
    $choiceCards.forEach(i => i.classList.remove('active'));
    if ($choiceGrid) $choiceGrid.classList.remove('is-active');
  }
}); */
