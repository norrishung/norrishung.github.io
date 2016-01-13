//Creates a slideshow from selected element.
function Slideshow(selector) {

    var leftArr = selector.find('.left-arrow')[0],
        rightArr = selector.find('.right-arrow')[0],
        images = selector.find('figure'),
        markerContainer = selector.find('.markers');
    
    var currentImage = 0;

    //initialization function
    function init() {
        //create markers
       for(i=0;i<images.length;i++) {
           markerContainer.append('<a href="#" class="mark"></a>');
       } 

       //event handlers
       $(rightArr).click(function(evt) {
           evt.preventDefault();
           currentImage < images.length - 1 ? currentImage++ : currentImage = 0;
           changeImage();
       })

       $(leftArr).click(function(evt) {
           evt.preventDefault();
           currentImage == 0 ? currentImage = images.length-1 : currentImage--;
           changeImage();
       })

       $('.mark').click(function(evt) {
        evt.preventDefault();
        currentImage = $('.mark').index(this);
        changeImage();
       })

       //first call
       changeImage();
    }
    
    //Changes image and marker to current slide index
    function changeImage() {
        images.removeClass('selected');
        images.eq(currentImage).addClass('selected');
        $('.mark').removeClass('selected');
        $('.mark').eq(currentImage).addClass('selected');
    }

    init();
} 