document.addEventListener('DOMContentLoaded', () => {
    const productoId = obtenerIdProducto();

    cargarProductoDesdeAPI(productoId);
    cargarComentariosDesdeAPI(productoId);
});

function obtenerIdProducto() {
    const productoId = localStorage.getItem('selectedProductId');
    if (!productoId) return '50921'; // Valor por defecto
    return productoId;
}

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
        img.onerror = () => img.src = 'https://via.placeholder.com/70x70/cccccc/999999?text=Error';

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

// Comentarios desde API
function cargarComentariosDesdeAPI(productoId) {
    const productComentsContainer = document.querySelector(".product-coments");
    productComentsContainer.innerHTML = `<p>Calificaciones del Producto</p>`;

    // Traer comentarios guardados en localStorage
    const comentariosGuardados = JSON.parse(localStorage.getItem(`comments_${productoId}`)) || [];

    comentariosGuardados.forEach(comentario => {
        agregarComentarioAlDOM(comentario.user, comentario.comment, comentario.rating, comentario.date);
    });

    // Traer comentarios de la API también
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
    const productComentsContainer = document.querySelector(".product-coments");
    const nuevoComentario = document.createElement("div");
    nuevoComentario.innerHTML = `
        <div>
            <div class="comment-username">${user}</div>
            <div class="comment-description">${comment}</div>
            <div class="comment-stars">${generarEstrellas(rating)}</div>
            <div class="comment-date">${date}</div>
        </div>`;
    productComentsContainer.appendChild(nuevoComentario);
}

function generarEstrellas(cantidad) {
    let estrellasHtml = '';
    for (let i = 0; i < parseInt(cantidad); i++) {
        estrellasHtml += '<i class="bi bi-star-fill"></i>';
    }
    return estrellasHtml;
}

// Rating y envío de comentario
document.addEventListener("DOMContentLoaded", function() {
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
        star.addEventListener("click", function() {
            currentRating = parseInt(this.getAttribute("data-value"));
            updateStars(currentRating);
        });
        star.addEventListener("mouseover", function() {
            updateStars(parseInt(this.getAttribute("data-value")));
        });
        star.addEventListener("mouseout", function() {
            updateStars(currentRating);
        });
    });

    const commentForm = document.getElementById("commentForm");
    commentForm.addEventListener("submit", function(e) {
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

        alert(`¡Gracias! Calificación de ${currentRating} estrellas enviada.`);

        document.getElementById("commentTextarea").value = "";
        currentRating = 0;
        updateStars(currentRating);
    });
});
