$(document).ready(function() {
    //Fast Click
    FastClick.attach(document.body);

    //Go to correct section of portfolio
    changeTab();

    //Add event listeners for portfolio buttons
    $('.portfolio__nav a').click(function(e) {
        e.preventDefault();
        window.location.hash = $(this).attr('href');
        changeTab();
        $('.portfolio').velocity('scroll', {duration: 600, easing: 'easeout', offset: 1});
    });

    //Capture browser history events
    $(window).on('hashchange', function(e) {
        e.preventDefault();
        changeTab();
    })

    //Sticky portfolio nav
    $(document).scroll(function(e) {
        if(document.body.scrollTop > $('.portfolio__nav').offset().top && $('.sticky-header').length == 0) {
            var stickyHeader = document.createElement('div');
            stickyHeader.className = 'sticky-header';
            stickyHeader.innerHTML = '<div class="portfolio__nav">' + $('.portfolio__nav').html(); + '</div>';
            $('body').append(stickyHeader);
            $('.portfolio .portfolio__nav').css('opacity', '0');
            $('.sticky-header .portfolio__nav a').click(function(e) {
                e.preventDefault();
                window.location.hash = $(this).attr('href');
                changeTab();
                $('.portfolio').velocity('scroll', {duration: 600, easing: 'easeout', offset: 1});
            });
        }

        else if(document.body.scrollTop < $('.portfolio__nav').offset().top && $('.sticky-header').length > 0) {
            $('.sticky-header').remove();
            $('.portfolio .portfolio__nav').css('opacity', '1');
        }
    });

});

function changeTab() {
    var currentTab = window.location.hash ? window.location.hash.replace('#', '') : 'interface';

    $('.portfolio__nav a').removeClass('selected');
    $('.portfolio__nav a[href="#' + currentTab + '"]').addClass('selected');

    var portfolioIndex = $('.portfolio__nav a[href="#' + currentTab + '"]').index();
    
    $('section[class^="portfolio__section--"]').css('transform', 'translate3D(-' + 100*portfolioIndex + '%, 0, 0)');

}