function start(){
	var examenRows = [];

	let table = new Table('examenList',['Codigo','Materia','fecha','hora',''],
        ['identificador','materia.nombre','fecha','hora'], null);
    table.setWidths(['18%','20%','20%','20%','10%']);

    table.setOnDeleteEvent((id)=>{
		console.log(getHeader());
		axios.delete(api.examen.examen+"/"+id, getHeader())
			.then(function (response) {
                if(response.status == 200)
                    searchApi();
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
            searchApi();
		}
	})

	function filterBy(data, type, filterInput) {
		careersRows = data.filter(item => item[type].includes(filterInput));
		table.refreshSelected(careersRows);
    }
    
    function searchApi(){
        axios.get(api.examen.examen, getHeader()
        ).then(function (response) {
            if(response.status == 200){
                let data = response.data.examenes;
                careersRows = data;
                table.refreshSelected(careersRows);
                document.getElementById("footer").innerHTML = cardFooter(careersRows.length);
            }
        });
    }
}


window.onload = function(){
    checkToken(['admin','docente'], start);
}