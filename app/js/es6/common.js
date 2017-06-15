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

const catalogue = $(".page-header__menu-catalogue-link");
catalogue.on("click", (e) => {
	e.preventDefault();
	const popup = $(".page-header__menu-popup");
	popup.toggleClass("page-header__menu-popup_visible");
});

const slider = $(".banner__slider");
slider.slick({
	arrows: true,
	dots: true
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
const mobileMenu = $(".page-header__menu-navigation");
mobileMenuCloseBtn.on("click", () => {
	mobileMenu.hide();
})

