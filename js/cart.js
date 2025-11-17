const CART_ITEMS_CONTAINER_ID = "cart-items-container";
const EMPTY_MESSAGE_ID = "empty-cart-message";
const DETAIL_BOX_ID = "detalle-compra-box";

// Cambiar la clave para que coincida con la usada en otros archivos
const LOCAL_STORAGE_KEY = "cart"; 

function updateTotals() {
    let globalSubtotal = 0;
    let currency = "USD"; 

    document.querySelectorAll(".item-subtotal-value").forEach(subtotalElem => {
        globalSubtotal += parseFloat(subtotalElem.getAttribute("data-subtotal-value") || 0);
        currency = subtotalElem.getAttribute("data-currency") || currency; 
    });
    
    

    document.getElementById("cartSubtotal").textContent = `${currency} ${globalSubtotal.toFixed(2)}`;
    document.getElementById("cartEnvio").textContent = `${currency} ${calcularCostoEnvio(globalSubtotal).toFixed(2)}`; 

    const total = globalSubtotal + calcularCostoEnvio(globalSubtotal);

    document.getElementById("cartTotal").textContent = `${currency} ${total.toFixed(2)}`;
}

function calcularCostoEnvio(precioBase) {
  const radioSeleccionado = document.querySelector('input[name="tipoEnvio"]:checked');

  const factorEnvio = parseFloat(radioSeleccionado.value); 
  
  const costoEnvio = precioBase * factorEnvio;
  
  return costoEnvio;
}

// Añadir función auxiliar de formato
function formatCurrency(value, currency = 'USD') {
	// Acepta número o string numérico
	const num = Number(value) || 0;
	// Formato simple: "USD 1234.00"
	return `${currency} ${num.toFixed(2)}`;
}

function handleQuantityChange(event) {
    const input = event.target;
    let quantity = parseInt(input.value);

    if (isNaN(quantity) || quantity < 1) {
        quantity = 1;
        input.value = 1;
    }

    const card = input.closest(".cart-item-card");
    if (!card) return;

    const unitCost = parseFloat(card.getAttribute("data-unit-cost")) || 0;
    const currency = card.getAttribute("data-currency") || 'USD';
    const productId = card.getAttribute("data-product-id");

    const newSubtotal = unitCost * quantity;

    const subtotalElement = card.querySelector(".item-subtotal-value");
    if (subtotalElement) {
        subtotalElement.textContent = formatCurrency(newSubtotal, currency);
        subtotalElement.setAttribute("data-subtotal-value", String(newSubtotal));
        subtotalElement.setAttribute("data-currency", currency);
    }

    // Actualizar cantidad en el localStorage y totales
    updateLocalStorageQuantity(productId, quantity);
    updateTotals();

    // Forzar actualización del contador después de cambiar cantidad
    window.updateCartCounter && window.updateCartCounter();
}

function updateLocalStorageQuantity(productId, newQuantity) {
    let cart = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
    const index = cart.findIndex(item => item.id == productId);

    if (index !== -1) {
        // Usar qty para mantener consistencia con el resto del código
        cart[index].qty = newQuantity;
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cart));
        
        // Disparar evento storage manualmente para otros listeners
        window.dispatchEvent(new StorageEvent('storage', {
            key: LOCAL_STORAGE_KEY,
            newValue: JSON.stringify(cart),
            storageArea: localStorage
        }));
    }
}

function removeItem(productId) {
    let cart = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
    cart = cart.filter(item => item.id != productId);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cart));

    const cardToRemove = document.querySelector(`.cart-item-card[data-product-id="${productId}"]`);
    if (cardToRemove) {
        cardToRemove.remove();
    }
    
    if (cart.length === 0) {
        showEmptyCart();
    } else {
        updateTotals();
    }
    // Forzar actualización del contador después de eliminar
    window.updateCartCounter && window.updateCartCounter();
    
    // Disparar evento storage manualmente
    window.dispatchEvent(new StorageEvent('storage', {
        key: LOCAL_STORAGE_KEY,
        newValue: JSON.stringify(cart),
        storageArea: localStorage
    }));
}


