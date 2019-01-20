import { iframeResizer } from 'iframe-resizer';
import hljs from 'highlight.js';

$('[data-showroom-target]').each(function(index){
    var $el = $(this);
    $el.on('click', function (e) {
        var easing = 'easeInOutCirc';
        var speed = 500;
        var $showroom = $('[data-showroom="' + $(e.target).data('showroom-target') + '"]');
        if ($showroom.hasClass('sg-showroom--active')) {
            return;
        }
        var activeTabIsToTheLeft = $showroom.prevAll('.sg-showroom.sg-showroom--active').length === 1;
        // var activeTabIsToTheRight = $showroom.nextAll('.sg-showroom.sg-showroom--active').length === 1;
        $showroom.siblings('.sg-showroom.sg-showroom--active').velocity({
            properties: {
                left: (activeTabIsToTheLeft ? '-120%' : '120%'),
            },
            options: {
                easing: easing,
                duration: speed,
                complete: function() {
                    $(this).removeClass('sg-showroom--active');
                }
            }
        });
        $showroom.velocity({
            properties: {
                left: 0
            },
            options: {
                easing: easing,
                duration: speed,
                delay: speed / 10,
                begin: function() {
                    $(this).attr('style', 'display:block;left:' + (activeTabIsToTheLeft ? '100%' : '-100%') + ';');
                },
                complete: function() {
                    $(this).addClass('sg-showroom--active');
                }
            }
        });
        $(e.target).parent().siblings('.sg-tabslist__item').removeClass('sg-tabslist__item--active');
        $(e.target).parent().addClass('sg-tabslist__item--active');
    });
});

function getDimensionsForDevice(device) {
    switch (device) {
        case 'mobile':
            return {
                width: '320px',
                height: '568px',
                isRotationPossible: true
            };
        case 'tablet':
            return {
                width: '768px',
                height: '1024px',
                isRotationPossible: true
            };
        case 'desktop':
        default:
            return {
                width: '100%',
                height: 'auto',
                isRotationPossible: false
            };
    }
}
const iframe = $('[data-resize-preview]').first().parent().parent().siblings('iframe').get(0);
iframeResizer({/* autoResize: false, log: true */}, iframe)
$('[data-resize-preview]').each(function(index) {
    var $el = $(this);
    $el.on('click', function(event){
        var dims = getDimensionsForDevice($el.data('resizePreview'));
        if ($el.hasClass('sg-devices__link--active') && dims.isRotationPossible) {
            $el.toggleClass('sg-devices__link--rotated');
        } else {
            $('.sg-devices__link--active').removeClass('sg-devices__link--active sg-devices__link--rotated');
            $el.addClass('sg-devices__link--active');
        }
        if ($el.hasClass('sg-devices__link--rotated')) {
            $(this).parent().parent().siblings('iframe').css({
                width: dims.height,
                height: dims.width
            });
        } else {
            $(this).parent().parent().siblings('iframe').css({
                width: dims.width,
                height: dims.height
            });
        }
        if (dims.height === 'auto') {
            iframe.iFrameResizer.resize();
        }
    });
})

var code = document.getElementsByTagName('code'),
    pl = code.length;
for (var i = 0; i < pl; i++) {
    var currentCode = code[i];
    hljs.highlightBlock( currentCode );
    currentCode.innerHTML = '<span class="line-number"></span>' + currentCode.innerHTML + '<span class="cl"></span>';
    var num = currentCode.innerHTML.split(/\n/).length;
    for (var j = 0; j < num; j++) {
        var line_num = currentCode.getElementsByTagName('span')[0];
        line_num.innerHTML += '<span>' + (j + 1) + '</span>';
    }
}
