window.onload = function() {
	var signatures = [];
	//loadSignatures();
	let fields = {
		examSignatures: new InputValidator('examSignatures', document.getElementById('examSignatures').className,
		'examSignatureFeedback', {valueMissing: 'Seleccione una opción'}),
		examCode: new InputValidator('examCode', document.getElementById('examCode').className,
		'examCodeFeedback', {valueMissing: 'Ingrese un código'}),
		examDate: new InputValidator('examDate', document.getElementById('examDate').className,
		'examDateFeedback', {valueMissing: 'Ingrese una fecha'}),
		examTime: new InputValidator('examTime', document.getElementById('examTime').className,
		'examTimeFeedback', {valueMissing: 'Ingrese un horario'}),
		examClassroom: new InputValidator('examClassroom', document.getElementById('examClassroom').className,
		'examClassroomFeedback', {valueMissing: 'Ingrese un aula'})
	};

/*
	TODO: Buscar únicamente las materias en base al docente
	*/
	function loadSignatures() {
		axios.post(api.materia.search, getHeader()
		).then(function (response) {
			if(response.status == 200){
				signatures = response.data.materias;
				let select = document.getElementById("examSignatures");
				signatures.forEach(s => {
					let option = createSignatureOption(s);
					select.appendChild(option);
				});
			}
		})
	}

	function createSignatureOption(signature) {
		let option = document.createElement("option");
		option.value = signature['id'];
		option.textContent = signature['nombre'];
		return option
	}

	document.getElementById("btnGuardar").addEventListener("click", (event) => save());

	function save() {
		apiCreate();
	}

	function apiCreate() {
		if (localValidate()) {/*
			axios.post(api.examen.examen, getData(), getHeader()
			).then(function(response) {
				if (response.status == 200) {

				}

			}).catch(function(error) {

			})*/
		}
	}

	function getData() {
		return {
			"identificador": document.getElementById("examCode").value,
			"materia_id": document.getElementById("examSignatures").value,
			"fecha": document.getElementById("examDate").value,
			"hora": document.getElementById("examTime").value,
			"aula": document.getElementById("examClassroom").value,
		}
	}

	function localValidate() {
	    let validValues = Object.values(fields).map(field => field.validate());
	    let firstNoValid = validValues.findIndex(value => !value);
	    if (firstNoValid != -1)
	        Object.values(fields)[firstNoValid].getField().focus();
	    return firstNoValid==-1;
	}
}
