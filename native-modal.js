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
	backdrop.classList.add("modal-backdrop", "fade", "show");

	let modalTemplate = document.createElement("div");
	modalTemplate.classList.add("modal", "fade");
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

	function isModalShowing() {
		return document.body.classList.contains("modal-open")
	}
	function getModalNode(modal, part) {
		return modal.querySelector(".modal-" + part)
	}

	function prepareForModal() {
		document.body.classList.add("modal-open");
		document.body.appendChild(backdrop);
	}

	function cleanModalPreperarions() {
		document.body.classList.remove("modal-open");
		document.body.removeChild(backdrop);
	}


/*
body.modal-open
class="show" 
aria-hidden="false" style="display: block;">
*/
	class BSModal {
		constructor() {
			this.modal = modalTemplate.cloneNode(true);
			document.body.insertAdjacentElement("afterbegin",this.modal)
		}

		setContent(options = { header, body, footer }) {
			if (typeof (options) === "string") options = { header: "", body: options, footer: "" };
			let { header, body, footer } = options;
			getModalNode(this.modal, "header").innerHTML = header;
			getModalNode(this.modal, "body").innerHTML = body;
			getModalNode(this.modal, "footer").innerHTML = footer;
		}

		show() {
			if(isModalShowing()&&this.modal.classList.contains("show")&&this.isAnimating) return;
			prepareForModal();
			this.modal.classList.add("show")
			this.modal.setAttribute("aria-hidden","false");
			this.modal.style.display = "block";
			showingModal = this;
		}

		hide() {
			if(!isModalShowing()) return;
			cleanModalPreperarions();
			this.modal.classList.remove("show")
			this.modal.setAttribute("aria-hidden","true");
			delete this.modal.style.display;
			showingModal = undefined;
		}
		
	}

	return BSModal;	
})();