var Modial = (function () {
	"use strict";
	const backdrop = document.createElement("div");
	backdrop.classList.add("modal-backdrop", "fade");

	let modalTemplate = document.createElement("div");
	modalTemplate.classList.add("modal", "fade");
	setTimeout(() => modalTemplate.classList.remove("show"), 0);
	modalTemplate.setAttribute("tabindex", "-1");
	modalTemplate.setAttribute("role", "dialogue");
	modalTemplate.setAttribute("aria-hidden", "true");
	modalTemplate.innerHTML = `<div class="modal-dialog" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title"></h5>
					<button type="button" class="btn-close modal-close" data-dismiss="modal" aria-label="Close"></button>
				</div>
				<div class="modal-body"></div>
				<div class="modal-footer"></div>
			</div>
		</div>`;

	function isModalShowing() {
		return document.readyState == "complete" && document.body.classList.contains("modal-open");
	}
	function getModalNode(modal, part) {
		return modal.querySelector(".modal-" + part);
	}

	function onTransition(element) {
		return new Promise((res, rej) => {
			if (element.classList.contains("fade")) {
				element.addEventListener("transitionend", res);
			} else {
				res();
			}
		});
	}

	function prepareForModal() {
		document.body.classList.add("modal-open");
		document.body.appendChild(backdrop);
		setTimeout(() => backdrop.classList.add("show"), 0);
	}

	function cleanModalPreperarions() {
		document.body.classList.remove("modal-open");
		onTransition(backdrop).then(_ => {
			document.body.removeChild(backdrop);
		});
		backdrop.classList.remove("show");
	}

	function setupEvents(modal, action) {
		var action = action ? "addEventListener" : "removeEventListener";
		modal.element[action]("click", modal.handleClick.bind(modal));
	}

	function onDocumentLoaded() {
		return new Promise((res, rej) => {
			if (document.readyState == "complete") {
				res();
			} else {
				window.addEventListener("load", res);
			}
		});
	}

	/*
body.modal-open
class="show"
aria-hidden="false" style="display: block;">
*/
	class Modial extends EventTarget {
		constructor(options = { backdrop: false, fade: true, ableToClose: true }) {
			super();
			this.options = options;
			this.element = modalTemplate.cloneNode(true);
			if (options.fade) this.element.classList.add("fade");
			this.element.modal = this;
			this.created = false;
			onDocumentLoaded().then(_ => {
				document.body.insertAdjacentElement("afterbegin", this.element);
				this.created = true;
				var createdEvent = new CustomEvent("created");
				this.dispatchEvent(createdEvent);
			});
		}

		setContent(options = { header, body, footer }) {
			if (typeof options === "string")
				options = { header: "", body: options, footer: "" };
			if (arguments.length > 1)
				options = Object.keys(options).reduce(
					(obj, k, i) => ((obj[k] = arguments[i]), obj),
					{}
				);
			let { header, body, footer } = options;
			getModalNode(this.element, "title").innerHTML = header;
			getModalNode(this.element, "body").innerHTML = body;
			getModalNode(this.element, "footer").innerHTML = footer;
		}

		setWidth(width) {
			getModalNode(this.element, "dialog").style["max-width"] = width;
		}

		show() {
			if (!this.created) return this.addEventListener("created", this.show);
			if (isModalShowing() && this.element.classList.contains("show")) return;
			var element = this.element;
			prepareForModal();
			element.style.display = "block";
			//onTransition(backdrop).then(_ => {
			element.classList.add("show");
			element.setAttribute("aria-hidden", "false");
			setupEvents(this, 1);
			//});
		}

		hide() {
			if (!isModalShowing() || !this.options.ableToClose) return;
			cleanModalPreperarions();
			var element = this.element;
			element.classList.remove("show");
			element.setAttribute("aria-hidden", "true");
			setupEvents(this);
			onTransition(this.element).then(_ => {
				element.style.display = "";
			});
		}

		enableClosing() {
			this.options.ableToClose = true;
			this.element.querySelector(".close").disabled = false;
		}
		disableClosing() {
			this.options.ableToClose = false;
			this.element.querySelector(".close").disabled = true;
		}

		showing() {
			return this.element && this.element.classList.contains("show");
		}

		toggle() {
			return this.showing() ? this.hide() : this.show();
		}

		getHeaderNode() {
			return getModalNode(this.element, "header");
		}

		getBodyNode() {
			return getModalNode(this.element, "body");
		}

		getFooterNode() {
			return getModalNode(this.element, "footer");
		}

		handleKey(e) {
			if (e.key == "Escape" && this.showing()) {
				this.hide();
			}
		}

		handleClick(e) {
			var clickTarget = e.target;
			var data = clickTarget.getAttribute("data-dismiss") === "modal";
			var parent = clickTarget.closest('[data-dismiss="modal"]');
			if (this.showing() && (parent || data || clickTarget == this.element)) {
				this.hide();
				e.preventDefault();
			}
		}
	}

	Modial.closeButton = (() => {
		let btn = document.createElement("button");
		btn.type = "button";
		btn.classList.add("btn-close", "modal-close");
		btn.dataset.dismiss = "modal";
		btn.setAttribute("aria-label", "Close");
		return btn;
	})();



	return Modial;
})();