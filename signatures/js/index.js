function start(){
	var signaturesRows = [];

	let table = new Table('signatureList',['Codigo','Nombre','Departamento',''],
		['identificador','nombre','dpto'], null);
	table.setWidths(['25%','25%','25%']);

	table.setOnDeleteEvent((id)=>{
		axios.delete(api.materia.materia+"/"+id, getHeader())
			.then(function (response) {
				if(response.status == 200){
					searchApi();
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
	btnBuscar.addEventListener('click', searchApi);

	function filterBy(data, type, filterInput) {
		signaturesRows = data.filter(item => item[type].includes(filterInput));
		table.refreshSelected(signaturesRows);
	}

	function searchApi(){
		if (select.validity() && searchValue.validity()){
			axios.post(api.materia.search,
			{
				"search": searchValue.getInput(),
			}, getHeader()
			).then(function (response) {
				if(response.status == 200){
					let data = response.data.materias;
					filterBy(data, select.getValue(), searchValue.getInput());
                    document.getElementById("footer").innerHTML = cardFooter(signaturesRows.length);
				}
			})
		}
	}
}

window.onload = function(){
    checkToken(['admin', 'docente'], start);
}