var fields;

function apiEdit(){
    if (validate()) {
        axios.post(
            api.alumno.perfil,
            getData(),
            getHeader()
        ).then(function (response) {
            if (response.status == 200) {
                alert("Datos cargados correctamente");
                window.location.href = "../home.html";
            }
        }).catch(function (error) {
            if(error.response)
                alert("Error: "+ error.response.data.message);
            else
                alert("Error: No se pudo comunicar con el sistema")
        })
    }
}

function validate() {
    if (document.getElementById("password").value.length < 8)
        fields.password.setCustomValidity("La contraseña debe tener al menos 8 caracteres");
    else
        fields.password.setCustomValidity();

    if (document.getElementById("phonenumber").value < 0)
        fields.phonenumber.setCustomValidity("El teléfono no puede ser menor a 0");
    else
        fields.phonenumber.setCustomValidity();

    let validValues = Object.values(fields).map(field => field.validate());
    let firstNoValid = validValues.findIndex(value => !value);
    if (firstNoValid != -1)
        Object.values(fields)[firstNoValid].getField().focus();
    return firstNoValid==-1;
}

function getData() {
    return {
        "email": document.getElementById("email").value,
        "password": document.getElementById("password").value,
        "password_confirmation": document.getElementById("password").value,
        "direccion": document.getElementById("address").value,
        "telefono": document.getElementById("phonenumber").value,
    }
}

function loadInput(){
    axios.get(api.alumno.perfil, getHeader())
    .then(function (response){
        if(response.status == 200){
            let data = response.data.user;
            document.getElementById("email").value = data.email;
            document.getElementById("password").value = null;
            document.getElementById("address").value = data.direccion;
            document.getElementById("phonenumber").value = data.telefono;
        }
    })
    .catch(function (error) {
        if(error.response)
        alert("Error: "+ error.response.data.message);
        else
        alert("Error: No se pudo comunicar con el sistema")
    });
}

function start(auth){
    if (auth=='alumno') {
        new NavBar(
            'navId',
            ['Home', 'Inscripcion carrera', 'Inscripcion materia', 'Exámenes','Editar Datos','Mis Notas'],
            ['../home.html', './career.html', './signature.html', './exam.html', '', '../notas.html'],
            'Alumno',
            localStorage.getItem('user_name'),
            '../../auth/login.html'
        )
    }

    let btnGuardar = document.getElementById('btnGuardar');
    btnGuardar.addEventListener('click', (event) => {
            apiEdit();
    });

    fields = {
        email: new InputValidator('email', 'emailFeedback',
            {valueMissing: 'Ingrese un mail', typeMismatch: 'Debe respetar el formato de mail', customError: ''}),
        password: new InputValidator('password', 'passwordFeedback',
            {valueMissing: 'Ingrese una contraseña', customError: ''}),
        address: new InputValidator('address', 'addressFeedback',
            {valueMissing: 'Ingrese una dirección', customError: ''}),
        phonenumber: new InputValidator('phonenumber', 'phonenumberFeedback',
            {valueMissing: 'Ingrese un número de teléfono', badInput: 'Debe ser un número', customError: ''}),
    }

    loadInput();

}

window.onload = function(){
    checkToken(['alumno','admin'], start);
}
