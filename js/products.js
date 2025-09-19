// Redirección a login.html si no hay sesión iniciada  // VERIFICACIÓN DE USUARIO
document.addEventListener('DOMContentLoaded', function() {
	// Verifica si hay un usuario guardado en sessionStorage
	const usuario = sessionStorage.getItem('usuario');
	if (!usuario) {
		window.location.href = 'login.html';
	    return; // Importante: salir si redirige
    }
    loadProducts();
});
//
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
// Función principal para cargar y mostrar productos
function loadProducts() {
    let catId = localStorage.getItem('catID')
    fetch(`https://japceibal.github.io/emercado-api/cats_products/${catId}.json`)
        .then(response => {
            if (!response.ok) throw new Error('Error en la respuesta');
            return response.json();
        })
        .then(data => {
            const productsContainer = document.getElementById('productsContainer');
            productsContainer.innerHTML = `
                <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                    ${data.products.map(createProductCard).join('')}
                </div>
            `;
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
