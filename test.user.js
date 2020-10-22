// ==UserScript==
// @name         Test
// @namespace    http://boxcrittersmods.ga
// @version      0.1
// @description  Test
// @author       TumbleGamer
// @require      https://github.com/SArpnt/joinFunction/raw/master/script.js
// @require      https://github.com/SArpnt/EventHandler/raw/master/script.js
// @require      https://github.com/SArpnt/cardboard/raw/master/script.user.js
// @require      https://github.com/tumble1999/mod-utils/raw/master/mod-utils.js
// @require      https://github.com/tumble1999/native-modals/raw/master/native-modal.js
// @match        https://boxcritters.com/play/
// @match        https://boxcritters.com/play/?*
// @match        https://boxcritters.com/play/#*
// @match        https://boxcritters.com/play/index.html
// @match        https://boxcritters.com/play/index.html?*
// @match        https://boxcritters.com/play/index.html#*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
	'use strict';
	console.log(BCModUtils);
	console.log(BSModal);

	var mod = BCModUtils.InitialiseMod({
		name: "Test",
		abriv: "T",
		author: "A Human"
	});

	mod.log("Hello World");
	mod.log(BCModUtils.camelize("Hello World"));

	var modal = new Modial();
	mod.log(modal);
	modal.setContent("Test", "Hello World");

	modal.addEventListener("Created", () => {
		console.log("Modal created");
	});


	setTimeout(_ => {
		modal.show();
	}, 2000);

	/*setTimeout(_=>{
		modal.hide()
	},4000)*/
})();