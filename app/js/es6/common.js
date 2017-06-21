localStorage.removeItem("inlineSVGrev");
localStorage.removeItem("inlineSVGdata");

;( function( window, document )
{
	'use strict';
	var file     = 'img/svg_sprite.html',
			revision = 1;

	if( !document.createElementNS || !document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' ).createSVGRect )
		return true;

	var isLocalStorage = 'localStorage' in window && window[ 'localStorage' ] !== null,
		request,
		data,
		insertIT = function()
		{
			document.body.insertAdjacentHTML( 'afterbegin', data );
		},
		insert = function()
		{
			if( document.body ) insertIT();
			else document.addEventListener( 'DOMContentLoaded', insertIT );
		};

	if( isLocalStorage && localStorage.getItem( 'inlineSVGrev' ) == revision )
	{
		data = localStorage.getItem( 'inlineSVGdata' );
		if( data )
		{
			insert();
			return true;
		}
	}

	try
	{
		request = new XMLHttpRequest();
		request.open( 'GET', file );
		request.onload = function()
		{
			if( request.status >= 200 && request.status < 400 )
			{
				data = request.responseText;
				insert();
				if( isLocalStorage )
				{
					localStorage.setItem( 'inlineSVGdata',  data );
					localStorage.setItem( 'inlineSVGrev',   revision );
				}
			}
		}
		request.send();
	}
	catch( e ){}

}( window, document ) );

$(document).ready( () => {
	const catalogue = $(".page-header__menu-catalogue-link");
	catalogue.on("click", (e) => {
		e.preventDefault();
		const popup = $(".page-header__menu-popup");
		popup.toggleClass("page-header__menu-popup_visible");
	});

	const slider = $(".banner__slider");
	slider.slick({
		arrows: true,
		dots: true,
		responsive: [
			{
				breakpoint: 767,
				settings: {
					arrows: false
				}
			}
		]
	});

	const callbackBtn = $(".page-header__callback-btn");
	const callbackPopUp = $(".callback-popup");
	const closePopUpBtn = $(".callback-popup__close-btn");
	callbackBtn.on("click", function(e){
		e.preventDefault();
		callbackPopUp.show();
		$("body").css("overflowY", "hidden");
	});

	closePopUpBtn.on("click", function(){
		callbackPopUp.hide();
		$("body").css("overflowY", "visible");
	});

	const mobileMenuCloseBtn = $(".mobile-menu__close-btn");
	const burgerBtn = $(".page-header__burger-btn");
	const mobileMenu = $(".page-header__menu-navigation");
	mobileMenuCloseBtn.on("click", () => {
		mobileMenu.hide();
	});
	burgerBtn.on("click", () => {
		mobileMenu.show();
	});

	$(window).on("resize", function(e){
		if(window.innerWidth > 767)
			mobileMenu.css("display", "block");
		else
			mobileMenu.css("display", "none");
			 
	});
	const accordionWrapper = $("[data-accordion]");
	accordionWrapper.accordion({
	  collapsible: true,
	  heightStyle: "content",
	  active: 0
	});


	var Gallery = function(
		mainItem, 
		galleryList, 
		galleryImages
	) {
		this._mainItem = $("."+mainItem);
		this._galleryList = $("."+galleryList);
		this._galleryImages = $("."+galleryImages);
		this._sourcesArray = [];
		this._count = 0;
	}

	Gallery.prototype._createSources = function() {
		var that = this;
		this._galleryImages.each(function(){
			that._sourcesArray.push($(this).attr("src"));
		});
	};
	Gallery.prototype._toggleSmallImage = function() {
		var that = this;
		this._galleryList.on("click", function(e){
			if(e.target.nodeName === "IMG") {
				var source = $(e.target).attr("src");
				that._mainItem.css("opacity", 0);
				that._mainItem.attr("src", source);
				that._mainSource = that._mainItem.attr("src");
				$(e.target).addClass("item-card__photo_active");
				$(e.target).siblings("img").each(function(index, elem){
					$(elem).removeClass("item-card__photo_active");
				});
				/*$('.expand-btn').magnificPopup({
			    items: {
			      src: source
			    },
			    type: 'image' // this is default type
				});*/
				that._popUp(that._mainSource);
				that._mainItem.animate({ "opacity": "1" }, 500);
			}
		});
	};

	Gallery.prototype._popUp = function(source) {
		if($.magnificPopup) {
			this._mainItem.magnificPopup({
		    items: {
		      src: source
		    },
		    type: 'image' // this is default type
			});
		}
	}


Gallery.prototype._toggleMainImage = function() {
		var that = this;
		this._mainItem.on("click", function(e){
			that._count++
			if(that._count === that._sourcesArray.length)
				that._count = 0;
			$(this).css("opacity", 0);
			$(this).attr("src", that._sourcesArray[that._count]);
			$(this).animate({ "opacity": "1" }, 500);
			/*$('.expand-btn').magnificPopup({
			    items: {
			      src: that._sourcesArray[that._count]
			    },
			    type: 'image' // this is default type
				});*/
				

		});
	};
	Gallery.prototype._offEventsOnMobiles = function() {
		var that = this;
		if(window.innerWidth < 768) {
			this._galleryList.off("click");
			this._mainItem.off("click");
		}
		$(window).on("resize", function(){
			if(window.innerWidth < 768) {
				that._galleryList.off("click");
				that._mainItem.off("click");
			} else {
				that._toggleSmallImage();
				that._toggleMainImage();
			}
		});
	};


	Gallery.prototype.init = function() {
		this._createSources();
		this._toggleSmallImage();
		//this._toggleMainImage();
		//this._offEventsOnMobiles();
		
	};
	new Gallery(
		"item-card__main-photo img",
		"item-card__small-photos",
		"item-card__small-photos img"
		).init();



} )



