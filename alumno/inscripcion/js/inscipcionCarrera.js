function start(auth) {
    if (auth=='alumno') {
        new NavBar(
            'navId',
            ['Home', 'Inscripcion carrera', 'Inscripcion materia', 'Exámenes','Editar Datos','Mis Notas'],
            ['../home.html', '', './signature.html', './exam.html', './perfil.html', '../notas.html'],
            'Alumno',
            localStorage.getItem('user_name'),
            '../../auth/login.html'
        )
    }

    selectCarrera = new InputValidator('selectCarrera', 'selectCarreraFeedback',
            {valueMissing: 'Elija una carrera'});

    axios.get(api.carrera.carrera, getHeader()
        ).then(function (response) {
            if(response.status == 200){
                let op = document.createElement('option');
                op.setAttribute("value", "");
                let t = document.createTextNode("Seleccione una carrera");
                op.appendChild(t);
                document.getElementById('selectCarrera').appendChild(op);

                response.data.carreras.forEach( u => {
                    let option = document.createElement("OPTION");
                    option.setAttribute("id", "option-"+u["id"]);
                    option.setAttribute("value", u["id"]);
                    let text = document.createTextNode(u["nombre"]);
                    option.appendChild(text);
                    document.getElementById('selectCarrera').appendChild(option);
                });

            }
    });

    let btnSuccess = document.getElementById('btn-inscribir');
    btnSuccess.addEventListener('click', (e) => {
        if (selectValidate()) {
            axios.post(
                api.carrera.inscripcion,
                {
                "carrera_id": document.getElementById('selectCarrera').value
                },
                getHeader()
            ).then(function(response) {
                if(response.status == 200){
                    alert("Inscripcion Exitosa");
                }
            }).catch(function (error) {
                if(error.response)
                    alert("Error: "+ error.response.data.message);
                else
                    alert("Error: No se pudo comunicar con el sistema")
            });
        }
    });

    document.getElementById('selectCarrera').addEventListener('change', (event) => selectValidate())

    function selectValidate() {
        return selectCarrera.validate();
    }
}

window.onload = function(){
    checkToken(['alumno'], start);
}
