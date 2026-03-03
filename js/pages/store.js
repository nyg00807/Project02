/* ========== DOM Element ========== */
const $overlay = document.querySelector('#overlay');
const $wishlistPanel = document.querySelector('.wishlist__panel');
const $wishlistList = document.querySelector('.wishlist__list');
const $wishlistCount = document.querySelector('.wishlist__count');
const $wishlistOpenBtn = document.querySelector('.wishlist');
const $wishlistCloseBtn = document.querySelector('.wishlist__x');
const $wishlistAllDelete = document.querySelector('.wishlist__all__delete');

const $cardContainer = document.querySelector('.game__cards');
const $paginationContainer = document.querySelector('#pagination');
const $searchInputs = document.querySelectorAll('.input-field--medium');
const $filterTitles = document.querySelectorAll('.filter__title');
const $filterItems = document.querySelectorAll('.accordion li');

const $resetBtn = document.querySelector('.page-button-center .btn--solid-blue');
const $filterMobileCloseBtn = document.querySelector('.page-button-center .btn--solid-purple');

const $toggleBtn = document.querySelector('.tab__filter__btn .btn--solid-blue');
const $filterBox = document.querySelector('.filter__box');
const $closeBtn = document.querySelector('.x__btn');

/* ========== Define Variables ========== */
let wishlistItems = JSON.parse(localStorage.getItem('wishlistItems')) || [];
let itemsPerPage = 8;
let currentPage = 1;
let currentFilteredGames = [...games];
let activeFilters = { genre: [], star: null, price: null, searchTerm: "" };

const genreMap = {
  "공포": "horror", "사이버펑크": "cyber", "소울라이크": "soul",
  "슈팅": "shoot", "스토리": "story", "시네마틱": "cinematic",
  "액션": "action", "어드벤처": "adventure", "오픈월드": "openworld",
  "판타지": "fantasy", "퍼즐": "puzzle", "협동": "cowork", "SF": "sf", "RPG": "rpg"
};
const genreMapKor = {};
Object.keys(genreMap).forEach(key => { genreMapKor[genreMap[key]] = key; });

/* ========== Execute Functions ========== */
renderCards(currentPage, currentFilteredGames);
updateWishlistUI();

// 필터 아코디언 제어
$filterTitles.forEach($title => {
  $title.addEventListener('click', () => {
    const $wrap = $title.closest('.filter__wrap');
    const $accordion = $wrap.querySelector('.accordion');
    const isActive = $title.classList.contains('active');
    $filterTitles.forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.accordion').forEach(a => a.classList.remove('active'));
    if (!isActive) { $title.classList.add('active'); $accordion.classList.add('active'); }
  });
});

// 필터 아이템 클릭
$filterItems.forEach($item => { 
  $item.addEventListener('click', (e) => { 
    e.stopPropagation(); 
    handleFilterClick($item); 
  }); 
});

// 검색 입력
$searchInputs.forEach($input => {
  $input.addEventListener('input', (e) => {
    activeFilters.searchTerm = e.target.value.trim().toLowerCase();
    $searchInputs.forEach(el => { el.value = e.target.value; });
    applyFilters();
  });
});

// 버튼 클릭 이벤트들
if ($resetBtn) $resetBtn.addEventListener('click', resetAllFilters);
if ($filterMobileCloseBtn) $filterMobileCloseBtn.addEventListener('click', () => toggleOverlay(false));
if ($wishlistCloseBtn) $wishlistCloseBtn.addEventListener('click', () => toggleOverlay(false));
if ($closeBtn) $closeBtn.addEventListener('click', () => toggleOverlay(false));
if ($overlay) $overlay.addEventListener('click', () => toggleOverlay(false));

if ($wishlistOpenBtn) {
  $wishlistOpenBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    $wishlistPanel.classList.add('active');
    toggleOverlay(true, false);
  });
}

if ($toggleBtn) {
  $toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    $filterBox.classList.add('active');
    toggleOverlay(true, true);
  });
}

