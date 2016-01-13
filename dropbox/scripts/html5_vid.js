function html5Vid(video, section) {
  var playButton = section.find('.button-play-video').eq(0);

  //start video and add playing class to parent container
  playButton.click(function(evt) {
    evt.preventDefault();
    video.attr('controls', 'controls')
    video.get(0).play();
    section.addClass('playing');
  })

  //reset parent container and video when video finishes
  video.bind('ended', function(evt) {
    video.removeAttr('controls')
    video.load();
    section.removeClass('playing');
  })
}