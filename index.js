const linkInicio = document.querySelector('a[href="#inicio"]');

if (linkInicio) {
    linkInicio.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

const btnCart = document.querySelector('.container-icon');
const containerCardProducts = document.querySelector('.container-card-products');
const productosSection = document.querySelector('.container-items');

const listaCarrito = document.querySelector('#lista-carrito');
const contadorProductos = document.querySelector('#contador-productos');
const totalPagar = document.querySelector('.total-pagar');
const textoVacio = document.querySelector('.carrito-vacio');
const carritoFooter = document.querySelector('.carrito-footer');

const btnVaciar = document.querySelector('#vaciar-carrito');
const btnFinalizar = document.querySelector('#btn-finalizar');
const seccionCheckout = document.querySelector('#seccion-checkout');
const formCheckout = document.querySelector('#form-checkout');
const mensajeGracias = document.querySelector('#mensaje-gracias');

const STORAGE_KEY = 'todoMatienzoCarrito';

function cargarCarritoDesdeStorage() {
    try {
        const datosGuardados = localStorage.getItem(STORAGE_KEY);
        if (!datosGuardados) return [];

        const parsed = JSON.parse(datosGuardados);
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.error('Error al leer el carrito desde localStorage:', error);
        return [];
    }
}

function guardarCarritoEnStorage(estadoCarrito) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(estadoCarrito));
    } catch (error) {
        console.error('Error al guardar el carrito en localStorage:', error);
    }
}

let carrito = cargarCarritoDesdeStorage();

// Abrir / cerrar carrito desde el ícono superior
if (btnCart && containerCardProducts) {
    btnCart.addEventListener('click', (e) => {
        e.stopPropagation();
        containerCardProducts.classList.toggle('hidden-cart');
    });
}

// Evitar que hacer clic adentro del carrito lo cierre
if (containerCardProducts) {
    containerCardProducts.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}

// Cerrar carrito al hacer clic fuera
window.addEventListener('click', () => {
    if (containerCardProducts && !containerCardProducts.classList.contains('hidden-cart')) {
        containerCardProducts.classList.add('hidden-cart');
    }
});

// 1. Añadir producto al carrito desde las tarjetas
if (productosSection) {
    productosSection.addEventListener('click', (e) => {
        const boton = e.target.closest('.info-producto button');
        if (!boton) return;

        const card = boton.closest('.item');
        if (!card) return;

        const titulo = card.querySelector('h2')?.textContent.trim() || 'Producto';
        const precioTexto = card.querySelector('.precio')?.textContent.trim() || '$0';
        const precio = parseFloat(precioTexto.replace(/[^0-9]/g, '')) || 0;

        const productoExistente = carrito.find((item) => item.titulo === titulo);

        if (productoExistente) {
            productoExistente.cantidad += 1;
        } else {
            carrito.push({
                titulo,
                precio,
                cantidad: 1
            });
        }

        mensajeGracias?.classList.add('hidden');
        actualizarCarrito();
    });
}

//  Sumar, restar o eliminar unidad dentro del carrito
if (listaCarrito) {
    listaCarrito.addEventListener('click', (e) => {
        const fila = e.target.closest('.cart-product');
        if (!fila) return;

        const titulo = fila.dataset.titulo;
        const index = carrito.findIndex((item) => item.titulo === titulo);
        if (index === -1) return;

        if (e.target.closest('.btn-sumar')) {
            carrito[index].cantidad += 1;
        } else if (e.target.closest('.btn-restar')) {
            carrito[index].cantidad -= 1;
            if (carrito[index].cantidad <= 0) {
                carrito.splice(index, 1);
            }
        } else if (e.target.closest('.icon-close')) {
            carrito.splice(index, 1);
        }

        actualizarCarrito();
    });
}

// Vaciar carrito
if (btnVaciar) {
    btnVaciar.addEventListener('click', () => {
        carrito = [];
        seccionCheckout?.classList.add('hidden');
        actualizarCarrito();
    });
}

// Mostrar sección para finalizar compra
if (btnFinalizar) {
    btnFinalizar.addEventListener('click', () => {
        if (carrito.length === 0) return;
        seccionCheckout?.classList.remove('hidden');
        mensajeGracias?.classList.add('hidden');
    });
}

if (formCheckout) {
    formCheckout.addEventListener('submit', (e) => {
        e.preventDefault();
        if (carrito.length === 0) return;

        carrito = [];
        formCheckout.reset();
        seccionCheckout?.classList.add('hidden');
        mensajeGracias?.classList.remove('hidden');
        actualizarCarrito();
    });
}

