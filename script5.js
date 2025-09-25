        // ===== LOADER ELEGANTE =====
document.addEventListener("DOMContentLoaded", () => {
    const loaderWrapper = document.querySelector(".loader-wrapper");

    setTimeout(() => {
        loaderWrapper.classList.add("hidden");
    }, 2200); // Espera 2.2 segundos antes de ocultar el loader
});