window.onload = function() {
	var signatures = [];
	//loadSignatures();
	let fields = [
		new InputValidator('examSignatures', "custom-select",
		'examSignatureFeedback', ['valueMissing'], ['Seleccione una opción']),
		new InputValidator('examCode', "form-control",
		'examCodeFeedback', ['valueMissing'], ['Ingrese un código']),
		new InputValidator('examDate',  "form-control",
		'examDateFeedback', ['valueMissing'], ['Ingrese una fecha']),
		new InputValidator('examTime',  "form-control",
		'examTimeFeedback', ['valueMissing'], ['Ingrese un horario']),
		new InputValidator('examClassroom',  "form-control",
		'examClassroomFeedback', ['valueMissing'], ['Ingrese un aula'])
	]

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
		return fields.every(field => field.validate());
	}
}
