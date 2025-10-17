const userForm = document.getElementsByClassName("profile-form")[0].querySelector(':nth-child(2)');
const nameInput = document.getElementById("nombre");
const lastnameInput = document.getElementById("apellido");
const userInput = document.getElementById("usuario");
const emailInput = document.getElementById("correo");
const phoneInput = document.getElementById("telefono");
const imgElement = document.getElementById('photo');
const photoInput = document.getElementById("change-photo");
const deleteImage = document.getElementById("delete");


document.addEventListener("DOMContentLoaded", () => {
    userInput.value = sessionStorage.getItem("usuario");
    nameInput.value = localStorage.getItem("nombreUsuario");
    lastnameInput.value = localStorage.getItem("apellidoUsuario");
    emailInput.value = localStorage.getItem("correoUsuario");
    phoneInput.value = localStorage.getItem("telefonoUsuario");

});

photoInput.addEventListener("change", (e) => {
    const file = e.target.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            const imageUrl = event.target.result;

            console.log("cambia foto");
            imgElement.src = imageUrl;

        }

        reader.readAsDataURL(file);
    }
});

deleteImage.addEventListener("click", () => {
    imgElement.src = "img/img_perfil.png";
});

userForm.addEventListener("submit", (e) => {
    e.preventDefault();

    localStorage.setItem("usuario", userInput.value);
    localStorage.setItem("nombreUsuario", nameInput.value);
    localStorage.setItem("apellidoUsuario", lastnameInput.value);
    localStorage.setItem("correoUsuario", emailInput.value);
    localStorage.setItem("telefonoUsuario", phoneInput.value);
})

