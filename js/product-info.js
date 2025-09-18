// Script para manejar la carga de productos desde la API e imágenes locales
document.addEventListener('DOMContentLoaded', () => {
    // Obtener el ID del producto de la URL
    const productoId = obtenerIdProducto();
    
    // Cargar el producto desde la API
    cargarProductoDesdeAPI(productoId);
});

// Función para obtener el ID del producto de la URL
function obtenerIdProducto() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id') || '50921'; // Valor por defecto
}

// Función principal para cargar producto desde API
async function cargarProductoDesdeAPI(productoId) {
    try {
        mostrarCargando();
        
        // Cargar datos de la API
        const response = await fetch('https://japceibal.github.io/emercado-api/cats_products/101.json');
        const data = await response.json();
        
        // Buscar el producto específico por ID
        const product = data.products.find(p => p.id == productoId) || data.products[0];
        
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
        img.onerror = function() {
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
    
    tempImage.onload = function() {
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
    
    tempImage.onerror = function() {
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