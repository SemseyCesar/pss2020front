function start(auth) {
    switch (auth) {
        case 'admin':
            window.location.href = '../signatures/asociar.hmtl';
            break;
        case 'docente':
            window.location.href = '../docente/notas/notas.hmtl';
            break;
        case 'alumno':
            window.location.href = '../alumno/inscripcion/career.hmtl';
            break;
        default:

    }
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
                setTimeout(function(){
                    checkToken(['admin', 'docente', 'alumno'], start);
                },100)
            }
        }).catch(
            (e) => {
                alert("Error al loguearse");
            }
        )
    })
}
