var BASE_URL = "http://127.0.0.1:8000/api";
// var BASE_URL = "https://pss2020api.herokuapp.com/api/",
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
    }
}