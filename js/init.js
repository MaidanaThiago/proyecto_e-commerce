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