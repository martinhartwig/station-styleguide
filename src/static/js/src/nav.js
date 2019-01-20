$('.sg-nav-components h2').each(function(index){
    var $el = $(this);
    var hasActiveChildren = ($el.parent().find('li.sg-list__item--active').length > 0);
    var isOpenByDefault = $el.parent().hasClass('sg-list__item--opened');
    $el.parent().addClass('sg-list__item' + (isOpenByDefault || hasActiveChildren ? '' : ' sg-list__item--closed'));
    $el.on('click', function (e) {
        $(e.target).parent().removeClass('sg-list__item--opened');
        if ($(e.target).parent().hasClass('sg-list__item--closed')) {
            $(e.target).siblings('ul').velocity("slideDown", { duration: 250 })
        } else {
            $(e.target).siblings('ul').velocity("slideUp", { duration: 250 })
        }
        $(e.target).parent().toggleClass('sg-list__item--closed');
    });
});
