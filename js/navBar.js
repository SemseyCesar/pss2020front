class NavBar {
    constructor(navId, texts, refs, rol, username, loginPath) {
        let div = document.createElement('div');
        div.setAttribute("class", "collapse navbar-collapse");
        div.setAttribute('id', 'sectionNavBar');

        div.appendChild(this.initItems(refs, texts));
        div.appendChild(this.initUserInfo(rol, username, loginPath));

        let navBar = document.getElementById(navId);
        navBar.appendChild(this.collapseButton());
        navBar.appendChild(div);
        navBar.setAttribute("class", "navbar navbar-expand-lg navbar-dark");
    }

    collapseButton() {
        let button = document.createElement('button');
        button.setAttribute('class', 'navbar-toggler');
        button.setAttribute('data-toggle', 'collapse');
        button.setAttribute('data-target', '#sectionNavBar');
        button.setAttribute('aria-controls', 'sectionNavBar');
        button.setAttribute('aria-expanded', 'false');
        button.setAttribute('aria-label', 'Toggle navigation');

        let span = document.createElement('span');
        span.setAttribute('class', 'navbar-toggler-icon');

        button.appendChild(span);

        return button;
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

        items.appendChild(this.rolSection(rol));
        items.appendChild(this.nameSection(username));
        items.appendChild(this.logoutSection(loginPath));

        return items;
    }

    rolSection(rol) {
        let userRolSection = document.createElement('li');
        let userRol = document.createElement('a');

        userRolSection.setAttribute("class", "nav-item");
        userRolSection.appendChild(userRol);

        userRol.setAttribute("class", "nav-link waves-effect waves-light mr-2 text-right");
        userRol.appendChild(document.createTextNode(rol));

        return userRolSection;
    }

    nameSection(username) {
        let userNameSection = document.createElement('li');
        let userName = document.createElement("a");

        userNameSection.setAttribute("class", "nav-item");
        userNameSection.appendChild(userName);

        userName.setAttribute("class", "nav-link waves-effect waves-light text-right");
        userName.appendChild(document.createTextNode(username.toUpperCase()));

        return userNameSection;
    }

    logoutSection(loginPath) {
        let logoutSection = document.createElement('li');
        let a = document.createElement('a');
        let logout = document.createElement("i");

        logoutSection.setAttribute("class", "nav-item");
        logoutSection.appendChild(a);
        logoutSection.addEventListener("click", (event) => {
            if (confirm("¿Cerrar sesión?")) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('user_name');
                window.location.href = loginPath;
            }
        });

        a.setAttribute("class", "nav-link waves-effect waves-light btn float-right");
        a.appendChild(logout);
        a.appendChild(document.createTextNode('Sign-out'));

        logout.setAttribute("class", "fa fa-sign-out");
        logout.setAttribute("style", "font-size: 18px;");

        return logoutSection;
    }
}
