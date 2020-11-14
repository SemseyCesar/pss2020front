let fields = {};
var table;
var careers = [];

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

function initAlumnoTable() {
	table = new TableExamAlumno('examenList',['Codigo','Materia','Fecha','Hora','Aula',''],
        ['id','identificador','materia_nombre','fecha','hora','aula'], null, true, true);
    table.setWidths(['10%','10%','20%','20%','20%','10%']);

    table.setOnRegisterEvent((id) => {
		console.log("Inscribiendose de " + id);
    });

    table.setOnUnregisterEvent((id) => {
		console.log("Desinscribiendose de " + id);
    });
}

// Busqueda de carreras para el caso de un usuario tipo alumno.
function searchCareers() {
	axios.get(
		api.alumno.carrera,
		getHeader()
    ).then(function (response) {
        if(response.status == 200){
            careers = response.data.carreras;
			loadSelect(
				document.getElementById("selectCarrera"),
				careers,
				"Seleccione una carrera"
			);
        }
    });
}

// Actualiza el drop-down de materias en base a la carrera selecionada (para usuarios tipo alumnos).
function onSelectCarreraChange() {
	validate([fields.selectCarreraValidator]);
	let selectCarrera = document.getElementById("selectCarrera");
	let selectMateria = document.getElementById("selectMateria");
	if (selectCarrera.value == "")
		loadSelect(selectMateria, [], "Seleccione una materia");
	else {
		loadSelect(
			selectMateria,
		 	careers.filter(c => c.id == selectCarrera.value)[0].materias,
			"Seleccione una materia"
		);
	}
}

// Para buscar las materias para admin y docente.
function loadSignatures() {
	axios.get(
		api.materia.materia,
		getHeader()
	).then(function (response) {
		if(response.status == 200){
			loadSelect(
				document.getElementById("selectMateria"),
				response.data.materias,
				"Seleccione una materia"
			);
		}
	});
}

// Para cargar un select con nuevos datos.
function loadSelect(select, data, defaultOptionText) {
	select.innerHTML = "";
	let op = document.createElement("option");
	op.setAttribute("value", ""),
	op.appendChild(document.createTextNode(defaultOptionText));
	select.appendChild(op);
	data.forEach((d) => {
		let option = document.createElement("option");
		option.setAttribute("id", select.getAttribute("id")+"-option-"+d['id']);
		option.setAttribute("value", d['id']);
		let text = document.createTextNode(d['nombre']);
		option.appendChild(text);
		select.appendChild(option);
	})
}




// ---------------------------------------------------------------------
// Para el momento de buscar los datos de los exámenes

function validate(validators) {
	let validValues = Object.values(validators).map(field => field.validate());
    let firstNoValid = validValues.findIndex(value => !value);
    if (firstNoValid != -1)
        Object.values(validators)[firstNoValid].getField().focus();
    return firstNoValid==-1;
}

function searchApi() {
	let urlSearch = api.examen.examen
	let first = true;
	let selectMateria = document.getElementById('selectMateria');
	let examCode = document.getElementById('examCode');
	console.log(selectMateria.value)
	if(selectMateria.value){
		urlSearch += "?materia=" + selectMateria.value;
		first = false;
	}
	if(examCode.value){
		urlSearch += first ? "?" : "&";
		urlSearch += "code=" + examCode.value;
	}
	

	axios.get(urlSearch, getHeader()
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
	}).catch(function (error) {
		if(error.response)
			console.log("Error: "+ error.response.data.message);
		else
			console.log("Error: No se pudo comunicar con el sistema");
	});
}
// ---------------------------------------------------------------------




// ---------------------------------------------------------------------
// Acomodando los elementos para los diferentes tipos de usuarios
function customize(auth) {
	switch (auth) {
		case 'alumno':
			customizeForStudent();
			document.getElementById("addExamSection").style.display = 'none';
			document.getElementById("examCodeSection").style.display = 'none';
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

function customizeForStudent() {
	fields = {
		selectCarreraValidator: new InputValidator("selectCarrera", "selectCarreraFeedback",
			{valueMissing: "Seleccione una carrera"}),
		selectMateriaValidator: new InputValidator("selectMateria", "selectMateriaFeedback",
			{valueMissing: "Seleccione una materia"})
	};
	document.getElementById("addExamSection").style.display = 'none';

	document.getElementById("selectCarreraSection").style.display = 'block';
	let selectCarrera = document.getElementById("selectCarrera");

	searchCareers();
	initAlumnoTable();

	selectCarrera.addEventListener("change", (event) =>
		onSelectCarreraChange()
	);
}

function defaultCustomize() {
	fields = {
		selectMateriaValidator: new InputValidator("selectMateria", "selectMateriaFeedback",
			{valueMissing: "Seleccione una materia"})
	}
	document.getElementById('examCodeSection').style.display = 'block';
	initTable();
	loadSignatures();
}
// ---------------------------------------------------------------------





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
