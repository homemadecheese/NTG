document.addEventListener('DOMContentLoaded', () => {

    /* Sistema de carrossel */
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    const carouselContainer = document.querySelector('.carousel-slides');
    let currentSlide = 0;

    /* Suporte a gestos de swipe para dispositivos móveis */
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartY = 0;
    let touchEndY = 0;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        /* Controle de loop do carrossel */
        if (index >= slides.length) {
            currentSlide = 0;
        } else if (index < 0) {
            currentSlide = slides.length - 1;
        } else {
            currentSlide = index;
        }
        
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    function handleSwipe() {
        const swipeThreshold = 50;
        const diffX = touchEndX - touchStartX;
        const diffY = Math.abs(touchEndY - touchStartY);

        /* Verifica se é um swipe horizontal */
        if (Math.abs(diffX) > swipeThreshold && diffY < swipeThreshold) {
            if (diffX > 0) {
                prevSlide();
            } else {
                nextSlide();
            }
        }
    }

    /* Event listeners para navegação por botões */
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    /* Event listeners para navegação por dots */
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => showSlide(index));
    });

    /* Event listeners para gestos de swipe */
    if (carouselContainer) {
        carouselContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });

        carouselContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
            handleSwipe();
        }, { passive: true });
    }

    /* Link de projetos */
    const linkProjetos = document.getElementById('link-projetos');
    
    if (linkProjetos) {
        linkProjetos.addEventListener('click', (event) => {
            event.preventDefault();
            alert('Confira os projetos no carrossel acima!');
        });
    }
});