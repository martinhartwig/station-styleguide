$('.sg-component').bind('scroll', function() {
    if ( $(this).scrollTop() > 0 ) {
        $('body').addClass('has-scroll');
    } else {
        $('body').removeClass('has-scroll');
    }
    if ( $(this).scrollTop() > 50 ) {
        $('body').addClass('has-scroll-header-half');
    } else {
        $('body').removeClass('has-scroll-header-half');
    }
    if ( $(this).scrollTop() > 120 ) {
        $('body').addClass('has-scroll-header');
    } else {
        $('body').removeClass('has-scroll-header');
    }
});
