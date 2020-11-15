function start(auth) {
    switch (auth) {
        case 'admin':
            window.location.href = '../admin/home.html';
            break;
        case 'docente':
            window.location.href = '../docente/home.html';
            break;
        case 'alumno':
            window.location.href = '../alumno/home.html';
            break;
    }
}

function errorLogin(error) {
    let alert = document.getElementById("alertIncorrect");
    var text;
    if(error.response)
        text = "<strong>Usuario o contraseña inválida</strong>";
    else
        text = "<strong>Error: </strong> No se pudo comunicar con el sistema";
    alert.innerHTML = text;
    alert.style.display = "block";
    window.setTimeout(function() {
        alert.style.display = "none";
    }, 2500);
}

window.onload = function(){

    let btnIngresar = document.getElementById('btn-ingresar');
    btnIngresar.addEventListener('click',(e) =>{
        axios.post(api.auth.login,{
            username: document.getElementById('username').value,
            password: document.getElementById('password').value
        }).then(response => {
            if(response.status == 200){
                localStorage.setItem('access_token', response.data.access_token);
                localStorage.setItem('user_name', response.data.user.nombre_apellido);
                checkToken(['admin', 'docente', 'alumno'], start);
            }
        }).catch(
            (e) => {
                errorLogin(e);
            }
        )
    })

}
