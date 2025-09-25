document.addEventListener('DOMContentLoaded', () => {
    // 1. Desplazamiento Suave (Smooth Scrolling)
    // Selecciona todos los enlaces que tienen un # en su href (enlaces internos)
    const linksInternos = document.querySelectorAll('nav a[href^="#"]');

    linksInternos.forEach(link => {
        link.addEventListener('click', (e) => {
            // Evita el comportamiento predeterminado del enlace (salto abrupto)
            e.preventDefault();

            // Obtiene el ID del elemento de destino desde el atributo href del enlace
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                // Desplazamiento suave hacia el elemento
                window.scrollTo({
                    top: targetElement.offsetTop - 120, // Ajusta el 'top' para tener en cuenta el encabezado fijo
                    behavior: 'smooth'
                });
            }
        });
    });

    // 2. Animación de las Secciones al Hacer Scroll
    const sectionsToAnimate = document.querySelectorAll('.card, .aside-info');

    // Crea un Intersection Observer para detectar cuando un elemento entra en el viewport
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // Si el elemento es visible
            if (entry.isIntersecting) {
                // Añade la clase 'animate-in' para activar la animación
                entry.target.classList.add('animate-in');
                // Deja de observar el elemento una vez que la animación se activa
                observer.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: '0px 0px -50px 0px', // Inicia la animación 50px antes de que el elemento llegue al final del viewport
        threshold: 0.2 // El 20% del elemento debe ser visible para disparar la animación
    });

    // Observa cada tarjeta y la sección de consejos
    sectionsToAnimate.forEach(section => {
        observer.observe(section);
    });

});

