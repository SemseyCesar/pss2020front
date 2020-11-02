class InputValidator {
    constructor(id, defaultClass, feedbackId, rules, rulesFeedbacks) {
        this.id = id;
        this.defaultClass = defaultClass;
        this.feedbackId = feedbackId;
        this.rules = rules;
        this.rulesFeedbacks = rulesFeedbacks;

        this.field = this.searchField(id);
    }

    searchField(id) {
        return document.getElementById(id);
    }

    validate() {
        var isValid = true;
        var newClass = this.defaultClass;
        var i = 0;
        let validityState = this.field.validity;
        console.log(validityState);
        while (isValid && i<this.rules.length) {
            let rule = this.rules[i];
            if (validityState[rule]) {
                isValid = false;
                this.setErrorState();
                this.setErrorMessage(this.rulesFeedbacks[i]);
            }
            i++;
        }
        if (isValid)
            this.setValidState();

        return isValid;
    }

    setValidState() {
        this.field.setAttribute("class", this.defaultClass);
    }

    setErrorState() {
        this.field.setAttribute("class", this.defaultClass + " is-invalid");
    }

    setErrorMessage(invalidFeedback) {
        let feedback = document.getElementById(this.feedbackId);
        feedback.textContent = invalidFeedback;
    }
}
