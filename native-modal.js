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
	const backdrop = document.createElement("div");
	backdrop.classList.add("modal-backdrop", "fade");

	let modalTemplate = document.createElement("div");
	modalTemplate.classList.add("modal", "fade");
	modalTemplate.setAttribute("tabindex", "-1");
	modalTemplate.setAttribute("role", "dialogue");
	modalTemplate.setAttribute("aria-hidden", "true");
	modalTemplate.innerHTML = `<div class="modal-dialog" role="document">
			<div class="modal-content">
				<div class="modal-header"></div>
				<div class="modal-body"></div>
				<div class="modal-footer"></div>
			</div>
		</div>`;

	function isModalShowing() {
		return document.body.classList.contains("modal-open");
	}
	function getModalNode(modal, part) {
		return modal.querySelector(".modal-" + part);
	}

	function onTransition(element) {
		return new Promise((res, rej) => {
			if (element.classList.contains("fade")) {
				element.addEventListener("transitionend", _ => {
					res()
				})
			} else {
				res();
			}
		});
	}

	function prepareForModal() {
		document.body.classList.add("modal-open");
		document.body.appendChild(backdrop);
		backdrop.classList.add("show")
	}

	function cleanModalPreperarions() {
		document.body.classList.remove("modal-open");
		onTransition(backdrop).then(_ => {
			document.body.removeChild(backdrop);
		})
		backdrop.classList.remove("show")
	}

	function setupEvents(modal, action) {
		var action = action ? "addEventListener" : "removeEventListener";
		modal.modal[action]("click", modal.handleClick.bind(modal));
	}

	function onDocumentLoaded() {
		return new Promise((res,rej)=>{
			if(document.readyState=="complete") {
				res();
			} else {
				document.addEventListener("load",res)
			}
		})
	}

	/*
body.modal-open
class="show" 
aria-hidden="false" style="display: block;">
*/
	class BSModal extends EventTarget {
		constructor(options = { backdrop: false, fade: true }) {
			super();
			this.options = options;
			this.modal = modalTemplate.cloneNode(true);
			if (options.fade) this.modal.classList.add("fade");
			this.modal.modal = this;
			this.created = false;
			onDocumentLoaded().then(_=>{
				document.body.insertAdjacentElement("afterbegin", this.modal);
				this.created = true;
				var createdEvent = new CustomEvent("created");
				this.dispatchEvent(createdEvent);
			})
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
			getModalNode(this.modal, "header").innerHTML = header;
			getModalNode(this.modal, "body").innerHTML = body;
			getModalNode(this.modal, "footer").innerHTML = footer;
		}

		show() {
			if(!this.created) {
				this.addEventListener("created",this.show);
			}
			if (isModalShowing() && this.modal.classList.contains("show")) return;
			var modal = this.modal
			prepareForModal()
			modal.style.display = "block";
			//onTransition(backdrop).then(_ => {
				modal.classList.add("show");
				modal.setAttribute("aria-hidden", "false");
				setupEvents(this, 1);
			//});
		}

		hide() {
			if (!isModalShowing()) return;
			cleanModalPreperarions();
			var modal = this.modal
			modal.classList.remove("show");
			modal.setAttribute("aria-hidden", "true");
			setupEvents(this);
			onTransition(this.modal).then(_ => {
				modal.style.display = "";
			})
		}

		showing() {
			return this.modal.classList.contains("show");
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
			if (e.key == "Escape" && this.showing()) {
				this.hide();
			}
		}

		handleClick(e) {
			var clickTarget = e.target;
			var data = clickTarget.getAttribute("data-dismiss") === "modal";
			var parent = clickTarget.closest('[data-dismiss="modal"]');
			if (this.showing() && (parent || data || clickTarget == this.modal)) {
				this.hide();
				e.preventDefault();
			}
		}
	}

	BSModal.closeButton = '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';

	return BSModal;
})();