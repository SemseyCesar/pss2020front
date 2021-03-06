let fields = {
    careerName: new InputValidator('careerName', 'careerNameFeedback',
        {valueMissing: 'Ingrese un nombre'}),
    careerCode: new InputValidator('careerCode',
              'careerCodeFeedback', {valueMissing: 'Ingrese un código'}),
    careerDepartment: new InputValidator('selectDepartamento', 'selectDepartamentoFeedback',
         {valueMissing: 'Seleccione un departamento'}),
    //careerProfessor: new InputValidator('selectProfessor',
    //          'selectProfessorFeedback', {valueMissing: 'Ingrese un docente'}),
    careerRuntime: new InputValidator('careerRuntime', 'careerRuntimeFeedback',
        {valueMissing: 'Ingrese la duración', badInput: 'Debe ser un número'})
};

let signatureFields = {
    selectMateriaValidator: new InputValidator('selectMateria', 'selectMateriaFeedback',
        {customError: 'La materia ya ha sido cargada'}),
    anioValidator: new InputValidator('anio', 'courseYearFeedback',
        {valueMissing: 'Ingrese un año', badInput: 'Debe ser un número', customError: 'Incorrecto'})
}

function localValidate() {
    let validValues = Object.values(fields).map(field => field.validate());
    let firstNoValid = validValues.findIndex(value => !value);
    if (firstNoValid != -1)
        Object.values(fields)[firstNoValid].getField().focus();
    return firstNoValid==-1;
}

function localValidateSignature(materiasSelected) {
    checkExistingSignature(materiasSelected);
    checkRuntimeWithSignatureYear();

    let validValues = Object.values(signatureFields).map(field => field.validate());
    let firstNoValid = validValues.findIndex(value => !value);
    if (firstNoValid != -1)
        Object.values(signatureFields)[firstNoValid].getField().focus();
    return firstNoValid==-1;
}

function checkExistingSignature(materiasSelected) {
    let id = signatureFields.selectMateriaValidator.getField().value;
    if(materiasSelected.filter(e => e.id == id).length > 0)
        signatureFields.selectMateriaValidator.setCustomValidity('La materia ya ha sido cargada');
    else
        signatureFields.selectMateriaValidator.setCustomValidity("");
}

function checkRuntimeWithSignatureYear() {
    let courseYear = document.getElementById("anio");
    if (!fields.careerRuntime.validate())
        signatureFields.anioValidator.setCustomValidity("Duración faltante o incorrecta");
    else {
        if (courseYear.value > document.getElementById("careerRuntime").value)
            signatureFields.anioValidator.setCustomValidity("No puede ser mayor a la duración");
        else
            signatureFields.anioValidator.setCustomValidity();
    }
}

document.getElementById('selectDepartamento').addEventListener('change', (event) => selectChange(fields.careerDepartment));
//document.getElementById('selectProfessor').addEventListener('change', (event) => selectChange(fields.careerProfessor));
document.getElementById('selectMateria').addEventListener('change', (event) => selectChange(signatureFields.selectMateriaValidator));

function selectChange(validator) {
    validator.setCustomValidity();
    validator.validate();
}
