class NavBar {
    constructor(navId, texts, refs, rol, username, loginPath) {
        let div = document.createElement('div');
        div.setAttribute("class", "collapse navbar-collapse");

        div.appendChild(this.initItems(refs, texts));
        div.appendChild(this.initUserInfo(rol, username, loginPath));

        document.getElementById(navId).appendChild(div);
        document.getElementById(navId).setAttribute("class", "navbar navbar-expand-lg navbar-dark bg-dark");
    }

    initItems(refs, texts) {
        let ul = document.createElement('ul');
        ul.setAttribute("class", 'navbar-nav mr-auto');
        refs.forEach((ref, i) => {
            let li = document.createElement('li');
            if (i==0)
                li.setAttribute("class", "nav-item active");
            else
                li.setAttribute("class", "nav-item");
            let a = document.createElement('a');
            a.setAttribute("class", "nav-link");
            a.setAttribute("href", ref);
            a.textContent = texts[i];
            li.appendChild(a);
            ul.appendChild(li);
        });

        return ul;
    }

    initUserInfo(rol, username, loginPath) {
        let items = document.createElement('ul');
        items.setAttribute("class", "navbar-nav ml-auto nav-flex-icons");

        let userRolSection = document.createElement('li');
        let userRol = document.createElement('a');

        userRolSection.setAttribute("class", "nav-item");
        userRolSection.setAttribute("style", "border-right: 1px solid #aaaaaa;");
        userRolSection.appendChild(userRol);

        userRol.setAttribute("class", "nav-link waves-effect waves-light mr-2");
        userRol.appendChild(document.createTextNode(rol));

        let userNameSection = document.createElement('li');
        let userName = document.createElement("a");
        let logout = document.createElement("i");

        userNameSection.setAttribute("class", "nav-item");
        userNameSection.appendChild(userName);

        userName.setAttribute("class", "nav-link waves-effect waves-light ml-2");
        userName.appendChild(document.createTextNode(username.toUpperCase()));
        userName.appendChild(logout);

        logout.setAttribute("class", "fa fa-sign-out ml-4");
        logout.addEventListener("click", (event) => {
            if (confirm("¿Cerrar sesión?")) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('user_name');
                window.location.href = loginPath;
            }
        });



        items.appendChild(userRolSection);
        items.appendChild(userNameSection);

        return items;
    }
}
