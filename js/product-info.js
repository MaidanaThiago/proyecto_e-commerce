let producto;

document.addEventListener('DOMContentLoaded', () => {
    const productoId = obtenerIdProducto();

    cargarProductoDesdeAPI(productoId);
    cargarComentariosDesdeAPI(productoId);
    inicializarFormularioComentarios();
});

function obtenerIdProducto() {
    const productoId = localStorage.getItem('selectedProductId');
    if (!productoId) return '50921'; // Valor por defecto
    return productoId;
}

// --------- Producto ---------
async function cargarProductoDesdeAPI(productoId) {
    try {
        mostrarCargando();
        const categorias = [101, 102, 103, 104, 105];
        let product = null;

        for (const categoriaId of categorias) {
            const response = await fetch(`https://japceibal.github.io/emercado-api/cats_products/${categoriaId}.json`);
            const data = await response.json();
            product = data.products.find(p => p.id == productoId);
            if (product) break;
        }

        if (!product) throw new Error('Producto no encontrado');

        producto = product
        actualizarUIProducto(product);
        cargarImagenesProducto(product);
        ocultarCargando();
    } catch (error) {
        console.error('Error al cargar el producto:', error);
        mostrarError('Error al cargar el producto. Intenta nuevamente.');
    }
}

function actualizarUIProducto(product) {
    document.getElementById('productTitle').textContent = product.name;
    document.getElementById('productPrice').textContent = `${product.currency} ${product.cost}`;
    document.getElementById('productSales').textContent = `Vendidos: ${product.soldCount}`;
    document.getElementById('productDescription').textContent = product.description;
}

function cargarImagenesProducto(product) {
    const thumbnailsContainer = document.getElementById('thumbnailsContainer');
    thumbnailsContainer.innerHTML = '';
    const todasLasImagenes = obtenerTodasLasImagenes(product);

    todasLasImagenes.forEach((imagen, index) => {
        const thumbnail = document.createElement('div');
        thumbnail.className = 'thumbnail' + (index === 0 ? ' active' : '');
        thumbnail.onclick = () => cambiarImagen(imagen.url, imagen.alt, thumbnail);

        const img = document.createElement('img');
        img.src = imagen.miniatura;
        img.alt = imagen.alt;
        /*img.onerror = () => img.src = 'https://via.placeholder.com/70x70/cccccc/999999?text=Error';    ---> NOS DABA ERORR */
        img.onerror = () => {
            thumbnail.remove(); // elimina la miniatura si la imagen no existe
        }

        thumbnail.appendChild(img);
        thumbnailsContainer.appendChild(thumbnail);
    });

    if (todasLasImagenes.length > 0) {
        cambiarImagen(todasLasImagenes[0].url, 'Imagen principal');
    } else {
        cambiarImagen('https://via.placeholder.com/600x500/cccccc/999999?text=Imagen+no+disponible', 'Imagen no disponible');
    }
}

function obtenerTodasLasImagenes(product) {
    const imagenes = [];
    const productoId = product.id;

    if (product.image) {
        imagenes.push({ url: product.image, miniatura: product.image, alt: 'Imagen principal del producto' });
    }

    for (let i = 2; i <= 6; i++) {
        const rutaImagen = `img/prod${productoId}_${i}.jpg`;
        imagenes.push({ url: rutaImagen, miniatura: rutaImagen, alt: `Vista ${i} del producto` });
    }

    return imagenes;
}

function cambiarImagen(url, alt, elemento) {
    const mainImage = document.getElementById('mainImage');
    mainImage.style.opacity = '0.5';
    const tempImage = new Image();
    tempImage.src = url;

    tempImage.onload = function () {
        mainImage.src = url;
        mainImage.alt = alt;
        mainImage.style.opacity = '1';
        if (elemento) {
            document.querySelectorAll('.thumbnail').forEach(thumb => thumb.classList.remove('active'));
            elemento.classList.add('active');
        }
    };

    tempImage.onerror = function () {
        mainImage.src = 'https://via.placeholder.com/600x500/cccccc/999999?text=Imagen+no+disponible';
        mainImage.alt = 'Imagen no disponible';
        mainImage.style.opacity = '1';
    };
}

function mostrarCargando() {
    document.getElementById('loadingIndicator').style.display = 'flex';
    document.getElementById('mainImage').style.display = 'none';
}

function ocultarCargando() {
    document.getElementById('loadingIndicator').style.display = 'none';
    document.getElementById('mainImage').style.display = 'block';
}

function mostrarError(mensaje) {
    const loadingElement = document.getElementById('loadingIndicator');
    loadingElement.innerHTML = `<p class="text-danger">${mensaje}</p>`;
}

// --------- Comentarios ---------
function cargarComentariosDesdeAPI(productoId) {
    const comentariosGuardados = JSON.parse(localStorage.getItem(`comments_${productoId}`)) || [];

    comentariosGuardados.forEach(comentario => {
        agregarComentarioAlDOM(comentario.user, comentario.comment, comentario.rating, comentario.date);
    });

    // También cargar los de la API
    const url = `https://japceibal.github.io/emercado-api/products_comments/${productoId}.json`;
    fetch(url)
        .then(res => res.json())
        .then(data => {
            data.forEach(comentario => {
                const fecha = new Date(comentario.dateTime).toLocaleDateString('es-ES');
                agregarComentarioAlDOM(comentario.user, comentario.description, comentario.score, fecha);
            });
        });
}

