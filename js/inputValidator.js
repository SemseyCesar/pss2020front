class InputValidator {
    /*
     * id -> id del input a validar
     * defaultClass -> estado por defecto del atributo class del input (para resetear cuando sea válido)
     * feedbackId -> id de la sección donde se muestra el mensaje de error
     * rules -> reglas a controlar en formato
            {
                ruleName1: 'Texto en caso de error',
                ruleName2: 'Texto en caso de error',
                ...
            }
            Las reglas válidas son:
            badInput -> Cuando se ingresa un string en un campo numerico por ej
            valueMissing -> Cuando el campo está vacío
            customError -> Un error personalizado (debe indicarse el mensaje si cambia a través de setCustomValidity(feedback))
            patterMismatch
            rangeOverflow ->

            -----------------TODO------------------
            COMPLETAR
    */
    constructor(id, defaultClass, feedbackId, rules) {
        this.id = id;
        this.defaultClass = defaultClass;
        this.feedbackId = feedbackId;
        this.rules = rules;

        this.field = this.searchField(id);
        this.feedback = this.searchField(feedbackId);
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
        if (!isValid)
            this.setErrorState();

        return isValid;
    }

    /*
     * Resetea el estado del input y del mensaje de error
     */
    resetState() {
        this.setValidState();
        this.feedback.innerHTML = "";
    }

    /*
     * Setea el input en estado de validez
     */
    setValidState() {
        this.field.setAttribute("class", this.defaultClass);
    }

    /*
     * Setea el input en estado de invalidez
     */
    setErrorState() {
        this.field.setAttribute("class", this.defaultClass + " is-invalid");
        this.field.focus();
    }

    /*
     * Agrega un nuevo mensaje de error
     */
    addErrorMessage(invalidFeedback) {
        if (this.feedback.innerHTML == "")
            this.feedback.innerHTML = invalidFeedback;
        else
            this.feedback.innerHTML = this.feedback.innerHTML + "<br>" + invalidFeedback;
    }

    /*
     * Setea un error customizado
     */
    setCustomValidity(customFeedback) {
        if (customFeedback) {
            this.field.setCustomValidity("Error");
            this.rules['customError'] = customFeedback;
        } else {
            this.field.setCustomValidity("");
        }
    }
}