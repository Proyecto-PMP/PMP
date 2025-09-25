document.addEventListener('DOMContentLoaded', () => {

    // 1. Desplazamiento suave (Smooth Scrolling)
    const links = document.querySelectorAll('.cinta-deslizante a');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            // Previene el comportamiento por defecto de los enlaces (saltar abruptamente)
            e.preventDefault();

            // Obtiene el 'id' del elemento al que queremos ir
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                // Realiza el desplazamiento suave hacia el elemento
                window.scrollTo({
                    top: targetElement.offsetTop - 50, // El -50 es para dejar un pequeño espacio
                    behavior: 'smooth'
                });
            }
        });
    });

    // 2. Animación de la cinta deslizante
    const cinta = document.querySelector('.cinta-deslizante');
    let isDown = false;
    let startX;
    let scrollLeft;

    cinta.addEventListener('mousedown', (e) => {
        isDown = true;
        cinta.classList.add('active');
        startX = e.pageX - cinta.offsetLeft;
        scrollLeft = cinta.scrollLeft;
    });

    cinta.addEventListener('mouseleave', () => {
        isDown = false;
        cinta.classList.remove('active');
    });

    cinta.addEventListener('mouseup', () => {
        isDown = false;
        cinta.classList.remove('active');
    });

    cinta.addEventListener('mousemove', (e) => {
        if (!isDown) return; // Detiene la función si el mouse no está presionado
        e.preventDefault();
        const x = e.pageX - cinta.offsetLeft;
        const walk = (x - startX) * 2; // Multiplica por 2 para mayor velocidad de arrastre
        cinta.scrollLeft = scrollLeft - walk;
    });

});