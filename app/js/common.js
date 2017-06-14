"use strict";

localStorage.removeItem("inlineSVGrev");
localStorage.removeItem("inlineSVGdata");

;(function (window, document) {
	'use strict';

	var file = 'img/svg_sprite.html',
	    revision = 1;

	if (!document.createElementNS || !document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect) return true;

	var isLocalStorage = 'localStorage' in window && window['localStorage'] !== null,
	    request,
	    data,
	    insertIT = function insertIT() {
		document.body.insertAdjacentHTML('afterbegin', data);
	},
	    insert = function insert() {
		if (document.body) insertIT();else document.addEventListener('DOMContentLoaded', insertIT);
	};

	if (isLocalStorage && localStorage.getItem('inlineSVGrev') == revision) {
		data = localStorage.getItem('inlineSVGdata');
		if (data) {
			insert();
			return true;
		}
	}

	try {
		request = new XMLHttpRequest();
		request.open('GET', file);
		request.onload = function () {
			if (request.status >= 200 && request.status < 400) {
				data = request.responseText;
				insert();
				if (isLocalStorage) {
					localStorage.setItem('inlineSVGdata', data);
					localStorage.setItem('inlineSVGrev', revision);
				}
			}
		};
		request.send();
	} catch (e) {}
})(window, document);

var catalogue = $(".page-header__menu-catalogue-link");
catalogue.on("click", function (e) {
	e.preventDefault();
	var popup = $(".page-header__menu-popup");
	popup.toggleClass("page-header__menu-popup_visible");
});