let productsArray = [];

// Redirección a login.html si no hay sesión iniciada
document.addEventListener('DOMContentLoaded', function () {
    const usuario = sessionStorage.getItem('usuario');
    if (!usuario) {
        window.location.href = 'login.html';
        return;
    }
    loadProducts();

    // Filtro de precios
    const filterBtn = document.getElementById('filterPriceBtn');
    if (filterBtn) {
        filterBtn.addEventListener('click', function () {
            const min = parseFloat(document.getElementById('filterPriceMin').value) || 0;
            const max = parseFloat(document.getElementById('filterPriceMax').value) || Infinity;
            arrayFiltrado = productsArray.filter(product => product.cost >= min && product.cost <= max);
            showProducts(arrayFiltrado);
        });
    }

const buscador = document.getElementById('buscador');
buscador.addEventListener('input', function() {
    const textoBusqueda = buscador.value.toLowerCase();
    const arrayFiltrado = [];

    productsArray.forEach(articulo => {
        const titulo = articulo.name.toLowerCase();
        const descripcion = articulo.description.toLowerCase();

        if (titulo.includes(textoBusqueda) || descripcion.includes(textoBusqueda)) {
            arrayFiltrado.push(articulo);
        }
    });

    showProducts(arrayFiltrado);
});

    //Event listener para el botón de Detalles
    document.addEventListener('click', function(e) {
        // Para el botón de Detalles
        if (e.target.closest('.btn-view-details')) {
            const button = e.target.closest('.btn-view-details');
            const productId = button.getAttribute('data-product-id');
            
            localStorage.setItem('selectedProductId', productId);
            window.location.href = 'product-info.html';
            return;
        }
        
        // Para el botón de Comprar (opcional)
        if (e.target.closest('.btn-buy-now')) {
            const button = e.target.closest('.btn-buy-now');
            const productId = button.getAttribute('data-product-id');
            console.log('Comprar producto:', productId);
            // addToCart(productId);
        }
    });
});

// Ordenar tarjetas
const orderSelect = document.getElementById('orderProducts');
if (orderSelect) {

    orderSelect.addEventListener("change", (e) => {
        if (e.target.value == 'priceAsc') {
            productsArray.sort(function (a, b) {
                if (a.cost < b.cost) return -1;
                if (a.cost > b.cost) return 1;
                return 0;
            });

        } else if (e.target.value == 'priceDes') {
            productsArray.sort(function (a, b) {
                if (a.cost > b.cost) return -1;
                if (a.cost < b.cost) return 1;
                return 0;
            });
        } else if (e.target.value == 'relevance') {
            productsArray.sort(function (a, b) {
                if (a.soldCount > b.soldCount) return -1;
                if (a.soldCount < b.soldCount) return 1;
                return 0;
            });
        }
        showProducts(productsArray);
    });
}

function createProductCard(product) {
    const nameParts = product.name.split(' ');
    const title = nameParts[0];
    const subtitle = nameParts.slice(1).join(' ');
    return `
        <div class="col">
            <div class="card-product">
                <div class="card-img-container">
                    <img src="${product.image || 'img/placeholder.jpg'}" class="card-img-top" alt="${product.name}">
                </div>
                <div class="card-body">
                    <h5 class="card-title">${title}</h5>
                    <h6 class="card-subtitle">${subtitle}</h6>
                    <p class="card-text">${product.description}</p>
                    <div class="price-container">
                        <div class="price">${product.currency} ${product.cost}</div>
                        <div class="sales">Vendidos: ${product.soldCount}</div>
                    </div>
                    <div class="btn-container">
                        <button class="btn btn-details btn-view-details" data-product-id="${product.id}">
                            <i class="bi bi-info-circle icon"></i>Detalles
                        </button>
                        <button class="btn btn-buy btn-buy-now" data-product-id="${product.id}">
                            <i class="bi bi-cart3 icon"></i>Comprar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function showProducts(products) {
    const productsContainer = document.getElementById('productsContainer');
    productsContainer.innerHTML = `
        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            ${products.map(createProductCard).join('')}
        </div>
    `;
}

// Función principal para cargar y mostrar productos
function loadProducts() {
    let catId = localStorage.getItem('catID')
    fetch(`https://japceibal.github.io/emercado-api/cats_products/${catId}.json`)
        .then(response => {
            if (!response.ok) throw new Error('Error en la respuesta');
            return response.json();
        })
        .then(data => {
            productsArray = data.products; // Guardar productos en variable global
            showProducts(productsArray);   // Mostrar todos al inicio
        })
        .catch(error => {
            console.error('Error cargando productos:', error);
            document.getElementById('productsContainer').innerHTML = `
                <div class="col-12 text-center">
                    <p class="text-danger">Error al cargar los productos: ${error.message}</p>
                </div>
            `;
        });
}
// Array para guardar los productos


// Función para mostrar la lista de productos
function showProductsList(array) {
    let htmlContentToAppend = "";

    if (array.length === 0) {
        htmlContentToAppend = `<h4>No se encontraron productos en esta categoría.</h4>`;
    } else {
        for (let i = 0; i < array.length; i++) {
            let product = array[i];
            htmlContentToAppend += `
            <div class="list-group-item list-group-item-action">
                <div class="row">
                    <div class="col-3">
                        <img src="${product.imgSrc}" alt="product image" class="img-thumbnail">
                    </div>
                    <div class="col">
                        <div class="d-flex w-100 justify-content-between">
                            <div class="mb-1">
                                <h4>${product.name} - ${product.currency} ${product.cost}</h4>
                                <p>${product.description}</p>
                            </div>
                            <small class="text-muted">${product.soldCount} artículos</small>
                        </div>
                    </div>
                </div>
            </div>
            `;
        }
    }

    document.getElementById("cat-list-container").innerHTML = htmlContentToAppend;
}

// Cuando el documento se carga
document.addEventListener("DOMContentLoaded", function () {
    // Obtiene el ID de la categoría del almacenamiento local
    const catID = localStorage.getItem("catID");

    if (!catID) {
        // Si no hay categoría seleccionada, muestra un mensaje de error
        document.getElementById("cat-list-container").innerHTML =
            `<h4 class="text-danger">No se encontró ninguna categoría seleccionada.</h4>`;
        return;
    }

    // Construye la URL usando el ID dinámico
    const URL_COMPLETA = PRODUCTS_URL + catID + EXT_TYPE;

    // Hace la solicitud y carga los productos
    getJSONData(URL_COMPLETA).then(function (resultObj) {
        if (resultObj.status === "ok") {
            productsArray = resultObj.data.products;
            showProductsList(productsArray);
        } else {
            document.getElementById("cat-list-container").innerHTML =
                `<h4 class="text-danger">Error al cargar los productos.</h4>`;
        }
    });
});