document.addEventListener('DOMContentLoaded', () => {
    /* Sistema de carrossel */
    const slides = document.querySelectorAll('.carousel-slide');
    const dotsContainer = document.querySelector('.carousel-dots');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    const carouselContainer = document.querySelector('.carousel-slides');
    
    let dots = [];
    let currentSlide = 0;
    let carouselAutoplay;
    let isUserInteracting = false;

    /* Suporte a gestos de swipe para dispositivos móveis */
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartY = 0;
    let touchEndY = 0;

    // Gera os dots conforme o número de slides
    function createDots() {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';
        dots = [];
        for (let i = 0; i < slides.length; i++) {
            const dot = document.createElement('span');
            dot.className = 'dot' + (i === 0 ? ' active' : '');
            dot.addEventListener('click', () => {
                showSlide(i);
                pauseAutoplay();
            });
            dotsContainer.appendChild(dot);
            dots.push(dot);
        }
    }

    createDots();

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
        const isMobile = window.innerWidth <= 768;

        if (isMobile && carouselContainer) {
            // Layout horizontal para mobile - scroll suave
            const slideWidth = carouselContainer.clientWidth;
            carouselContainer.scrollTo({
                left: currentSlide * slideWidth,
                behavior: 'smooth'
            });

            // Marca slide ativo visualmente
            slides.forEach((s, i) => s.classList.toggle('active', i === currentSlide));
        } else {
            // Comportamento original para desktop
            slides.forEach(slide => slide.classList.remove('active'));
            if (slides[currentSlide]) {
                slides[currentSlide].classList.add('active');
            }
        }

        // Sempre injeta o embed quando o slide muda
        ensureEmbedForSlide(currentSlide);
        
        // Reinicia o autoplay após mudança de slide
        resetAutoplay();
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    // Funções para o autoplay
    function startAutoplay() {
        if (carouselAutoplay) {
            clearInterval(carouselAutoplay);
        }
        
        carouselAutoplay = setInterval(() => {
            if (!isUserInteracting) {
                nextSlide();
            }
        }, 4000); // Muda a cada 4 segundos
    }

    function resetAutoplay() {
        if (carouselAutoplay) {
            clearInterval(carouselAutoplay);
        }
        startAutoplay();
    }

    function pauseAutoplay() {
        isUserInteracting = true;
        if (carouselAutoplay) {
            clearInterval(carouselAutoplay);
        }
        
        // Retoma o autoplay após 5 segundos de inatividade
        setTimeout(() => {
            isUserInteracting = false;
            startAutoplay();
        }, 5000);
    }

    function handleSwipe() {
        const swipeThreshold = 50;
        const diffX = touchEndX - touchStartX;
        const diffY = Math.abs(touchEndY - touchStartY);

        /* Verifica se é um swipe horizontal significativo */
        if (Math.abs(diffX) > swipeThreshold && diffY < swipeThreshold * 2) {
            if (diffX > 0) {
                prevSlide();
            } else {
                nextSlide();
            }
        }
    }

    /* Event listeners para navegação por botões */
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            pauseAutoplay();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            pauseAutoplay();
        });
    }

    /* Event listeners para gestos de swipe */
    if (carouselContainer) {
        carouselContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
            pauseAutoplay();
        }, { passive: true });

        carouselContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
            handleSwipe();
        }, { passive: true });
    }

    // Inicia o autoplay
    startAutoplay();
    
    // Pausa autoplay quando o mouse está sobre o carrossel (desktop)
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', () => {
            if (window.innerWidth > 768) {
                pauseAutoplay();
            }
        });
        
        carouselContainer.addEventListener('mouseleave', () => {
            if (window.innerWidth > 768) {
                isUserInteracting = false;
                startAutoplay();
            }
        });
    }

    /* ========== RESTANTE DO SEU CÓDIGO EXISTENTE ========== */

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

    /* Fecha o menu móvel ao clicar em qualquer link de navegação */
    if (navLinks) {
        const anchors = navLinks.querySelectorAll('a[href^="#"]');
        anchors.forEach(a => {
            a.addEventListener('click', () => {
                navLinks.classList.remove('show');
            });
        });
    }

    /* Detecta orientação dos vídeos nos slides */
    const projectVideos = document.querySelectorAll('.project-media video');
    projectVideos.forEach(video => {
        function applyOrientation() {
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

        if (video.readyState >= 1) {
            applyOrientation();
        }

        video.addEventListener('loadedmetadata', applyOrientation);
        video.addEventListener('emptied', () => setTimeout(applyOrientation, 200));
    });

    /* Lazy-load videos when user clicks the poster */
    const posters = document.querySelectorAll('.video-poster');
    posters.forEach(poster => {
        const btn = poster.querySelector('.play-btn');
        btn && btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (poster.dataset.loaded === '1') return;
            const mp4 = poster.dataset.mp4;
            const mov = poster.dataset.mov;
            const video = document.createElement('video');
            video.controls = true;
            video.playsInline = true;
            video.preload = 'metadata';
            video.style.width = '100%';
            video.style.height = 'auto';
            
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
            
            poster.innerHTML = '';
            poster.appendChild(video);
            poster.dataset.loaded = '1';
            
            const playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise.catch(err => {
                    console.warn('Playback failed:', err);
                });
            }
            
            video.addEventListener('loadedmetadata', () => {
                const parent = video.closest('.project-media');
                if (parent) {
                    if (video.videoHeight > video.videoWidth) parent.classList.add('vertical');
                    else parent.classList.remove('vertical');
                }
            });
        });
    });

    /* ========== Lazy-insert do iframe de embeds ========== */
    function showFallback(placeholder, src) {
        placeholder.innerHTML = '';
        const btn = document.createElement('button');
        btn.className = 'open-youtube';
        btn.textContent = 'Abrir no YouTube';
        btn.addEventListener('click', () => {
            const watchUrl = src.replace('/embed/', '/watch?v=');
            window.open(watchUrl, '_blank');
        });
        placeholder.appendChild(btn);
        btn.style.display = 'block';
        placeholder.dataset.loaded = 'failed';
    }

    function fixVideoAspectRatio() {
        const projectMedias = document.querySelectorAll('.project-media');
        projectMedias.forEach(media => {
            const iframe = media.querySelector('iframe');
            const video = media.querySelector('video');

            if (iframe) {
                const isMobile = window.innerWidth <= 768;
                if (isMobile) {
                    media.classList.remove('vertical');
                    media.style.aspectRatio = '16/9';
                }
            }

            if (video && video.videoWidth && video.videoHeight) {
                if (video.videoHeight > video.videoWidth) {
                    media.classList.add('vertical');
                } else {
                    media.classList.remove('vertical');
                }
            }
        });
    }

    window.addEventListener('resize', fixVideoAspectRatio);

    function ensureEmbedForSlide(index) {
        const slide = slides[index];
        if (!slide) return;

        const placeholder = slide.querySelector('.embed-placeholder');
        if (!placeholder) return;

        if (placeholder.dataset.loaded === '1' || placeholder.dataset.loaded === 'failed') return;

        let src = placeholder.dataset.src;
        if (!src) return;

        const shortsMatch = src.match(/youtube\.com\/shorts\/([\w-]+)/);
        if (shortsMatch) {
            src = `https://www.youtube.com/embed/${shortsMatch[1]}`;
        }

        const iframe = document.createElement('iframe');
        iframe.className = 'embed-video';
        iframe.src = src;
        iframe.title = placeholder.getAttribute('aria-label') || 'Embedded video';
        iframe.frameBorder = '0';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        iframe.referrerPolicy = 'strict-origin-when-cross-origin';
        iframe.allowFullscreen = true;

        if (window.innerWidth <= 768) {
            iframe.style.width = '100%';
            iframe.style.height = '100%';
        }

        let loaded = false;
        const loadTimeout = setTimeout(() => {
            if (!loaded) {
                showFallback(placeholder, src);
            }
        }, 6000);

        iframe.addEventListener('load', () => {
            loaded = true;
            clearTimeout(loadTimeout);
            placeholder.dataset.loaded = '1';
            const btn = placeholder.querySelector('.open-youtube');
            if (btn) btn.style.display = 'none';
            setTimeout(fixVideoAspectRatio, 100);
        });

        iframe.addEventListener('error', () => {
            clearTimeout(loadTimeout);
            showFallback(placeholder, src);
        });

        placeholder.innerHTML = '';
        placeholder.appendChild(iframe);
        placeholder.dataset.loaded = 'loading';
        fixVideoAspectRatio();
    }

    const initialActive = Array.from(slides).findIndex(s => s.classList.contains('active'));
    if (initialActive >= 0) ensureEmbedForSlide(initialActive);

    /* ========== Carrossel de Depoimentos ========== */
    (function initTestimonialsCarousel() {
        const testiSlides = Array.from(document.querySelectorAll('.testi-slide'));
        const dotsContainer = document.querySelector('.testi-dots');
        const prev = document.querySelector('.testi-btn.prev');
        const next = document.querySelector('.testi-btn.next');
        const track = document.querySelector('.testimonials-track');
        if (!testiSlides.length || !dotsContainer) return;

        let current = testiSlides.findIndex(s => s.classList.contains('active'));
        if (current < 0) current = 0;

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
            
            const isMobile = window.innerWidth <= 768;
            if (isMobile && track) {
                const slideWidth = track.clientWidth;
                track.scrollTo({ left: index * slideWidth, behavior: 'smooth' });
            }
        }

        function nextTesti() { show(current + 1); }
        function prevTesti() { show(current - 1); }

        if (prev) prev.addEventListener('click', () => { prevTesti(); resetAuto(); });
        if (next) next.addEventListener('click', () => { nextTesti(); resetAuto(); });

        createTestiDots();

        let autoplay = setInterval(nextTesti, 4500);
        function resetAuto() {
            clearInterval(autoplay);
            autoplay = setInterval(nextTesti, 4500);
        }

        const carouselEl = document.querySelector('.testimonials-carousel');
        if (carouselEl) {
            carouselEl.addEventListener('mouseenter', () => clearInterval(autoplay));
            carouselEl.addEventListener('mouseleave', () => { resetAuto(); });
            carouselEl.addEventListener('touchstart', () => clearInterval(autoplay), { passive: true });
            carouselEl.addEventListener('touchend', () => { resetAuto(); }, { passive: true });
            
            let tStartX = 0, tEndX = 0, tStartY = 0, tEndY = 0;
            carouselEl.addEventListener('touchstart', (e) => {
                tStartX = e.changedTouches[0].screenX;
                tStartY = e.changedTouches[0].screenY;
            }, { passive: true });

            carouselEl.addEventListener('touchend', (e) => {
                tEndX = e.changedTouches[0].screenX;
                tEndY = e.changedTouches[0].screenY;
                const dx = tEndX - tStartX;
                const dy = Math.abs(tEndY - tStartY);
                if (Math.abs(dx) > 40 && dy < 80) {
                    if (dx > 0) prevTesti(); else nextTesti();
                    resetAuto();
                }
            }, { passive: true });
        }
    })();
});

// Corrige layout quando a orientação do dispositivo muda
window.addEventListener('orientationchange', function () {
    setTimeout(() => {
        showSlide(currentSlide);
        fixVideoAspectRatio();
    }, 300);
});
