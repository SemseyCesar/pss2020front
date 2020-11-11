class TableExamAlumno extends Table {
    constructor(id, cols_name, cols, onAdd, hideEditButton, hideDeleteButton) {
        super(id, cols_name, cols, onAdd, hideEditButton, hideDeleteButton);
    }

    refreshSelected(data) {
        this.tbody.innerHTML="";
        data.forEach(elem =>{
            let fila = document.createElement("tr");
            this.cols.filter(c => c != 'id').forEach( c =>{
                let celda = document.createElement("td");
                if(c.split('.').length > 1){
                    let keys = c.split('.');
                    let value = elem[keys.shift()];
                    while(keys.length>0){
                        value = value[keys.shift()];
                    }
                    celda.textContent = value;
                }else
                    celda.textContent = elem[c];
                fila.appendChild(celda);
            });
            let celda_acciones = document.createElement("td");
            celda_acciones.style.paddingLeft = '3px';
            fila.appendChild(celda_acciones);
            celda_acciones.appendChild(this.createRegisterButton(elem['id']));
            celda_acciones.appendChild(this.createUnregisterButton(elem['id']));
            this.tbody.appendChild(fila);
        });
    }

    createRegisterButton(id) {
        let registerButton = document.createElement("button");
        registerButton.setAttribute('class','btn btn-outline-primary ml-1');
        let icon = document.createElement('i');
        icon.setAttribute('class','fa fa-add');
        icon.style.fontSize = "12px";
        let text = document.createTextNode("Inscribirse");
        registerButton.appendChild(icon);
        registerButton.appendChild(text);
        registerButton.addEventListener('click', (event) =>{
            if(this.onRegisterEvent) this.onRegisterEvent(id)
        });
        return registerButton;
    }

    createUnregisterButton(id) {
        let unregisterButton = document.createElement("button");
        unregisterButton.setAttribute('class','btn btn-outline-danger ml-1');
        let icon = document.createElement('i');
        icon.setAttribute('class','fa fa-close');
        icon.style.fontSize = "12px";
        let text = document.createTextNode("Desincribirse");
        unregisterButton.appendChild(icon);
        unregisterButton.appendChild(text);
        unregisterButton.addEventListener('click', (event) =>{
            if(this.onUnregisterEvent) this.onUnregisterEvent(id)
        });
        return unregisterButton;
    }

    setOnRegisterEvent(onRegisterEvent) {
        this.onRegisterEvent = onRegisterEvent;
    }

    setOnUnregisterEvent(onUnregisterEvent) {
        this.onUnregisterEvent = onUnregisterEvent;
    }
}
