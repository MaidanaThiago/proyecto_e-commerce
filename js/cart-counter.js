function updateCartCounter() {
    const counter = document.getElementById('cart-counter');
    if (!counter) return;

    let count = 0;
    try {
        const cartData = localStorage.getItem('cart');
        if (cartData) {
            const cart = JSON.parse(cartData);
            if (Array.isArray(cart)) {
                count = cart.reduce((sum, item) => sum + (Number(item.qty || item.quantity) || 1), 0);
            }
        }
    } catch (e) {
        console.error('Error al leer carrito:', e);
    }

    counter.textContent = count || '';
    counter.style.display = count ? 'block' : 'none';
}

// Exponer globalmente
window.updateCartCounter = updateCartCounter;

// Actualizar al cargar
document.addEventListener('DOMContentLoaded', updateCartCounter);
