      /**
       * Función para alternar la visibilidad del contenido de la tarjeta,
       * asegurando que solo un elemento esté abierto a la vez.
       * @param {HTMLElement} clickedElement El elemento que ha sido clickeado (el div contenedor).
       */
      function toggleContent(clickedElement) {
        const content = clickedElement.querySelector(".card-content");
        const flecha = clickedElement.querySelector(".flecha");

        // Verifica si el contenido de la tarjeta clicada ya está abierto
        const isContentOpen = content.classList.contains("show");

        // Cierra todas las demás tarjetas
        const allContents = document.querySelectorAll(".card-content");
        const allFlechas = document.querySelectorAll(".flecha");

        allContents.forEach((c) => c.classList.remove("show"));
        allFlechas.forEach((f) => f.classList.remove("girada"));

        // Si el contenido clicado no estaba abierto, lo abre
        if (!isContentOpen) {
          content.classList.add("show");
          flecha.classList.add("girada");
        }
      }

      const menuBtn = document.getElementById("menuBtn");
      const sidebar = document.getElementById("sidebar");

      menuBtn.addEventListener("click", () => {
        sidebar.classList.toggle("open");
      });