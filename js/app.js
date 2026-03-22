/* ============================================================
   ROHIT VERMA — Portfolio Interactions
   Particles · Typing · Tilt · Cursor · Reveals · Counters
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ─── Loader ─────────────────────────────────────────────
    const loader = document.getElementById('loader');
    const loaderLines = loader.querySelectorAll('.loader-line');

    // Prevent scroll during load
    document.body.style.overflow = 'hidden';

    loaderLines.forEach((line) => {
        const delay = parseInt(line.dataset.delay, 10);
        setTimeout(() => line.classList.add('visible'), delay);
    });

    setTimeout(() => {
        loader.classList.add('loaded');
        document.body.style.overflow = '';
    }, 2200);


    // ─── Custom Cursor ──────────────────────────────────────
    const dot = document.querySelector('.cursor-dot');
    const outline = document.querySelector('.cursor-outline');
    let mouseX = 0, mouseY = 0;
    let outlineX = 0, outlineY = 0;
    const isDesktop = window.innerWidth > 768;

    if (isDesktop && dot && outline) {
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            dot.style.left = mouseX + 'px';
            dot.style.top = mouseY + 'px';
        });

        function animateCursor() {
            outlineX += (mouseX - outlineX) * 0.12;
            outlineY += (mouseY - outlineY) * 0.12;
            outline.style.left = outlineX + 'px';
            outline.style.top = outlineY + 'px';
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Hover state
        const hoverTargets = document.querySelectorAll(
            'a, button, .service-card, .stack-tag, .collab-card, .stat-card, .timeline-card'
        );
        hoverTargets.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });
    }


    // ─── Scroll Progress Bar ────────────────────────────────
    const scrollProgress = document.querySelector('.scroll-progress');

    function updateScrollProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (docHeight > 0) {
            scrollProgress.style.width = (scrollTop / docHeight) * 100 + '%';
        }
    }


    // ─── Navigation ─────────────────────────────────────────
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    function updateNav() {
        nav.classList.toggle('scrolled', window.scrollY > 50);
    }

    // Combined scroll handler
    window.addEventListener('scroll', () => {
        updateScrollProgress();
        updateNav();
    }, { passive: true });

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('open');
    });

    navMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('open');
        });
    });


    // ─── Particle System (Canvas) ───────────────────────────
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let particleMouseX = -1000, particleMouseY = -1000;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.1;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Bounce off edges
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

            // Mouse repulsion
            const dx = this.x - particleMouseX;
            const dy = this.y - particleMouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
                this.x += dx * 0.02;
                this.y += dy * 0.02;
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 240, 255, ${this.opacity})`;
            ctx.fill();
        }
    }

    function initParticles() {
        const count = Math.min(80, Math.floor(window.innerWidth * 0.04));
        particles = [];
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 150) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0, 240, 255, ${0.08 * (1 - dist / 150)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        drawConnections();
        requestAnimationFrame(animateParticles);
    }

    // Mouse interaction with particle canvas
    document.addEventListener('mousemove', (e) => {
        const heroRect = canvas.getBoundingClientRect();
        if (e.clientY < heroRect.bottom) {
            particleMouseX = e.clientX;
            particleMouseY = e.clientY;
        }
    });

    initParticles();
    animateParticles();


    // ─── Typing Effect ──────────────────────────────────────
    const typedElement = document.getElementById('typed');
    const roles = [
        'Backend Dev',
        'AI Automation Builder',
        'Full-Stack Problem Solver',
        'Vibe Coder',
        'Chatbot Architect',
        'DevOps Handler'
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
        const current = roles[roleIndex];
        let speed;

        if (isDeleting) {
            typedElement.textContent = current.substring(0, charIndex - 1);
            charIndex--;
            speed = 40;
        } else {
            typedElement.textContent = current.substring(0, charIndex + 1);
            charIndex++;
            speed = 90;
        }

        if (!isDeleting && charIndex === current.length) {
            speed = 2200; // pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            speed = 400;
        }

        setTimeout(typeEffect, speed);
    }

    // Start typing after loader finishes
    setTimeout(typeEffect, 2500);


    // ─── Scroll Reveal (IntersectionObserver) ───────────────
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Stagger siblings for a cascade effect
                const parent = entry.target.parentElement;
                const siblings = parent ? [...parent.querySelectorAll(':scope > .reveal')] : [];
                const idx = siblings.indexOf(entry.target);
                const delay = idx >= 0 ? idx * 100 : 0;

                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);

                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));


    // ─── Counter Animation ──────────────────────────────────
    const counters = document.querySelectorAll('.stat-number[data-target]');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.target, 10);
                let current = 0;
                const duration = 1500; // ms
                const startTime = performance.now();

                function updateCounter(now) {
                    const elapsed = now - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    // Ease out
                    const eased = 1 - Math.pow(1 - progress, 3);
                    current = Math.round(eased * target);
                    el.textContent = current;

                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        el.textContent = target;
                    }
                }

                requestAnimationFrame(updateCounter);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => counterObserver.observe(c));


    // ─── Timeline Line Animation ────────────────────────────
    const timeline = document.querySelector('.timeline');

    if (timeline) {
        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    timeline.classList.add('animated');
                    timelineObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        timelineObserver.observe(timeline);
    }


    // ─── 3D Tilt Cards ──────────────────────────────────────
    if (isDesktop) {
        const tiltCards = document.querySelectorAll('.tilt-card');

        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 25;
                const rotateY = (centerX - x) / 25;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                card.style.transition = 'transform 0.5s ease';
                setTimeout(() => { card.style.transition = ''; }, 500);
            });
        });
    }


    // ─── Magnetic Buttons ───────────────────────────────────
    if (isDesktop) {
        const magneticElements = document.querySelectorAll('.magnetic');

        magneticElements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                el.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
            });

            el.addEventListener('mouseleave', () => {
                el.style.transform = '';
                el.style.transition = 'transform 0.4s ease';
                setTimeout(() => { el.style.transition = ''; }, 400);
            });
        });
    }


    // ─── Smooth Scroll ──────────────────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetEl = document.querySelector(this.getAttribute('href'));
            if (targetEl) {
                targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });


    // ─── Contact Form (mailto fallback) ─────────────────────
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            const subject = encodeURIComponent('Portfolio Inquiry from ' + name);
            const body = encodeURIComponent(
                'Name: ' + name + '\nEmail: ' + email + '\n\n' + message
            );
            window.location.href = 'mailto:rohitverma.tech@gmail.com?subject=' + subject + '&body=' + body;
        });
    }


    // ─── Active Nav Link Highlight ──────────────────────────
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '-80px 0px -50% 0px'
    });

    sections.forEach(section => sectionObserver.observe(section));


    // ─── Easter Egg: Konami Code ────────────────────────────
    const konamiCode = [
        'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
        'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
        'KeyB', 'KeyA'
    ];
    let konamiIndex = 0;

    document.addEventListener('keydown', (e) => {
        if (e.code === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                // Rainbow mode!
                document.body.style.transition = 'filter 0.5s ease';
                document.body.style.filter = 'hue-rotate(180deg) saturate(1.5)';
                setTimeout(() => {
                    document.body.style.filter = '';
                    setTimeout(() => {
                        document.body.style.transition = '';
                    }, 500);
                }, 3000);
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });

});
