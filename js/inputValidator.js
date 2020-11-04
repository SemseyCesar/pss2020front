class InputValidator {
    constructor(id, feedbackId, rules) {
        this.id = id;
        this.feedbackId = feedbackId;
        this.rules = rules;

        this.field = this.searchField(id);
        this.feedback = this.searchField(feedbackId);
        this.defaultClass = this.field.className;
    }

    searchField(id) {
        return document.getElementById(id);
    }

    /*
     * Verifica si se cumplen cada una de las reglas
     */
    validate() {
        var isValid = true;
        var newClass = this.defaultClass;
        let validityState = this.field.validity;
        this.resetState();
        Object.keys(this.rules).forEach((rule) => {
            if (validityState[rule]) {
                isValid = false;
                this.addErrorMessage(this.rules[rule]);
            }
        });
        if (!isValid) {
            this.setErrorState();
        }

        return isValid;
    }

    /*
     * Resetea el estado del input y del mensaje de error
     */
    resetState() {
        this.setValidState();
        if (this.check(this.feedback, this.feedbackId))
            this.feedback.innerHTML = "";
    }

    /*
     * Setea el input en estado de validez
     */
    setValidState() {
        if (this.check(this.field, this.id))
            this.field.setAttribute("class", this.defaultClass);
    }

    /*
     * Setea el input en estado de invalidez
     */
    setErrorState() {
        if (this.check(this.field, this.id))
            this.field.setAttribute("class", this.defaultClass + " is-invalid");
    }

    /*
     * Agrega un nuevo mensaje de error
     */
    addErrorMessage(invalidFeedback) {
        if (this.check(this.feedback, this.feedbackId)) {
            if (this.feedback.innerHTML == "")
                this.feedback.innerHTML = invalidFeedback;
            else
                this.feedback.innerHTML = this.feedback.innerHTML + "<br>" + invalidFeedback;
        }
    }

    /*
     * Setea un error customizado
     */
    setCustomValidity(customFeedback) {
        if (this.check(this.field, this.id)) {
            if (customFeedback) {
                this.field.setCustomValidity("Error");
                this.rules['customError'] = customFeedback;
            } else {
                this.field.setCustomValidity("");
            }
        }
    }

    getField() {
        return this.field;
    }

    check(toCheck, id) {
        if (toCheck != null) {
            return true;
        } else {
            console.log("No existe el campo con id <" + id + ">");
            return false;
        }
    }
}
