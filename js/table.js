class Table{
    constructor(id, cols_name, cols, onAdd, hideEditButton, hideDeleteButton){

        this.id = id;
        this.onAdd = onAdd;
        this.cols_name = cols_name;
        this.cols = cols;
        this.hideEditButton = hideEditButton;
        this.hideDeleteButton = hideDeleteButton;

        this.table = this.initTable();
        this.thead = this.initTHead(cols_name);
        this.table.appendChild(this.thead);
        this.tbody = this.initTBody(id);
        this.table.appendChild(this.tbody);

        document.getElementById(id).appendChild(this.table);

    }

    initTable(){
        let table = document.createElement("table");
        table.setAttribute('class', 'table');
        return table;
    }

    initTBody(id){
        let tbody = document.createElement("tbody");
        tbody.setAttribute('id', id+'-tbody');
        return tbody;
    }

    initTHead(cols){
        let thead = document.createElement("thead");
        let tr = document.createElement("tr");
        thead.appendChild(tr);
        cols.forEach( c =>{
                let th =  document.createElement("th");
                tr.appendChild(th);
                th.setAttribute('scope','col');
                th.textContent = c;
            }
        )
        return thead;
    }

    setWidths(widths){
        widths.forEach((w, i)=>{
            this.thead.firstChild.childNodes[i].style.width = w;
        });
    }

    refreshSelected(data){
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
            if (!this.hideEditButton)
                celda_acciones.appendChild(this.createEditButton(elem['id']));
            if (!this.hideDeleteButton)
                celda_acciones.appendChild(this.createDeleteButton(elem['id']));
            this.tbody.appendChild(fila);
        })
    };

    createDeleteButton(id){
        let deleteButton = document.createElement("button");
        deleteButton.setAttribute('class','btn btn-danger ml-1');
        let icon = document.createElement('i');
        icon.setAttribute('class','fa fa-trash');
        icon.style.fontSize = "12px";
        deleteButton.appendChild(icon);
        deleteButton.addEventListener('click', (event) =>{
            if(this.onDeleteEvent) this.onDeleteEvent(id)
        });
        return deleteButton;
    }

    createEditButton(id){
        let deleteButton = document.createElement("button");
        deleteButton.setAttribute('class','btn btn-warning');
        let icon = document.createElement('i');
        icon.setAttribute('class','fa fa-edit');
        icon.style.fontSize = "12px";
        deleteButton.appendChild(icon);
        deleteButton.addEventListener('click', (event) =>{
            if(this.onEditEvent) this.onEditEvent(id)
        });
        return deleteButton;
    }

    setOnDeleteEvent(onDeleteEvent){
        this.onDeleteEvent = onDeleteEvent;
    }

    setOnEditEvent(onEditEvent){
        this.onEditEvent = onEditEvent;
    }
}
