/*
<div id="BCM_modal" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
		<div class="modal-dialog" role="document">
			<div class="modal-content">
			</div>
		</div>
	</div>

*/


/*
<div id="BCM_modal" class="modal fade show" tabindex="-1" role="dialog" aria-hidden="false" style="display: block;">
		<div class="modal-dialog" role="document">
			<div class="modal-content">
				<div class="modal-header"></div>
				<div class="modal-body"></div>
				<div class="modal-footer"></div>
			<div>
		</div>
	</div>

	<div class="modal-backdrop fade show"></div>
*/


var BSModal = (function () {
	"use strict";
	var supportTransition = 'webkitTransition' in document.head.style || 'transition' in document.head.style;
	var transitionDuration = 'webkitTransition' in document.head.style ? 'webkitTransitionDuration' : 'transitionDuration';
	var transitionProperty = 'webkitTransition' in document.head.style ? 'webkitTransitionProperty' : 'transitionProperty';

	const backdrop = document.createElement("div");
	backdrop.classList.add("modal-backdrop", "fade", "show");

	let modalTemplate = document.createElement("div");
	modalTemplate.classList.add("modal");
	modalTemplate.setAttribute("tabindex", "-1")
	modalTemplate.setAttribute("role", "dialogue")
	modalTemplate.setAttribute("aria-hidden", "true")
	modalTemplate.innerHTML =
`<div class="modal-dialog" role="document">
	<div class="modal-content">
		<div class="modal-header"></div>
		<div class="modal-body"></div>
		<div class="modal-footer"></div>
	</div>
</div>`;


	function setFocus(element) {
		element.focus ? element.focus() : element.setActive();
	}

	function showBackdrop() {
		document.body.appendChild(backdrop);
	}

	function backdropShowing() {
		return document.body.contains(backdrop) && backdrop.classList.contains("show");
	}

	function getCurrentOpen() {
		return document.getElementsByClassName("modal show")[0];
	}
	function isModalShowing() {
		return document.body.classList.contains("modal-open")
	}
	function getModalNode(modal, part) {
		return modal.querySelector(".modal-" + part)
	}

	function getTransitionDuration(element) {
		var computedStyle = getComputedStyle(element);
		var property = computedStyle[transitionProperty];
		if (supportTransition && property && property !== "none") {
			var duration = parseFloat(computedStyle[transitionDuration])
		}
		return !isNaN(duration) ? duration * 1000 : 0;
	}
	function onEndOfTransition(element, callback) {
		var transitionEndEvent = 'webkitTransition' in document.head.style ? 'webkitTransitionEnd' : 'transitionend';
		var called = false;
		var duration = getTransitionDuration(element);
		if (duration) {
			element.addEventListener(transitionEndEvent, function transistionEndWrapper(e) {
				if (!called) callback(e);
				called = true;
				element.removeEventListener(transitionEndEvent, endTransitionEventCB);
			})
		} else {
			setTimeout(_ => { if (!called) callback(); called = true; },17);
		}
	}

	function setupEvents(modal, action) {
		var action = action ? "addEventListener" : "removeEventListener";
		window[action]("resize", modal.update, false);
		modal.modal[action]("click", modal.handleDismiss, false);
		document[action]("keydown", modal.handleKey, false)
	}

	function hideBackdrop() {
		var removeBackdrop = _ => document.body.removeChild(backdrop);
		if (backdropShowing() && !isModalShowing()) {
			backdrop.classList.remove("show");
			onEndOfTransition(backdrop, removeBackdrop);
		} else {
			removeBackdrop();
		}
	}

	function prepareShow(modal) {
		modal.modal.style.display = "block";

		!getCurrentOpen() && document.body.classList.add("modal-open");
		modal.modal.classList.add("show")
		modal.modal.setAttribute("aria-hidden", "false");
		if (modal.toFade()) {
			onEndOfTransition(modal.modal, _ => showModal(modal))
		}
	}

	function showModal(modal) {
		setFocus(modal.modal);
		modal.isAnimating = false;
		setupEvents(modal, 1);
	}

	function hideModal(modal) {
		delete modal.style.display;
		setFocus(modal.modal)
		hideBackdrop();
		setupEvents(modal);
		modal.isAnimating = false;
	}


	/*
	body.modal-open
	class="show" 
	aria-hidden="false" style="display: block;">
	*/
	class BSModal {
		constructor(options = { backdrop: false, fade: true }) {
			this.options = options;
			this.modal = modalTemplate.cloneNode(true);
			if (options.fade) this.modal.classList.add("fade");
			//this.modal.modal = this;
			this.isAnimating = false;
			document.body.insertAdjacentElement("afterbegin", this.modal)
		}

		setContent(options = { header, body, footer }) {
			if (typeof (options) === "string") options = { header: "", body: options, footer: "" };
			if(arguments.length>1) {
				options = Object.keys(options).reduce((obj,k,i)=>{
					obj[k]=arguments[i];
					return obj;
				},{})
			}
			let { header, body, footer } = options;
			getModalNode(this.modal, "header").innerHTML = header;
			getModalNode(this.modal, "body").innerHTML = body;
			getModalNode(this.modal, "footer").innerHTML = footer;
		}

		show() {
			if (this.showing() && this.isAnimating) return;
			this.isAnimating = true;

			//Hide any eisting modals
			var currentOpen = getCurrentOpen();
			if (currentOpen && currentOpen !== this.modal) {
				//modalTrigger.modal??
				currentOpen.modal && currentOpen.modal.hide();
			}


			var currentOpen = getCurrentOpen();
			//Display backdrop if requested
			if (this.options.backdrop) showBackdrop();

			//if the backdrop isnt showing and there is no open modals
			if (backdrop && !currentOpen && !backdropShowing()) {
				var backdropDelay = getTransitionDuration(backdrop);
				backdrop.classList.add("show");
			}


			if (currentOpen) {
				prepareShow(this);
			} else {
				setTimeout(_ => prepareShow(this), backdrop && backdropDelay)
			}
		}

		toFade() {
			if (this.options.fade != this.modal.classList.contains("fade")) {
				this.modal.classList.toggle("face");
			}
			return this.options.fade;
		}

		hide(force) {
			if (!isModalShowing()) return;
			this.isAnimating = true;
			this.modal.classList.remove("show")
			this.modal.setAttribute("aria-hidden", "true");
			if (this.toFade() && !force) {
				onEndOfTransition(this.modal, _ => hideModal(this.modal))
			} else {
				hideModal(this.modal)
			}
		}

		update() {

		}

		showing() {
			return this.modal.classList.contains("show")
		}

		toggle() {
			return this.showing() ? this.hide() : this.show();
		}

		getHeaderNode() {
			return getModalNode(this.modal, "header");
		}

		getBodyNode() {
			return getModalNode(this.modal, "body");
		}

		getFooterNode() {
			return getModalNode(this.modal, "footer");
		}


		handleKey(e) {
			if (!this.isAnimating && e.key == "Escape" && this.showing()) {
				this.hide();
			}
		}

		/**
		 * 
		 * @param {MouseEvent} e 
		 */
		handleDismiss(e) {
			if (this.isAnimating) return;
			var clickTarget = e.target;
			var data = clickTarget.getAttribute("data-dismiss") === "modal"
			var parent = clickTarget.closest('[data-dismiss="modal"]');
			if (this.showing() && (parent || data || clickTarget == this.modal)) {
				this.hide();
				e.preventDefault()
			}
		}
	}

	return BSModal;
})();