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

    let searchValue = new SearchBar(
        'searchValueSection',
        ['text','text','text'], 
        ['Seleccione una opción','Ingrese el Nombre','Ingrese el Código'],
        ['','','',''],
        null
    );

    let select = new Select(
        'selectSection',
        ['', 'nombre', 'identificador'],
        ['Buscar por...', 'Nombre', 'Código'],
        'Seleccione una opción.',
        searchValue,
        null
    );

    select.setOnChange(() => {
        select.validity();
        searchValue.setAttributes(select.getSelectedIndex());
        searchValue.validity();
    })

	let btnBuscar = document.getElementById('btnBuscar');
	btnBuscar.addEventListener('click', (event) => {
		if (select.validity() && searchValue.validity()){
			axios.post('https://pss2020api.herokuapp.com/api/carrera/search',
			{
				"search": searchValue.getInput(),
			}
			).then(function (response) {
				if(response.status == 200){
					let data = response.data.carreras;
					filterBy(data, select.getValue(), searchValue.getInput());
                    document.getElementById("footer").innerHTML = cardFooter(careersRows.length);
				}
			});
		}
	})

	function filterBy(data, type, filterInput) {
		careersRows = data.filter(item => item[type].includes(filterInput));
		table.refreshSelected(careersRows);
	}
}