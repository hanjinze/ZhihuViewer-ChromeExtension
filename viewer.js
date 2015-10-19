$(document).ready(function() {
	var allImages = $('.zm-item-answer').find('.lazy');
	var allImagesUrl = [];
	var allImagesHtml = [];
	var viewportWidth = $(window).width();
	var viewportHeight =  window.innerHeight;
	var maxImages = 0;
	var unitWidth = 0;
	var maxWidth = 0;
	var log = console.log.bind(console);
	var prevButton = {};
	var nextButton = {};
	var total = {};
	var current = {};
	var viewer = {};
	var imageHolder = {};
	var isPresented = false;

	if(location.href.indexOf('zhuanlan') !== -1) {
		allImages = $('.origin_image');
	}
	allImages.each(function(index, image) {
		if($(this).data('original') !== undefined) {
			allImagesUrl.push($(this).data('original'));
		} else {
			allImagesUrl.push($(this).data('actualsrc'));
		}
		
	});
	$('<div class="viewer">' +
			'<div class="window" data-index="0"></div>' +
			'<div class="close-window"></div>' +
			'<div class="paginator">' +
				'<div class="paginator-right paginator-each"></div>' +
				'<div class="paginator-left paginator-each"></div>' +
			'</div>' +
			'<div class="nav"><span class="current"></span><span class="slash">/</span><span class="total"></span></div>' + 
	  '</div>' +
	  '<div class="mask"></div>').appendTo($('body'));

	viewer = $('.viewer');
	viewer.css('width', viewportWidth + 'px').css('height', viewportHeight + 'px');

	imageHolder = $('.window');
	for(var i = 0; i < allImagesUrl.length; i++) {
		allImagesHtml.push('<div class="image"><img src="' + allImagesUrl[i] + '" data-index=' + (i + 1) + '"></div>');
	}
	$(allImagesHtml.join('')).appendTo(imageHolder);

	maxImages = allImagesUrl.length;
	total = $('.total');
	current = $('.current');
	total.text(maxImages);
	current.text('1');
	prevButton = $('.paginator-left');
	nextButton = $('.paginator-right');
	if(maxImages === 0) {
		$('<h1 class="viewer-tip">此问题下没有图片</h1>').appendTo(imageHolder);
		nextButton.hide();
	}
	if(maxImages === 1) {
		nextButton.hide();
	}

	function prevPic(){
		var currentPosition = parseInt(imageHolder.data('index'));
		var currentPic = parseInt(current.text());
		if(currentPosition !== 0) {
			imageHolder.css('right', (currentPosition - 1) * 100 + '%');
			imageHolder.data('index', currentPosition - 1);
			current.text(currentPic - 1);
		}   		 
		if(currentPosition === 1) {
			prevButton.fadeOut(400);
			nextButton.fadeIn(400);
		}
	}

	function nextPic() {
		var currentPosition = parseInt(imageHolder.data('index'));
		var currentPic = parseInt(current.text());
		prevButton.fadeIn(400);
		if(currentPosition < maxImages - 1) {
			imageHolder.css('right', (currentPosition + 1) * 100 + '%');
			imageHolder.data('index', currentPosition + 1);
			current.text(currentPic + 1);
		}
		if(currentPosition === maxImages -2) {
			nextButton.fadeOut(400);
		}
	}

	function shortCuts(e) {
		/* key code 39 -> arrow right
		** key code 68 -> d
		** key code 37 -> arrow left
		** key code 65 -> a
		** key code 27 -> ESC
		** key code 81 -> q
		** key code 70 -> f
		 */
		if(e.which === 39 || e.which === 68) {
			nextPic();
		} else if(e.which === 37 || e.which === 65) {
			prevPic();
		} else if(e.which === 27 || e.which === 81) {
			stop();
		}
	}
	
	function start(){
		isPresented = true;
		viewer.fadeIn(400);
		$('.mask').fadeIn(400);
		$('body').css('overflow', 'hidden');
		unitWidth = imageHolder.width();
		maxWidth = (maxImages - 1) * unitWidth;
		prevButton.click(prevPic);
		nextButton.click(nextPic);
		$('.close-window').click(stop)
		$(document).keydown(shortCuts);
	}

	function stop(){
		isPresented = false;
		viewer.fadeOut(400);
		$('.mask').hide();
		$('body').css('overflow', 'visible');
		prevButton.off('click');
		nextButton.off('click');
		$('.close-window').off('click');
		$(document).off('keydown', shortCuts);
	}

	$(window).resize(function(){
		viewer.css('width', $(window).width() + 'px').css('height', window.innerHeight + 'px');
		unitWidth = imageHolder.width();
		maxWidth = (maxImages - 1) * unitWidth;
	})
	
	$(document).keydown(function(e){
		if(e.altKey && e.ctrlKey && e.which === 70) {
			if(isPresented) {
				stop();
			} else {
				start();
			}
		}
	});
	
  	chrome.runtime.sendMessage('showPageAction');
	

});