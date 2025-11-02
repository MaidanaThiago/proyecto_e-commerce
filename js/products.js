let productsArray = [];
const CART_LOCAL_STORAGE_KEY = "carrito_productos"; 

function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem(CART_LOCAL_STORAGE_KEY)) || [];

    const existingProductIndex = cart.findIndex(item => item.id == product.id);

    if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity += 1;
        console.log(`Producto ${product.name} actualizado. Cantidad: ${cart[existingProductIndex].quantity}`);
    } else {
        const itemToAdd = {
            id: product.id,
            name: product.name,
            cost: product.cost,
            currency: product.currency,
            image: product.image,
            quantity: 1 
        };
        cart.push(itemToAdd);
        console.log(`Producto ${product.name} agregado.`);
    }
    
    localStorage.setItem(CART_LOCAL_STORAGE_KEY, JSON.stringify(cart));
}

document.addEventListener('DOMContentLoaded', function () {
    const usuario = sessionStorage.getItem('usuario');
    if (!usuario) {
        window.location.href = 'login.html';
        return;
    }
    loadProducts();

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

    document.addEventListener('click', function(e) {
        if (e.target.closest('.btn-view-details')) {
            const button = e.target.closest('.btn-view-details');
            const productId = button.getAttribute('data-product-id');
            
            localStorage.setItem('selectedProductId', productId);
            window.location.href = 'product-info.html';
            return;
        }
        
       
        if (e.target.closest('.btn-buy-now')) {
            const button = e.target.closest('.btn-buy-now');
            const productId = button.getAttribute('data-product-id');
            
            const product = productsArray.find(p => p.id == productId);

            if (product) {
                addToCart(product);
                
                button.textContent = "¡Agregado!";
                button.classList.remove('btn-buy');
                button.classList.add('btn-success');
                setTimeout(() => {
                    button.textContent = "Comprar";
                    button.classList.remove('btn-success');
                    button.classList.add('btn-buy');
                }, 1000); // 1 segundo de feedback
            } else {
                console.error("Producto no encontrado en el array local.");
            }
            return;
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
    
   
    const productId = product.id; 
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
                        <button class="btn btn-details btn-view-details" data-product-id="${productId}">
                            <i class="bi bi-info-circle icon"></i>Detalles
                        </button>
                        <button class="btn btn-buy btn-buy-now" data-product-id="${productId}">
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
           
            productsArray = data.products;
            showProducts(productsArray);  // Mostrar todos al inicio
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
