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

/*Interactivity to determine when an animated element in in view. In view elements trigger our animation*/
$(document).ready(function() {

  //window and animation items
  var animation_elements = $.find('.animation-element');
  var web_window = $(window);

  //check to see if any animation containers are currently in view
  function check_if_in_view() {
    //get current window information
    var window_height = web_window.height();
    var window_top_position = web_window.scrollTop();
    var window_bottom_position = (window_top_position + window_height);

    //iterate through elements to see if its in view
    $.each(animation_elements, function() {

      //get the element sinformation
      var element = $(this);
      var element_height = $(element).outerHeight();
      var element_top_position = $(element).offset().top;
      var element_bottom_position = (element_top_position + element_height);

      //check to see if this current container is visible (its viewable if it exists between the viewable space of the viewport)
      if ((element_bottom_position >= window_top_position) && (element_top_position <= window_bottom_position)) {
        element.addClass('in-view');
      } else {
        element.removeClass('in-view');
      }
    });

  }

  //on or scroll, detect elements in view
  $(window).on('scroll resize', function() {
      check_if_in_view()
    })
    //trigger our scroll event on initial load
  $(window).trigger('scroll');

});
