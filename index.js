const btnCart = document.querySelector ('.container-icon')

const containerCardProducts = document.querySelector('.container-card-products')

btnCart.addEventListener('click', ()=>{
    containerCardProducts.classList.toggle('hidden-cart')
}
)