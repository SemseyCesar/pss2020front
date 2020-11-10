let fields = {};
var table;

// Carga la tabla para admin y docente.
function initTable() {
	table = new Table('examenList',['Codigo','Materia','Fecha','Hora','Aula',''],
        ['id','identificador','materia_nombre','fecha','hora','aula'], null);
    table.setWidths(['10%','10%','20%','20%','20%','10%']);

    table.setOnDeleteEvent((id) => {
        var opcion = confirm("¿Seguro/a que quiere borrar el examen?");
        if (opcion == true) {
			axios.delete(
				api.examen.examen+"/"+id,
				getHeader()
			).then(function (response) {
				if(response.status == 200) {
					alert("Examen removido exitosamente")
					searchApi();
				}
			}).catch(function(error){
	            if(error.response)
	                alert("Error: "+ error.response.data.message);
	            else
	                alert("Error: No se pudo comunicar con el sistema");
			});
		}
    });

    table.setOnEditEvent((id) =>{
        window.location.href = './create.html?id=' + id;
    });
}

// Busqueda de carreras para el caso de un usuario tipo alumno.
function searchCareers() {
	var carreras = [];
	axios.get(
		api.alumno.carrera,
		getHeader()
    ).then(function (response) {
        if(response.status == 200){
            carreras = response.data.carreras;
        }
    });
	return carreras;
}

// Actualiza el drop-down de materias en base a la carrera selecionada (para usuarios tipo alumnos).
function onSelectCarreraChange(careers) {
	validate([fields.selectCarreraValidator]);
	let select = document.getElementById("selectCarrera");
	if (select.value == "")
		loadSelect(select, []);
	else
		loadSelect(select, careers.filter(c => c.id ==id)[0].materias);
}

// Para buscar las materias para admin y docente.
function loadSignatures() {
	axios.get(
		api.materia.materia,
		getHeader()
	).then(function (response) {
		if(response.status == 200){
			loadSelect(document.getElementById("selectMateria"), response.data.materias);
		}
	});
}

// Para cargar un select con nuevos datos.
function loadSelect(select, data) {
	var oldOption
	while (oldOption = document.getElementById(select.getAttribute("id")+"-option"))
		select.removeChild(oldOption);
	data.forEach((d) => {
		let option = document.createElement("option");
		option.setAttribute("id", select.getAttribute("id")+"-option-"+d['id']);
		option.setAttribute("value", d['id']);
		let text = document.createTextNode(d['nombre']);
		option.appendChild(text);
		select.appendChild(option);
	})
}

// Para validar inputs.
function validate(validators) {
	let validValues = Object.values(validators).map(field => field.validate());
    let firstNoValid = validValues.findIndex(value => !value);
    if (firstNoValid != -1)
        Object.values(validators)[firstNoValid].getField().focus();
    return firstNoValid==-1;
}

function searchApi() {
	axios.get(api.examen.examen, getHeader()
	).then(function (response) {
		if(response.status == 200){
			let selectMateria = document.getElementById("selectMateria");
			let search = document.getElementById("examCode");
			var examRows = response.data.examenes.map(function(exam) {
				return {
					'id': exam.id,
					'identificador': exam.identificador,
					'materia_id': exam.materia_id,
					'materia_nombre': document.getElementById(selectMateria.getAttribute("id")+"-option-"+exam.materia_id).innerHTML,
					'fecha': exam.fecha,
					'hora': exam.hora,
					'aula': exam.aula
				};
			})
			examRows = examRows.filter((exam) => (exam.materia_id == selectMateria.value) && (exam['identificador'].includes(search.value)));
			table.refreshSelected(examRows);
			document.getElementById("footer").innerHTML = cardFooter(examRows.length);
		}
	});
}

// Elegir que cargar en base al usuario.
function customize(auth) {
	switch (auth) {
		case 'alumno':
			customizeForStudent();
			break;
		case 'admin':
			defaultCustomize();
			document.getElementById("addExamSection").style.display = 'none';
			break;
		case 'docente':
			defaultCustomize();
			break;
	}
}

// Para alumnos, se agregar el drop-down de carreras.
function customizeForStudent() {
	fields = {
		selectCarreraValidator: new InputValidator("selectCarrera", "selectCarreraFeedback",
			{valueMissing: "Seleccione una carrera"}),
		selectMateriaValidator: new InputValidator("selectMateria", "selectMateriaFeedback",
			{valueMissing: "Seleccione una materia"})
	};
	let selectCarrera = document.getElementById("selectCarreraSection");
	selectCarrera.style.dislay = 'block';

	let careers = searchCareers();
	loadSelect(selectCarrera, careers)

	selectCarrera.addEventListener("change", (event) =>
		onSelectCarreraChange(careers)
	);
}

// Para admin y docentes se agrega el input de búsqueda.+
function defaultCustomize() {
	fields = {
		selectMateriaValidator: new InputValidator("selectMateria", "selectMateriaFeedback",
			{valueMissing: "Seleccione una materia"})
	}
	document.getElementById('examCodeSection').style.display = 'block';
	initTable();
	loadSignatures();
}

function start(auth){
    document.getElementById("selectMateria").addEventListener("change", (event) => {
        validate([fields.selectMateriaValidator]);
    });

	document.getElementById('btnBuscar').addEventListener('click', (event) => {
		if (validate(fields)){
			searchApi();
		}
	});

	customize(auth);
}


window.onload = function(){
    checkToken(['admin','docente','alumno'], start);
}
