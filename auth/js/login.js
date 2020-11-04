let fields = {
    username: new InputValidator('username', 'usernameFeedback',
        {customError: 'Incorrecto'}),
    password: new InputValidator('password', 'passwordFeedback',
        {customError: 'Incorrecto'})
}

function start(auth) {
    fields.username.setCustomValidity();
    fields.password.setCustomValidity();
    Object.values(fields).forEach((item) => {
        item.validate();
    });

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

function errorLogin() {
    fields.username.setCustomValidity("Nombre de usuario no existente");
    fields.password.setCustomValidity("Contraseña incorrecta");
    Object.values(fields).forEach((item) => {
        item.validate();
    });
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
                errorLogin();
            }
        )
    })

}
