$(document).ready(function() {
  var scrollController = new ScrollMagic();
  var tween = TweenMax.fromTo(".secondary-nav .icon", .5,
        {"height": "32px", "opacity": 1},
        {"height": "0px", "opacity": 0}
    );

  var scene = new ScrollScene({duration: 50}).setTween(tween).addTo(scrollController);
  var scene2 = new ScrollScene({offset: 70}).setPin('.secondary-categories').addTo(scrollController);
})