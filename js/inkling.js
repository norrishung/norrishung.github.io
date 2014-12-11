$(document).ready(function() {
    scrolling(window, fixHeader);
    var slideshow = makeSlideshow();
});

function fixHeader(e) {
    var screenTop = $(document).scrollTop();
    $('h2:not(.pinned-top)').each(function(index, header) {
        var headerTop = $(header).position().top;
        var pinnedHeader = $(header).parent().find('.pinned-top');

        if(headerTop < screenTop && !pinnedHeader.length) {
            $(header).parent().append($('<h2 class="pinned-top">').html($(header).html()));
        }
        if(headerTop > screenTop && pinnedHeader.length > 0) {
            $(header).parent().find('.pinned-top').remove();
        }
    })
}


//Focuses images when they come into screen center.
function focusImage(e) {
    var screenCenter = $(document).scrollTop() + $(window).height()/2;
    var tolerance = $(window).height()/10;

    $('.media figure img').each(function(index, fig) {
        var figTop = $(fig).position().top;
        var figBottom = figTop + $(fig).height();
        if(figTop < screenCenter + tolerance || figBottom > screenCenter - tolerance) {
            $(fig).addClass('active');
        }
        if(figBottom < screenCenter - tolerance || figTop > screenCenter + tolerance) {
            $(fig).removeClass('active');
        }
    })
}

// Takes all <figures> on page and generates a media slideshow.
// Clicking on images on the page takes you to that image in the slideshow
function makeSlideshow() {

    var figOffset = 125;

    //Create slideshow container
    var slideshow = $('<div class="slideshow" data-fig-index="0"></div>');

    //Retreive all figures as an array of objects
    var figures = [];
    $('figure').each(function(index, fig) {
        figures.push({
            img: $(fig).find('img').attr('src'),
            caption: $(fig).find('figcaption').html() ? $(fig).find('figcaption').html() : ""
        });
    });

    //Add all figures to slideshow
    $(figures).each(function(index, fig) {
        var figure = $('<figure>');
        figure.append('<img src="' + fig.img + '">');
        figure.append('<figcaption>' + fig.caption + '</figcaption>');
        slideshow.append(figure);
    })

    //Add navigational elements
    var navContainer = $('<nav></nav>'),
        prevButton = $('<a href="#" class="prev-button"></a>'),
        nextButton = $('<a href="#" class="next-button">'),
        closeButton = $('<a href="#" class="close-button">'),
        slideCountLabel = $('<div class="slide-count"><span class="current-slide">1</span> of <span class="total-slides">' + figures.length + '</span></div>');

    slideshow.append(prevButton).append(nextButton).append(slideCountLabel).append(closeButton);

    //Generic slide changing function
    var changeSlide = function() {
        var figIndex = parseInt($(slideshow).attr('data-fig-index'));
        $('.slideshow figure').css('transform', 'translateX(-' + figIndex*figOffset + '%)');
        $('.current-slide').html(figIndex+1);

        //Disable buttons if first or last slide
        $('.prev-button, .next-button').removeClass('disabled');
        if(figIndex == 0) {
            prevButton.addClass('disabled');
        }
        if(figIndex == figures.length-1) 
        {
            nextButton.addClass('disabled');
        }
    }

    //Event for previous button
    $(prevButton).click(function(e) {
        e.preventDefault();
        var figIndex = parseInt($(slideshow).attr('data-fig-index'));
        if(figIndex>0) {
            slideshow.attr('data-fig-index', figIndex-1);
            changeSlide();
        }
    })

    //Event for next button
    $(nextButton).click(function(e) {
        e.preventDefault();
        var figIndex = parseInt($(slideshow).attr('data-fig-index'));
        if(figIndex<figures.length-1) {
            slideshow.attr('data-fig-index', figIndex+1);
            changeSlide();
        }
    })

    //Event for key events
    $('body').keydown(function(e) {
        switch(e.which) {
            case 37: $(prevButton).click(); // left 
            break;

            case 39: $(nextButton).click(); // right
            break;


            default: return; // exit this handler for other keys
        }
    })

    //Add event to jump to correct slideshow index when clicking on figure
    $('.main-section figure img').click(function(e) {
        e.preventDefault();
        var figIndex = $('figure').index($(this).parent());
        slideshow.attr('data-fig-index', figIndex);
        changeSlide();
        setTimeout(function() {
            $('body').addClass('slideshow-mode');
            //(firefox hack) allow opacity transition
            setTimeout(function() {
                $('body').css('overflow', 'hidden');
            }, 50);
        }, 50);
        
    })

    //Event to close slideshow
    $(slideshow).click(function(e) {
        e.preventDefault();
        //if user clicks off figure image or caption, slidshow closes;
        if($(e.target).is("figure") || $(e.target).is("div") || $(e.target).hasClass('close-button')) {
            $('body').removeClass('slideshow-mode');
            //(firefox hack) allow opacity transition
            setTimeout(function() {
                $('body').css('overflow', 'auto');
            }, 50);
        }
    })


    //Add slideshow to body
    $('body').append(slideshow);

    return slideshow;
}