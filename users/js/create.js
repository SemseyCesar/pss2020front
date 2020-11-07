function start(){
    let fields = {
        name: new InputValidator('name', 'nameFeedback',
                {valueMissing: 'Ingrese un nombre y apellido', customError: ''}),
        email: new InputValidator('email', 'emailFeedback',
                {valueMissing: 'Ingrese un mail', typeMismatch: 'Debe respetar el formato de mail', customError: ''}),
        password: new InputValidator('password', 'passwordFeedback',
                {valueMissing: 'Ingrese una contraseña', customError: ''}),
        birthdate: new InputValidator('birthdate', 'birthdateFeedback',
                {valueMissing: 'Ingrese la fecha de nacimiento', customError: ''}),
        birthplace: new InputValidator('birthplace', 'birthplaceFeedback',
                {valueMissing: 'Ingrese el lugar de nacimiento', customError: ''}),
        documentType: new InputValidator('documentType', 'documentTypeFeedback',
                {valueMissing: 'Seleccione un tipo de documento', customError: ''}),
        dni: new InputValidator('dni', 'dniFeedback',
                {valueMissing: 'Ingrese un dni', badInput: 'Debe ser un número', customError: ''}),
        address: new InputValidator('address', 'addressFeedback',
                {valueMissing: 'Ingrese una dirección', customError: ''}),
        phonenumber: new InputValidator('phonenumber', 'phonenumberFeedback',
                {valueMissing: 'Ingrese un número de teléfono', badInput: 'Debe ser un número', customError: ''}),
        userType: new InputValidator('userType', 'userTypeFeedback',
                {valueMissing: 'Seleccione un tipo de usuario', customError: ''}),
        lu: new InputValidator('lu', 'luFeedback',
                {valueMissing: 'Ingrese un lu', badInput: 'Debe ser un número', customError: ''}),
        school: new InputValidator('school', 'schoolFeedback',
                {valueMissing: 'Ingrese una escuela', customError: ''})
    }

    const selectElement = document.getElementById('userType');
    selectElement.addEventListener('change', (event) => {
        const school = document.getElementById('school');
        if (event.target.value == "alumno")
            school.disabled = false;
        else {
            school.disabled = true;
            school.content = "";
        }
        customStudentSchoolValidate();
        fields.school.validate();
    });

    // const axios = require('axios');
    let btnGuardar = document.getElementById('btnGuardar');
    btnGuardar.addEventListener('click', (event) => {
        if(localValidate()) {
            axios.post(
                api.user.user,
                getData(),
                getHeader()
            ).then(function (response) {
                if (response.status == 200) {
                    Object.values(fields).forEach(fieldValidator => {
                        fieldValidator.getField().value = "";
                    })
                    alert("Datos cargados correctamente");
                }
            }).catch(function (error) {
                if(error.response)
                    alert("Error: "+ error.response.data.message);
                else
                    alert("Error: No se pudo comunicar con el sistema")
            })
        }
    })

    function getData() {
        return {
            "email": document.getElementById("email").value,
            "password": document.getElementById("password").value,
            "password_confirmation": document.getElementById("password").value,
            "type": document.getElementById("userType").value,
            "nombre_apellido": document.getElementById("name").value,
            "fecha_nacimiento": document.getElementById("birthdate").value,
            "lugar_nacimiento": document.getElementById("birthplace").value,
            "DNI": document.getElementById("dni").value,
            "direccion": document.getElementById("address").value,
            "telefono": document.getElementById("phonenumber").value,
            "legajo": document.getElementById("lu").value,
            "escuela": document.getElementById("school").value
        }
    }

    function localValidate() {
        setCustomValidities();
        let validValues = Object.values(fields).map(field => field.validate());
        let firstNoValid = validValues.findIndex(value => !value);
        if (firstNoValid != -1)
            Object.values(fields)[firstNoValid].getField().focus();
        return firstNoValid==-1;
    }

    function setCustomValidities() {
        customStudentSchoolValidate();
        customBirthdateValidate();
        customGreaterThanZeroValidate(fields.dni, "documento");
        customGreaterThanZeroValidate(fields.lu, "lu");
        customGreaterThanZeroValidate(fields.phonenumber, "número de teléfono");
    }

    function customStudentSchoolValidate() {
        let userType = document.getElementById('userType');
        if (userType.value == "alumno") {
            fields.school.getField().setAttribute("required", "");
        } else {
            fields.school.getField().removeAttribute("required");
        }
    }

    function customBirthdateValidate() {
        let today = new Date();
        let birthdate = new Date(fields.birthdate.getField().value);
        if (birthdate >= today)
            fields.birthdate.setCustomValidity("La fecha de nacimiento debe ser menor a la fecha actual");
        else
            fields.birthdate.setCustomValidity();
    }

    function customGreaterThanZeroValidate(inputValidator, extraText) {
        if (inputValidator.getField().value < 0)
            inputValidator.setCustomValidity("El " + extraText + " no puede ser menor a 0");
        else
            inputValidator.setCustomValidity();
    }
}

window.onload = function(){
    checkToken(['admin'], start);
}
