/* ========== DOM Element  ========== */
const $fnbTitles = document.querySelectorAll('.fnb div');



/* ========== Responsive - Execute function  ========== */
window.addEventListener('resize', footerResize);
footerResize();

function footerResize(){
  const screenW = window.innerWidth;

  if(screenW <= MO_BREAK_POINT){
    footerMo();
  }
}

function footerMo(){
  $fnbTitles.forEach(title => {
    title.addEventListener('click', fnbTitlesClick);
  });
}



/* ========== Responsive - Define function  ========== */
function fnbTitlesClick(){
  const $fnb = this.closest('.fnb');

  if($fnb.classList.contains('active')){
    $fnb.classList.remove('active');
  }
  else{
    $fnbTitles.forEach(i => i.closest('.fnb').classList.remove('active'));
    $fnb.classList.add('active');
  }
}