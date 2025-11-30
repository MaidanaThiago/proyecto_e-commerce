const userForm = document.getElementsByClassName("profile-form")[0].querySelector(':nth-child(2)');
const nameInput = document.getElementById("nombre");
const lastnameInput = document.getElementById("apellido");
const userInput = document.getElementById("usuario");
const emailInput = document.getElementById("correo");
const phoneInput = document.getElementById("telefono");
const imgElement = document.getElementById('photo');
const photoInput = document.getElementById("change-photo");
const deleteImage = document.getElementById("delete");

// Verificar autenticación
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        sessionStorage.setItem('redirectAfterLogin', window.location.href);
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Cargar datos del usuario
document.addEventListener("DOMContentLoaded", () => {
    if (!checkAuth()) return;

    // Obtener datos del usuario desde localStorage
    const userDataStr = localStorage.getItem('user');
    if (userDataStr) {
        try {
            const userData = JSON.parse(userDataStr);
            
            // Cargar datos en el formulario
            userInput.value = userData.username || '';
            emailInput.value = userData.email || '';
            
            // Cargar datos adicionales si existen
            const profileData = localStorage.getItem('profileData');
            if (profileData) {
                const profile = JSON.parse(profileData);
                nameInput.value = profile.nombre || '';
                lastnameInput.value = profile.apellido || '';
                phoneInput.value = profile.telefono || '';
                
                if (profile.photo) {
                    imgElement.src = profile.photo;
                }
            }
        } catch (error) {
            console.error('Error al cargar datos del usuario:', error);
        }
    }
});

// Cambiar foto de perfil
photoInput.addEventListener("change", (e) => {
    const file = e.target.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            const imageUrl = event.target.result;
            imgElement.src = imageUrl;
        }
        reader.readAsDataURL(file);
    }
});

// Eliminar foto de perfil
deleteImage.addEventListener("click", () => {
    imgElement.src = "img/img_perfil.png";
});

// Guardar cambios del perfil
userForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Guardar datos del perfil
    const profileData = {
        nombre: nameInput.value,
        apellido: lastnameInput.value,
        telefono: phoneInput.value,
        photo: imgElement.src
    };

    localStorage.setItem("profileData", JSON.stringify(profileData));
    
    // Actualizar datos del usuario
    const userDataStr = localStorage.getItem('user');
    if (userDataStr) {
        const userData = JSON.parse(userDataStr);
        userData.username = userInput.value;
        userData.email = emailInput.value;
        localStorage.setItem('user', JSON.stringify(userData));
        sessionStorage.setItem('usuario', userData.username);
    }

    alert('Perfil actualizado correctamente');
});

