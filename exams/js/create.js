function start(){
	var signatures = [];
	loadSignatures();
	let fields = {
		examSignatures: new InputValidator('examSignatures', 'examSignatureFeedback',
			{valueMissing: 'Seleccione una opción'}),
		examCode: new InputValidator('examCode', 'examCodeFeedback',
			{valueMissing: 'Ingrese un código'}),
		examDate: new InputValidator('examDate', 'examDateFeedback',
			{valueMissing: 'Ingrese una fecha'}),
		examTime: new InputValidator('examTime', 'examTimeFeedback',
			{valueMissing: 'Ingrese un horario'}),
		examClassroom: new InputValidator('examClassroom', 'examClassroomFeedback',
			{valueMissing: 'Ingrese un aula'})
	};

	const searchParams = new URLSearchParams(window.location.search);
    var edit = (searchParams.has('id') && searchParams.get('id')) ? true : false;
    var _id = edit ? searchParams.get('id') : null;

    if(edit){loadInput(_id)}

/*
-----------------------------------------------------------------------------------------------------
-----------------------------------------------------------------------------------------------------
-----------------------------------------------------------------------------------------------------
@// TODO: Buscar únicamente las materias en base al docente
-----------------------------------------------------------------------------------------------------
-----------------------------------------------------------------------------------------------------
-----------------------------------------------------------------------------------------------------
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
		if (edit)
			apiEdit();
		else
			apiCreate();
	}

	function apiCreate() {
		if (localValidate()) {
			axios.post(api.examen.examen, getDataToSend(), getHeader()
			).then(function(response) {
				if (response.status == 200) {
					refreshInputs();
				}
			}).catch(function(error) {
                if(error.response)
                    alert("Error: "+ error.response.data.message);
                else
                    alert("Error: No se pudo comunicar con el sistema")
			});
		}
	}

    function apiEdit(){
		console.log("EAS");
        if (localValidate()){
            axios.put(api.examen.examen+"/"+_id,
                getDataToSend() , getHeader()
            ).then(function (response){
                if(response.status == 200){
                    refreshInputs();
                }
            }).catch(function (error) {
                if(error.response)
                    alert("Error: "+ error.response.data.message);
                else
                    alert("Error: No se pudo comunicar con el sistema")
            });
        }
    }

	function getTime(){
		var time = document.getElementById("examTime").value;
		const splittedString = time.split(":");
		return splittedString[0]+":"+splittedString[1];
	}

	function getDataToSend() {
		return {
			"identificador": document.getElementById("examCode").value,
			"materia_id": document.getElementById("examSignatures").value,
			"fecha": document.getElementById("examDate").value,
			"hora": getTime(),
			"aula": document.getElementById("examClassroom").value,
		}
	}

	function loadInput(id){
        axios.get(api.examen.examen, getHeader())
        .then(function (response){
            if(response.status == 200){
                data = response.data.examenes;
				loadSignatures();
				let examen = data.filter(d => d.id == id)[0];
				if (examen) {
	                document.getElementById('examCode').value = examen.identificador;
	                document.getElementById('examSignatures').value = examen.materia_id;
					document.getElementById('examDate').value = examen.fecha,
	                document.getElementById('examTime').value = examen.hora;
	                document.getElementById('examClassroom').value = examen.aula;
					document.getElementById('examSignatures').setAttribute("disabled", "true");
				} else {
					alerte("Error, no existe el exámen buscado");
				}
            }
        })
        .catch(function (error) {
            if(error.response)
                alert("Error: "+ error.response.data.message);
            else
                alert("Error: No se pudo comunicar con el sistema")
        });
    }

	function localValidate() {
	    let validValues = Object.values(fields).map(field => field.validate());
	    let firstNoValid = validValues.findIndex(value => !value);
	    if (firstNoValid != -1)
	        Object.values(fields)[firstNoValid].getField().focus();
	    return firstNoValid==-1;
	}

	function refreshInputs() {
		if (edit) {
			alert("Datos actualizados correctamente");
		} else {
			document.getElementById('examCode').value = "";
			document.getElementById('examSignatures').value = ";"
			document.getElementById('examDate').value = "",
			document.getElementById('examTime').value = "";
			document.getElementById('examClassroom').value = "";
			document.getElementById('examSignatures').setAttribute("disabled", "false");
			alert("Datos cargados correctamente");
		}
	}
}

window.onload = function(){
    checkToken(['admin','docente'], start);
}
