
/*
	By Osvaldas Valutis, www.osvaldas.info
	Available for use under the MIT License
*/

!function(n,t,e,i){"use strict";var o=function(){var n=e.body||e.documentElement,n=n.style;return""==n.WebkitTransition?"-webkit-":""==n.MozTransition?"-moz-":""==n.OTransition?"-o-":""==n.transition?"":!1},r=o()===!1?!1:!0,a=function(n,t,e){var i={},r=o();i[r+"transform"]="translateX("+t+")",i[r+"transition"]=r+"transform "+e+"s linear",n.css(i)},u="ontouchstart"in t,d=t.navigator.pointerEnabled||t.navigator.msPointerEnabled,c=function(n){if(u)return!0;if(!d||"undefined"==typeof n||"undefined"==typeof n.pointerType)return!1;if("undefined"!=typeof n.MSPOINTER_TYPE_MOUSE){if(n.MSPOINTER_TYPE_MOUSE!=n.pointerType)return!0}else if("mouse"!=n.pointerType)return!0;return!1};n.fn.imageLightbox=function(i){var i=n.extend({selector:'id="imagelightbox"',animationSpeed:250,preloadNext:!0,enableKeyboard:!0,quitOnEnd:!1,quitOnImgClick:!1,quitOnDocClick:!0,onStart:!1,onEnd:!1,onLoadStart:!1,onLoadEnd:!1},i),o=n([]),f=n(),l=n(),p=0,g=0,s=0,h=!1,m=function(){if(!l.length)return!0;var e=.8*n(t).width(),i=.9*n(t).height(),o=new Image;o.src=l.attr("src"),o.onload=function(){if(p=o.width,g=o.height,p>e||g>i){var r=p/g>e/i?p/e:g/i;p/=r,g/=r}l.css({width:p+"px",height:g+"px",top:(n(t).height()-g)/2+"px",left:(n(t).width()-p)/2+"px"})}},v=function(t){if(h)return!1;if(t="undefined"==typeof t?!1:"left"==t?1:-1,l.length){if(t!==!1&&(o.length<2||i.quitOnEnd===!0&&(-1===t&&0==o.index(f)||1===t&&o.index(f)==o.length-1)))return E(),!1;var e={opacity:0};r?a(l,100*t-s+"px",i.animationSpeed/1e3):e.left=parseInt(l.css("left"))+100*t+"px",l.animate(e,i.animationSpeed,function(){x()}),s=0}h=!0,i.onLoadStart!==!1&&i.onLoadStart(),setTimeout(function(){l=n("<img "+i.selector+" />").attr("src",f.attr("href")).on("load",function(){l.appendTo("body"),m();var e={opacity:1};if(l.css("opacity",0),r)a(l,-100*t+"px",0),setTimeout(function(){a(l,"0px",i.animationSpeed/1e3)},50);else{var u=parseInt(l.css("left"));e.left=u+"px",l.css("left",u-100*t+"px")}if(l.animate(e,i.animationSpeed,function(){h=!1,i.onLoadEnd!==!1&&i.onLoadEnd()}),i.preloadNext){var d=o.eq(o.index(f)+1);d.length||(d=o.eq(0)),n("<img />").attr("src",d.attr("href"))}}).on("error",function(){i.onLoadEnd!==!1&&i.onLoadEnd()});var e=0,u=0,g=0;l.on(d?"pointerup MSPointerUp":"click",function(n){if(n.preventDefault(),i.quitOnImgClick)return E(),!1;if(c(n.originalEvent))return!0;var t=(n.pageX||n.originalEvent.pageX)-n.target.offsetLeft;f=o.eq(o.index(f)-(p/2>t?1:-1)),f.length||(f=o.eq(p/2>t?o.length:0)),v(p/2>t?"left":"right")}).on("touchstart pointerdown MSPointerDown",function(n){return!c(n.originalEvent)||i.quitOnImgClick?!0:(r&&(g=parseInt(l.css("left"))),void(e=n.originalEvent.pageX||n.originalEvent.touches[0].pageX))}).on("touchmove pointermove MSPointerMove",function(n){return!c(n.originalEvent)||i.quitOnImgClick?!0:(n.preventDefault(),u=n.originalEvent.pageX||n.originalEvent.touches[0].pageX,s=e-u,void(r?a(l,-s+"px",0):l.css("left",g-s+"px")))}).on("touchend touchcancel pointerup pointercancel MSPointerUp MSPointerCancel",function(n){return!c(n.originalEvent)||i.quitOnImgClick?!0:void(Math.abs(s)>50?(f=o.eq(o.index(f)-(0>s?1:-1)),f.length||(f=o.eq(0>s?o.length:0)),v(s>0?"right":"left")):r?a(l,"0px",i.animationSpeed/1e3):l.animate({left:g+"px"},i.animationSpeed/2))})},i.animationSpeed+100)},x=function(){return l.length?(l.remove(),void(l=n())):!1},E=function(){return l.length?void l.animate({opacity:0},i.animationSpeed,function(){x(),h=!1,i.onEnd!==!1&&i.onEnd()}):!1},y=function(t){t.each(function(){o=o.add(n(this))}),t.on("click.imageLightbox",function(t){return t.preventDefault(),h?!1:(h=!1,i.onStart!==!1&&i.onStart(),f=n(this),void v())})};return n(t).on("resize",m),i.quitOnDocClick&&n(e).on(u?"touchend":"click",function(t){l.length&&!n(t.target).is(l)&&E()}),i.enableKeyboard&&n(e).on("keyup",function(n){return l.length?(n.preventDefault(),27==n.keyCode&&E(),void((37==n.keyCode||39==n.keyCode)&&(f=o.eq(o.index(f)-(37==n.keyCode?1:-1)),f.length||(f=o.eq(37==n.keyCode?o.length:0)),v(37==n.keyCode?"left":"right")))):!0}),y(n(this)),this.switchImageLightbox=function(n){var t=o.eq(n);if(t.length){var e=o.index(f);f=t,v(e>n?"left":"right")}return this},this.addToImageLightbox=function(n){y(n)},this.quitImageLightbox=function(){return E(),this},this}}(jQuery,window,document);



