class Select {
	constructor(id, optionValues, optionTexts, invalidFeedbackText, searchBar, onAdd) {

		this.id = id;
		this.onAdd = onAdd;
		this.optionValues = optionValues;
		this.optionTexts = optionTexts;
		this.invalidFeedbackText = invalidFeedbackText;
		this.searchBar = searchBar;

		this.select = this.initSelect();
		this.initOptions(optionValues, this.select);
		this.invalidFeedback = this.initInvalidFeedback();

		document.getElementById(id).appendChild(this.select);
		document.getElementById(id).appendChild(this.invalidFeedback);
	}

	initSelect() {
		let select = document.createElement("select");
		select.setAttribute("class", "custom-select");
		select.setAttribute("required", "");
		select.addEventListener("change", (event) => {
			if (this.onchange) this.onchange()
		});
		return select;
	}

	initOptions(optionValues, select) {
		this.optionTexts.forEach( function(item, index, arr) {
			let option = document.createElement("option");
			option.setAttribute("value", optionValues[index]);
			option.textContent = item;
			select.appendChild(option);
		})
	}

	initInvalidFeedback() {
		let invalidFeedback = document.createElement("div");
		invalidFeedback.setAttribute("class", "invalid-feedback");
		invalidFeedback.textContent = this.invalidFeedbackText;
		return invalidFeedback
	}

	setOnChange(onchange) {
		this.onchange = onchange;
	}

	validity() {
		var valid;
		if (this.select.checkValidity()) {
			this.select.setAttribute("class", "custom-select");
			valid = true;
		} else {
			this.select.setAttribute("class", "custom-select is-invalid");
			valid = false;
		}
		return valid;
	}

	getValue() {
		return this.select.value;
	}

	getSelectedIndex() {
		return this.select.selectedIndex;
	}
}