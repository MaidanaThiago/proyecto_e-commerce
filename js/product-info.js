// Script para manejar la carga de productos desde la API e imágenes locales
document.addEventListener('DOMContentLoaded', () => {
    // Obtener el ID del producto de localStorage
    const productoId = obtenerIdProducto();

    // Cargar el producto desde la API
    cargarProductoDesdeAPI(productoId);
    cargarComentariosDesdeAPI(productoId);
});

// Función para obtener el ID del producto de localStorage
function obtenerIdProducto() {
    const productoId = localStorage.getItem('selectedProductId');

    if (!productoId) {
        console.error('No se encontró ID de producto en localStorage');
        // Opcional: redirigir a products.html
        // window.location.href = 'products.html';
        return '50921'; // Valor por defecto
    }

    return productoId;
}

// Función principal para cargar producto desde API
async function cargarProductoDesdeAPI(productoId) {
    try {
        mostrarCargando();

        // Buscar el producto en todas las categorías
        const categorias = [101, 102, 103, 104, 105];
        let product = null;

        for (const categoriaId of categorias) {
            try {
                const response = await fetch(`https://japceibal.github.io/emercado-api/cats_products/${categoriaId}.json`);
                const data = await response.json();

                product = data.products.find(p => p.id == productoId);
                if (product) break;
            } catch (error) {
                console.warn(`Error en categoría ${categoriaId}:`, error);
            }
        }

        if (!product) {
            throw new Error('Producto no encontrado');
        }

        // Actualizar la UI con los datos del producto
        actualizarUIProducto(product);

        // Cargar imágenes (primera desde API, resto desde carpeta local)
        cargarImagenesProducto(product);

        // Ocultar indicador de carga
        ocultarCargando();

    } catch (error) {
        console.error('Error al cargar el producto:', error);
        mostrarError('Error al cargar el producto. Intenta nuevamente.');
    }
}

// Función para actualizar la UI con los datos del producto
function actualizarUIProducto(product) {
    // Actualizar información básica
    document.getElementById('productTitle').textContent = product.name;
    document.getElementById('productPrice').textContent = `${product.currency} ${product.cost}`;
    document.getElementById('productSales').textContent = `Vendidos: ${product.soldCount}`;
    document.getElementById('productDescription').textContent = product.description;
}

// Función para cargar imágenes del producto
function cargarImagenesProducto(product) {
    const thumbnailsContainer = document.getElementById('thumbnailsContainer');
    thumbnailsContainer.innerHTML = '';

    // Obtener todas las imágenes (primera de API + adicionales locales)
    const todasLasImagenes = obtenerTodasLasImagenes(product);

    // Crear miniaturas para cada imagen
    todasLasImagenes.forEach((imagen, index) => {
        const thumbnail = document.createElement('div');
        thumbnail.className = 'thumbnail' + (index === 0 ? ' active' : '');
        thumbnail.onclick = () => cambiarImagen(imagen.url, imagen.alt, thumbnail);

        const img = document.createElement('img');
        img.src = imagen.miniatura;
        img.alt = imagen.alt;

        // Manejar errores de carga de imagen
        img.onerror = function () {
            this.src = 'https://via.placeholder.com/70x70/cccccc/999999?text=Error';
        };

        thumbnail.appendChild(img);
        thumbnailsContainer.appendChild(thumbnail);
    });

    // Mostrar primera imagen
    if (todasLasImagenes.length > 0) {
        cambiarImagen(todasLasImagenes[0].url, 'Imagen principal');
    } else {
        // Si no hay imágenes, mostrar placeholder
        cambiarImagen('https://via.placeholder.com/600x500/cccccc/999999?text=Imagen+no+disponible', 'Imagen no disponible');
    }
}

// Función para obtener todas las imágenes (API + locales)
function obtenerTodasLasImagenes(product) {
    const imagenes = [];
    const productoId = product.id;

    // 1. Agregar la imagen principal de la API
    if (product.image) {
        imagenes.push({
            url: product.image,
            miniatura: product.image,
            alt: 'Imagen principal del producto'
        });
    }

    // 2. Agregar imágenes adicionales desde la carpeta local
    // Suponemos que hay hasta 6 imágenes adicionales (2-6)
    for (let i = 2; i <= 6; i++) {
        const rutaImagen = `img/prod${productoId}_${i}.jpg`;
        imagenes.push({
            url: rutaImagen,
            miniatura: rutaImagen,
            alt: `Vista ${i} del producto`
        });
    }

    return imagenes;
}

