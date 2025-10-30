document.addEventListener("DOMContentLoaded", function(){
    // Redirección a login.html si no hay sesión iniciada
    const usuario = sessionStorage.getItem('usuario');
    if (!usuario) {
        sessionStorage.setItem('redirectAfterLogin', window.location.pathname.split('/').pop());
        window.location.href = 'login.html';
        return;
    }
    document.getElementById("autos").addEventListener("click", function() {
        localStorage.setItem("catID", 101);
        window.location = "products.html"
    });
    document.getElementById("juguetes").addEventListener("click", function() {
        localStorage.setItem("catID", 102);
        window.location = "products.html"
    });
    document.getElementById("muebles").addEventListener("click", function() {
        localStorage.setItem("catID", 103);
        window.location = "products.html"
    });
});
