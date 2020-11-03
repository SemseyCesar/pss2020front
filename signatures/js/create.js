function start(){
    let fields = {
        signatureName: new InputValidator('signatureName', 'signatureNameFeedback',
        {valueMissing: 'Ingrese un nombre'}),
        signatureCode: new InputValidator('signatureCode', 'signatureCodeFeedback',
        {valueMissing: 'Ingrese un código'}),
        signatureDepartment: new InputValidator('signatureDepartment', 'signatureDepartmentFeedback',
        {valueMissing: 'Ingrese un código'})
    }

    let btnGuardar = document.getElementById('btnGuardar');
    btnGuardar.addEventListener('click', (event) => {
        if(!edit)
            apiCreate();
        else
            apiEdit();
    });

    const searchParams = new URLSearchParams(window.location.search);
    var edit = (searchParams.has('id') && searchParams.get('id')) ? true : false;
    var _id = edit ? searchParams.get('id') : null;

    if(edit){loadInput(_id)}

    function localValidate() {
        let validValues = Object.values(fields).map(field => field.validate());
        let firstNoValid = validValues.findIndex(value => !value);
        if (firstNoValid != -1)
        Object.values(fields)[firstNoValid].getField().focus();
        return firstNoValid==-1;
    }

    function getData() {
        return {
            "nombre": document.getElementById("signatureName").value,
            "identificador": document.getElementById("signatureCode").value,
            "dpto": document.getElementById("signatureDepartment").value
        }
    }

    function loadInput(id){
        axios.get(api.materia.materia+"/"+id, getHeader())
        .then(function (response){
            if(response.status == 200){
                data = response.data.materia;
                document.getElementById('signatureName').value = data.nombre;
                document.getElementById('signatureCode').value = data.identificador;
                document.getElementById('signatureDepartment').value = data.dpto;
            }
        })
        .catch(function (error) {
            if(error.response)
            alert("Error: "+ error.response.data.message);
            else
            alert("Error: No se pudo comunicar con el sistema")
        });
    }

    function apiCreate(){
        if(localValidate()) {
            axios.post(api.materia.materia,
                getData(), getHeader()
            ).then(function (response) {
                document.getElementById("signatureName").value="";
                document.getElementById("signatureCode").value="";
                document.getElementById("signatureDepartment").value="";
                alert("Datos cargados correctamente");
            }).catch(function (error) {
                if(error.response)
                alert("Error: "+ error.response.data.message);
                else
                alert("Error: No se pudo comunicar con el sistema")
            });
        } else {
            console.log("No valida");
        }
    }

    function apiEdit(){
        if (localValidate()){
            axios.put(api.materia.materia+"/"+_id,
            getData() , getHeader()
        ).then(function (response){
            if(response.status == 200){
                document.getElementById("signatureName").value="";
                document.getElementById("signatureCode").value="";
                document.getElementById("signatureDepartment").value="";
                alert("Datos cargados correctamente");
            }
        }).catch(function (error) {
            if(error.response)
            alert("Error: "+ error.response.data.message);
            else
            alert("Error: No se pudo comunicar con el sistema")
        });
    }
}
}

window.onload = function(){
    checkToken(['admin'], start);
}
