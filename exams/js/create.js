window.onload = function() {
	var signatures = [];
	loadSignatures();

/*
	TODO: Buscar únicamente las materias en base al docente
	*/
	function loadSignatures() {
		axios.post('https://pss2020api.herokuapp.com/api/materia/search',
		{
			"search": "",
		}
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

	document.getElementById("btnGuardar").addEventListener("click", save());

	function save() {
		if (validate()) {
			/*
			 * COMPLETAR URL
			 */
			axios.post('https://pss2020api.herokuapp.com/api/',
			{
				/*
				 * COMPLETAR NOMBRE DE LOS CAMPOS
				 */
				// MATERIA
				"": document.getElementById("examSignatures").value,
				// CODIGO
				"": document.getElementById("examCode").value,
				// FECHA
				"": document.getElementById("examDate").value,
				// HORA
				"": document.getElementById("examTime").value,
				// AULA
				"": document.getElementById("examClassroom").value,
			}
			).then(function(response) {
				if (response.status == 200) {
					
				}

			}).catch(function(error) {

			})
		}
	}
}