function createProductCard(productData) {
    // Normalizar datos de entrada (soporta múltiples formatos)
    const id = productData.id || productData.productId;
    const name = productData.title || productData.name || 'Producto';
    const cost = Number(productData.price || productData.cost || productData.unitPrice || 0);
    const currency = productData.currency || 'USD';
    const image = productData.image || productData.img || productData.thumbnail;
    const quantity = Number(productData.qty || productData.quantity || 1);
    
    console.debug('Renderizando producto:', {id, name, cost, quantity}); // Debug
    
    const initialSubtotal = cost * quantity;
    
    return `
        <div class="card p-3 mb-3 cart-item-card" 
             data-unit-cost="${cost}" 
             data-currency="${currency}" 
             data-product-id="${id}"
             style="background-color: var(--color-card-bg); color: var(--color-text);">
            <div class="row g-0 align-items-center">
                
                <div class="col-md-3 me-3">
                    <img src="${image}" alt="${name}" class="img-fluid rounded" style="max-height: 100px; object-fit: cover;">
                </div>
                
                <div class="col-md-8">
                    <h5 class="card-title" style="color: var(--color-text);">${name}</h5>
                    
                    <div class="d-flex justify-content-between align-items-center flex-wrap">
                        <div class="me-3">
                            <span class="text-muted small" style="color: var(--color-text) !important;">Precio: ${currency}</span> 
                            <span class="fw-bold" style="color: var(--color-text) !important;">${cost.toFixed(2)}</span>
                        </div>
                        
                        <div class="d-flex align-items-center me-3 my-1">
                            <span class="text-muted small me-2" style="color: var(--color-text) !important;">Cantidad:</span>
                            <input type="number" class="form-control form-control-sm quantity-input" value="${quantity}" min="1" style="width: 60px;">
                        </div>

                        <div class="my-1">
                            <span class="text-muted small d-block" style="color: var(--color-text) !important;">Subtotal Item:</span>
                            <span class="item-subtotal-value fw-bold" 
                                  data-currency="${currency}" 
                                  data-subtotal-value="${initialSubtotal}"
                                  style="color: var(--color-text) !important;">
                                ${currency} ${initialSubtotal.toFixed(2)}
                            </span>
                        </div>
                        
                        <button class="btn btn-secondary btn-sm remove-item-btn" 
                                data-product-id="${id}"
                                style="background-color: #8b8b8b; border: none; height: 30px;">
                            Borrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderCart(cartItems) {
    const container = document.getElementById(CART_ITEMS_CONTAINER_ID);
    const detailBox = document.getElementById(DETAIL_BOX_ID);
    const messageContainer = document.getElementById(EMPTY_MESSAGE_ID);

    messageContainer.style.display = 'none';
    detailBox.style.display = 'block';

    container.innerHTML = cartItems.map(createProductCard).join('');

    document.querySelectorAll(".quantity-input").forEach(input => {
        // Escuchar input para actualización en tiempo real y change como respaldo
        input.addEventListener('input', handleQuantityChange);
        input.addEventListener('change', handleQuantityChange);
    });
    
    document.querySelectorAll(".remove-item-btn").forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = e.currentTarget.getAttribute('data-product-id');
            removeItem(productId);
        });
    });

    updateTotals();
}

function showEmptyCart() {
    const messageContainer = document.getElementById(EMPTY_MESSAGE_ID);
    const detailBox = document.getElementById(DETAIL_BOX_ID);
    const container = document.getElementById(CART_ITEMS_CONTAINER_ID);

    if (container) container.innerHTML = ""; 
    
    messageContainer.innerHTML = `
        <div class="alert alert-info text-center" role="alert">
            🛒 **Tu carrito está vacío.** Agrega productos para continuar.
        </div>
    `;
    messageContainer.style.display = 'block';
    detailBox.style.display = 'none';
}


async function loadCart() {
    console.debug('Iniciando carga del carrito...'); // Debug
    
    // Intentar leer del localStorage
    let cartItems = null;
    try {
        const cartDataJSON = localStorage.getItem(LOCAL_STORAGE_KEY);
        console.debug('Cart raw data:', cartDataJSON); // Debug
        
        if (cartDataJSON) {
            cartItems = JSON.parse(cartDataJSON);
            // Si es un objeto con propiedad items/products, tomar el array
            if (cartItems && !Array.isArray(cartItems)) {
                cartItems = cartItems.items || cartItems.products || cartItems.cart || null;
            }
        }
    } catch (error) {
        console.error("Error al parsear el carrito:", error);
    }

    if (cartItems && Array.isArray(cartItems) && cartItems.length > 0) {
        console.debug('Carrito encontrado, items:', cartItems.length); // Debug
        renderCart(cartItems);
    } else {
        console.debug('Carrito vacío o inválido'); // Debug
        showEmptyCart();
    }
}

document.addEventListener("DOMContentLoaded", loadCart);

