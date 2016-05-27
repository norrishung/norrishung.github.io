// Useful Helper Functions
function $(selector) {
    return document.querySelectorAll(selector);
}

function $addClass(el, className) {
    if (el.classList)
      el.classList.add(className);
    else
      el.className += ' ' + className;
}

function $removeClass(el, className) {
    if (el.classList)
      el.classList.remove(className);
    else
      el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
}

// Slideshow Object
function Slideshow(args) {

    var self = this;

    this.keywords = args.keywords ? args.keywords : "";
    this.attachmentContainer = args.attachmentContainer ? args.attachmentContainer : 'div';
    this.lightboxContainer = args.lightboxContainer ? args.lightboxContainer : 'div';

    this.photos = [];
    this.currentSlide = 0;
    this.slideshowLength = 0;

    // Grabs images on flickr based on keywords and calls render functions on success
    this.fetchImages = function(keywords) {
        var flickrRequest = new XMLHttpRequest();
        flickrRequest.open('GET', 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=12821821bb349dc70f06c0ed566e5ea7&tags=' + keywords + '&format=json&nojsoncallback=1&privacy_filters=1&sort=interestingness-aesc&extras=url_q,url_o&per_page=6', true)
        flickrRequest.onload = function() {
            if(flickrRequest.status >= 200 && flickrRequest.status < 400) {
                self.photos = JSON.parse(flickrRequest.responseText).photos.photo;
                self.slideshowLength = photos.length;
                self.renderSlideshowAttachment();
                self.renderSlideshowLightbox();
            }
            else {
                console.log('reached server but failed');
            }
        }
        flickrRequest.onerror = function() {
            console.log('connection error');
        }
        flickrRequest.send();
    }

    // Renders the slideshow attachment
    this.renderSlideshowAttachment = function() {

        self.photos.forEach(function(photo, index) {
            var photoContainer = document.createElement('div');
            $addClass(photoContainer, 'attachment--slideshow__thumb');
            var photoEl = document.createElement('img');
            photoEl.setAttribute('src', photo.url_q);
            photoEl.setAttribute('data-index', index);
            photoContainer.appendChild(photoEl);
            var attachmentContainer = $(self.attachmentContainer)[0];
            attachmentContainer.appendChild(photoContainer);
        });

        var thumbs = $('.attachment--slideshow__thumb');

        for(i = 0; i < thumbs.length; i++) {
            var currentThumb = thumbs[i];
            currentThumb.addEventListener('click', function(e) {
                self.showLightbox(e.target);
            });
        }

    }

    // Renders the Lightbox
    this.renderSlideshowLightbox = function() {

        self.photos.forEach(function(photo, index) {
            var photoContainer = document.createElement('div');
            $addClass(photoContainer, 'slideshow__image-container');
            var photoEl = document.createElement('img');
            $addClass(photoEl, 'slideshow__image');
            if(photo.url_o) {
                photoEl.setAttribute('src', photo.url_o);
            }
            photoContainer.appendChild(photoEl);
            var lightboxContainer = $(self.lightboxContainer)[0];
            lightboxContainer.appendChild(photoContainer);
        });

        $('.lightbox__dismiss-button')[0].addEventListener('click', function(e) {
            self.dismissLightbox();
        });

        $('.slideshow__prev-button')[0].addEventListener('click', function(e) {
            self.prevSlide();
        });

        $('.slideshow__next-button')[0].addEventListener('click', function(e) {
            self.nextSlide();
        });

        document.addEventListener('keyup', function(e) {
            var key = e.keyCode || e.which;

            if(key == 37 && $('.lightbox')[0].classList.contains('lightbox--is-open')) {
                self.prevSlide();
            }

            if(key == 39 && $('.lightbox')[0].classList.contains('lightbox--is-open')) {
                self.nextSlide();
            }

            if(key == 27) {
                self.dismissLightbox();
            }
        })
    }

    // Opens the lightbox
    this.showLightbox = function(slide) {
        if(!$('.lightbox')[0].classList.contains('lightbox--is-open')) {
            self.currentSlide = parseInt(slide.getAttribute('data-index'));
            self.goToSlide();
            $addClass($('.lightbox')[0], 'lightbox--is-open');
        }
    }

    // Closes the lightbox
    this.dismissLightbox = function() {
        if($('.lightbox')[0].classList.contains('lightbox--is-open')) {
            $removeClass($('.lightbox')[0], 'lightbox--is-open'); 
        }
    }

    // Goes to previous slide
    this.prevSlide = function() {
        if(self.currentSlide > 0) {
            self.currentSlide -= 1;
            self.goToSlide();
        }

    }

    // Goes to next slide
    this.nextSlide = function() {
        if(self.currentSlide < self.slideshowLength - 1) {
            self.currentSlide += 1;
            self.goToSlide(); 
       }
    }

    // Adjusts layout so current slide is visible
    this.goToSlide = function() {
        var slides = $('.slideshow__image-container');

        for(i = 0; i < slides.length; i++) {
            slides[i].style.transform = 'translateX(-' + self.currentSlide * 100 + '%)';
        }

        $('.lightbox__title')[0].innerHTML = self.photos[self.currentSlide].title;
    }

    // Initializes the slideshow
    this.fetchImages(this.keywords);
    
}

// Instantiates the slideshow
var slideshow = Slideshow({
    keywords: "High Sierras",
    attachmentContainer: ".attachment--slideshow",
    lightboxContainer: ".slideshow__images"
});
