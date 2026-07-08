/* =========================================
   CONFIGURACIÓN DE LA INVITACIÓN
   ========================================= */
const CONFIG = {
    // 1. Fecha del evento para el contador (Countdown)
    // Formato: "Mes Dia, Año Hora:Minutos:Segundos" (ej. "October 24, 2026 17:00:00")
    // Nota: El mes debe escribirse en inglés (January, February, March, April, May, June, July, August, September, October, November, December)
    fechaEvento: "August 6, 2026 17:00:00", // <-- REEMPLAZAR CON LA FECHA REAL

    // 2. Número de teléfono de WhatsApp para recibir las confirmaciones
    // Formato: Código de país seguido del número (sin espacios ni caracteres especiales, ej: "51900000000" para Perú)
    whatsappTelefono: "51954044440", // <-- REEMPLAZAR CON EL CELULAR REAL

    // 3. Nombre de la Quinceañera (para personalizar mensajes automáticos)
    nombreQuinceanera: "Krisha Yarely"
};

document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       0. SYSTEM FLOW: LANDING -> VIDEO -> MAIN
       ========================================= */
    const landingScreen = document.getElementById('landing-screen');
    const btnVerInvitacion = document.getElementById('btn-ver-invitacion');

    const videoScreen = document.getElementById('video-screen');
    const introVideo = document.getElementById('intro-video');
    const btnSkipVideo = document.getElementById('btn-skip-video');

    const mainInvitation = document.getElementById('main-invitation');

    const musicBtn = document.getElementById('music-btn');
    const audioEl = document.getElementById('bg-music');
    let isPlaying = false;
    let firstPlay = true; // para fade-in solo la primera vez

    const startPlay = () => {
        if (isPlaying) return;

        const tryPlay = audioEl.play();
        if (!tryPlay) return;

        tryPlay.then(() => {
            isPlaying = true;
            musicBtn.classList.add('playing');

            // Fade-in solo la primera vez que suena
            if (firstPlay) {
                firstPlay = false;
                audioEl.volume = 0;
                const fadeDuration = 2500;
                const steps = 60;
                const stepTime = fadeDuration / steps;
                let step = 0;
                const ramp = setInterval(() => {
                    step++;
                    audioEl.volume = Math.min(1, step / steps);
                    if (step >= steps) clearInterval(ramp);
                }, stepTime);
            }
        }).catch(e => {
            console.warn('Audio no pudo reproducirse:', e);
        });
    };

    const toggleMusic = () => {
        if (isPlaying) {
            audioEl.pause();
            musicBtn.classList.remove('playing');
            isPlaying = false;
        } else {
            startPlay();
        }
    };

    if (musicBtn && audioEl) {
        musicBtn.addEventListener('click', () => toggleMusic());
    }

    if (btnVerInvitacion) {
        btnVerInvitacion.addEventListener('click', () => {
            landingScreen.classList.add('hidden-view');
            
            // Si hay video de intro cargado, mostrar la pantalla de video; si no, ir directo
            if (introVideo && introVideo.querySelector('source').getAttribute('src') !== '') {
                videoScreen.classList.remove('hidden-view');
                introVideo.play().catch(() => {
                    // Si falla el auto-play del video, saltar a la invitación principal
                    showMainInvitation();
                });
            } else {
                showMainInvitation();
            }
        });
    }

    const showMainInvitation = () => {
        videoScreen.classList.add('hidden-view');
        if (introVideo) introVideo.pause();

        mainInvitation.classList.remove('hidden-view');

        setTimeout(() => {
            startPlay();
        }, 500);
    };

    if (introVideo) {
        introVideo.addEventListener('ended', showMainInvitation);
    }
    if (btnSkipVideo) {
        btnSkipVideo.addEventListener('click', showMainInvitation);
    }


    /* =========================================
       0.5 BOTÓN DE SCROLL ABAJO (HERO)
       ========================================= */
    const scrollBtn = document.getElementById('scroll-down-btn');
    const familySection = document.getElementById('family-section-anchor');

    if (scrollBtn && familySection) {
        scrollBtn.addEventListener('click', () => {
            familySection.scrollIntoView({ behavior: 'smooth' });
        });
    }


    /* =========================================
       1. INTERSECTION OBSERVER FOR ANIMATIONS
       ========================================= */
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    document.querySelectorAll('.reveal-on-scroll').forEach(section => {
        observer.observe(section);
    });


    /* =========================================
       2. COUNTDOWN TIMER LOGIC
       ========================================= */
    let targetDate = new Date(CONFIG.fechaEvento).getTime();

    const setTime = () => {
        const now = new Date().getTime();
        const difference = targetDate - now;

        const countdownGrid = document.querySelector('.countdown-grid');
        if (!countdownGrid) return;

        if (isNaN(targetDate)) {
            countdownGrid.innerHTML = "<h3 style='grid-column: 1 / -1; font-family: \"Cinzel\", serif;'>Próximamente</h3>";
            clearInterval(countdownInterval);
            return;
        }

        if (difference < 0) {
            countdownGrid.innerHTML = "<h3 style='grid-column: 1 / -1; font-family: \"Cinzel\", serif;'>¡Llegó el gran día!</h3>";
            clearInterval(countdownInterval);
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        const dEl = document.getElementById('cd-days');
        const hEl = document.getElementById('cd-hours');
        const mEl = document.getElementById('cd-minutes');
        const sEl = document.getElementById('cd-seconds');

        if (dEl && hEl && mEl && sEl) {
            dEl.innerText = days;
            hEl.innerText = hours.toString().padStart(2, '0');
            mEl.innerText = minutes.toString().padStart(2, '0');
            sEl.innerText = seconds.toString().padStart(2, '0');
        }
    };

    setTime();
    const countdownInterval = setInterval(setTime, 1000);


    /* =========================================
       3. CAROUSEL LOGIC
       ========================================= */
    const track = document.getElementById('photo-track');
    const prevBtn = document.getElementById('btn-prev');
    const nextBtn = document.getElementById('btn-next');
    const dotsContainer = document.getElementById('carousel-dots');

    if (track && prevBtn && nextBtn && dotsContainer) {
        const images = track.querySelectorAll('.carousel-img');
        const totalImages = images.length;
        let currentIndex = 0;

        images.forEach((_, idx) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (idx === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(idx));
            dotsContainer.appendChild(dot);
        });

        const updateControls = () => {
            images.forEach((img, i) => {
                img.classList.toggle('active', i === currentIndex);
            });

            document.querySelectorAll('.dot').forEach((d, i) => {
                d.classList.toggle('active', i === currentIndex);
            });
        };

        const goToSlide = (idx) => {
            currentIndex = idx;
            updateControls();
        };

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % totalImages;
            updateControls();
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + totalImages) % totalImages;
            updateControls();
        });

        window.addEventListener('resize', updateControls);

        // Swipe para móviles
        let touchStartX = 0;
        let touchEndX = 0;

        track.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        track.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            if (touchEndX < touchStartX - 50) nextBtn.click();
            if (touchEndX > touchStartX + 50) prevBtn.click();
        }
    }


    /* =========================================
       4. FORMULARIO RSVP HANDLER (WhatsApp Directo)
       ========================================= */
    const rsvpForm = document.getElementById('rsvp-form');
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = rsvpForm.querySelector('.btn-submit');
            const guestName = document.getElementById('guest-name').value.trim();
            const guestPhone = document.getElementById('guest-phone').value.trim();
            const guestAttendance = document.getElementById('guest-attendance').value;

            // 1. Validar campos
            if (!guestName || !guestPhone || !guestAttendance) {
                alert('Por favor, completa todos los campos.');
                return;
            }

            // 2. Estado de carga en el botón
            const originalHTML = submitBtn.innerHTML;
            const originalBg = submitBtn.style.background;
            const originalColor = submitBtn.style.color;

            submitBtn.innerHTML = 'Abriendo WhatsApp... <i class="ph ph-circle-notch-bold"></i>';
            submitBtn.disabled = true;

            // 3. Preparar mensaje
            const mensaje = `¡Hola *${CONFIG.nombreQuinceanera}*! 🐉\n\n` +
                            `Confirmo mi asistencia a tu fiesta medieval de 15 años.\n\n` +
                            `• *Nombre:* ${guestName}\n` +
                            `• *Celular:* ${guestPhone}\n` +
                            `• *Respuesta:* ${guestAttendance}\n\n` +
                            `¡Nos vemos pronto! 🏰✨`;

            // Codificar el texto
            const textEncoded = encodeURIComponent(mensaje);
            
            // Link a la API de WhatsApp
            const waLink = `https://wa.me/${CONFIG.whatsappTelefono}?text=${textEncoded}`;

            // 4. Redirigir a WhatsApp en pestaña nueva
            window.open(waLink, '_blank');

            // 5. Simular éxito y restaurar botón
            setTimeout(() => {
                submitBtn.innerHTML = '¡Listo! <i class="ph ph-check-circle"></i>';
                submitBtn.style.background = '#25D366';
                submitBtn.style.color = '#FFFFFF';
                submitBtn.disabled = false;

                setTimeout(() => {
                    rsvpForm.reset();
                    submitBtn.innerHTML = originalHTML;
                    submitBtn.style.background = originalBg;
                    submitBtn.style.color = originalColor;
                }, 3000);
            }, 1200);
        });
    }
});
