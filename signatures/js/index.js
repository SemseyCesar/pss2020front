window.onload = function() {
	let table = new Table('signatureList',['Codigo','Nombre','Departamento',''],
		['identificador','nombre','dpto'], null);
	table.setWidths(['25%','25%','25%']);

	table.setOnDeleteEvent((id)=>{
		console.log("Borrando " + id);
	})

	table.setOnEditEvent((id) =>{
		console.log("Modificando " + id);
	})


	const selectElement = document.getElementById('selecTypeSearch');
	selectElement.addEventListener('change', (event) => {
		const searchText = document.getElementById('searchValue');
		document.getElementById("selecTypeSearch").setAttribute("class", "custom-select");
		if (event.target.value == "name") {
			searchText.placeholder = "Ingrese el Nombre";
		}
		else {
			if (event.target.value == "code") {
				searchText.placeholder = "Ingrese el Codigo";
			} else {
				searchText.placeholder = "Seleccione una opción";
				document.getElementById("selecTypeSearch").setAttribute("class", "custom-select is-invalid");
			}
		}
	});

	let btnBuscar = document.getElementById('btnBuscar');
	btnBuscar.addEventListener('click', (event) =>{
		if (document.getElementById("selecTypeSearch").checkValidity()){
			document.getElementById("selecTypeSearch").setAttribute("class", "custom-select");
			axios.post('https://pss2020api.herokuapp.com/api/materia/search',
			{
				"search": document.getElementById('searchValue').value,
			}
			).then(function (response) {
				console.log(response);
				if(response.status == 200){
					let data = response.data.materias;
					var filter;
					if (selecTypeSearch.value == "name")
						filter = 'nombre';
					else
						filter = 'identificador';
					let counter = filterBy(data, filter);
					updateCardFooter(counter);
				}
			})
		} else {
			document.getElementById("selecTypeSearch").setAttribute("class", "custom-select is-invalid");
		}
	});

	function filterBy(data, type) {
		let searchValue = document.getElementById('searchValue').value;
		var counter = 0;
		var filteredSignatures = []
		data.forEach( item => {
			if (item[type].includes(searchValue)) {
				filteredSignatures.push(item);
				counter++;
			}
		})
		table.refreshSelected(filteredSignatures);
		return counter;
	}

	function updateCardFooter(counter) {
		const footer = document.getElementById("footer");
		var footerText;
		if (counter==0)
			footerText = "No hay resultados";
		else
			if (counter==1)
				footerText = "Se encontró " + counter + " resultado";
			else
				footerText = "Se encontraron " + counter + " resultados";
		footer.innerHTML = footerText;
	}
}