function actualizarCarrito() {
    if (!listaCarrito) return;

    listaCarrito.innerHTML = '';

    let totalUnidades = 0;
    let totalPrecio = 0;

    carrito.forEach((item) => {
        const cantidad = Number(item.cantidad) || 0;
        const precioUnitario = Number(item.precio) || 0;

        totalUnidades += cantidad;
        totalPrecio += precioUnitario * cantidad;

        const div = document.createElement('div');
        div.classList.add('cart-product');
        div.dataset.titulo = item.titulo;

        div.innerHTML = `
            <div class="info-cart-product">
                <p class="titulo-producto-carrito">${item.titulo}</p>
                <span class="precio-producto-carrito">$${precioUnitario * cantidad}</span>
            </div>
            <div class="controles-cantidad">
                <button type="button" class="btn-cantidad btn-restar">-</button>
                <span class="numero-cantidad">${cantidad}</span>
                <button type="button" class="btn-cantidad btn-sumar">+</button>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon-close">
                <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
        `;

        listaCarrito.appendChild(div);
    });

    if (contadorProductos) {
        contadorProductos.textContent = totalUnidades;
    }

    if (totalPagar) {
        totalPagar.textContent = `$${totalPrecio}`;
    }

    if (carrito.length === 0) {
        textoVacio?.classList.remove('hidden');
        carritoFooter?.classList.add('hidden');
        seccionCheckout?.classList.add('hidden');
    } else {
        textoVacio?.classList.add('hidden');
        carritoFooter?.classList.remove('hidden');
    }

    guardarCarritoEnStorage(carrito);
}


actualizarCarrito();

const inputBuscador = document.querySelector('.buscador input');
const tarjetasProductos = document.querySelectorAll('.container-items .item');

function normalizarTexto(texto) {
    return texto
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim();
}

// Verifica si alguna palabra  del texto coincide con el término buscado
function coincidePalabraExacta(textoProducto, terminoBuscado) {
    const palabras = normalizarTexto(textoProducto).split(/[^a-z0-9]+/).filter(Boolean);
    return palabras.some((p) => p.startsWith(terminoBuscado));
}

if (inputBuscador && tarjetasProductos.length > 0) {
    inputBuscador.addEventListener('input', (e) => {
        const consulta = normalizarTexto(e.target.value);

        tarjetasProductos.forEach((card) => {
            if (!consulta) {
                card.style.display = '';
                return;
            }

            const titulo = card.querySelector('.info-producto h2')?.textContent || '';
            const esCoincidencia = coincidePalabraExacta(titulo, consulta);

            card.style.display = esCoincidencia ? '' : 'none';
        });
    });
}

// --- CARRUSEL AUTOMÁTICO CADA 5 SEGUNDOS ---
const slides = document.querySelectorAll('.hero-promos .slide');
const dots = document.querySelectorAll('.hero-promos .dot');
const btnPrev = document.querySelector('.hero-promos .prev');
const btnNext = document.querySelector('.hero-promos .next');

let slideActual = 0;
let intervaloSlider;

function mostrarSlide(indice) {
    if (slides.length === 0) return;

    slideActual = (indice + slides.length) % slides.length;

    slides.forEach((s, i) => s.classList.toggle('activo', i === slideActual));
    dots.forEach((d, i) => d.classList.toggle('activo', i === slideActual));
}

function iniciarAutoplay() {
    clearInterval(intervaloSlider);
    intervaloSlider = setInterval(() => {
        mostrarSlide(slideActual + 1);
    }, 5000); // 5000 ms = 5 segundos
}

if (slides.length > 0) {
    btnNext?.addEventListener('click', () => {
        mostrarSlide(slideActual + 1);
        iniciarAutoplay();
    });

    btnPrev?.addEventListener('click', () => {
        mostrarSlide(slideActual - 1);
        iniciarAutoplay();
    });

    dots.forEach((dot) => {
        dot.addEventListener('click', () => {
            const idx = Number(dot.dataset.index);
            mostrarSlide(idx);
            iniciarAutoplay();
        });
    });

    iniciarAutoplay();
}

// --- CUENTA REGRESIVA BLACK FRIDAY ---
// Ejemplo: termina dentro de 3 días desde que se abre la página (o podés poner una fecha fija)
const fechaFinBlackFriday = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
// Si preferís una fecha fija, reemplazá la línea de arriba por:
// const fechaFinBlackFriday = new Date('2026-11-30T23:59:59');

const diasEl = document.getElementById('dias');
const horasEl = document.getElementById('horas');
const minutosEl = document.getElementById('minutos');
const segundosEl = document.getElementById('segundos');

function actualizarCuentaRegresiva() {
    if (!diasEl || !horasEl || !minutosEl || !segundosEl) return;

    const ahora = new Date().getTime();
    const diferencia = fechaFinBlackFriday.getTime() - ahora;

    if (diferencia <= 0) {
        diasEl.textContent = '00';
        horasEl.textContent = '00';
        minutosEl.textContent = '00';
        segundosEl.textContent = '00';
        return;
    }

    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diferencia / (1000 * 60 * 60)) % 24);
    const minutos = Math.floor((diferencia / 1000 / 60) % 60);
    const segundos = Math.floor((diferencia / 1000) % 60);

    diasEl.textContent = String(dias).padStart(2, '0');
    horasEl.textContent = String(horas).padStart(2, '0');
    minutosEl.textContent = String(minutos).padStart(2, '0');
    segundosEl.textContent = String(segundos).padStart(2, '0');
}

actualizarCuentaRegresiva();
setInterval(actualizarCuentaRegresiva, 1000);