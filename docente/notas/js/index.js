function start(auth) {
	console.log(auth);
	var notasRows = [];
	var signatures = [];
	var table;

	customize();
/*
	table.setOnDeleteEvent((id)=>{
		console.log(getHeader());
		axios.delete(api.carrera.carrera+"/"+id, getHeader())
			.then(function (response) {
				console.log(response)
				if(response.status == 200){
					careersRows = careersRows.filter( c => c.id != id)
					table.refreshSelected(careersRows);
				}
			});
    })

    table.setOnEditEvent((id) =>{
        window.location.href = './create.html?id=' + id;
    });
*/


	let btnBuscar = document.getElementById('btnBuscar');
	btnBuscar.addEventListener('click', (event) => search())

	function search() {
		if (areInputValids()) {
			// Buscar notasssss
		}
	}

	function filterBy(data, type, filterInput) {
		careersRows = data.filter(item => item[type].includes(filterInput));
		table.refreshSelected(careersRows);
	}

	function customize() {
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
		loadSignatures();
	}

	function customizeForAdmin() {
		document.getElementById('searchLu').setAttribute("required", "");
		signatures = [
			{id: 1, name: 'nombre admin 1'},
			{id: 2, name: 'nombre admin 2'},
			{id: 3, name: 'nombre admin 3'},
			{id: 4, name: 'nombre admin 4'},
			{id: 5, name: 'nombre admin 5'}
		];
/*		axios.post(
			api.materia.search,
			{
				"search": "",
			},
			getHeader()
		).then(function (response) {
			if (response.status == 200 || response.status == 204) {

			}
		});*/
		addTable();
//		setLuValidations();
	}

	function customizeForDocente() {
		/*
		axios.get(
			api.profesor.materia,
			getHeader()
		).then(function (response) {
			if (response.status == 200 || response.status == 204){
				signatures = response.data.materias;
				console.log(signatures);
			}
		});*/
		signatures = [
			{id: 1, name: 'nombre docente 1'},
			{id: 2, name: 'nombre docente 2'},
			{id: 3, name: 'nombre docente 3'},
			{id: 4, name: 'nombre docente 4'},
			{id: 5, name: 'nombre docente 5'}
		];
		addTable();
//		setLuValidations();
	}

	function customizeForAlumno() {/*
		axios.post(
			// F
		).then(function (response) {
			if (response.status == 200 || response.status == 204) {
				signatures = response.data.materias;
				console.log(signatures);
			}
		});*/
//		document.getElementById('searchLu').style.display = 'none';
		signatures = [
			{id: 1, name: 'nombre alumno 1'},
			{id: 2, name: 'nombre alumno 2'},
			{id: 3, name: 'nombre alumno 3'},
			{id: 4, name: 'nombre alumno 4'},
			{id: 5, name: 'nombre alumno 5'}
		];
		addAlumnoTable();
	}

	function loadSignatures() {
		addSignature("", "Seleccione una materia");
		signatures.forEach( (s) => addSignature(s.id, s.name));
	}

	function addSignature(id, name) {
		let option = document.createElement("option");
		option.setAttribute("id", 'option-materia-' + id);
		option.setAttribute("value", name);
		let text = document.createTextNode(name);
		option.appendChild(text);
		document.getElementById('selectSignature').appendChild(option);
	}

	function addTable() {
		table = new Table('notasInfo',['','Lu','Nombre','Cursado','Final',''],
	        ['','lu','nombre_apellido','nota_cursado','nota_final'], null);
	    table.setWidths(['15%','20%','20%','20%','20%']);
	}

	function addAlumnoTable() {
		table = new Table('notasInfo',['','Nota de cursado','Nota de final',''],
	        ['','nota_cursado','nota_final',''], null);
	    table.setWidths(['20%','25%','25%','20%']);
	}

/*
	// PARA VALIDAR DATOS LOCALES DESPUÉS

	let fields = {
		selectSignature: new InputValidator('selectSignature',
				'selectSignatureFeedback', {valueMissing: 'Seleccione una materia'}),
		searchLu: new InputValidator('searchLu', 'searchLuFeedback',
				{valueMissing: 'Ingrese un lu', badInput: 'Debe ser un número', customError: ''})
	}

	fields.selectSignature.getField().addEventListener('change', selectOnChange());

	function selectOnChange() {
		fields.selectSignature.validate();
	}

	function setLuValidations() {
		let lu = fields.serchLu.getField().value;
		if (lu < 0)
			fields.searchLu.setCustomValidity("El lu debe ser mayor a 0");
		else
			fields.searchLu.setCustomValidity();
	}

	function areInputValids() {
		let validValues = Object.values(fields).map(field => field.validate());
		let firstNoValid = validValues.findIndex(value => !value);
		if (firstNoValid != -1)
			Object.values(fields)[firstNoValid].getField().focus();
		return firstNoValid==-1;
	}*/

	console.log(document.getElementById('searchLu'));
}


window.onload = start('docente'); /*{

    checkToken(['admin'], start);
}*/
