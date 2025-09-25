// ===== VARIABLES PRINCIPALES =====
const track = document.querySelector('.track');
const cars = Array.from(document.querySelectorAll('.car'));
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
const dotsContainer = document.querySelector('.dots');
const body = document.body;

let index = 0;
let interval = null;
const DURATION = parseInt(getComputedStyle(document.documentElement)
    .getPropertyValue('--autoplay-duration')) || 4000;

// ===== CLON PARA LOOP INFINITO =====
const firstClone = cars[0].cloneNode(true);
track.appendChild(firstClone);

// ===== BACKGROUNDS =====
const bgClasses = ['bg-1', 'bg-2', 'bg-3', 'bg-4', 'bg-5'];

// ===== DOTS =====
cars.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => moveTo(i));
    dotsContainer.appendChild(dot);
});
const dots = document.querySelectorAll('.dot');

// ===== FUNCIONES =====
function updateUI() {
    // calcula índice real (ignorando el clon)
    const realIndex = ((index % cars.length) + cars.length) % cars.length;

    // quitar clases previas y poner la nueva en el body
    body.classList.remove(...bgClasses);
    body.classList.add(bgClasses[realIndex]);

    // dots
    dots.forEach((dot, i) => dot.classList.toggle('active', i === realIndex));
}

function moveTo(i, smooth = true) {
    index = i;
    track.style.transition = smooth ? `transform var(--transition-speed) var(--transition-curve)` : 'none';
    track.style.transform = `translateX(-${index * 100}%)`;
    updateUI();
}

function next() {
    index++;
    moveTo(index);
}

function prev() {
    index--;
    moveTo(index);
}

function startAutoPlay() {
    stopAutoPlay();
    interval = setInterval(next, DURATION);
}

function stopAutoPlay() {
    clearInterval(interval);
}

// ===== EVENTOS =====
nextBtn.addEventListener('click', () => {
    stopAutoPlay();
    next();
});
prevBtn.addEventListener('click', () => {
    stopAutoPlay();
    prev();
});

// Loop infinito
track.addEventListener('transitionend', () => {
    if (index === cars.length) {
        moveTo(0, false);
    } else if (index < 0) {
        moveTo(cars.length - 1, false);
    }
});

// Pausa/reanuda autoplay
document.querySelector('.carousel').addEventListener('mouseenter', stopAutoPlay);
document.querySelector('.carousel').addEventListener('mouseleave', startAutoPlay);

// Ajuste en resize
window.addEventListener('resize', () => moveTo(index, false));

// ===== INICIO =====
moveTo(0, false);
startAutoPlay();

// ===== LOADER =====
document.addEventListener("DOMContentLoaded", () => {
    const loaderWrapper = document.querySelector(".loader-wrapper");
    setTimeout(() => {
        loaderWrapper.classList.add("hidden");
    }, 2200);
});

// ===== NAVEGACIÓN POR TECLADO =====
document.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "ArrowRight": // Siguiente slide
            stopAutoPlay();
            next();
            break;
        case "ArrowLeft": // Slide anterior
            stopAutoPlay();
            prev();
            break;
        case "Escape": // Pausar autoplay
            stopAutoPlay();
            break;
        case " ": // Barra espaciadora para reanudar autoplay
            e.preventDefault(); // evita scroll de la página
            startAutoPlay();
            break;
        default:
            break;
    }
});

function updateUI() {
    const realIndex = ((index % cars.length) + cars.length) % cars.length;

    // transición fade: baja opacidad antes de cambiar fondo
    body.style.transition = "opacity 0.8s ease-in-out";
    body.style.opacity = 0;

    setTimeout(() => {
        body.classList.remove(...bgClasses);
        body.classList.add(bgClasses[realIndex]);

        // vuelve a aparecer después de cambiar fondo
        body.style.opacity = 1;
    }, 400); // la mitad del tiempo del fade
}

 function animateSlideText(currentSlide) {
  const elements = currentSlide.querySelectorAll("h2, p, .view-more-btn");
  elements.forEach((el, i) => {
    el.style.animation = "none"; // resetea
    void el.offsetWidth; // hack para reiniciar animación
    el.style.animation = `fadeInUp 0.8s ease forwards ${i * 0.2}s`;
  });
}

// Dentro de moveTo()
function moveTo(i, smooth = true) {
    index = i;
    track.style.transition = smooth ? 
      `transform var(--transition-speed) var(--transition-curve)` : 'none';
    track.style.transform = `translateX(-${index * 100}%)`;
    updateUI();

    // 🔥 aplica animación al slide actual
    const currentSlide = cars[((index % cars.length) + cars.length) % cars.length];
    animateSlideText(currentSlide);
}