// 바깥 클릭 시 패널 닫기
document.addEventListener('click', (e) => {
  if ($wishlistPanel.classList.contains('active') && !$wishlistPanel.contains(e.target) && !$wishlistOpenBtn.contains(e.target)) toggleOverlay(false);
  if ($filterBox.classList.contains('active') && !$filterBox.contains(e.target) && !$toggleBtn.contains(e.target)) toggleOverlay(false);
});

// 마우스가 카드 위로 올라갔을 때 비디오 재생
$cardContainer.addEventListener('mouseover', (e) => {
  const $cardItem = e.target.closest('.card-item');
  if ($cardItem) {
    const $video = $cardItem.querySelector('video');
    if ($video && $video.paused) {
      $video.play().catch(error => {
        console.log("비디오 재생이 차단되었습니다:", error);
      });
    }
  }
});

// 마우스가 카드를 벗어났을 때 비디오 정지 및 초기화
$cardContainer.addEventListener('mouseout', (e) => {
  const $cardItem = e.target.closest('.card-item');
  const $relatedTarget = e.relatedTarget;
  if ($cardItem && (!$relatedTarget || !$cardItem.contains($relatedTarget))) {
    const $video = $cardItem.querySelector('video');
    if ($video && !$video.paused) {
      $video.pause();
      $video.currentTime = 0;
    }
  }
});
$cardContainer.addEventListener('click', (e) => {
  //위시리스트 버튼 클릭 시 처리
  const $wishBtn = e.target.closest('.hover__wishlist, .card__wishlist');
  if ($wishBtn) {
    e.stopPropagation();
    const gameId = $wishBtn.dataset.id;
    const gameData = games.find(g => g.id === gameId);
    toggleWishlist(gameData);
    return;
  }

  // 카드 호버 영역(상세 페이지 이동) 클릭 시 처리
  const $hoverBox = e.target.closest('.card__hover');
  if ($hoverBox) {
    const gameId = $hoverBox.dataset.game;
    if (gameId) {
      goToGameDetail(gameId); 
    }
  }
  const $cardItem = e.target.closest('.card-item');
  if ($cardItem) {
    const gameId = $cardItem.dataset.game;
    if (gameId) {
      goToGameDetail(gameId); 
    }
  }
});

/* ========== 상세 이동 함수 (기존 gamesClick 로직 활용) ========== */
function goToGameDetail(gameId) {
  if (!gameId) return;
  window.location.href = `game.html?id=${encodeURIComponent(gameId)}`;
}

if ($wishlistAllDelete) {
  $wishlistAllDelete.addEventListener('click', () => {
    wishlistItems = [];
    saveWishlist();
    updateWishlistUI();
    renderCards(currentPage, currentFilteredGames);
  });
}

/* ========== Define Functions ========== */
function saveWishlist() {
  localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
}

