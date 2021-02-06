;(function($) {

  var $body = $('body'),
      $wrapper = $('#wrapper'),
      $inner = $('#inner'),
      controller = new ScrollMagic.Controller(),
      $masonry = $body.find('.masonry-grid'),
      $section = $('section');

  $('.nav-links a, .hero a, a.grid-item, .prev-next-container a').addClass('transition-link');

  $(".animsition").animsition({
    inClass: 'fade-in transition-in',
    outClass: 'fade-out transition-out',
    inDuration: 600,
    outDuration: 600,
    linkElement: '.transition-link',
    loading: false,
    loadingParentElement: 'body', //animsition wrapper element
    loadingClass: 'animsition-loading',
    loadingInner: '', // e.g '<img src="loading.svg" />'
    timeout: false,
    timeoutCountdown: 5000,
    onLoadEvent: true,
    browser: [ 'animation-duration', '-webkit-animation-duration'],
    overlay : false,
    overlayClass : 'animsition-overlay-slide',
    overlayParentElement : 'body',
    transition: function(url){ window.location.href = url; }
  });


  /*
      Responsive navigation
  */

  var $navLinks = $('ul.nav-links > li:not(.brand)');
  function responsiveMenu(){
    if($(window).width() < 951){
      if($body.hasClass('menu-open')){
        TweenLite.to($navLinks, 2, {opacity: 1, ease: Power3.easeInOut});
      } else {
        TweenLite.to($navLinks, 0, {opacity: 0, ease: Power3.easeInOut});
      }
      $body.on('click', '.has-dropdown', function(e){
        if(!$(this).find('.dropdown').hasClass('dropdown-open')){
          $('ul.dropdown-open').removeClass('dropdown-open').slideUp();
          $(this).find('ul.dropdown').addClass('dropdown-open').slideDown();
          e.preventDefault();
          e.stopPropagation();
        }
      });
    } else {
      TweenLite.to($navLinks, 0, {opacity: 1, ease: Power3.easeInOut});
    }
  }

  $body.on('click', '.responsive-nav', function(e){
    $body.toggleClass('menu-open');
    if($body.hasClass('menu-open')){
      TweenMax.staggerTo($navLinks, 2, {opacity: 1, ease: Power3.easeInOut}, .2);
    } else {
      TweenLite.to($navLinks, 0, {opacity: 0, ease: Power3.easeInOut}, .2);
    }
  });


  /*
    Page content
  */

// Filters
  $body.on('click', '.filter', function(e){

    e.preventDefault();
    e.stopPropagation();

    var $this = $(this),
        selected = $this.attr('data-filter'),
        $filterContainer = $(this).closest('.filters')

    $filterContainer.find('.filter.active').removeClass('active');
    $this.addClass('active');

    $masonry.find('.grid-item:not(.'+selected+')').css({
      '-webkit-transition' : 'all .35s',
      'transition' : 'all .35s',
      '-webkit-transform' : 'scale(0)',
      'transform' : 'scale(0)',
      '-webkit-opacity' : '0',
      'opacity' : '0',
    });
    setTimeout(function(){
      $masonry.find('.grid-item:not(.'+selected+')').hide(0);
      $masonry.find('.'+selected).show(0).css({
        '-webkit-transform' : 'scale(1)',
        '-webkit-opacity' : '1',
        'transform' : 'scale(1)',
        'opacity' : '1'
      });
      $masonry.packery('layout');
    }, 250);
  });

  init();
  autoSizeTextarea();
  initAccordion();

  function init(){
    parallaxHero();
    scrollAnimations();
    $masonry.packery({
      percentPosition: true,
      columnWidth: '.grid-item',
      isInitLayout: false
    });
    $masonry.packery('layout');


// Preloader
    var  $loader = $('#loader'),
         preloader = imagesLoaded($inner, { background: '.bg' }),
         total = 0,
         loaded = 0,
         totalImg = $('.bg').length + $('img').length;

    preloader.on('always', function() {
      total = preloader.images.length;
      $loader.find('.total').text(total);
    }).on('progress', function() {
      loaded++;
      if(loaded < 2)
        $loader.find('.description').text('image loaded');
      else
        $loader.find('.description').text('images loaded');
      $loader.find('.loaded').text(loaded);
      setTimeout(function(){
        $loader.find('.number').text(Math.round(loaded/totalImg*100));
        $loader.find('.loadbar .inner').css({'width' : (loaded/totalImg*100)+'%'});
      },100*loaded);
      $masonry.packery('layout');
    }).on('done', function() {
      setTimeout(function(){
        $loader.find('.number').text('100');
        $loader.find('.loadbar .inner').css({'width' : '100%'});
        $body.addClass('loaded init-load');
        $loader.find('section').delay(500).fadeOut(500);
        $loader.delay(1000).fadeOut(1000);
        TweenLite.to($inner, 1, {autoAlpha: 1, y: 0, delay: 1, ease:Power3.easeOut});
        TweenLite.to(window, .5, {scrollTo: '#wrapper', ease:Power3.easeInOut});
        if($(window).width() > 951){
          TweenMax.staggerFrom($('#main-header .col-1'), 1, {autoAlpha: 0, y: -80, delay: .7, ease:Power3.easeInOut},.2);
        }
        animateText(.7);
      }, 100*loaded);
    }).on('fail', function() {
      $loader.find('.number').text('100');
      $loader.find('.loadbar .inner').css({'width' : '100%'});
      $loader.find('.indicator').css('opacity', 1);
      $body.addClass('loaded init-load');
      $loader.delay(300).fadeOut(1000);
      TweenLite.to($inner, 4, {autoAlpha: 1, y: 0, delay: 2, ease:Power3.easeOut});
    });

    makeLineGrid();
  }

// Accordion
  function initAccordion(){
      var $accordion = $wrapper.find('.accordion');
      if($accordion.length){
        $('.accordion li.active .body').show(0).parent().siblings().find('.body').hide(0);
        $('.accordion li').on('click', function(e){
          var $li = $(this);
          if($li.hasClass('active'))
            $li.removeClass('active').find('.body').slideUp().parent();
          else
            $li.addClass('active').find('.body').slideDown().parent().siblings().removeClass('active').find('.body').slideUp();
          e.preventDefault();
        });
      }
  }


// Hero
  function parallaxHero(){
    var parallaxHero = new ScrollMagic.Scene({triggerElement: ".hero", offset: $(window).height()/2, duration: $('.hero').height() })
    .setTween(".hero", {opacity: 0, y: 80})
    .addTo(controller);
  }

  function scrollAnimations(){
    $wrapper.find('.list-block *, .content-block *').each(function() {
      // build a tween
      var tween = TweenLite.from($(this), 1, {autoAlpha: 0, y: '+=30', ease:Power3.easeInOut});
      // build a scene
      var scene = new ScrollMagic.Scene({
        triggerElement: this,
        offset: -$(window).height()/2
      })
      .setTween(tween) 
      .addTo(controller);
    });
  }

  function makeLineGrid(){
    var $lineCount = new Array(8),
        $gridLine = $('<div class="col-1"></div>'),
        $gridContainer = $('<div class="line-container"></div>'),
        $grid = $('<div class="container"></div>');
    $.each($lineCount, function(i){
      $grid.append($gridLine.clone());
    });
    $gridContainer.append($grid);
    $wrapper.append($gridContainer);
  }

  function autoSizeTextarea(){
    $(document).find('textarea').each(function () {
      this.setAttribute('style', 'height:' + (this.scrollHeight-26) + 'px;overflow-y:hidden;');
    }).on('input', function () {
      this.style.height = 'auto';
      this.style.height = (this.scrollHeight) + 'px';
    });
  }

  function animateText($delay){
    if($('.animatedText').length){
      var mySplitText = new SplitText('.animatedText'),
          splitTextTimeline = new TimelineLite();
      mySplitText.split({type:"words, chars"});
      splitTextTimeline.staggerFrom(mySplitText.chars, 1, {delay: $delay, autoAlpha:0,  y: -100, ease:Power3.easeInOut}, 0.05);
    }
  }



})(jQuery);
