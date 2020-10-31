window.onload = function(){

    let btnIngresar = document.getElementById('btn-ingresar');
    btnIngresar.addEventListener('click',(e) =>{
        axois.post(api.auth.login,{
            username: document.getElementById('username').value,
            password: document.getElementById('password').value
        }).then(response => {
            console.log(response);
        })
    })

}