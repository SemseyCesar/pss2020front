let fields = {
    signatureName: new InputValidator('signatureName', document.getElementById('signatureName').className,
    'signatureNameFeedback', {valueMissing: 'Ingrese un nombre'}),
    signatureCode: new InputValidator('signatureCode', document.getElementById('signatureCode').className,
    'signatureCodeFeedback', {valueMissing: 'Ingrese un código'}),
    signatureDepartment: new InputValidator('signatureDepartment', document.getElementById('signatureDepartment').className,
    'signatureDepartmentFeedback', {valueMissing: 'Ingrese un código'})
}

let btnGuardar = document.getElementById('btnGuardar');
btnGuardar.addEventListener('click', (event) => {
    if(localValidate()) {
        axios.post(api.materia.materia,
            getData(), getHeader()
        ).then(function (response) {
            document.getElementById("signatureName").value="";
            document.getElementById("signatureCode").value="";
            document.getElementById("signatureDepartment").value="";
            alert("Datos cargados correctamente");
        }).catch(function (error) {
            if(error.response)
                alert("Error: "+ error.response.data.message);
            else
                alert("Error: No se pudo comunicar con el sistema")
        });
    } else {
        console.log("No valida");
    }
});

function localValidate() {
    let validValues = Object.values(fields).map(field => field.validate());
    let firstNoValid = validValues.findIndex(value => !value);
    if (firstNoValid != -1)
        Object.values(fields)[firstNoValid].getField().focus();
    return firstNoValid==-1;
}

function getData() {
    return {
        "nombre": document.getElementById("signatureName").value,
        "identificador": document.getElementById("signatureCode").value,
        "dpto": document.getElementById("signatureDepartment").value
    }
}
