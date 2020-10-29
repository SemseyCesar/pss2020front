window.onload = function() {
	
	var careersRows = [];

	let table = new Table('carrerList',['Codigo','Nombre','Departamento','Docente','Duración',''],
        ['identificador','nombre','dpto','docente','duracion'], null);
    table.setWidths(['18%','20%','20%','20%','10%']);

    table.setOnDeleteEvent((id)=>{
		axios.delete('https://pss2020api.herokuapp.com/api/carrera/'+id)
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
	btnBuscar.addEventListener('click', (event) => {
		if (document.getElementById("selecTypeSearch").checkValidity()){
			document.getElementById("selecTypeSearch").setAttribute("class", "custom-select");
			axios.post('https://pss2020api.herokuapp.com/api/carrera/search',
			{
				"search": document.getElementById('searchValue').value,
			}
			).then(function (response) {
				if(response.status == 200){
					let data = response.data.carreras;
					var filter;
					if (selecTypeSearch.value == "name")
						filter = 'nombre';
					else
						filter = 'identificador';
					let counter = filterBy(data, filter);
					updateCardFooter(counter);
				}
			});
		} else {
			document.getElementById("selecTypeSearch").setAttribute("class", "custom-select is-invalid");
		}
	})

	function filterBy(data, type) {
		let searchValue = document.getElementById('searchValue').value;
		let counter = 0;
		let filteredCareers = [];
		data.forEach( item => {
			if (item[type].includes(searchValue)) {
				filteredCareers.push(item);
				counter++;
			}
		})
		careersRows = filteredCareers;
		table.refreshSelected(careersRows);
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