//Настройки лайтбокса для картинок в новом окне
function lightBox() {
    var
        // ACTIVITY INDICATOR

        activityIndicatorOn = function () {
            $('<div id="imagelightbox-loading"><div></div></div>').appendTo('body');
        },
        activityIndicatorOff = function () {
            $('#imagelightbox-loading').remove();
        },


        // OVERLAY

        overlayOn = function () {
            $('<div id="imagelightbox-overlay"></div>').appendTo('body');
        },
        overlayOff = function () {
            $('#imagelightbox-overlay').remove();
        },


        // CLOSE BUTTON

        closeButtonOn = function (instance) {
            $('<button type="button" id="imagelightbox-close" title="Close"></button>').appendTo('body').on('click touchend', function () {
                $(this).remove();
                instance.quitImageLightbox();
                return false;
            });
        },
        closeButtonOff = function () {
            $('#imagelightbox-close').remove();
        },


        // CAPTION

        captionOn = function () {
            var description = $('a[href="' + $('#imagelightbox').attr('src') + '"] img').attr('alt');
            if (description.length > 0)
                $('<div id="imagelightbox-caption">' + description + '</div>').appendTo('body');
        },
        captionOff = function () {
            $('#imagelightbox-caption').remove();
        },


        // NAVIGATION

        navigationOn = function (instance, selector) {
            var images = $(selector);
            if (images.length) {
                var nav = $('<div id="imagelightbox-nav"></div>');
                for (var i = 0; i < images.length; i++)
                    nav.append('<button type="button"></button>');

                nav.appendTo('body');
                nav.on('click touchend', function () {
                    return false;
                });

                var navItems = nav.find('button');
                navItems.on('click touchend', function () {
                        var $this = $(this);
                        if (images.eq($this.index()).attr('href') != $('#imagelightbox').attr('src'))
                            instance.switchImageLightbox($this.index());

                        navItems.removeClass('active');
                        navItems.eq($this.index()).addClass('active');

                        return false;
                    })
                    .on('touchend', function () {
                        return false;
                    });
            }
        },
        navigationUpdate = function (selector) {
            var items = $('#imagelightbox-nav button');
            items.removeClass('active');
            items.eq($(selector).filter('[href="' + $('#imagelightbox').attr('src') + '"]').index(selector)).addClass('active');
        },
        navigationOff = function () {
            $('#imagelightbox-nav').remove();
        },


        // ARROWS

        arrowsOn = function (instance, selector) {
            var $arrows = $('<button type="button" class="imagelightbox-arrow imagelightbox-arrow-left"></button><button type="button" class="imagelightbox-arrow imagelightbox-arrow-right"></button>');

            $arrows.appendTo('body');

            $arrows.on('click touchend', function (e) {
                e.preventDefault();

                var $this = $(this),
                    $target = $(selector + '[href="' + $('#imagelightbox').attr('src') + '"]'),
                    index = $target.index(selector);

                if ($this.hasClass('imagelightbox-arrow-left')) {
                    index = index - 1;
                    if (!$(selector).eq(index).length)
                        index = $(selector).length;
                } else {
                    index = index + 1;
                    if (!$(selector).eq(index).length)
                        index = 0;
                }

                instance.switchImageLightbox(index);
                return false;
            });
        },
        arrowsOff = function () {
            $('.imagelightbox-arrow').remove();
        };




    var selectorG = '.lightbox';
    var instanceG = $(selectorG).imageLightbox({
        onStart: function () {
            overlayOn();
            arrowsOn(instanceG, selectorG);
            closeButtonOn(instanceG);
        },
        onEnd: function () {
            overlayOff();
            arrowsOff();
            closeButtonOff();
            activityIndicatorOff();
        },
        onLoadStart: function () {
            activityIndicatorOn();
        },
        onLoadEnd: function () {
            $('.imagelightbox-arrow').css('display', 'block');
            activityIndicatorOff();
        }
    });
}
