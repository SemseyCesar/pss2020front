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
            console.log(this.cols)
            console.log(elem);
            let fila = document.createElement("tr");
            this.cols.forEach( c =>{
                let celda = document.createElement("td");
                celda.textContent = elem[c];
                fila.appendChild(celda);
            });
            let celda_acciones = document.createElement("td");
            fila.appendChild(celda_acciones);
            //agregarButtonCreate(celda, elem);
            this.tbody.appendChild(fila);
        })
    };
}