function createBody(errorCode) {
    let container = document.createElement('body');
    let img = document.createElement('img');

    container.setAttribute("class", "d-flex justify-content-center align-items-center w-100");
    container.setAttribute("style", "min-height: 100vh;");
    img.setAttribute("src", "./404.jpg");

    container.appendChild(img);

    return container;
}