function agregarComentarioAlDOM(user, comment, rating, date) {
    const commentsList = document.getElementById("commentsList");
    const nuevoComentario = document.createElement("div");
    nuevoComentario.className = "comment-card";
    nuevoComentario.innerHTML = `
        <div class="comment-username">${user}</div>
        <div class="comment-stars">${generarEstrellas(rating)}</div>
        <div class="comment-description">${comment}</div>
        <div class="comment-date">${date}</div>
    `;
    commentsList.prepend(nuevoComentario);
}

function generarEstrellas(cantidad) {
    let estrellasHtml = '';
    for (let i = 0; i < parseInt(cantidad); i++) {
        estrellasHtml += '<i class="bi bi-star-fill"></i>';
    }
    return estrellasHtml;
}

// --------- Formulario de comentario ---------
function inicializarFormularioComentarios() {
    const starContainer = document.querySelector(".star-rating");
    const stars = starContainer.querySelectorAll("i");
    const ratingText = document.getElementById("selectedRatingText");
    let currentRating = 0;

    function updateStars(rating) {
        stars.forEach(star => {
            const starValue = parseInt(star.getAttribute("data-value"));
            if (starValue <= rating) {
                star.classList.add("rated");
                star.classList.remove("bi-star");
                star.classList.add("bi-star-fill");
            } else {
                star.classList.remove("rated");
                star.classList.add("bi-star");
                star.classList.remove("bi-star-fill");
            }
        });
        ratingText.textContent = `${rating}/5`;
    }

    stars.forEach(star => {
        star.addEventListener("click", function () {
            currentRating = parseInt(this.getAttribute("data-value"));
            updateStars(currentRating);
        });
        star.addEventListener("mouseover", function () {
            updateStars(parseInt(this.getAttribute("data-value")));
        });
        star.addEventListener("mouseout", function () {
            updateStars(currentRating);
        });
    });

    const commentForm = document.getElementById("commentForm");
    commentForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const comment = document.getElementById("commentTextarea").value;
        if (currentRating === 0 || comment.trim() === "") {
            alert("Por favor, selecciona una calificación y escribe un comentario.");
            return;
        }

        const fechaActual = new Date().toLocaleDateString('es-ES');
        agregarComentarioAlDOM("Tú", comment, currentRating, fechaActual);

        // Guardar comentario en localStorage
        const productoId = obtenerIdProducto();
        const comentariosGuardados = JSON.parse(localStorage.getItem(`comments_${productoId}`)) || [];
        comentariosGuardados.push({
            user: "Tú",
            comment: comment,
            rating: currentRating,
            date: fechaActual
        });
        localStorage.setItem(`comments_${productoId}`, JSON.stringify(comentariosGuardados));

        document.getElementById("commentTextarea").value = "";
        currentRating = 0;
        updateStars(currentRating);
    });
}


// Sección de productos relacionados

let productsArray = [];

// Redirección a login.html si no hay sesión iniciada
document.addEventListener('DOMContentLoaded', function () {
    const usuario = sessionStorage.getItem('usuario');
    if (!usuario) {
        window.location.href = 'login.html';
        return;
    }
    loadProducts();


    //Event listener para el botón de Detalles
    document.addEventListener('click', function (e) {
        // Para el botón de Detalles
        if (e.target.closest('.btn-view-details')) {
            const button = e.target.closest('.btn-view-details');
            const productId = button.getAttribute('data-product-id');

            localStorage.setItem('selectedProductId', productId);
            window.location.href = 'product-info.html';
            return;
        }
    });
});

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
                    <h5 class="card-title">${product.name}</h5>
                    <div class="price-container">
                        <div class="price">${product.currency} ${product.cost}</div>
                    </div>
                    <div class="btn-container">
                        <button class="btn btn-details btn-view-details" data-product-id="${product.id}">
                            <i class="bi bi-info-circle icon"></i>Detalles
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
            productsArray = productsArray.filter(elemento => elemento.id != obtenerIdProducto()); // Quita del Array el elemento actual de la página de product-info para que no lo muestre en "Productos Relacionados"
            showProducts(productsArray); // Muestra el array de "Productos Relacionados"
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

// Funcionalidad boton "Comprar"

const buyButton = document.getElementById("buy");
buyButton.addEventListener("click", () => {

    localStorage.setItem("nombreProducto", producto.name);
    localStorage.setItem("costoProducto", producto.cost);
    localStorage.setItem("monedaProducto", producto.currency);
    localStorage.setItem("cantidadProducto", 1);
    localStorage.setItem('imagenProducto', producto.image);
    localStorage.setItem("subtotalProducto", producto.cost);

    window.location.href = './cart.html';
});
