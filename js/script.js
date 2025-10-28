document.addEventListener('DOMContentLoaded', () => {

    /* Sistema de carrossel */
    const slides = document.querySelectorAll('.carousel-slide');
    // Dots serão criados dinamicamente
    const dotsContainer = document.querySelector('.carousel-dots');
    let dots = [];
    // Gera os dots conforme o número de slides
    function createDots() {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';
        dots = [];
        for (let i = 0; i < slides.length; i++) {
            const dot = document.createElement('span');
            dot.className = 'dot' + (i === 0 ? ' active' : '');
            dot.addEventListener('click', () => showSlide(i));
            dotsContainer.appendChild(dot);
            dots.push(dot);
        }
    }

    createDots();
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
        /* Controle de loop do carrossel */
        if (index >= slides.length) {
            currentSlide = 0;
        } else if (index < 0) {
            currentSlide = slides.length - 1;
        } else {
            currentSlide = index;
        }

    dots.forEach(dot => dot.classList.remove('active'));
    if (dots[currentSlide]) dots[currentSlide].classList.add('active');

        /* Se o container estiver em layout horizontal (mobile), fazemos o scroll para o slide */
        const style = carouselContainer ? getComputedStyle(carouselContainer) : null;
        const isHorizontal = style && style.display === 'flex';

        if (isHorizontal && carouselContainer) {
            // garante que cada slide ocupe 100% da largura do container
            const slideWidth = carouselContainer.clientWidth;
            carouselContainer.scrollTo({ left: currentSlide * slideWidth, behavior: 'smooth' });
            // marca slides (opcional) para estilos visuais
            slides.forEach((s, i) => s.classList.toggle('active', i === currentSlide));
            // quando em layout horizontal, também injetamos o embed caso exista
            ensureEmbedForSlide(currentSlide);
        } else {
            // comportamento original (stacked/opacidade)
            slides.forEach(slide => slide.classList.remove('active'));
            slides[currentSlide].classList.add('active');
            // tentar injetar iframe do slide ativo (lazy-load / diagnóstico)
            ensureEmbedForSlide(currentSlide);
        }
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
    // (Removido: listeners de dots fixos)

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

    /* Botão do carrossel que leva para nossa equipe */
    const btnNossaEquipe = document.getElementById('btn-nossa-equipe');
    const nossaEquipeSection = document.getElementById('nossa-equipe');

    if (btnNossaEquipe && nossaEquipeSection) {
        btnNossaEquipe.addEventListener('click', (e) => {
            e.preventDefault();
            nossaEquipeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('show');
        });
    }

    /* Fecha o menu móvel ao clicar em qualquer link de navegação (melhora usabilidade) */
    if (navLinks) {
        const anchors = navLinks.querySelectorAll('a[href^="#"]');
        anchors.forEach(a => {
            a.addEventListener('click', () => {
                // remove a classe show para ocultar o menu em telas pequenas
                navLinks.classList.remove('show');
            });
        });
    }

    /* Detecta orientação dos vídeos nos slides e aplica classe 'vertical' quando for portrait */
    const projectVideos = document.querySelectorAll('.project-media video');
    projectVideos.forEach(video => {
        function applyOrientation() {
            // Alguns navegadores só reportam videoWidth/videoHeight após loadedmetadata
            if (video.videoWidth && video.videoHeight) {
                const parent = video.closest('.project-media');
                if (parent) {
                    if (video.videoHeight > video.videoWidth) {
                        parent.classList.add('vertical');
                    } else {
                        parent.classList.remove('vertical');
                    }
                }
            }
        }

        // Se já carregou metadados, aplica imediatamente
        if (video.readyState >= 1) {
            applyOrientation();
        }

        // Aplica quando metadados estiverem disponíveis
        video.addEventListener('loadedmetadata', applyOrientation);

        // Reaplica caso a fonte mude dinamicamente
        video.addEventListener('emptied', () => setTimeout(applyOrientation, 200));
    });

    /* Lazy-load videos when user clicks the poster (helps mobile & desktop playback) */
    const posters = document.querySelectorAll('.video-poster');
    posters.forEach(poster => {
        const btn = poster.querySelector('.play-btn');
        btn && btn.addEventListener('click', (e) => {
            e.preventDefault();
            // prevent double creation
            if (poster.dataset.loaded === '1') return;
            const mp4 = poster.dataset.mp4;
            const mov = poster.dataset.mov;
            const video = document.createElement('video');
            video.controls = true;
            video.playsInline = true;
            video.preload = 'metadata';
            video.style.width = '100%';
            video.style.height = 'auto';
            // try mp4 first then mov
            if (mp4) {
                const s1 = document.createElement('source');
                s1.src = encodeURI(mp4);
                s1.type = 'video/mp4';
                video.appendChild(s1);
            }
            if (mov) {
                const s2 = document.createElement('source');
                s2.src = encodeURI(mov);
                s2.type = 'video/quicktime';
                video.appendChild(s2);
            }
            // replace poster content with video element
            poster.innerHTML = '';
            poster.appendChild(video);
            poster.dataset.loaded = '1';
            // attempt to play (user interaction allows play)
            const playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise.catch(err => {
                    // autoplay blocked or other error - leave controls for user
                    console.warn('Playback failed:', err);
                });
            }
            // after metadata loaded, trigger orientation logic
            video.addEventListener('loadedmetadata', () => {
                const parent = video.closest('.project-media');
                if (parent) {
                    if (video.videoHeight > video.videoWidth) parent.classList.add('vertical');
                    else parent.classList.remove('vertical');
                }
            });
        });
    });

    /* ========== Lazy-insert do iframe de embeds (diagnóstico para desktop) ========== */
    function showFallback(placeholder, src) {
        placeholder.innerHTML = '';
        const btn = document.createElement('button');
        btn.className = 'open-youtube';
        btn.textContent = 'Abrir no YouTube';
        btn.addEventListener('click', () => {
            // transforma embed URL em link de watch e abre em nova aba
            const watchUrl = src.replace('/embed/', '/watch?v=');
            window.open(watchUrl, '_blank');
        });
        placeholder.appendChild(btn);
        btn.style.display = 'block';
        placeholder.dataset.loaded = 'failed';
    }

    function ensureEmbedForSlide(index) {
        const slide = slides[index];
        if (!slide) return;
        const placeholder = slide.querySelector('.embed-placeholder');
        if (!placeholder) return; // nada para fazer
        if (placeholder.dataset.loaded === '1' || placeholder.dataset.loaded === 'failed') return;
        let src = placeholder.dataset.src;
        if (!src) return;
        // Se for um shorts, converte para formato embed
        const shortsMatch = src.match(/youtube\.com\/shorts\/([\w-]+)/);
        if (shortsMatch) {
            src = `https://www.youtube.com/embed/${shortsMatch[1]}`;
        }
        console.log('Attempting to inject iframe for slide', index, src);

        const iframe = document.createElement('iframe');
        iframe.className = 'embed-video';
        iframe.src = src;
        iframe.title = placeholder.getAttribute('aria-label') || 'Embedded video';
        iframe.frameBorder = '0';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        iframe.referrerPolicy = 'strict-origin-when-cross-origin';
        iframe.allowFullscreen = true;

        // adiciona um timeout para detectar falha (ex.: embed bloqueado por X-Frame-Options)
        let loaded = false;
        const loadTimeout = setTimeout(() => {
            if (!loaded) {
                console.warn('Iframe load timeout for', src);
                showFallback(placeholder, src);
            }
        }, 6000);

        iframe.addEventListener('load', () => {
            loaded = true;
            clearTimeout(loadTimeout);
            placeholder.dataset.loaded = '1';
            // remove qualquer botão de fallback se existir
            const btn = placeholder.querySelector('.open-youtube');
            if (btn) btn.style.display = 'none';
            console.log('Iframe loaded for', src);
        });

        iframe.addEventListener('error', () => {
            clearTimeout(loadTimeout);
            console.warn('Iframe error for', src);
            showFallback(placeholder, src);
        });

        // injeta o iframe
        placeholder.innerHTML = '';
        placeholder.appendChild(iframe);
        // sinaliza que começamos a carregar
        placeholder.dataset.loaded = 'loading';
    }

    // se a página já tiver um slide ativo que contenha um placeholder, tente injetar (útil em desktop)
    const initialActive = Array.from(slides).findIndex(s => s.classList.contains('active'));
    if (initialActive >= 0) ensureEmbedForSlide(initialActive);

    /* ========== Carrossel de Depoimentos (testimonials) ========== */
    (function initTestimonialsCarousel() {
        const testiSlides = Array.from(document.querySelectorAll('.testi-slide'));
        const dotsContainer = document.querySelector('.testi-dots');
        const prev = document.querySelector('.testi-btn.prev');
        const next = document.querySelector('.testi-btn.next');
        if (!testiSlides.length || !dotsContainer) return; // nada a fazer

        let current = testiSlides.findIndex(s => s.classList.contains('active'));
        if (current < 0) current = 0;

        // cria dots
        const testiDots = [];
        function createTestiDots() {
            dotsContainer.innerHTML = '';
            testiSlides.forEach((_, i) => {
                const d = document.createElement('span');
                d.className = 'dot' + (i === current ? ' active' : '');
                d.addEventListener('click', () => show(i));
                dotsContainer.appendChild(d);
                testiDots.push(d);
            });
        }

        function show(index) {
            if (index >= testiSlides.length) index = 0;
            if (index < 0) index = testiSlides.length - 1;
            testiSlides.forEach((s, i) => s.classList.toggle('active', i === index));
            testiDots.forEach(d => d.classList.remove('active'));
            if (testiDots[index]) testiDots[index].classList.add('active');
            current = index;
        }

        function nextTesti() { show(current + 1); }
        function prevTesti() { show(current - 1); }

        if (prev) prev.addEventListener('click', () => { prevTesti(); resetAuto(); });
        if (next) next.addEventListener('click', () => { nextTesti(); resetAuto(); });

        createTestiDots();

        // autoplay
        let autoplay = setInterval(nextTesti, 4500);
        function resetAuto() {
            clearInterval(autoplay);
            autoplay = setInterval(nextTesti, 4500);
        }

        // pausa ao passar mouse (desktop) / ao tocar mantém autoplay mas evita mudanças instantâneas
        const carouselEl = document.querySelector('.testimonials-carousel');
        if (carouselEl) {
            carouselEl.addEventListener('mouseenter', () => clearInterval(autoplay));
            carouselEl.addEventListener('mouseleave', () => { resetAuto(); });
            // toque simples: pausa curto
            carouselEl.addEventListener('touchstart', () => clearInterval(autoplay), { passive: true });
            carouselEl.addEventListener('touchend', () => { resetAuto(); }, { passive: true });
        }

    })();

});