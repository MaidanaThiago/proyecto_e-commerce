
// Guardar usuario en sessionStorage al hacer login y redirigir a products.html
document.addEventListener('DOMContentLoaded', function() {
	const form = document.querySelector('form');
	if (form) {
		form.addEventListener('submit', function(e) {
			e.preventDefault();
			const username = document.getElementById('username').value.trim();
			const password = document.getElementById('password').value.trim();
			if (username && password) {
				sessionStorage.setItem('usuario', username);
				window.location.href = 'products.html';
			} else {
				alert('Por favor, complete usuario y contraseña.');
			}
		});
	}
});


function redireccion(event) {
  event.preventDefault(); 
  window.location.href = "categories.html";
}
function redireccion(event) {
  event.preventDefault();
  const usuario = document.getElementById("username").value.trim();
  const contraseña = document.getElementById("password").value.trim();


  if(usuario === "" || contraseña === ""){
    alert("Todos los campos son obligatorios");
  }else{
  window.location.href = "categories.html";
  }
}


