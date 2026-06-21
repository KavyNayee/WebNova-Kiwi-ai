/**
 * WebNova Agency — Premium JavaScript
 * Orb physics · Particle morph · Scroll transitions · All original features
 */

document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

    // ============================================
    // SCROLL PROGRESS BAR
    // ============================================
    const scrollProgress = document.getElementById('scrollProgress');
    function updateScrollProgress() {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const pct = (window.pageYOffset / max) * 100;
        if (scrollProgress) scrollProgress.style.width = pct + '%';
    }
    window.addEventListener('scroll', updateScrollProgress, { passive: true });

    // ============================================
    // CUSTOM CURSOR
    // ============================================
    const cursor = document.getElementById('customCursor');
    const trail = document.getElementById('cursorTrail');

    if (cursor && trail && !isTouchDevice) {
        let cx = 0, cy = 0, tx = 0, ty = 0, tlx = 0, tly = 0;

        document.addEventListener('mousemove', function (e) {
            cx = e.clientX; cy = e.clientY;
        });

        function animateCursor() {
            tx += (cx - tx) * 0.18;
            ty += (cy - ty) * 0.18;
            tlx += (cx - tlx) * 0.08;
            tly += (cy - tly) * 0.08;

            cursor.style.left = tx - 5 + 'px';
            cursor.style.top = ty - 5 + 'px';
            trail.style.left = tlx - 18 + 'px';
            trail.style.top = tly - 18 + 'px';

            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        document.addEventListener('mouseenter', function () {
            cursor.style.opacity = '1';
            trail.style.opacity = '1';
        });
        document.addEventListener('mouseleave', function () {
            cursor.style.opacity = '0';
            trail.style.opacity = '0';
        });

        document.querySelectorAll('a, button, .service-card, .portfolio-card').forEach(function (el) {
            el.addEventListener('mouseenter', function () {
                cursor.style.transform = 'scale(2)';
                trail.style.transform = 'scale(1.5)';
                trail.style.borderColor = 'rgba(30,144,255,0.6)';
            });
            el.addEventListener('mouseleave', function () {
                cursor.style.transform = 'scale(1)';
                trail.style.transform = 'scale(1)';
                trail.style.borderColor = 'rgba(30,144,255,0.4)';
            });
        });
    }

    // ============================================
    // HEADER SCROLL
    // ============================================
    const header = document.getElementById('header');
    let lastScroll = 0, scrollDir = 'up';
    if (header) header.style.transition = 'transform 0.35s cubic-bezier(0.4,0,0.2,1), background 0.35s ease, padding 0.35s ease, box-shadow 0.35s ease';

    function handleHeaderScroll() {
        const cur = window.pageYOffset;
        if (cur > 100) header && header.classList.add('scrolled');
        else header && header.classList.remove('scrolled');

        if (cur > lastScroll && cur > 200 && scrollDir !== 'down') {
            scrollDir = 'down';
            header && (header.style.transform = 'translateY(-100%)');
        } else if (cur < lastScroll && scrollDir !== 'up') {
            scrollDir = 'up';
            header && (header.style.transform = 'translateY(0)');
        }
        lastScroll = cur;
    }
    window.addEventListener('scroll', handleHeaderScroll, { passive: true });

    // ============================================
    // MOBILE MENU
    // ============================================
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function () {
            menuToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });
        mobileMenu.querySelectorAll('.mobile-nav-link').forEach(function (link) {
            link.addEventListener('click', function () {
                menuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // ============================================
    // SMOOTH SCROLL
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
        a.addEventListener('click', function (e) {
            const id = this.getAttribute('href');
            if (id === '#') return;
            const el = document.querySelector(id);
            if (el) {
                e.preventDefault();
                const top = el.getBoundingClientRect().top + window.pageYOffset - 80;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ============================================
    // ACTIVE NAV
    // ============================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function highlightNav() {
        const pos = window.pageYOffset + 160;
        sections.forEach(function (sec) {
            if (pos >= sec.offsetTop && pos < sec.offsetTop + sec.offsetHeight) {
                navLinks.forEach(l => l.classList.remove('active'));
                const match = document.querySelector('.nav-link[href="#' + sec.id + '"]');
                if (match) match.classList.add('active');
            }
        });
    }
    window.addEventListener('scroll', highlightNav, { passive: true });

    // ============================================
    // SCROLL REVEAL
    // ============================================
    const revealObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                revealObs.unobserve(e.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

    // ============================================
    // STAT COUNTERS
    // ============================================
    const counterObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
            if (e.isIntersecting) {
                animateCounter(e.target, parseInt(e.target.getAttribute('data-target')));
                counterObs.unobserve(e.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-number').forEach(el => counterObs.observe(el));

    function animateCounter(el, target) {
        const dur = 2200;
        const start = performance.now();
        (function tick(now) {
            const p = Math.min((now - start) / dur, 1);
            const e = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(e * target);
            if (p < 1) requestAnimationFrame(tick);
            else el.textContent = target;
        })(start);
    }

    // ============================================
    // HERO PARTICLE SYSTEM
    // ============================================
    const particlesEl = document.getElementById('particles');
    if (particlesEl) {
        const colors = ['#1E90FF', '#00C8FF', '#4DB8FF', '#0055FF'];
        for (let i = 0; i < 40; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            const size = Math.random() * 3 + 1;
            const color = colors[Math.floor(Math.random() * colors.length)];
            p.style.cssText = `
                width:${size}px; height:${size}px;
                left:${Math.random()*100}%;
                background:${color};
                box-shadow: 0 0 ${size*4}px ${color};
                animation-duration:${Math.random()*20+12}s;
                animation-delay:${Math.random()*15}s;
            `;
            particlesEl.appendChild(p);
        }
    }

    // ============================================
    // FORM HANDLING
    // ============================================
    function setupForm(form) {
        if (!form) return;
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const orig = btn.innerHTML;
            btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Message Sent!';
            btn.style.background = '#10B981';
            btn.disabled = true;
            setTimeout(function () {
                btn.innerHTML = orig;
                btn.style.background = '';
                btn.disabled = false;
                form.reset();
            }, 3500);
        });
    }
    setupForm(document.getElementById('heroContactForm'));
    setupForm(document.getElementById('contactForm'));

    // ============================================
    // SERVICE CARD MOUSE GLOW
    // ============================================
    if (!isTouchDevice) {
        document.querySelectorAll('.service-card').forEach(function (card) {
            card.addEventListener('mousemove', function (e) {
                const r = card.getBoundingClientRect();
                const x = e.clientX - r.left;
                const y = e.clientY - r.top;
                const glow = card.querySelector('.service-card-glow');
                if (glow) {
                    glow.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(30,144,255,0.12), transparent 60%)`;
                }
            });
        });
    }

    // ============================================
    // ORB — MOUSE PARALLAX
    // ============================================
    const orbWrapper = document.getElementById('orbWrapper');
    const orbCore = document.getElementById('orbCore');

    if (orbWrapper && orbCore && !isTouchDevice) {
        let mouseX = 0, mouseY = 0;
        let orbRotX = 0, orbRotY = 0;

        document.addEventListener('mousemove', function (e) {
            mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        });

        function animateOrb() {
            orbRotX += (mouseY * -15 - orbRotX) * 0.06;
            orbRotY += (mouseX * 15 - orbRotY) * 0.06;
            orbWrapper.style.transform = `rotateX(${orbRotX}deg) rotateY(${orbRotY}deg)`;
            requestAnimationFrame(animateOrb);
        }
        animateOrb();
    }

    // ============================================
    // ORB — SCROLL SCALE + ROTATION
    // ============================================
    const orbScene = document.getElementById('orbScene');
    const orbContainer = document.getElementById('orbContainer');

    function updateOrbOnScroll() {
        const hero = document.getElementById('home');
        if (!hero || !orbScene) return;
        const heroRect = hero.getBoundingClientRect();
        const heroH = hero.offsetHeight;
        const progress = Math.max(0, Math.min(1, -heroRect.top / (heroH * 0.7)));

        // Scale orb as we scroll
        const scale = 1 - progress * 0.25;
        const rotateZ = progress * 90;
        const translateY = progress * -30;

        if (orbWrapper) {
            orbWrapper.style.transform += ` scale(${scale}) translateY(${translateY}px) rotateZ(${rotateZ}deg)`;
        }
    }
    window.addEventListener('scroll', updateOrbOnScroll, { passive: true });

    // ============================================
    // PARTICLE MORPH — CANVAS
    // ============================================
    const canvas = document.getElementById('morphCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let W = 400, H = 400;
        canvas.width = W;
        canvas.height = H;

        // Build text pixel positions
        function getTextPixels(text, fontSize) {
            const offscreen = document.createElement('canvas');
            offscreen.width = W;
            offscreen.height = H;
            const oc = offscreen.getContext('2d');
            oc.fillStyle = 'white';
            oc.font = `800 ${fontSize}px Inter, sans-serif`;
            oc.textAlign = 'center';
            oc.textBaseline = 'middle';
            oc.fillText(text, W / 2, H / 2);
            const data = oc.getImageData(0, 0, W, H).data;
            const pixels = [];
            const step = 5;
            for (let y = 0; y < H; y += step) {
                for (let x = 0; x < W; x += step) {
                    const i = (y * W + x) * 4;
                    if (data[i + 3] > 128) {
                        pixels.push({ x, y });
                    }
                }
            }
            return pixels;
        }

        // Particles for morph
        const MORPH_COUNT = 280;
        const morphParticles = [];
        let textPixels = [];
        let morphActive = false;
        let morphProgress = 0;
        let morphPhase = 0; // 0=idle, 1=explode, 2=reform, 3=show
        let animFrame;

        class MorphParticle {
            constructor() {
                this.reset();
            }
            reset() {
                const angle = Math.random() * Math.PI * 2;
                const r = 80 + Math.random() * 20;
                this.x = W / 2 + Math.cos(angle) * r;
                this.y = H / 2 + Math.sin(angle) * r;
                this.tx = this.x;
                this.ty = this.y;
                this.vx = 0;
                this.vy = 0;
                this.size = Math.random() * 2.5 + 0.8;
                this.alpha = 0;
                this.color = Math.random() > 0.5 ? '#1E90FF' : '#00C8FF';
                this.explodeX = (Math.random() - 0.5) * W * 1.2;
                this.explodeY = (Math.random() - 0.5) * H * 1.2;
            }
            setTarget(px) {
                this.tx = px.x;
                this.ty = px.y;
            }
        }

        for (let i = 0; i < MORPH_COUNT; i++) {
            morphParticles.push(new MorphParticle());
        }

        function runMorph() {
            // Get text targets
            textPixels = getTextPixels('WEBNOVA', 64);
            if (textPixels.length === 0) textPixels = getTextPixels('WN', 80);

            // Assign targets
            morphParticles.forEach(function (p, i) {
                const tp = textPixels[i % textPixels.length];
                p.setTarget(tp);
                p.alpha = Math.random() * 0.5 + 0.3;
            });

            morphPhase = 1;
            morphProgress = 0;
            morphActive = true;
        }

        function drawMorphFrame() {
            ctx.clearRect(0, 0, W, H);

            if (!morphActive) return;

            morphProgress += 0.012;
            if (morphProgress > 1) morphProgress = 1;

            const ease = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

            morphParticles.forEach(function (p, i) {
                let px, py, alpha;

                if (morphPhase === 1) {
                    // Explode outward
                    const e = ease(Math.min(morphProgress * 2, 1));
                    px = p.x + (p.explodeX - p.x) * e * 0.6;
                    py = p.y + (p.explodeY - p.y) * e * 0.6;
                    alpha = p.alpha * (1 - morphProgress);

                    if (morphProgress >= 1) {
                        morphPhase = 2;
                        morphProgress = 0;
                    }
                } else {
                    // Reform into text
                    const delay = (i / MORPH_COUNT) * 0.4;
                    const t = Math.max(0, (morphProgress - delay) / (1 - delay));
                    const e = ease(Math.min(t, 1));

                    const startX = p.x + (Math.random() - 0.5) * 100;
                    const startY = p.y + (Math.random() - 0.5) * 100;

                    px = startX + (p.tx - startX) * e;
                    py = startY + (p.ty - startY) * e;
                    alpha = e * 0.85;
                }

                // Draw glow particle
                ctx.save();
                ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
                ctx.shadowColor = p.color;
                ctx.shadowBlur = 8;
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(px, py, p.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            });

            if (morphPhase === 2 && morphProgress >= 1) {
                // Hold the text for 2.5s then fade out
                morphPhase = 3;
                setTimeout(function () {
                    // Fade canvas out
                    canvas.style.opacity = '0';
                    setTimeout(function () {
                        morphActive = false;
                        ctx.clearRect(0, 0, W, H);
                        // Re-show orb
                        if (orbWrapper) orbWrapper.style.opacity = '1';
                    }, 600);
                }, 2500);
            }
        }

        // Trigger morph on scroll
        const heroSec = document.getElementById('home');
        let morphTriggered = false;

        function checkMorphTrigger() {
            if (morphTriggered || !heroSec) return;
            const rect = heroSec.getBoundingClientRect();
            const scrollFrac = -rect.top / (heroSec.offsetHeight * 0.55);

            if (scrollFrac > 0.85) {
                morphTriggered = true;
                // Hide orb, show canvas
                canvas.style.opacity = '1';
                if (orbWrapper) {
                    orbWrapper.style.transition = 'opacity 0.4s ease';
                    orbWrapper.style.opacity = '0';
                }
                runMorph();
            }
        }
        window.addEventListener('scroll', checkMorphTrigger, { passive: true });

        // Main morph animation loop
        function morphLoop() {
            drawMorphFrame();
            animFrame = requestAnimationFrame(morphLoop);
        }
        morphLoop();
    }

    // ============================================
    // PRICING CARD — HIGHLIGHT PULSE
    // ============================================
    const highlighted = document.querySelector('.pricing-highlighted');
    if (highlighted) {
        setInterval(function () {
            highlighted.style.boxShadow = '0 0 80px rgba(30,144,255,0.35), inset 0 0 60px rgba(30,144,255,0.06)';
            setTimeout(function () {
                highlighted.style.boxShadow = '0 0 60px rgba(30,144,255,0.2), inset 0 0 60px rgba(30,144,255,0.04)';
            }, 1000);
        }, 2500);
    }

    // ============================================
    // PORTFOLIO CARD — TILT EFFECT (desktop)
    // ============================================
    if (!isTouchDevice) {
        document.querySelectorAll('.portfolio-card').forEach(function (card) {
            card.addEventListener('mousemove', function (e) {
                const r = card.getBoundingClientRect();
                const x = (e.clientX - r.left) / r.width - 0.5;
                const y = (e.clientY - r.top) / r.height - 0.5;
                card.style.transform = `translateY(-10px) scale(1.01) rotateX(${y * -5}deg) rotateY(${x * 5}deg)`;
            });
            card.addEventListener('mouseleave', function () {
                card.style.transform = '';
            });
        });
    }

    // ============================================
    // STAT CARDS — GLOW ON HOVER
    // ============================================
    if (!isTouchDevice) {
        document.querySelectorAll('.stat-card').forEach(function (card) {
            card.addEventListener('mouseenter', function () {
                card.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3), 0 0 40px rgba(30,144,255,0.15)';
            });
            card.addEventListener('mouseleave', function () {
                card.style.boxShadow = '';
            });
        });
    }

    // ============================================
    // LOGO GLOW PULSE
    // ============================================
    const logoText = document.querySelector('.logo-text');
    if (logoText) {
        setInterval(function () {
            logoText.style.filter = 'drop-shadow(0 0 12px rgba(30,144,255,0.8))';
            setTimeout(function () { logoText.style.filter = ''; }, 800);
        }, 4000);
    }

    // ============================================
    // INITIAL ANIMATIONS — stagger hero items
    // ============================================
    setTimeout(function () {
        document.querySelectorAll('.hero .reveal').forEach(function (el, i) {
            setTimeout(function () {
                el.classList.add('visible');
            }, i * 120);
        });
    }, 200);

});
