// =====================
// SCROLL SUAVE ENTRE SECCIONES
// =====================
document.addEventListener('DOMContentLoaded', () => {
    // Selecciona solo los enlaces que contienen un #
    const linksInternos = document.querySelectorAll('a[href^="#"]');

    linksInternos.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            // ...el resto de tu código para el desplazamiento suave
        });
    });
});

// =====================
// ANIMACIONES AL HACER SCROLL
// =====================
const secciones = document.querySelectorAll('section');

const mostrarSeccion = () => {
    const triggerBottom = window.innerHeight * 5; // 85% de la pantalla visible
    secciones.forEach(seccion => {
        const top = seccion.getBoundingClientRect().top;

        if (top < triggerBottom) {
            seccion.classList.add('mostrar');
        } else {
            seccion.classList.remove('mostrar');
        }
    });
};

window.addEventListener('scroll', mostrarSeccion);
mostrarSeccion(); // Llamada inicial para mostrar lo que está en pantalla

// =====================
// RESALTAR MENÚ ACTIVO SEGÚN LA SECCIÓN
// =====================
const enlacesMenu = document.querySelectorAll('.slider-menu a');

window.addEventListener('scroll', () => {
    let actual = '';
    secciones.forEach(seccion => {
        const top = seccion.offsetTop;
        const altura = seccion.clientHeight;

        if (window.scrollY >= top - 100) {
            actual = seccion.getAttribute('id');
        }
    });

    enlacesMenu.forEach(enlace => {
        enlace.classList.remove('activo');
        if (enlace.getAttribute('href') === `#${actual}`) {
            enlace.classList.add('activo');
        }
    });
});

// =====================
// EFECTO ZOOM EN TARJETAS DE INTEGRANTES
// =====================
const tarjetas = document.querySelectorAll('.tarjeta');

tarjetas.forEach(tarjeta => {
  tarjeta.addEventListener('mouseenter', () => tarjeta.classList.add("zoom"));
  tarjeta.addEventListener('mouseleave', () => tarjeta.classList.remove("zoom"));
});

// =====================
// CARRUSEL
// =====================
const track = document.getElementById("carouselTrack");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const dots = document.querySelectorAll(".dot");
let currentIndex = 0;

function updateCarousel() {
  track.style.transform = `translateX(-${currentIndex * 100}%)`;
  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === currentIndex);
  });
}

function goToSlide(index) {
  currentIndex = (index + dots.length) % dots.length; // evita valores fuera de rango
  updateCarousel();
}

// Botones
nextBtn.addEventListener("click", () => goToSlide(currentIndex + 1));
prevBtn.addEventListener("click", () => goToSlide(currentIndex - 1));

// Dots
dots.forEach((dot, index) => {
  dot.addEventListener("click", () => goToSlide(index));
});

// Teclado (Accesibilidad)
document.addEventListener("keydown", e => {
  if (e.key === "ArrowRight") goToSlide(currentIndex + 1);
  if (e.key === "ArrowLeft") goToSlide(currentIndex - 1);
});

// Iniciar
updateCarousel();

  