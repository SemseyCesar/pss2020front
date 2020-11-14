var carreras = [];
var selectCarrera = document.getElementById('selectCarrera');
var table;
function start(){
    selectCarreras();
    selectCarrera.addEventListener('change', (e) =>{
        onChangeCarreraSelected(selectCarrera.value);
    });

    initTable();
    table.setOnDeleteEvent((id) => {
        axios.delete(api.examen.inscripcion+"/"+id, getHeader())
        .then((response) => {if(response.status == 200){
                searchApi();
            }}
        );
    });

    table.setOnEditEvent((id) =>{
        axios.post(api.examen.inscripcion,{examen_id: id}, getHeader())
        .then((response) => {if(response.status == 200){
                searchApi();
            }}
        );
    });

    searchApi();

    let btnBuscar = document.getElementById('btnBuscar');
    btnBuscar.addEventListener('click', (e)=>searchApi());

}

function initTable() {
    table = new Table('examenList',['Codigo','Materia','Fecha','Hora','Aula','Inscripto',''],
        ['id','identificador','materia_nombre','fecha','hora','aula','inscripto'], null);
    table.setWidths(['10%','10%','20%','20%','20%','10%']);
}

function onChangeCarreraSelected(id){
    let carreraSelected = carreras.filter(c => c.id ==id)[0];
    document.getElementById('selectMateria').innerHTML = "";
    carreraSelected.materias.forEach( m => {
        let option = document.createElement("OPTION");
        option.setAttribute("id", "option-"+m["id"]);
        option.setAttribute("value", m["id"]);
        let text = document.createTextNode(m["nombre"]);
        option.appendChild(text);
        document.getElementById('selectMateria').appendChild(option);
    });
}




function selectCarreras(){
    axios.get(api.alumno.carrera, getHeader()
        ).then(function (response) {
            if(response.status == 200){
                carreras = response.data.carreras;
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
    })
    // .catch(function (error) {
    //     if(error.response)
    //         console.log("Error: "+ error.response.data.message);
    //     else
    //         console.log("Error: No se pudo comunicar con el sistema");
    // });
}

function hardCodeDelBueno(){
    $( ".btn.btn-outline-warning").addClass("btn-outline-success");
    $( ".btn.btn-outline-warning").removeClass("btn-outline-warning");
    $( ".btn.btn-outline-success").html("<i class='fa fa-check'></i>");
    $( ".btn.btn-outline-danger").html("<i class='fa fa-close'></i>");

    $( ".btn.btn-outline-danger").each( (index, element )=>{
        if(element.parentElement.parentElement.children[5].innerHTML == "No"){
            element.classList.add("d-none");
        }
    });
    $( ".btn.btn-outline-success").each( (index, element )=>{
        if(element.parentElement.parentElement.children[5].innerHTML == "Si"){
            element.classList.add("d-none");
        }
    })
}

window.onload = function(){
    checkToken(['admin','docente','alumno'], start);
}