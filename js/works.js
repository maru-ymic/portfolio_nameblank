"use strict";

// スムーズスクロール
$('.page-top').click(function () {
  $('body,html').animate({
    //ページトップまでスクロール
    scrollTop: 0
    //ページトップスクロールの速さ。数字が大きいほど遅くなる
  }, 500);
  //リンク自体の無効化
  return false;
});

// モーダル開閉時の動き
$(function(){
  $('.js-modalButton').on('click', function(){
    if ( $('.js-modal.on').length === 0) {
      // 自分自身の data-id の値を取得
      const dataID = $(this).attr('data-id');
      $('.js-modal[data-id="' + dataID + '"]').addClass('on');
      // モーダルを開く直前に、BOX内を上部にスクロール
      $('.js-modal[data-id="' + dataID + '"] .modal-inner').scrollTop(0)
      $('body').addClass('modal-on');
    }
  });
  $('.js-modalClose').on('click', function(){
    $('.js-modal').removeClass('on');
    $('body').removeClass('modal-on');
  })
  // 画面外をクリックすると閉じる
  $(document).on('click', function(event){
    if ( $('.js-modal.on').length > 0 ) {
      console.log();
      if ( $(event.target).closest('.js-modalButton').length ===0 && $(event.target).closest('.modal-inner').length === 0) {
        $('.js-modalClose').trigger('click');
      }
    }
  })
});


// スクロールの値の比較用の設定
var beforePos = 0;

// スクロール途中でヘッダーが消え、上にスクロールすると復活する設定を関数にまとめる
function ScrollAnime() {

  // #area-2の位置まできたら
  var elemTop = $('.header-change-position').offset().top;
  var scroll = $(window).scrollTop();

  // ヘッダーの出し入れをする
  if(scroll == beforePos) {
    // IE11対策で処理を入れない
  } else if ( elemTop > scroll || 0 > scroll - beforePos ) {
    // ヘッダーが上から出現する
    // #headerにUpMoveというクラス名を除き
    $('.header').removeClass('UpMove');
    // #headerにDownMoveのクラス名を追加
    $('.header').addClass('DownMove');
  } else {
    //ヘッダーが上に消える
    // #headerにDownMoveというクラス名を除き
    $('.header').removeClass('DownMove');
    // #headerにUpMoveのクラス名を追加
    $('.header').addClass('UpMove');
  }
  
  // 現在のスクロール値を比較用のbeforePosに格納
  beforePos = scroll;
}


// 画面をスクロールをしたら動かしたい場合の記述
$(window).scroll(function () {
  // スクロール途中でヘッダーが消え、上にスクロールすると復活する関数を呼ぶ
  ScrollAnime();
});

// ページが読み込まれたらすぐに動かしたい場合の記述
$(window).on('load', function () {
  // スクロール途中でヘッダーが消え、上にスクロールすると復活する関数を呼ぶ
  ScrollAnime();
});


// スクロールしたらヘッダー背景色変更
$(function () {
  $(window).on('scroll', function () {
    if ($(this).scrollTop() > $('.header-change-position').offset().top ) {
      $('.header').addClass('change-color');
    } else {
      $('.header').removeClass('change-color');
    }
  });
});


// メニュー展開時に背景を固定
const backgroundFix = (bool) => {
  const scrollingElement = () => {
    const browser = window.navigator.userAgent.toLowerCase();
    if ("scrollingElement" in document) return document.scrollingElement;
    return document.documentElement;
  };

  const scrollY = bool
    ? scrollingElement().scrollTop
    : parseInt(document.body.style.top || "0");

  const fixedStyles = {
    height: "100vh",
    position: "fixed",
    top: `${scrollY * -1}px`,
    left: "0",
    width: "100vw"
  };

  Object.keys(fixedStyles).forEach((key) => {
    document.body.style[key] = bool ? fixedStyles[key] : "";
  });

  if (!bool) {
    window.scrollTo(0, scrollY * -1);
  }
};

// 変数定義
const CLASS = "-active";
let flg = false;
let accordionFlg = false;

let humberger = document.getElementById("js-hamberger");
let focusTrap = document.getElementById("js-focus-trap");
let menu = document.querySelector(".js-nav-area");
let accordionTrigger = document.querySelectorAll(".js-sp-accordion-trigger");
let accordion = document.querySelectorAll(".js-sp-accordion");

// メニュー開閉制御
// ハンバーガーボタンが選択されたら
humberger.addEventListener("click", (e) => {
  e.currentTarget.classList.toggle(CLASS);
  menu.classList.toggle(CLASS);
  if (flg) {// flgの状態で制御内容を切り替え
    backgroundFix(false);
    humberger.setAttribute("aria-expanded", "false");
    humberger.focus();
    flg = false;
  } else {
    backgroundFix(true);
    humberger.setAttribute("aria-expanded", "true");
    flg = true;
  }
});

// escキー押下でメニューを閉じられるように
window.addEventListener("keydown", () => {
  if (event.key === "Escape") {
    humberger.classList.remove(CLASS);
    menu.classList.remove(CLASS);

    backgroundFix(false);
    humberger.focus();
    humberger.setAttribute("aria-expanded", "false");
    flg = false;
  }
});


/**
 * swipe
 *
 * */
if ( $(window).scrollTop() <= 0) {
  $('body').addClass('touch-menu-on');
}
const touchState = {
  startX: 0,
  startY: 0,
  changeX: 0,
  changeY: 0,
};

document.addEventListener('touchstart', (event) => {
  touchState.startX = event.touches[0].pageX;
  touchState.startY = event.touches[0].pageY;
});

document.addEventListener('touchmove', (event) => {
  touchState.changeX = event.changedTouches[0].pageX;
  touchState.changeY = event.changedTouches[0].pageY;
  if (!document.getElementsByTagName('body')[0].classList.contains('menu-on')) {
    const scrollTop = document.scrollingElement.scrollTop || document.body.scrollTo;
    const mvHeight = document.querySelector('.header-change-position').offsetTop;
    if (scrollTop <= mvHeight) {
      document.getElementsByTagName('body')[0].classList.remove('touch-menu-on');
    } else {
      if (scrollTop > 0) {
        if (touchState.startY > touchState.changeY) {
          document.getElementsByTagName('body')[0].classList.remove('touch-menu-on');
        } else {
          document.getElementsByTagName('body')[0].classList.add('touch-menu-on');
        }
      }
    }
  }
});

document.addEventListener('touchend', (event) => {
  if (!document.getElementsByTagName('body')[0].classList.contains('menu-on')) {
    const scrollTop = document.scrollingElement.scrollTop || document.body.scrollTo;
    const mvHeight = document.querySelector('.header-change-position').offsetTop;
    if (scrollTop > 0) {
      if (scrollTop <= mvHeight) {
        document.getElementsByTagName('body')[0].classList.remove('touch-menu-on');
      }
    } else {
      document.getElementsByTagName('body')[0].classList.add('touch-menu-on');
    }
  }}
);