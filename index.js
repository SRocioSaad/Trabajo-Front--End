const btnCart = document.querySelector('.container-icon');
const containerCardProducts = document.querySelector('.container-card-products');

// 1. Abrir / Cerrar el carrito al hacer clic en el ícono superior
btnCart.addEventListener('click', (e) => {
    e.stopPropagation();
    containerCardProducts.classList.toggle('hidden-cart');
});

// 2. Controlar los clics adentro del carrito
if (containerCardProducts) {
    containerCardProducts.addEventListener('click', (e) => {
        e.stopPropagation(); // Evita que se cierre al hacer clic adentro

        // 3. Si hacés clic en la cruz, eliminar ese producto
        if (e.target.closest('.icon-close')) {
            const productElement = e.target.closest('.cart-product');
            if (productElement) {
                productElement.remove(); // Borra el producto
                
                // Verificamos si ya no quedan productos en el carrito
                const remainingProducts = containerCardProducts.querySelectorAll('.cart-product');
                if (remainingProducts.length === 0) {
                    // Si está vacío, cerramos el carrito automáticamente y ocultamos la caja
                    containerCardProducts.classList.add('hidden-cart');
                }
            }
        }
    });
}

// 4. Cerrar el carrito si hacés clic en cualquier otra parte de la página
window.addEventListener('click', () => {
    if (containerCardProducts && !containerCardProducts.classList.contains('hidden-cart')) {
        containerCardProducts.classList.add('hidden-cart');
    }
});