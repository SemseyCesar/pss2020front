var table;
let fields = {
	selectSignature: new InputValidator('selectSignature', 'selectSignatureFeedback',
		{valueMissing: 'Seleccione una materia'}),
	searchLu: new InputValidator('searchLu', 'searchLuFeedback',
		{customError: ''})
}

function tableAdmin() {
	table = new Table('notasInfo',['Lu','Nombre','Cursado','Final',''],
        ['lu','nombre_apellido','nota_cursado','nota_final'], null, true, true);
    table.setWidths(['20%','20%','20%','20%']);
}

function tableDocente() {
	table = new Table('notasInfo',['Lu','Nombre','Cursado','Final',''],
        ['lu','nombre_apellido','nota_cursado','nota_final'], null);
    table.setWidths(['20%','20%','20%','20%']);

	table.setOnDeleteEvent((id) => {
		console.log("Docente borrando nota " + id);
/*		axios.delete(
			// INSERTE RUTA DE API
			,
			getHeader()
		).then(function (response) {
				console.log(response)
				if(response.status == 200){
				}
			});*/
    })

    table.setOnEditEvent((id) => {
		console.log("Docente editando nota " + id);
    });
}

function tableAlumno() {
	table = new Table('notasInfo',['Nota de cursado','Nota de final',''],
		['nota_cursado','nota_final'], null, true, true);
	table.setWidths(['25%','25%']);
}

function loadSignatures() {
	axios.get(
		api.materia.materia,
		getHeader()
	).then(function (response) {
		if (response.status == 200 || response.status == 204) {
			loadSelect(
				document.getElementById("selectSignature"),
				response.data.materias,
				"Seleccione una materia"
			);
		}
	});
}

function loadSelect(select, data, defaultText) {
	select.innerHTML = "";
	let op = document.createElement('option');
	op.setAttribute("value", "");
	op.appendChild(document.createTextNode(defaultText));
	select.appendChild(op);
	data.forEach((d) => {
		let option = document.createElement("option");
		option.setAttribute("id", select.getAttribute("id")+"-"+d['id']);
		option.setAttribute("value", d['id']);
		option.appendChild(document.createTextNode(d['nombre']));
		select.appendChild(option);
	});
}

function search() {
	if (validate()) {
		console.log("Buscando");	
		api.get(
			api.materias.materias,
			getHeader()
		).then(function(response) {
			if ((response.status == 200) || (response.status == 204)) {
				table.refreshSelected(response.data.notas)
			}
		}).catch(function(error) {
			if (error.response)
				alert("Error: " + error.response.data.message);
			else
				alert("Error al conectar con el sistema");
		})
	}
}

function validate() {
	luValidate();

	let validValues = Object.values(fields).map(field => field.validate());
    let firstNoValid = validValues.findIndex(value => !value);
    if (firstNoValid != -1)
        Object.values(fields)[firstNoValid].getField().focus();
    return firstNoValid==-1;
}

function selectOnChange() {
	fields.selectSignature.validate();
}

function luValidate() {
	let lu = document.getElementById('searchLu').value;
	if (lu <= 0)
		fields.searchLu.setCustomValidity("El lu debe ser mayor a 0");
	else
		fields.searchLu.setCustomValidity();
}

function customize(auth) {
	switch (auth) {
		case 'admin':
			customizeForAdmin();
			break;
		case 'docente':
			customizeForDocente();
			break;
		case 'alumno':
			customizeForAlumno();
			break;
	}
}

function customizeForAdmin() {
	tableAdmin();
	document.getElementById('searchLuSection').style.display = 'block';
}

function customizeForDocente() {
	tableDocente();
	document.getElementById("addNotaSection").style.display = 'block';
	document.getElementById('searchLuSection').style.display = 'block';
}

function customizeForAlumno() {
	tableAlumno();
}

function start(auth) {
	document.getElementById('btnBuscar').addEventListener('click', (event) => search())
	document.getElementById('selectSignature').addEventListener('change', (event) => selectOnChange());

	customize(auth);
	loadSignatures();
}




window.onload = function() {
    checkToken(['admin', 'docente', 'notas'], start);
}
