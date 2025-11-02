const CART_ITEMS_CONTAINER_ID = "cart-items-container";
const EMPTY_MESSAGE_ID = "empty-cart-message";
const DETAIL_BOX_ID = "detalle-compra-box";

const LOCAL_STORAGE_KEY = "carrito_productos"; 

function updateTotals() {
    let globalSubtotal = 0;
    let currency = "USD"; 

    document.querySelectorAll(".item-subtotal-value").forEach(subtotalElem => {
        globalSubtotal += parseFloat(subtotalElem.getAttribute("data-subtotal-value") || 0);
        currency = subtotalElem.getAttribute("data-currency") || currency; 
    });
    
    const total = globalSubtotal;

    document.getElementById("cartSubtotal").textContent = `${currency} ${globalSubtotal.toFixed(2)}`;
    document.getElementById("cartEnvio").textContent = `Free`; 
    document.getElementById("cartTarifa").textContent = `---`; 
    document.getElementById("cartTotal").textContent = `${currency} ${total.toFixed(2)}`;
}

function handleQuantityChange(event) {
    const input = event.target;
    let quantity = parseInt(input.value);
    
    if (isNaN(quantity) || quantity < 1) {
        quantity = 1;
        input.value = 1;
    }

    const card = input.closest(".cart-item-card");
    const unitCost = parseFloat(card.getAttribute("data-unit-cost"));
    const currency = card.getAttribute("data-currency");
    const productId = card.getAttribute("data-product-id");
    
    const newSubtotal = unitCost * quantity;

    const subtotalElement = card.querySelector(".item-subtotal-value");
    subtotalElement.textContent = `${currency} ${newSubtotal.toFixed(2)}`;
    subtotalElement.setAttribute("data-subtotal-value", newSubtotal);

    updateTotals();
    updateLocalStorageQuantity(productId, quantity);
}

function updateLocalStorageQuantity(productId, newQuantity) {
    let cart = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
    const index = cart.findIndex(item => item.id == productId);

    if (index !== -1) {
        cart[index].quantity = newQuantity;
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cart));
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
}


function createProductCard(productData) {
    const { id, name, cost, currency, image, quantity } = productData;
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
        input.addEventListener('input', handleQuantityChange);
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
    const cartDataJSON = localStorage.getItem(LOCAL_STORAGE_KEY);
    
    if (cartDataJSON) {
        try {
            const cartItems = JSON.parse(cartDataJSON);
            
            if (cartItems && cartItems.length > 0) {
                renderCart(cartItems); 
            } else {
                showEmptyCart();
            }
        } catch (error) {
            console.error("Error al parsear el carrito de localStorage:", error);
            showEmptyCart();
        }
    } else {
        showEmptyCart();
    }
}

document.addEventListener("DOMContentLoaded", loadCart);