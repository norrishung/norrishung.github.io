$(document).ready(function() {

    //Initialize slideshow and video
    var slideshow = new Slideshow($('.carousel'));  
    var video = new html5Vid($('#dfb-vid'), $('.section-see'));

    //If why-section is already on screen, start animation after 200px of scrolling
    if(isOnScreen($('.section-why'))) {
      $(document).scroll(function(evt) {
        if($(document).scrollTop() > 200) {
          $('.section-why').addClass('visible');
        }
      })
    }
    //Otherwise, start animation when why-section scrolls on screen.
    else {
      $(document).scroll(function(evt) {
        if(isOnScreen($('.section-why'))) {
          $('.section-why').addClass('visible');
        }
      })
    }

});

function isOnScreen(element) {
  return $(element).offset().top < $(document).scrollTop() + $(window).height();
}