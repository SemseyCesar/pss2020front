class Table{
    constructor(id, cols_name, cols, onAdd){

        this.id = id;
        this.onAdd = onAdd;
        this.cols_name = cols_name;
        this.cols = cols;
        
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
                celda.textContent = elem[c];
                fila.appendChild(celda);
            });
            let celda_acciones = document.createElement("td");
            celda_acciones.style.paddingLeft = '3px';
            fila.appendChild(celda_acciones);
            celda_acciones.appendChild(this.createDeleteButton(elem['id']));
            celda_acciones.appendChild(this.createEditButton(elem['id']));
            this.tbody.appendChild(fila);
        })
    };

    createDeleteButton(id){
        let deleteButton = document.createElement("button");
        deleteButton.setAttribute('class','btn btn-danger');
        let icon = document.createElement('i');
        icon.setAttribute('class','fa fa-minus');
        icon.style.fontSize = "12px";
        deleteButton.appendChild(icon);
        deleteButton.addEventListener('click', (event) =>{
            if(this.onDeleteEvent) this.onDeleteEvent(id)
        });
        return deleteButton;
    }

    createEditButton(id){
        let deleteButton = document.createElement("button");
        deleteButton.setAttribute('class','btn btn-secondary ml-1');
        let icon = document.createElement('i');
        icon.setAttribute('class','fa fa-pencil');
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