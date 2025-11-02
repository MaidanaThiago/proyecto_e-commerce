const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json";
const PUBLISH_PRODUCT_URL = "https://japceibal.github.io/emercado-api/sell/publish.json";
const PRODUCTS_URL = "https://japceibal.github.io/emercado-api/cats_products/";
const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/";
const PRODUCT_INFO_COMMENTS_URL = "https://japceibal.github.io/emercado-api/products_comments/";
const CART_INFO_URL = "https://japceibal.github.io/emercado-api/user_cart/";
const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy.json";
const EXT_TYPE = ".json";

let showSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "block";
}

let hideSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "none";
}

let getJSONData = function(url){
    let result = {};
    showSpinner();
    return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }else{
        throw Error(response.statusText);
      }
    })
    .then(function(response) {
          result.status = 'ok';
          result.data = response;
          hideSpinner();
          return result;
    })
    .catch(function(error) {
        result.status = 'error';
        result.data = error;
        hideSpinner();
        return result;
    });
}
/*DESAFIATE! agregar en la esquina derecha el nombre del usuario ingresado*/
document.addEventListener('DOMContentLoaded', function () {
  const usuario = sessionStorage.getItem('usuario');
  if (!usuario) return;

  const navList = document.querySelector('nav .navbar-nav');
  if (!navList) return;

  if (!document.getElementById('nav-username')) {
    const li = document.createElement('li');
    li.className = 'nav-item ms-auto';
    const a = document.createElement('a');
    a.className = 'nav-link';
    a.id = 'nav-username';
    a.textContent = usuario;
    a.href = '#';
    li.appendChild(a);
    navList.appendChild(li);
  }
});


const LIGHT_MODE_KEY = 'lightModeEnabled';

function applyLightMode(isEnabled) {
    const body = document.body;
    const iconLeft = document.getElementById('darkModeIcon');
    const toggleRight = document.getElementById('darkModeToggleRight');
    
    if (isEnabled) {
        body.classList.add('light-mode');
        // Icono izquierdo cambia a Luna (para indicar que se puede volver a oscuro)
        if (iconLeft) iconLeft.classList.replace('bi-sun-fill', 'bi-moon-fill');
        if (toggleRight) toggleRight.checked = true;
        localStorage.setItem(LIGHT_MODE_KEY, 'true');
    } else {
        body.classList.remove('light-mode');
        // Icono izquierdo cambia a Sol (para indicar que se puede volver a claro)
        if (iconLeft) iconLeft.classList.replace('bi-moon-fill', 'bi-sun-fill');
        if (toggleRight) toggleRight.checked = false;
        localStorage.setItem(LIGHT_MODE_KEY, 'false');
    }
}

function toggleMode() {
    const isLightEnabled = document.body.classList.contains('light-mode');
    applyLightMode(!isLightEnabled);
}


document.addEventListener('DOMContentLoaded', function () {
    const savedPreference = localStorage.getItem(LIGHT_MODE_KEY);
    const initialMode = savedPreference === 'true'; 
    applyLightMode(initialMode);
    
    const toggleButtonLeft = document.getElementById('darkModeToggle');
    const toggleButtonRight = document.getElementById('darkModeToggleRight');
    
    if (toggleButtonLeft) {
        toggleButtonLeft.addEventListener('click', toggleMode);
    }
    if (toggleButtonRight) {
        toggleButtonRight.addEventListener('click', toggleMode);
    }
    
    const userName = sessionStorage.getItem('usuario');
    const userNameText = document.getElementById('userNameText');
    
    if (userName && userNameText) {
        userNameText.textContent = userName;
    }

    document.getElementById('logoutBtn')?.addEventListener('click', function() {
        sessionStorage.removeItem('usuario');
        window.location.href = 'login.html'; 
    });
});