window.onload = function() {
	var signaturesRows = [];

	let table = new Table('signatureList',['Codigo','Nombre','Departamento',''],
		['identificador','nombre','dpto'], null);
	table.setWidths(['25%','25%','25%']);

	table.setOnDeleteEvent((id)=>{
		console.log("Borrando " + id);
	})

	table.setOnEditEvent((id) =>{
		console.log("Modificando " + id);
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
	btnBuscar.addEventListener('click', (event) =>{
		if (select.validity() && searchValue.validity()){
			axios.post(api.materia.search,
			{
				"search": searchValue.getInput(),
			}, getHeader()
			).then(function (response) {
				console.log(response);
				if(response.status == 200){
					let data = response.data.materias;
					filterBy(data, select.getValue(), searchValue.getInput());
                    document.getElementById("footer").innerHTML = cardFooter(signaturesRows.length);
				}
			})
		}
	});

	function filterBy(data, type, filterInput) {
		signaturesRows = data.filter(item => item[type].includes(filterInput));
		table.refreshSelected(signaturesRows);
	}
}