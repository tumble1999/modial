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
	var showingModel;
	const backdrop = document.createElement("div");
	backdrop.classList.add("modal-backdrop fade show");
	backdrop.addEventListener("click",()=>{

	})

	let modalTemplate = document.createElement("div");
	modalTemplate.classList.add("modal fade");
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

	function isModelShowing() {
		document.body.classList.contains("model-open")&&isModelShowing
	}
	function getModalContentContainer(modal, part) {
		return modal.querySelector(".modal-" + part)
	}

	function prepareForModel() {
		document.body.classList.add("model-open");
		document.body.appendChild(backdrop);
	}

	function cleanModelPreperarions() {
		document.body.classList.remove("model-open");
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
		}

		setContent(options = { header, body, footer }) {
			if (typeof (options) === "string") options = { header: "", body: options, footer: "" };
			let { header, body, footer } = options;
			getModalContentContainer(this.modal, "header").innerHTML = header;
			getModalContentContainer(this.modal, "body").innerHTML = body;
			getModalContentContainer(this.modal, "footer").innerHTML = footer;
		}

		show() {
			if(isModelShowing()) return;
			prepareForModel();
			this.model.classList.add("show")
			this.modal.setAttribute("aria-hidden","false");
			this.modal.style.display = "block";
			showingModel = this;
		}

		hide() {
			if(!isModelShowing()) return;
			cleanModelPreperarions();
			this.model.classList.remove("show")
			this.modal.setAttribute("aria-hidden","true");
			delete this.modal.style.display;
			showingModel = undefined;
		}
	}

	return BSModal;	
})();