class SearchBar {
	constructor(id, inputTypes, placeholders, invalidFeedbackTexts, onAdd) {

		this.id = id;
		this.onAdd = onAdd;
		this.inputTypes = inputTypes;
		this.placeholders = placeholders;
		this.invalidFeedbackTexts = invalidFeedbackTexts;

		this.searchBar = this.initSearchBar();
		this.invalidFeedback = this.initInvalidFeedback();
		let parent = document.getElementById(id);
		parent.appendChild(this.searchBar);
		parent.appendChild(this.invalidFeedback);
	}

	initSearchBar() {
		let searchBar = document.createElement("input");
		searchBar.setAttribute("class", "form-control");
		searchBar.setAttribute("type", this.inputTypes[0]);
		searchBar.setAttribute("placeholder", this.placeholders[0]);
		return searchBar;
	}

	initInvalidFeedback() {
		let invalidFeedback = document.createElement("div");
		invalidFeedback.setAttribute("class", "invalid-feedback");
		return invalidFeedback		
	}

	setAttributes(i) {
		if (i>=0 && i<this.inputTypes.length && i<this.placeholders.length) {
			this.searchBar.setAttribute("type", this.inputTypes[i]);
			this.searchBar.setAttribute("placeholder", this.placeholders[i]);
			this.invalidFeedback.textContent = this.invalidFeedbackTexts[i];
		}
	}

	validity() {
		var valid;
		if (this.searchBar.checkValidity()) {
            this.searchBar.setAttribute("class", "form-control");
            valid = true;
		} else {
            this.searchBar.setAttribute("class", "form-control is-invalid");
            valid = false;
		}
		return valid
	}

	getInput() {
		return this.searchBar.value;
	}
}