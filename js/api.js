// var BASE_URL = "http://127.0.0.1:8000/api";
var BASE_URL = "https://pss2020api.herokuapp.com/api/",
var api = {
    auth:{
        login: BASE_URL + "/login",
        check: BASE_URL + "/check"
    },
    user:{
        register: BASE_URL + "/register",
        search: BASE_URL + "/user/search",
        docentes: BASE_URL + "/user/docentes",
    },
    materia:{
        search: BASE_URL + "/materia/search",
        materia: BASE_URL + "/materia",
        asociar: BASE_URL + "/materia/asociar"
    },
    carrera:{
        search: BASE_URL + "/carrera/search",
        carrera: BASE_URL + "/carrera"
    },
    examen:{
        examen: BASE_URL + "/examen",
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
            if(response.status == 200){
                document.body = previousBody
                start();
            }
        }
    )
}