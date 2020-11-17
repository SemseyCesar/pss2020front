function start(auth) {
    if (auth=='admin')
        new NavBar(
            'navId',
            ['Home', 'Usuarios', 'Carreras', 'Materias', 'Exámenes', 'Notas', 'Asociar Doc-Mat'],
            ['../admin/home.html', '../users/index.html', '../careers/index.html', '../signatures/index.html', '../exams/index.html', '../docente/notas/notas.html', '../signatures/asociar.html'],
            "Admin",
            localStorage.getItem('user_name'),
            '../auth/login.html'
        )

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


    let btnGuardar = document.getElementById('btnGuardar');
    btnGuardar.addEventListener('click', (event) => {
        if(!edit)
            apiCreate();
        else
            apiEdit();
    });

    const searchParams = new URLSearchParams(window.location.search);
    var edit = (searchParams.has('id') && searchParams.get('id')) ? true : false;
    var _id = edit ? searchParams.get('id') : null;
    if(edit){loadInput(_id)}
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


    function apiEdit(){
        if(localValidate()) {
            axios.put(
                api.user.user+"/"+_id,
                getData(),
                getHeader()
            ).then(function (response) {
                if (response.status == 200) {
                    alert("Datos cargados correctamente");
					window.history.back();
                }
            }).catch(function (error) {
                if(error.response)
                    alert("Error: "+ error.response.data.message);
                else
                    alert("Error: No se pudo comunicar con el sistema")
            })
        }
    }

    function apiCreate(){
        if(localValidate()) {
            axios.post(
                api.user.user,
                getData(),
                getHeader()
            ).then(function (response) {
                if (response.status == 200) {
                    alert("Datos cargados correctamente");
					window.history.back();
                }
            }).catch(function (error) {
                if(error.response)
                    alert("Error: "+ error.response.data.message);
                else
                    alert("Error: No se pudo comunicar con el sistema")
            })
        }
    }

    function getData() {
        return {
            "email": document.getElementById("email").value,
            "password": document.getElementById("password").value,
            "password_confirmation": document.getElementById("password").value,
            "type": document.getElementById("userType").value,
            "nombre_apellido": document.getElementById("name").value,
            "fecha_nacimiento": document.getElementById("birthdate").value,
            "lugar_nacimiento": document.getElementById("birthplace").value,
            "tipo_documento": document.getElementById("documentType").value,
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

    function loadInput(id){
        axios.get(api.user.user+"/"+id, getHeader())
        .then(function (response){
            if(response.status == 200){
                let data = response.data.user;
                document.getElementById("email").value = data.email;
                document.getElementById("email").disable = true;
                document.getElementById("password").disable = true;
                document.getElementById("password").value = "HACKMASTER";
                document.getElementById("userType").value = data.type;
                document.getElementById("name").value = data.nombre_apellido;
                document.getElementById("birthdate").value = data.fecha_nacimiento;
                document.getElementById("birthplace").value = data.lugar_nacimiento;
                document.getElementById("documentType").value = data.tipo_documento;
                document.getElementById("dni").value = data.DNI;
                document.getElementById("address").value = data.direccion;
                document.getElementById("phonenumber").value = data.telefono;
                document.getElementById("lu").value = data.legajo;
                if(data.type=="alumno")
                    document.getElementById("school").value = data.escuela;
                else
                    document.getElementById("school").disabled = true;
            }
        })
        .catch(function (error) {
            if(error.response)
            alert("Error: "+ error.response.data.message);
            else
            alert("Error: No se pudo comunicar con el sistema")
        });
    }
}

window.onload = function(){
    checkToken(['admin'], start);
}
