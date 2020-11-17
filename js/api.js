<<<<<<< Updated upstream
//var BASE_URL = "http://127.0.0.1:8000/api";
=======
// var BASE_URL = "http://127.0.0.1:8000/api";
>>>>>>> Stashed changes
var BASE_URL = "https://pss2020api.herokuapp.com/api";
var api = {
    auth:{
        login: BASE_URL + "/login",
        check: BASE_URL + "/check"
    },
    user:{
        search: BASE_URL + "/user/search",
        docentes: BASE_URL + "/user/docentes",
        user: BASE_URL + "/user"
    },
    materia:{
        materia: BASE_URL + "/materia",
        asociar: BASE_URL + "/materia/asociar",
        inscripcion : BASE_URL + "/materia/inscripcion",
    },
    carrera:{
        carrera: BASE_URL + "/carrera",
        inscripcion : BASE_URL + "/carrera/inscripcion",
    },
    alumno:{
        perfil: BASE_URL + "/alumno/perfil",
        carrera: BASE_URL + "/alumno/carrera",
    },
    profesor:{
        nota: BASE_URL + "/profesor/materia/nota",
    },
    examen:{
        examen: BASE_URL + "/examen",
        inscripcion: BASE_URL + "/examen/inscripcion",
    }
}

function getHeader(){
    return {
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('access_token')
        }
    };
}

function checkToken(roles, start){

    let previousBody = document.body;

    document.body = document.createElement("body");
    axios.post(api.auth.check, {roles:roles}, getHeader()).then(
        (response) => {
            // response.data.auth  te dueve 'admin', 'docente' o 'alumno'
            if(response.status == 200){
                document.body = previousBody;
                start(response.data.auth);
            }
        }
    ).catch(
        (e) => {
            if (e.response) {
                document.body.appendChild(createBody());
            }
        }
    )
}

function createBody(errorCode) {
    let container = document.createElement('body');
    let img = document.createElement('img');

    container.setAttribute("class", "d-flex justify-content-center align-items-center w-100");
    container.setAttribute("style", "min-height: 100vh; background-color: #ebebec;");
    img.setAttribute("src", "https://i.imgur.com/PQs4KHH.png");

    container.appendChild(img);

    return container;
}
