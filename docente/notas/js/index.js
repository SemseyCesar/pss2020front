function start(auth){
/*	var careersRows = [];

	let table = new Table('carrerList',['Codigo','Nombre','Departamento','Docente','Duración',''],
        ['identificador','nombre','dpto','docente','duracion'], null);
    table.setWidths(['18%','20%','20%','20%','10%']);

    table.setOnDeleteEvent((id)=>{
		console.log(getHeader());
		axios.delete(api.carrera.carrera+"/"+id, getHeader())
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
    });*/

	let btnBuscar = document.getElementById('btnBuscar');
	btnBuscar.addEventListener('click', (event) => search())

	function search() {
		if (select.validity() && searchValue.validity()){
			axios.post(api.carrera.search,
			{
				"search": searchValue.getInput(),
			}, getHeader()
			).then(function (response) {
				if(response.status == 200){
					let data = response.data.carreras;
					filterBy(data, select.getValue(), searchValue.getInput());
                    document.getElementById("footer").innerHTML = cardFooter(careersRows.length);
				}
			});
		}
	}


	function filterBy(data, type, filterInput) {
		careersRows = data.filter(item => item[type].includes(filterInput));
		table.refreshSelected(careersRows);
	}
}


window.onload = function(){
    checkToken(['admin'], start);
}
