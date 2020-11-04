class NavBar {
    constructor(navId, texts, refs, rol, username) {
        this.navId = navId;
        this.texts = texts;
        this.refs = refs;
        this.rol = rol;
        this.username = username;

        let div = document.createElement('div');
        div.setAttribute("class", "collapse navbar-collapse");

        div.appendChild(this.initItems(refs, texts));
        div.appendChild(this.initUserInfo(rol, username));

        document.getElementById(navId).appendChild(div);

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

    initUserInfo(rol, username) {
        let ul = document.createElement('ul');
        ul.setAttribute("class", "navbar-nav ml-auto nav-flex-icons");

        let li1 = document.createElement('li');
        li1.setAttribute("class", "nav-item");
        let a1 = document.createElement('a');
        a1.setAttribute("class", "nav-link waves-effect waves-light mr-2");
        a1.innerHTML = rol;
        li1.appendChild(a1);

        let user = document.createElement('li');
        user.setAttribute("class", "nav-item dropdown");
        let a2 = document.createElement('a');
        a2.setAttribute("class", "nav-link dropdown-toggle");
        a2.innerHTML = username;
        user.appendChild(a2);

        ul.appendChild(li1);
        ul.appendChild(user);

        return ul;
    }
}
