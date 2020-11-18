var carreras = [];
var selectCarrera = document.getElementById('selectCarrera');
var table;
var fields;

function start(auth){
    if (auth=='alumno') {
        new NavBar(
            'navId',
            ['Home', 'Inscripcion carrera', 'Inscripcion materia', 'Exámenes','Editar Datos','Mis Notas'],
            ['../home.html', './career.html', './signature.html', '', './perfil.html', '../notas.html'],
            'Alumno',
            localStorage.getItem('user_name'),
            '../../auth/login.html'
        )
    }

    fields = {
        selCarrera: new InputValidator("selectCarrera", "selectCarreraFeedback",
            {valueMissing: "Seleccione una carrera"}),
        selMateria: new InputValidator("selectMateria", "selectMateriaFeedback",
            {valueMissing: "Seleccione una materia"})
    }

    selectCarreras();
    selectCarrera.addEventListener('change', (e) =>{
        onChangeCarreraSelected(selectCarrera.value);
        fields.selCarrera.validate();
        fields.selMateria.validate();
    });
    document.getElementById("selectMateria").addEventListener('change', (e) =>{
        fields.selMateria.validate();
    });

    initTable();
    table.setOnDeleteEvent((id) => {
        axios.get(api.examen.examen, getHeader())
        .then((response) => {if(response.status == 200){
                if(((response.data.examenes.filter(d => d.id == id)[0]).inscripto)=="No"){
                    alert("Error: No se puede desinscribir de un examen al cual no esta inscripto");
                } else {
                    axios.delete(api.examen.inscripcion+"/"+id, getHeader())
                    .then((response) => {if(response.status == 200){
                            searchApi();
                        }}
                    );
                }
            }
        }
    )});


       


    table.setOnEditEvent((id) =>{
        axios.post(api.examen.inscripcion,{examen_id: id}, getHeader())
        .then((response) => {if(response.status == 200){
                searchApi();
            }}
        );
    });

    let btnBuscar = document.getElementById('btnBuscar');
    btnBuscar.addEventListener('click', (e)=>searchApi());
}

function initTable() {
    table = new Table('examenList',['Codigo','Materia','Fecha','Hora','Aula','Inscripto',''],
        ['id','identificador','materia_nombre','fecha','hora','aula','inscripto'], null);
    table.setWidths(['10%','10%','20%','20%','20%','10%']);
}

function onChangeCarreraSelected(id){
    let selectMateria = document.getElementById('selectMateria');
    selectMateria.innerHTML = "";
    let op = document.createElement("option");
    selectMateria.appendChild(op);
    if (id != "") {
        op.setAttribute("value", "");
        selectMateria.removeAttribute("disabled");
        op.appendChild(document.createTextNode("Seleccione una materia"));
        let carreraSelected = carreras.filter(c => c.id ==id)[0];
        carreraSelected.materias.forEach( m => {
            let option = document.createElement("OPTION");
            option.setAttribute("id", "option-"+m["id"]);
            option.setAttribute("value", m["id"]);
            let text = document.createTextNode(m["nombre"]);
            option.appendChild(text);
            selectMateria.appendChild(option);
        });
    }
    else {
        selectMateria.setAttribute("disabled", "");
        op.setAttribute("value", "sin carrera");
        op.appendChild(document.createTextNode("No hay carrera seleccionada"));
    }
}




function selectCarreras(){
    axios.get(api.alumno.carrera, getHeader()
        ).then(function (response) {
            if(response.status == 200){
                carreras = response.data.carreras;
                let op = document.createElement("option");
                op.setAttribute("value", "");
                op.appendChild(document.createTextNode("Seleccione una carrera"));
                selectCarrera.appendChild(op);
                response.data.carreras.forEach( u => {
                    let option = document.createElement("OPTION");
                    option.setAttribute("id", "option-"+u["id"]);
                    option.setAttribute("value", u["id"]);
                    let text = document.createTextNode(u["nombre"]);
                    option.appendChild(text);
                    selectCarrera.appendChild(option);
                    onChangeCarreraSelected(selectCarrera.value)
                });
            }
    });
}

function searchApi() {
    if (localValidate()) {
        let urlSearch = api.examen.examen
        let selectMateria = document.getElementById('selectMateria');
        if(selectMateria.value){
            urlSearch += "?materia=" + selectMateria.value;
        }
        axios.get(urlSearch, getHeader()
        ).then(function (response) {
            if(response.status == 200){
                let examRows = response.data.examenes.map(function(exam) {
                    return {
                        'id': exam.id,
                        'identificador': exam.identificador,
                        'materia_id': exam.materia_id,
                        'materia_nombre': exam.materia.nombre,
                        'fecha': exam.fecha,
                        'hora': exam.hora,
                        'aula': exam.aula,
                        'inscripto' : exam.inscripto
                    };
                })
                table.refreshSelected(examRows);
                hardCodeDelBueno();
            }
        }).catch(function (error) {
            if(error.response)
                console.log("Error: "+ error.response.data.message);
            else
                console.log("Error: No se pudo comunicar con el sistema");
        });
    }
}

function localValidate() {
	let validValues = Object.values(fields).map(field => field.validate());
    let firstNoValid = validValues.findIndex(value => !value);
    if (firstNoValid != -1)
        Object.values(fields)[firstNoValid].getField().focus();
    return firstNoValid==-1;
}

function hardCodeDelBueno(){
    $( ".btn.btn-warning").addClass("btn-success");
    $( ".btn.btn-warning").removeClass("btn-warning");
    $( ".btn.btn-success").html("<i class='fa fa-check'></i>");
    $( ".btn.btn-danger").html("<i class='fa fa-close'></i>");

    $( ".btn.btn-danger").each( (index, element )=>{
        if(element.parentElement.parentElement.children[5].innerHTML == "No"){
            element.classList.add("d-none");
        }
    });
    $( ".btn.btn-success").each( (index, element )=>{
        if(element.parentElement.parentElement.children[5].innerHTML == "Si"){
            element.classList.add("d-none");
        }
    })
}

window.onload = function(){
    checkToken(['admin','alumno'], start);
}
