// document.ontouchmove = function(e) {
// 	e.preventDefault()
// };

$(document).ready(function(){
	var pages = {
		selector : $('.page'),
		numberOfPages : $('.page').length,
		activePage : 0,
		nextPage : 1, 
		previousPage : this.numberOfPages - 1,
		pages : [],
		noticeShowing: false,
		lastSwipe: 0,
		swipeMinInterval: 30,

		checkBG : function() {

		},

		goPreviousPage : function(){
			if (this.activePage) {
				this.activePage--;
				if (this.activePage < 0) {
					this.activePage = this.numberOfPages - 1;
					this.nextPage = 0;
					this.previousPage = this.activePage - 1;
				}
				$('.wrapper-inner').transition({'left' : (this.activePage * 1024)*-1});

				// please refactor this code ...
				$("#bg-1").attr('page', function(h, i){
					var hold = parseInt($(this).attr('bg-hold'));
					i = parseInt(i);
					if (hold+i-1 === pages.activePage) {
						$(this).transition({'left' : 0});
					}
				});
				// ... for it is atrocious
			} else {
				this.notice("at start of document");
			}
		},
		goNextPage : function() {
			if (this.activePage != (this.numberOfPages - 1) ) {
				this.activePage++;
				if (this.activePage >= this.numberOfPages) {
					this.activePage = 0;
					this.nextPage = 1;
					this.previousPage = this.numberOfPages - 1;
				}
				$('.wrapper-inner').transition({'left' : (this.activePage * 1024)*-1});
				$("#bg-1").attr('page', function(h, i){
					var hold = parseInt($(this).attr('bg-hold'));
					i = parseInt(i);
					if (hold+i === pages.activePage) {
						$(this).transition({'left' : -1024});
					}
				});
			} else {
				this.notice("at end of document");
			}
		},
		goPreviousSubPage : function() {
			if (this.pages[this.activePage].activePage === 0) {
				
					this.goPreviousPage();
				
			} else {
				this.pages[this.activePage].nextPage = this.pages[this.activePage].activePage;
				this.pages[this.activePage].activePage--;
				this.pages[this.activePage].previousPage--;
				$(this.selector[this.activePage]).find('.sub-page').transition({left:'+=440px'});
			}
		},
		goNextSubPage : function() {
			if ( this.pages[this.activePage].activePage === (this.pages[this.activePage].numberOfPages -1) ) {
				
					this.goNextPage();
				
				
			} else {
				this.pages[this.activePage].activePage++;
				this.pages[this.activePage].previousPage = this.pages[this.activePage].activePage-1;
				this.pages[this.activePage].nextPage++;
				$(this.selector[this.activePage]).find('.sub-page').transition({left:'-=440px'});
			}
		},
		notice : function(msg) {

			if (!this.noticeShowing) {
				this.noticeShowing = true;
				$('#notice').html(msg)
					.css({opacity: 0})
					.removeClass('hidden')
					.transition({opacity:1})
					.transition({opacity:0, delay:800}, function() {
						pages.noticeShowing = false;
					});
			}
		}
	}

	var tools = {
		activePage: 0,
		nextPage: 1,
		goNextSubPage:function(activeContainer) {
			activeContainer.parent().transition({'left':'-440px'})
		},
		goPreviousSubPage:function(activeContainer) {
			activeContainer.parent().transition({'left':'0'})
		}
	}

	var contents = {
		isActive: false,
		contentsSelector: $('#contents'),
		toggleContents: function() {
			if (this.isActive === true) {
				this.contentsSelector.transition({
					'left': '-520px'
				});
				this.isActive = false;
			} else {
				this.contentsSelector.transition({
					'left': '0px'
				});
				this.isActive = true;
			}
		}
	}

	var skills = {
		activePage:0,
		numberOfPages:2,
		skillsSelector: $('#skills'),
		skillSlideSelector: false,
		numberOfSlides: false,
		activeSlide:0,
		skillSlideLeft: function(){
			if ((this.activeSlide + 1) < this.numberOfSlides) {
				this.activeSlide++;
				$('.skill-slideshow-inner').transition({
					'left':'-=863'
				});
				$('.skill-slide-indicator .ball').removeClass("active")
					.each(function(){
						if (skills.activeSlide == $(this).attr("slide")) {
							$(this).addClass('active');
						}
					});
			} 

		},
		skillSlideRight: function(){
			if (this.activeSlide > 0) {
				this.activeSlide--;
				$('.skill-slideshow-inner').transition({
					'left': '+=863'
				});
				$('.skill-slide-indicator .ball').removeClass("active")
					.each(function(){
						if (skills.activeSlide == $(this).attr("slide")) {
							$(this).addClass('active');
						}
					});
			}


		},
		closeSkills: function(){

			// pages.notice("reach");
			this.skillsSelector.transition({
				'top':'748px'
			});
			$('#exercise').transition({
				'bottom':'0'
			})
		},
		openSkills: function(skillName) {
			// remember to remove Math.random()
			$('#skills-inner').css({'left':0}).load('skills/'+skillName+'.html?v='+Math.random(), function(){
				skills.skillSlideSelector = $('.skill-slide');
				skills.numberOfSlides = $('.skill-slide').length;
				skills.activePage = 0;
				skills.numberOfPages = 2;
				skills.activeSlide = 0;
				skills.skillSlideSelector.each(function(index){
					if (!index) {
						var ballClass = "ball active";
					} else {
						var ballClass = "ball";
					}
					$(".skill-slide-indicator").append('<div class="'+ballClass+'" slide="'+index+'"></div>');
				});
				$('.skill-slideshow-inner').css({
					'width': skills.numberOfSlides * 863
				});
				skills.numberOfPages = $("section.skills-page").length;
			});
			this.skillsSelector.transition({
				'top':'0px'
			});
			$('#exercise').transition({
				'bottom':'748px'
			});
			
		},
		pageLeft: function() {
			this.activePage++;
			if (this.activePage > (this.numberOfPages - 1)) {
				this.activePage = (this.numberOfPages - 1);
			} else {
				this.skillsSelector.find('#skills-inner')
					.transition({
						'left':'-=1024'
					});
			}
		},
		pageRight: function() {
			this.activePage--;
			if (this.activePage < 0) {
				this.activePage = 0;
			} else {
				this.skillsSelector.find('#skills-inner')
					.transition({
						'left': "+=1024"
					});
			}
		}
	}

	var caseSlide  = {
		activeSlide:0,
		slideContainer: $('.case-slideshow'),
		numberOfSlides:3,
		lastSwipe:0,
		swipeMinInterval: 30,
		slideLeft: function(){
			this.activeSlide++;
			if (this.activeSlide > (this.numberOfSlides-1)) {
				this.activeSlide = this.numberOfSlides-1;
			} else {
				console.log(this.slideContainer.find(".slide-indicator"));
				this.slideContainer.find(".case-slideshow-inner").transition({
					'left':'-=512'
				});	
				this.slideContainer.find(".slide-indicator .ball").each(function(index){
					if ($(this).hasClass('active')) {
						$(this).transition({'background-color':'#dbdbda'}, function(){ $(this).removeClass('active')})
					}
					//console.log($(this).attr('slide'), caseSlide.activeSlide)
					if ( $(this).attr('slide') == caseSlide.activeSlide) {
						$(this).transition({'background-color':'#23303a'}, function(){ $(this).addClass('active')});
					}
				});			
			}

		},
		slideRight: function(){
			this.activeSlide--;
			if (this.activeSlide < 0) {
				this.activeSlide = 0;
			} else {
				console.log(this.slideContainer.find(".slide-indicator .ball"));
				this.slideContainer.find(".case-slideshow-inner").transition({
					'left':'+=512'
				});
				this.slideContainer.find(".slide-indicator .ball").each(function(index){
					if ($(this).hasClass('active')) {
						$(this).transition({'background-color':'#dbdbda'}, function(){ $(this).removeClass('active')})
					}
					if ( $(this).attr('slide') == caseSlide.activeSlide) {
						$(this).transition({'background-color':'#23303a'}, function(){ $(this).addClass('active')});
					}
				});
			}
		}

	};

	// set up pages array
	$.each(pages.selector, function(i){
		var spl = $(this).find('.sub-page');
		if (spl.length > 0) {
			pages.pages.push({
				hasSub: true,
				numberOfPages: $(spl).find('.sub-page-inner').length,
				activePage : 0,
				nextPage : 1,
				previousPage: $(spl).find('.sub-page-inner').length - 1
			});

		} else {
			pages.pages.push({ hasSub: false });
		}
	});

	$('#notice').css({
		left : ($(window).width() / 2) - (  $('#notice').width() / 2 ),
		top : ($(window).height() / 2) - ( $('#notice').height() / 2 )
	})

	$(window).resize(function(){
		// pages.selector.css({
		// 	'height':$(window).height(),
		// 	'width':$(window).width() 
		// });
		$('#notice').css({
			left : (1024 / 2) - (  $('#notice').width() / 2 ),
			top : (748 / 2) - ( $('#notice').height() / 2 )
		})
	});

	$('.wrapper').width(1024);
	$('.wrapper-inner').width(1024 * pages.numberOfPages);

	// end of setup

	// swipe behaviors

	// $('.page').on('swipeleft', function(event){
	// 	var d = new Date();
	// 	if ((d.getTime() - pages.lastSwipe) >= pages.swipeMinInterval) {
	// 		pages.goNextPage();
	// 		pages.lastSwipe = d.getTime();
	// 	}
		
	// });

	// $('.page').on('swiperight', function(event){
	// 	var d = new Date();
			
	// 	if ((d.getTime() - pages.lastSwipe) >= pages.swipeMinInterval) {
	// 		pages.goPreviousPage();
	// 		pages.lastSwipe = d.getTime();
	// 	}
	// });



	$('.page').swipe({
        swipeLeft:function(event, direction, distance, duration, fingerCount, fingerData) {
          	pages.goNextPage();
        },       
        swipeRight:function(event, direction, distance, duration, fingerCount, fingerData) {
          	pages.goPreviousPage(); 
        },
         threshold:30
      });

	$('.lesson').swipe({
        swipeLeft:function(event, direction, distance, duration, fingerCount, fingerData) {
        	event.stopPropagation();
          	pages.goNextSubPage();
        },       
        swipeRight:function(event, direction, distance, duration, fingerCount, fingerData) {
        	event.stopPropagation();
          	pages.goPreviousSubPage();
        },
         threshold:30
      });

	$('.skill').swipe({
        swipeLeft:function(event, direction, distance, duration, fingerCount, fingerData) {
          	event.stopPropagation();
			tools.goNextSubPage($(this));
        },       
        swipeRight:function(event, direction, distance, duration, fingerCount, fingerData) {
          	event.stopPropagation();
          	tools.goPreviousSubPage($(this));
        },
         threshold:30
      });

	$('#contents-tab').on('click', function(event){
		event.preventDefault();
		contents.toggleContents();
	});

	$('#skills .handle').on('click', function(){
		skills.closeSkills();
	});

	$('#skills .skill-slide').swipe({
        swipeLeft:function(event, direction, distance, duration, fingerCount, fingerData) {
          	event.stopPropagation();
          	skills.skillSlideLeft();
        },       
        swipeRight:function(event, direction, distance, duration, fingerCount, fingerData) {
          	event.stopPropagation();
			skills.skillSlideRight();
         },
         threshold:30
      });

	$(document).on('swiping', '#skills .skill-slide', function(){
		$(this).swipe({
        swipeLeft:function(event, direction, distance, duration, fingerCount, fingerData) {
          	event.stopPropagation();
          	skills.skillSlideLeft();
        },       
        swipeRight:function(event, direction, distance, duration, fingerCount, fingerData) {
          	event.stopPropagation();
			skills.skillSlideRight();
         },
         threshold:30
      });
	});

	// $(document).on('swiperight','#skills .skill-slide', function(){
	// 	skills.skillSlideRight();
	// });
	// $(document).on('swipeleft', '#skills .skill-slide',function(){
	// 	skills.skillSlideLeft();
	// });

	$('.skill-main').on('click', function(){
		var skillName = $(this).attr('subject');
		skills.openSkills(skillName);
	});
	$(document).on('swipeleft', '.skills-page', function(){
		skills.pageLeft();
	});
	$(document).on('swiperight', '.skills-page', function(){
		skills.pageRight();
	});

	$('.case-slideshow .case-slide').on('swipeleft', function(event){
		var d = new Date();
		event.stopPropagation();
		if ( d.getTime() - caseSlide.lastSwipe >= caseSlide.swipeMinInterval ) {
			caseSlide.slideLeft();
			caseSlide.lastSwipe = d.getTime()
		}
	});

	$('.case-slideshow .case-slide').on('swiperight', function(event){
		var d = new Date();
		event.stopPropagation();
		if ( d.getTime() - caseSlide.lastSwipe  >= caseSlide.swipeMinInterval ) {
			caseSlide.slideRight();
			caseSlide.lastSwipe = d.getTime()
		}

	});

	// potential fix for scrolling issues: 
	// http://goo.gl/4UEU3O
	// http://goo.gl/jVVMMz

	// document.getElementsByClassName('.scroll-region').ontouchmove = function(event){
	// 	event.stopPropagation();
	// };

});