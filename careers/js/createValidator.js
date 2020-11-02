let fields = {
    careerName: new InputValidator('careerName', document.getElementById('careerName').className,
              'careerNameFeedback', {valueMissing: 'Ingrese un nombre'}),
    careerCode: new InputValidator('careerCode', document.getElementById('careerCode').className,
              'careerCodeFeedback', {valueMissing: 'Ingrese un código'}),
    careerDepartment: new InputValidator('careerDepartment', document.getElementById('careerDepartment').className,
              'careerDepartmentFeedback', {valueMissing: 'Ingrese un departamento'}),
    careerProfessor: new InputValidator('careerProfessor', document.getElementById('careerProfessor').className,
              'careerProfessorFeedback', {valueMissing: 'Ingrese un docente'}),
    careerRuntime: new InputValidator('careerRuntime', document.getElementById('careerRuntime').className,
              'careerRuntimeFeedback', {valueMissing: 'Ingrese la duración', badInput: 'Debe ser un número'})
};

let signatureFields = {
    selectMateriaValidator: new InputValidator('selectMateria', document.getElementById('selectMateria').className,
    'selectMateriaFeedback', {customError: 'La materia ya ha sido cargada'}),
    anioValidator: new InputValidator('anio', document.getElementById('anio').className,
    'courseYearFeedback', {valueMissing: 'Ingrese un año', badInput: 'Debe ser un número', customError: 'Incorrecto'})
}

function localValidate() {
    return Object.values(fields).every(field => field.validate());
}

function localValidateSignature(materiasSelected) {
    checkExistingSignature(materiasSelected);
    checkRuntimeWithSignatureYear();

    return Object.values(signatureFields).every(field => field.validate())
}

function checkExistingSignature(materiasSelected) {
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