function toggleOverlay(show, isFilter = false) {
  const screenW = window.innerWidth;
  const needsOverlay = isFilter ? (screenW <= TAB_BREAK_POINT) : (screenW <= MO_BREAK_POINT);

  if (show) {
    if (needsOverlay && $overlay) {
      $overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  } else {
    if ($overlay) $overlay.classList.remove('active');
    if ($filterBox) $filterBox.classList.remove('active');
    if ($wishlistPanel) $wishlistPanel.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function applyFilters() {
  currentFilteredGames = games.filter(game => {
    const searchMatch = game.name.toLowerCase().includes(activeFilters.searchTerm);
    const genreMatch = activeFilters.genre.length === 0 || activeFilters.genre.every(g => game.genre.includes(genreMap[g]));
    let starMatch = activeFilters.star ? Math.floor(game.star) === parseInt(activeFilters.star) : true;
    let priceMatch = true;
    if (activeFilters.price) {
      const currentPrice = Math.round(game.originalPrice * (1 - game.discount / 100));
      const limit = parseInt(activeFilters.price.replace(/[^0-9]/g, ''));
      priceMatch = activeFilters.price.includes('이하') ? currentPrice <= limit : currentPrice >= limit;
    }
    return searchMatch && genreMatch && starMatch && priceMatch;
  });
  currentPage = 1;
  renderCards(1, currentFilteredGames);
}

function handleFilterClick($item) {
  const $parent = $item.closest('.accordion');
  const text = $item.querySelector('p').innerText.trim();
  if ($parent.classList.contains('genre__accordion')) {
    $item.classList.toggle('active');
    const idx = activeFilters.genre.indexOf(text);
    idx > -1 ? activeFilters.genre.splice(idx, 1) : activeFilters.genre.push(text);
  } else {
    const type = $parent.classList.contains('star__accordion') ? 'star' : 'price';
    if ($item.classList.contains('active')) {
      $item.classList.remove('active');
      activeFilters[type] = null;
    } else {
      $parent.querySelectorAll('li').forEach($li => $li.classList.remove('active'));
      $item.classList.add('active');
      activeFilters[type] = text;
    }
  }
  applyFilters();
}

function resetAllFilters() {
  activeFilters = { genre: [], star: null, price: null, searchTerm: "" };
  currentFilteredGames = [...games];
  currentPage = 1;
  $searchInputs.forEach(input => { input.value = ""; });
  document.querySelectorAll('.accordion li').forEach(li => li.classList.remove('active'));
  renderCards(1, currentFilteredGames);
}

function toggleWishlist(game) {
  const index = wishlistItems.findIndex(item => item.id === game.id);
  index > -1 ? wishlistItems.splice(index, 1) : wishlistItems.push(game);
  saveWishlist();
  updateWishlistUI();
  renderCards(currentPage, currentFilteredGames);
}

function updateWishlistUI() {
  if (!$wishlistCount || !$wishlistList) return;
  $wishlistCount.innerText = `총 ${wishlistItems.length}개`;
  if (wishlistItems.length === 0) {
    $wishlistList.innerHTML = '<p class="empty-msg">관심있는 게임을 담아보세요.</p>';
    if ($wishlistAllDelete) $wishlistAllDelete.style.display = 'none';
    return;
  }
  if ($wishlistAllDelete) $wishlistAllDelete.style.display = 'flex';
  $wishlistList.innerHTML = wishlistItems.map(item => {
    const discountedPrice = Math.round(item.originalPrice * (1 - item.discount / 100));
    return `
      <li class="wishlist__item">
        <div class="item__left"><img src="assets/img/games/${item.id}/cover.jpg" alt="${item.name}"></div>
        <div class="item__mid">
          <p class="title--xs">${item.name}</p>
          <div class="item__star"><p class="title--xs"><i class="bi bi-star-fill"></i> ${item.star}</p></div>
          <div class="item__mid__bottom">
            <p class="title--m">₩${discountedPrice.toLocaleString()}</p>
            <p class="text--s">&#8361 ${item.originalPrice.toLocaleString()}</p>
            <div class="item__discount"><p class="title--xs">-${item.discount}%</p></div>
          </div>
        </div>
        <div class="item__right" onclick="event.stopPropagation(); deleteWishItem('${item.id}')"><i class="bi bi-trash-fill"></i></div>
      </li>`;
  }).join('');
}

window.deleteWishItem = (id) => {
  wishlistItems = wishlistItems.filter(item => item.id !== id);
  saveWishlist();
  updateWishlistUI();
  renderCards(currentPage, currentFilteredGames);
};

function renderCards(page, dataToRender) {
  if (!$cardContainer) return;
  $cardContainer.innerHTML = "";
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = dataToRender.slice(startIndex, endIndex);

  if (paginatedItems.length === 0) {
    $cardContainer.innerHTML = `<p class="no-data">해당하는 게임이 없습니다.</p>`;
    if ($paginationContainer) $paginationContainer.innerHTML = "";
    return;
  }

  $cardContainer.innerHTML = paginatedItems.map(game => {
    const discountedPrice = Math.round(game.originalPrice * (1 - game.discount / 100));
    const genreHTML = game.genre.map(g => `<div class="genre"><p class="title--xs">${genreMapKor[g] || g}</p></div>`).join('');
    const isWishlisted = wishlistItems.some(item => item.id === game.id);
    const wishClass = isWishlisted ? 'active' : '';
    const heartIcon = isWishlisted ? 'bi-heart-fill' : 'bi-heart';

    return `
      <div class="card-item" data-game="${game.id}">
        <div class="card">
          <div class="card__discount"><p class="title--l">-${game.discount}%</p></div>
          <div class="card__img"><img src="assets/img/games/${game.id}/cover.jpg" alt="${game.name}"></div>
          <div class="card__text">
            <div class="card__text__top">
              <div class="text__name"><p class="title--s">${game.name}</p></div>
              <div class="text__star"><p class="title--s"><i class="bi bi-star-fill"></i>${game.star}</p></div>
            </div>
            <div class="card__text__mid"><div class="text__dev"><p class="text--s">${game.dev}</p></div></div>
            <div class="card__text__bottom">
              <div class="text__price"><p class="title--l">&#8361 ${discountedPrice.toLocaleString()}</p></div>
              <div class="card__wishlist ${wishClass}" data-id="${game.id}"><i class="bi ${heartIcon}"></i></div>
              <div class="text__price__discount"><p class="text--s">&#8361 ${game.originalPrice.toLocaleString()}</p></div>
            </div>
          </div>
        </div>
        <div class="card__hover" data-game="${game.id}">
          <div class="card__hover__video"><video src="${game.mainVideo}" muted loop></video></div>
          <div class="card__hover__mid">
            <div class="hover__mid__left">
              <div class="mid__left__name"><p class="title--s">${game.name}</p></div>
              <div class="mid__left__bottom">
                <div class="bottom__dev"><p class="text--m">${game.dev}</p></div>
                <div class="bottom__star"><p class="title--xs"><i class="bi bi-star-fill"></i>${game.star}</p></div>
              </div>
            </div>
            <div class="hover__mid__discount"><p class="title--l">-${game.discount}%</p></div>
            <div class="hover__mid__right">
              <div class="right__discount__price"><p class="text--m">&#8361 ${game.originalPrice.toLocaleString()}</p></div>
              <div class="right__price"><p class="title--l">&#8361 ${discountedPrice.toLocaleString()}</p></div>
            </div>
          </div>
          <div class="card__hover__bottom">
            <div class="bottom__genre__box">${genreHTML}</div>
            <div class="hover__wishlist ${wishClass}" data-id="${game.id}">
              <i class="bi ${heartIcon}"></i><p class="title--xs">위시리스트</p>
            </div>
          </div>
        </div>
      </div>`;
  }).join('');
  renderPagination(dataToRender.length);
}

function renderPagination(totalItems) {
  if (!$paginationContainer) return;
  $paginationContainer.innerHTML = "";
  const totalPages = Math.max(Math.ceil(totalItems / itemsPerPage), 1);

  const prevBtn = document.createElement('button');
  prevBtn.innerHTML = `<i class="bi bi-chevron-left"></i>`;
  prevBtn.className = 'page-btn side-btn';
  prevBtn.disabled = (currentPage === 1);
  prevBtn.onclick = () => { if (currentPage > 1) { currentPage--; renderCards(currentPage, currentFilteredGames); } };
  $paginationContainer.appendChild(prevBtn);

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.innerText = i;
    btn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
    btn.onclick = () => { currentPage = i; renderCards(currentPage, currentFilteredGames); window.scrollTo(0, 500); };
    $paginationContainer.appendChild(btn);
  }

  const nextBtn = document.createElement('button');
  nextBtn.innerHTML = `<i class="bi bi-chevron-right"></i>`;
  nextBtn.className = 'page-btn side-btn';
  nextBtn.disabled = (currentPage === totalPages);
  nextBtn.onclick = () => { if (currentPage < totalPages) { currentPage++; renderCards(currentPage, currentFilteredGames); } };
  $paginationContainer.appendChild(nextBtn);
}

/* ========== Responsive - Execute function ========== */
window.addEventListener('resize', screenResize);
screenResize();

function screenResize(){
  const screenW = window.innerWidth;
  const prevItemsPerPage = itemsPerPage;

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

  // 페이지당 아이템 수 변경 체크
  if (prevItemsPerPage !== itemsPerPage) { 
    currentPage = 1; 
    renderCards(currentPage, currentFilteredGames); 
  }
}

function enterMo(){
  itemsPerPage = 6;
}

function enterTab(){
  itemsPerPage = 6;
}

function enterLaptop(){
  itemsPerPage = 8;
}

function enterPc(){
  itemsPerPage = 8;

}
