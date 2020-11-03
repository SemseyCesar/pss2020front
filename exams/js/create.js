function start(){
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

	const searchParams = new URLSearchParams(window.location.search);
    var edit = (searchParams.has('id') && searchParams.get('id')) ? true : false;
    var _id = edit ? searchParams.get('id') : null;
    console.log(edit, _id);

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
        if (localValidate()){
            axios.put(api.examen.examen+_id,
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

	function getDataToSend() {
		return {
			"identificador": document.getElementById("examCode").value,
			"materia_id": document.getElementById("examSignatures").value,
			"fecha": document.getElementById("examDate").value,
			"hora": document.getElementById("examTime").value,
			"aula": document.getElementById("examClassroom").value,
		}
	}

	function loadInput(id){
        axios.get(api.carrera.carrera+id, getHeader())
        .then(function (response){
            if(response.status == 200){
                data = response.data.examen;
				loadSignatures();
                document.getElementById('examCode').value = data.identificador;
                document.getElementById('examSignatures').value = data.materia_id;
                document.getElementById('examDate').value = data.fecha,
                document.getElementById('examTime').value = response.hora;
                document.getElementById('examClassroom').value = data.aula;
				document.getElementById('examSignatures').setAttribute("disabled", "true");
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
		document.getElementById('examCode').value = "";
		document.getElementById('examSignatures').value = ";"
		document.getElementById('examDate').value = "",
		document.getElementById('examTime').value = "";
		document.getElementById('examClassroom').value = "";
		document.getElementById('examSignatures').setAttribute("disabled", "false");
	}
}

window.onload = function(){
    checkToken(['admin','docente'], start);
}