// Función para cambiar la imagen principal
function cambiarImagen(url, alt, elemento) {
    const mainImage = document.getElementById('mainImage');

    // Mostrar loader mientras carga la nueva imagen
    mainImage.style.opacity = '0.5';

    // Crear una imagen temporal para precargar
    const tempImage = new Image();
    tempImage.src = url;

    tempImage.onload = function () {
        // Cuando la imagen se carga correctamente
        mainImage.src = url;
        mainImage.alt = alt;
        mainImage.style.opacity = '1';

        // Actualizar miniaturas activas si se hizo clic en una
        if (elemento) {
            document.querySelectorAll('.thumbnail').forEach(thumb => {
                thumb.classList.remove('active');
            });
            elemento.classList.add('active');
        }
    };

    tempImage.onerror = function () {
        // Si hay error al cargar la imagen
        mainImage.src = 'https://via.placeholder.com/600x500/cccccc/999999?text=Imagen+no+disponible';
        mainImage.alt = 'Imagen no disponible';
        mainImage.style.opacity = '1';
    };
}

// Función para mostrar estado de carga
function mostrarCargando() {
    document.getElementById('loadingIndicator').style.display = 'flex';
    document.getElementById('mainImage').style.display = 'none';
}

// Función para ocultar estado de carga
function ocultarCargando() {
    document.getElementById('loadingIndicator').style.display = 'none';
    document.getElementById('mainImage').style.display = 'block';
}

// Función para mostrar errores
function mostrarError(mensaje) {
    const loadingElement = document.getElementById('loadingIndicator');
    loadingElement.innerHTML = `<p class="text-danger">${mensaje}</p>`;
}

//Cargar comentarios
function cargarComentariosDesdeAPI(productoId) {
    const url = `https://japceibal.github.io/emercado-api/products_comments/${productoId}.json`
    const productComentsContainer = document.getElementsByClassName("product-coments")[0];
    fetch(url)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            if (data.length > 0) {
                for (comentario of data) {
                    let fecha = new Date(comentario.dateTime).toLocaleDateString('es-ES');

                    productComentsContainer.innerHTML += `
                    <div>
                        <div class = "comment-username">${comentario.user}</div>
                        <div class = "comment-description">${comentario.description}</div>
                        <div class = "comment-stars">${generarEstrellas(comentario.score)}</div>
                        <div class = "comment-date">${fecha}</div>
                    </div>`;
                }
            } else {
                productComentsContainer.innerHTML += `<p>Aún no hay calificaciones para este producto.</p>`
            }

        });
}

// Función para generar los iconos de estrellas
function generarEstrellas(cantidad) {
    let estrellasHtml = '';
    // Itera 'cantidad' de veces para crear un icono de estrella
    for (let i = 0; i < parseInt(cantidad); i++) {
        // Usamos la clase de Bootstrap Icons 'bi-star-fill'
        estrellasHtml += '<i class="bi bi-star-fill"></i>';
    }
    return estrellasHtml;
}
document.addEventListener("DOMContentLoaded", function() {
    const starContainer = document.querySelector(".star-rating");
    const stars = starContainer.querySelectorAll("i");
    const ratingText = document.getElementById("selectedRatingText");
    let currentRating = 0; // Almacena la calificación actual seleccionada

    // Función para actualizar el color de las estrellas
    function updateStars(rating) {
        stars.forEach(star => {
            const starValue = parseInt(star.getAttribute("data-value"));
            if (starValue <= rating) {
                star.classList.add("rated");
                star.classList.remove("bi-star");
                star.classList.add("bi-star-fill"); // Usar estrella rellena
            } else {
                star.classList.remove("rated");
                star.classList.add("bi-star");
                star.classList.remove("bi-star-fill"); // Usar estrella vacía
            }
        });
        ratingText.textContent = `${rating}/5`;
    }

    // Evento de click para fijar la calificación
    stars.forEach(star => {
        star.addEventListener("click", function() {
            currentRating = parseInt(this.getAttribute("data-value"));
            updateStars(currentRating);
        });

        // Evento hover (entrada) para previsualizar la calificación
        star.addEventListener("mouseover", function() {
            const hoverRating = parseInt(this.getAttribute("data-value"));
            updateStars(hoverRating);
        });

        // Evento hover (salida) para volver a la calificación seleccionada
        star.addEventListener("mouseout", function() {
            updateStars(currentRating);
        });
    });

    const commentForm = document.getElementById("commentForm");
    commentForm.addEventListener("submit", function(e) {
        e.preventDefault();
        const comment = document.getElementById("commentTextarea").value;
        
        if (currentRating === 0) {
            alert("Por favor, selecciona una calificación (1-5 estrellas).");
            return;
        }

    
        console.log(`Calificación enviada: ${currentRating} estrellas. Comentario: "${comment}"`);
        alert(`¡Gracias! Calificación de ${currentRating} estrellas enviada.`);

        // Resetear el formulario después del envío exitoso
        document.getElementById("commentTextarea").value = "";
        currentRating = 0;
        updateStars(currentRating);
    });
});
