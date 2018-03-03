// Back-to-top and back-to-bottom buttons
$(function() {
  upDown();
});

$(window).scroll(function() {
  var winScrollTop = $(window).scrollTop();
  var winHeight = $(window).height();
  var docHeight = $(document).height();

  if (winScrollTop > 0) {
    $("#backToTop").removeClass("disable");
    if (winScrollTop == docHeight - winHeight && $("#backToBottom").css("display") == "block") {
      $("#backToBottom").addClass("disable");
    } else {
      $("#backToBottom").removeClass("disable");
    }
  } else {
    $("#backToTop").addClass("disable");
  }
});

function upDown() {
  var winScrollTop = $(window).scrollTop();

  if (winScrollTop === 0) {
    $("#backToTop").addClass("disable");
    $("#backToBottom").addClass("disable");
  }

  $("scrollBtnContainer a").click(function(e) {
    var winHeight = $(window).height();
    var docHeight = $(document).height();
    var speed = 600;

    if (!$(this).hasId("backToTop")) {
      $("html,body").stop().animate({
        scrollTop: docHeight - winHeight
      }, speed);
    } else {
      $("html,body").stop().animate({
        scrollTop: 0
      }, speed);
    }
    e.preventDefault();
  });
}
