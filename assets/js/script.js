/* ============================================================
   YAS CORPORATE PORTFOLIO — script.js
   Vanilla JavaScript | RTL | Arabic
   ============================================================ */

'use strict';

/* ============================================================
   1. PRELOADER
   ============================================================ */

(function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    // منع الـ scroll أثناء التحميل
    document.body.classList.add('preloading');

    const hidePreloader = () => {
        preloader.classList.add('hidden');
        document.body.classList.remove('preloading');
    };

    // 4 ثواني ثم يختفي
    setTimeout(hidePreloader, 4000);

    // لو الصفحة خلصت تحميل قبل الـ 4 ثواني، نفضل نستنى الـ 4 ثواني كاملة
    // بس لو فاتت الـ 4 ثواني والصفحة لسه بتتحمل، هيختفي بعد load
    window.addEventListener('load', () => {
        // مش بنعجل الإخفاء — الـ setTimeout فوق هو اللي بيتحكم
    });
})();

/* ============================================================
   UTILITIES
   ============================================================ */

/**
 * Select a single element — shorthand for querySelector
 * @param {string} selector
 * @param {Element} [parent=document]
 */
const qs = (selector, parent = document) => parent.querySelector(selector);

/**
 * Select all elements — shorthand for querySelectorAll
 * @param {string} selector
 * @param {Element} [parent=document]
 */
const qsAll = (selector, parent = document) => [...parent.querySelectorAll(selector)];

/**
 * Add event listener with optional options
 */
const on = (el, event, handler, options) => {
    if (el) el.addEventListener(event, handler, options);
};

/**
 * Throttle a function — prevents excessive firing
 * @param {Function} fn
 * @param {number} delay ms
 */
const throttle = (fn, delay = 100) => {
    let lastTime = 0;
    return (...args) => {
        const now = Date.now();
        if (now - lastTime >= delay) {
            lastTime = now;
            fn(...args);
        }
    };
};

/**
 * Debounce a function
 * @param {Function} fn
 * @param {number} delay ms
 */
const debounce = (fn, delay = 150) => {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
};

/* ============================================================
   1. NAVBAR
   ============================================================ */
const Navbar = (() => {

    const navbar     = qs('#navbar');
    const burgerBtn  = qs('#burgerBtn');
    const navMenu    = qs('#navMenu');
    const navLinks   = qsAll('.nav-link');
    let overlay      = null;

    /* --- Scroll: add .scrolled + hide announcement bar --- */
    const annBar = qs('#announcementBar');
    let annHidden = false;

    const handleScroll = throttle(() => {
        if (!navbar) return;
        const sy = window.scrollY;

        // .scrolled class
        navbar.classList.toggle('scrolled', sy > 50);

        // إخفاء الـ announcement bar بعد 80px scroll
        if (sy > 80 && !annHidden) {
            annHidden = true;
            if (annBar) {
                annBar.style.transform = 'translateY(-100%)';
                annBar.style.opacity = '0';
            }
            navbar.classList.add('ann-hidden');
        } else if (sy <= 80 && annHidden) {
            annHidden = false;
            if (annBar) {
                annBar.style.transform = 'translateY(0)';
                annBar.style.opacity = '1';
            }
            navbar.classList.remove('ann-hidden');
        }
    }, 80);

    /* --- Mobile overlay creation --- */
    const createOverlay = () => {
        overlay = document.createElement('div');
        overlay.className = 'nav-overlay';
        overlay.setAttribute('aria-hidden', 'true');
        document.body.appendChild(overlay);
        on(overlay, 'click', closeMenu);
    };

    /* --- Open menu --- */
    const openMenu = () => {
        if (!navMenu || !burgerBtn) return;
        navMenu.classList.add('open');
        burgerBtn.classList.add('open');
        burgerBtn.setAttribute('aria-expanded', 'true');
        if (overlay) {
            overlay.classList.add('active');
        }
        document.body.style.overflow = 'hidden';
    };

    /* --- Close menu --- */
    const closeMenu = () => {
        if (!navMenu || !burgerBtn) return;
        navMenu.classList.remove('open');
        burgerBtn.classList.remove('open');
        burgerBtn.setAttribute('aria-expanded', 'false');
        if (overlay) {
            overlay.classList.remove('active');
        }
        document.body.style.overflow = '';
    };

    /* --- Toggle menu --- */
    const toggleMenu = () => {
        navMenu && navMenu.classList.contains('open') ? closeMenu() : openMenu();
    };

    /* --- Active link on scroll --- */
    const sections = qsAll('section[id]');

    const updateActiveLink = throttle(() => {
        const scrollY = window.scrollY + 120;

        sections.forEach(section => {
            const top    = section.offsetTop;
            const bottom = top + section.offsetHeight;
            const id     = section.getAttribute('id');
            const link   = qs(`.nav-link[href="#${id}"]`);

            if (link) {
                link.classList.toggle('active', scrollY >= top && scrollY < bottom);
            }
        });
    }, 100);

    /* --- Smooth close on nav-link click --- */
    const bindNavLinks = () => {
        navLinks.forEach(link => {
            on(link, 'click', (e) => {
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    closeMenu();
                    const target = qs(href);
                    if (target) {
                        const navHeight = navbar ? navbar.offsetHeight : 80;
                        const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
                        window.scrollTo({ top, behavior: 'smooth' });
                    }
                }
            });
        });
    };

    /* --- Keyboard: close on Escape --- */
    const handleKeydown = (e) => {
        if (e.key === 'Escape') closeMenu();
    };

    /* --- Init --- */
    const init = () => {
        createOverlay();
        on(burgerBtn, 'click', toggleMenu);
        on(window, 'scroll', handleScroll,  { passive: true });
        on(window, 'scroll', updateActiveLink, { passive: true });
        on(document, 'keydown', handleKeydown);
        bindNavLinks();
        handleScroll();      // run once on load
        updateActiveLink();  // run once on load
    };

    return { init };

})();

/* ============================================================
   1b. DEPARTMENTS DROPDOWN
   ============================================================ */
const DeptDropdown = (() => {

    const init = () => {
        const wraps = qsAll('.nav-dropdown-wrap');

        wraps.forEach(wrap => {
            const btn  = wrap.querySelector('.nav-dropdown-btn');
            const menu = wrap.querySelector('.nav-dropdown-menu');
            if (!btn || !menu) return;

            on(btn, 'click', (e) => {
                e.stopPropagation();
                const isOpen = wrap.classList.contains('open');

                // Close all other open dropdowns
                qsAll('.nav-dropdown-wrap.open').forEach(w => {
                    if (w !== wrap) {
                        w.classList.remove('open');
                        w.querySelector('.nav-dropdown-btn')?.setAttribute('aria-expanded', 'false');
                    }
                });

                wrap.classList.toggle('open', !isOpen);
                btn.setAttribute('aria-expanded', String(!isOpen));
            });

            // Close on item click
            menu.querySelectorAll('.nav-dropdown-item').forEach(item => {
                on(item, 'click', () => {
                    wrap.classList.remove('open');
                    btn.setAttribute('aria-expanded', 'false');
                });
            });
        });

        // Close on outside click
        on(document, 'click', () => {
            qsAll('.nav-dropdown-wrap.open').forEach(w => {
                w.classList.remove('open');
                w.querySelector('.nav-dropdown-btn')?.setAttribute('aria-expanded', 'false');
            });
        });

        // Close on Escape
        on(document, 'keydown', (e) => {
            if (e.key === 'Escape') {
                qsAll('.nav-dropdown-wrap.open').forEach(w => {
                    w.classList.remove('open');
                    w.querySelector('.nav-dropdown-btn')?.setAttribute('aria-expanded', 'false');
                });
            }
        });
    };

    return { init };

})();

/* ============================================================
   2. SCROLL REVEAL
   ============================================================ */
const ScrollReveal = (() => {

    const THRESHOLD = 0.15; // 15% of element visible triggers reveal

    const observe = () => {
        const elements = qsAll('[data-reveal]');
        if (!elements.length) return;

        if (!('IntersectionObserver' in window)) {
            // Fallback: reveal everything immediately
            elements.forEach(el => el.classList.add('revealed'));
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el    = entry.target;
                    const delay = el.dataset.delay ? parseInt(el.dataset.delay) : 0;

                    setTimeout(() => {
                        el.classList.add('revealed');
                    }, delay);

                    observer.unobserve(el); // reveal once only
                }
            });
        }, {
            threshold: THRESHOLD,
            rootMargin: '0px 0px -40px 0px'
        });

        elements.forEach(el => observer.observe(el));
    };

    const init = () => observe();

    return { init };

})();

/* ============================================================
   3. SMOOTH SCROLL — Anchor links not handled by navbar
   ============================================================ */
const SmoothScroll = (() => {

    const init = () => {
        on(document, 'click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (!link) return;

            // Skip if already handled by navbar
            if (link.classList.contains('nav-link')) return;

            const href = link.getAttribute('href');
            if (!href || href === '#') return;

            const target = qs(href);
            if (!target) return;

            e.preventDefault();
            const navbar  = qs('#navbar');
            const navH    = navbar ? navbar.offsetHeight : 80;
            const top     = target.getBoundingClientRect().top + window.scrollY - navH;

            window.scrollTo({ top, behavior: 'smooth' });
        });
    };

    return { init };

})();

/* ============================================================
   4. BACK TO TOP BUTTON
   ============================================================ */
const BackToTop = (() => {

    const btn = qs('#backToTop');

    const handleScroll = throttle(() => {
        if (!btn) return;
        btn.classList.toggle('visible', window.scrollY > 500);
    }, 100);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const init = () => {
        on(btn, 'click', scrollToTop);
        on(window, 'scroll', handleScroll, { passive: true });
        handleScroll();
    };

    return { init };

})();

/* ============================================================
   5. PRODUCT TABS
   ============================================================ */
const ProductTabs = (() => {

    const tabBtns   = qsAll('.tab-btn');
    const tabPanels = qsAll('.tab-panel');

    const activateTab = (targetTab) => {
        // Deactivate all
        tabBtns.forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-selected', 'false');
        });
        tabPanels.forEach(panel => panel.classList.remove('active'));

        // Activate target
        const activeBtn = qs(`.tab-btn[data-tab="${targetTab}"]`);
        const activePanel = qs(`#tab-${targetTab}`);

        if (activeBtn) {
            activeBtn.classList.add('active');
            activeBtn.setAttribute('aria-selected', 'true');
        }
        if (activePanel) {
            activePanel.classList.add('active');
            // Trigger reveal for newly visible elements
            qsAll('[data-reveal]', activePanel).forEach(el => {
                if (!el.classList.contains('revealed')) {
                    el.classList.add('revealed');
                }
            });
        }
    };

    const bindTabs = () => {
        tabBtns.forEach(btn => {
            on(btn, 'click', () => {
                const tab = btn.dataset.tab;
                if (tab) activateTab(tab);
            });

            // Keyboard navigation
            on(btn, 'keydown', (e) => {
                const tabs     = tabBtns;
                const idx      = tabs.indexOf(btn);
                let  newIdx    = idx;

                // RTL: ArrowLeft = next, ArrowRight = previous
                if (e.key === 'ArrowLeft')  newIdx = (idx + 1) % tabs.length;
                if (e.key === 'ArrowRight') newIdx = (idx - 1 + tabs.length) % tabs.length;
                if (e.key === 'Home') newIdx = 0;
                if (e.key === 'End')  newIdx = tabs.length - 1;

                if (newIdx !== idx) {
                    e.preventDefault();
                    tabs[newIdx].focus();
                    activateTab(tabs[newIdx].dataset.tab);
                }
            });
        });
    };

    const init = () => {
        if (!tabBtns.length) return;
        bindTabs();
    };

    return { init };

})();

/* ============================================================
   6. DEVICE COMPOSITION ANIMATION (Hero)
   ============================================================ */
const HeroAnimation = (() => {

    const STAGGER = 120; // ms between each card animation

    const animate = () => {
        const cards = qsAll('.device-card');
        const center = qs('.device-center');

        cards.forEach((card, i) => {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.8)';
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            }, 300 + i * STAGGER);
        });

        if (center) {
            center.style.opacity = '0';
            center.style.transform = 'scale(0.7)';
            center.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            setTimeout(() => {
                center.style.opacity = '1';
                center.style.transform = 'scale(1)';
            }, 300 + cards.length * STAGGER);
        }
    };

    /* Subtle floating effect */
    const addFloat = () => {
        const cards = qsAll('.device-card');
        cards.forEach((card, i) => {
            const duration = 3000 + i * 400;
            const delay    = i * 200;
            card.animate([
                { transform: 'translateY(0px)' },
                { transform: `translateY(${i % 2 === 0 ? '-6px' : '6px'})` },
                { transform: 'translateY(0px)' }
            ], {
                duration,
                delay,
                iterations: Infinity,
                easing: 'ease-in-out'
            });
        });
    };

    const init = () => {
        animate();
        // Check if Web Animations API is supported
        if (typeof Element.prototype.animate === 'function') {
            setTimeout(addFloat, 1500);
        }
    };

    return { init };

})();

/* ============================================================
   7. INTERACTIVE CARDS — hover tilt effect (subtle)
   ============================================================ */
const CardTilt = (() => {

    const MAX_TILT = 5; // degrees

    const applyTilt = (card) => {
        on(card, 'mousemove', (e) => {
            const rect   = card.getBoundingClientRect();
            const x      = e.clientX - rect.left;
            const y      = e.clientY - rect.top;
            const centerX = rect.width  / 2;
            const centerY = rect.height / 2;

            // Invert for RTL feel
            const rotateY =  ((x - centerX) / centerX) * MAX_TILT;
            const rotateX = -((y - centerY) / centerY) * MAX_TILT;

            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
            card.style.transition = 'transform 0.1s ease';
        });

        on(card, 'mouseleave', () => {
            card.style.transform = '';
            card.style.transition = 'transform 0.4s ease';
        });
    };

    const init = () => {
        // Apply to why-cards and pillar-cards — not service cards (too many)
        const targets = qsAll('.why-card, .pillar-card, .maint-card, .flow-step');
        targets.forEach(applyTilt);
    };

    return { init };

})();

/* ============================================================
   8. ACTIVE SECTION HIGHLIGHT — Progress indicator
   ============================================================ */
const SectionProgress = (() => {

    let progressBar = null;

    const createBar = () => {
        progressBar = document.createElement('div');
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            right: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, #1a56db, #0ea5e9);
            z-index: 9999;
            transition: width 0.1s linear;
            pointer-events: none;
        `;
        document.body.appendChild(progressBar);
    };

    const update = throttle(() => {
        if (!progressBar) return;
        const scrollTop  = window.scrollY;
        const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
        const progress   = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = Math.min(progress, 100) + '%';
    }, 50);

    const init = () => {
        createBar();
        on(window, 'scroll', update, { passive: true });
        update();
    };

    return { init };

})();

/* ============================================================
   9. CAPABILITIES — Staggered entrance
   ============================================================ */
const CapabilitiesReveal = (() => {

    const init = () => {
        const capItems = qsAll('.cap-item');
        if (!capItems.length) return;

        if (!('IntersectionObserver' in window)) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    capItems.forEach((item, i) => {
                        setTimeout(() => {
                            item.style.opacity   = '1';
                            item.style.transform = 'translateY(0)';
                        }, i * 50);
                    });
                    observer.disconnect();
                }
            });
        }, { threshold: 0.1 });

        // Set initial state
        capItems.forEach(item => {
            item.style.opacity   = '0';
            item.style.transform = 'translateY(24px)';
            item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        });

        const section = qs('#capabilities');
        if (section) observer.observe(section);
    };

    return { init };

})();

/* ============================================================
   10. SOLUTION BLOCKS — icon micro-animations on hover
   ============================================================ */
const SolutionHover = (() => {

    const init = () => {
        const icons = qsAll('.sol-floating-icons span');

        icons.forEach((icon, i) => {
            on(icon, 'mouseenter', () => {
                icon.style.transform = 'translateY(-8px) scale(1.15)';
                icon.style.transition = 'transform 0.25s ease';
            });
            on(icon, 'mouseleave', () => {
                icon.style.transform = '';
                icon.style.transition = 'transform 0.4s ease';
            });
        });

        // Animate sol-icon-main subtly
        const mainIcons = qsAll('.sol-icon-main');
        mainIcons.forEach(icon => {
            if (typeof Element.prototype.animate === 'function') {
                icon.animate([
                    { transform: 'scale(1) rotate(0deg)' },
                    { transform: 'scale(1.05) rotate(3deg)' },
                    { transform: 'scale(1) rotate(0deg)' }
                ], {
                    duration: 4000,
                    iterations: Infinity,
                    easing: 'ease-in-out'
                });
            }
        });
    };

    return { init };

})();

/* ============================================================
   11. PROCESS STEPS — connect lines on large screens
   ============================================================ */
const ProcessSteps = (() => {

    const animateSteps = () => {
        const steps = qsAll('.process-step');
        if (!steps.length) return;

        if (!('IntersectionObserver' in window)) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    steps.forEach((step, i) => {
                        setTimeout(() => {
                            step.classList.add('revealed');
                            const icon = qs('.step-icon', step);
                            if (icon) {
                                icon.style.transform = 'scale(1.15)';
                                icon.style.transition = 'transform 0.3s ease';
                                setTimeout(() => {
                                    icon.style.transform = '';
                                }, 300);
                            }
                        }, i * 150);
                    });
                    observer.disconnect();
                }
            });
        }, { threshold: 0.2 });

        const section = qs('#process');
        if (section) observer.observe(section);
    };

    const init = () => {
        animateSteps();
    };

    return { init };

})();

/* ============================================================
   12. HERO BADGE — pulse glow on load
   ============================================================ */
const HeroBadge = (() => {
    const init = () => {
        const badge = qs('.hero-badge');
        if (!badge) return;

        setTimeout(() => {
            badge.style.boxShadow = '0 0 20px rgba(14,165,233,.4)';
            badge.style.transition = 'box-shadow 1s ease';
            setTimeout(() => {
                badge.style.boxShadow = '';
            }, 1200);
        }, 800);
    };

    return { init };
})();

/* ============================================================
   13. MAINTENANCE CARDS — hover animate icon
   ============================================================ */
const MaintenanceCards = (() => {
    const init = () => {
        const cards = qsAll('.maint-card');
        cards.forEach(card => {
            const icon = qs('i', card);
            on(card, 'mouseenter', () => {
                if (icon) {
                    icon.style.transform = 'scale(1.3) rotate(-8deg)';
                    icon.style.transition = 'transform 0.3s ease';
                }
            });
            on(card, 'mouseleave', () => {
                if (icon) {
                    icon.style.transform = '';
                    icon.style.transition = 'transform 0.3s ease';
                }
            });
        });
    };
    return { init };
})();

/* ============================================================
   14. EDU OFFERINGS — stagger reveal
   ============================================================ */
const EduReveal = (() => {
    const init = () => {
        const items = qsAll('.edu-item');
        if (!items.length || !('IntersectionObserver' in window)) return;

        items.forEach(item => {
            item.style.opacity   = '0';
            item.style.transform = 'translateY(20px)';
            item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    items.forEach((item, i) => {
                        setTimeout(() => {
                            item.style.opacity   = '1';
                            item.style.transform = 'translateY(0)';
                        }, i * 80);
                    });
                    observer.disconnect();
                }
            });
        }, { threshold: 0.1 });

        const section = qs('#education');
        if (section) observer.observe(section);
    };
    return { init };
})();

/* ============================================================
   15. TRUST VALUES — stagger reveal
   ============================================================ */
const TrustReveal = (() => {
    const init = () => {
        const vals = qsAll('.trust-val');
        if (!vals.length || !('IntersectionObserver' in window)) return;

        vals.forEach(val => {
            val.style.opacity   = '0';
            val.style.transform = 'translateX(20px)';
            val.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    vals.forEach((val, i) => {
                        setTimeout(() => {
                            val.style.opacity   = '1';
                            val.style.transform = 'translateX(0)';
                        }, i * 100);
                    });
                    observer.disconnect();
                }
            });
        }, { threshold: 0.2 });

        const section = qs('#trust');
        if (section) observer.observe(section);
    };
    return { init };
})();

/* ============================================================
   16. CORP FLOW — stagger reveal
   ============================================================ */
const CorpFlowReveal = (() => {
    const init = () => {
        const steps  = qsAll('.flow-step');
        const arrows = qsAll('.flow-arrow');
        if (!steps.length || !('IntersectionObserver' in window)) return;

        steps.forEach(step => {
            step.style.opacity   = '0';
            step.style.transform = 'scale(0.85)';
            step.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        });
        arrows.forEach(arrow => {
            arrow.style.opacity = '0';
            arrow.style.transition = 'opacity 0.3s ease';
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    steps.forEach((step, i) => {
                        setTimeout(() => {
                            step.style.opacity   = '1';
                            step.style.transform = 'scale(1)';
                        }, i * 120);
                    });
                    arrows.forEach((arrow, i) => {
                        setTimeout(() => {
                            arrow.style.opacity = '0.5';
                        }, 60 + i * 120);
                    });
                    observer.disconnect();
                }
            });
        }, { threshold: 0.2 });

        const section = qs('#corporate');
        if (section) observer.observe(section);
    };
    return { init };
})();

/* ============================================================
   17. WINDOW RESIZE — close mobile menu if resized to desktop
   ============================================================ */
const ResizeHandler = (() => {
    const init = () => {
        const handleResize = debounce(() => {
            if (window.innerWidth >= 1025) {
                const navMenu   = qs('#navMenu');
                const burgerBtn = qs('#burgerBtn');
                const overlay   = qs('.nav-overlay');

                if (navMenu)   navMenu.classList.remove('open');
                if (burgerBtn) {
                    burgerBtn.classList.remove('open');
                    burgerBtn.setAttribute('aria-expanded', 'false');
                }
                if (overlay)   overlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        }, 200);

        on(window, 'resize', handleResize);
    };
    return { init };
})();

/* ============================================================
   18. CONTACT LINKS — phone / email / whatsapp interactivity
   ============================================================ */
const ContactInteraction = (() => {
    const init = () => {
        const phoneLinks = qsAll('a[href^="tel:"], a[href^="mailto:"], a[href^="https://wa.me/"]');
        phoneLinks.forEach(link => {
            on(link, 'click', () => {
                link.style.transform = 'scale(0.96)';
                setTimeout(() => { link.style.transform = ''; }, 150);
            });
        });
    };
    return { init };
})();

/* ============================================================
   19. FOOTER LINKS — smooth hover underline
   ============================================================ */
const FooterLinks = (() => {
    const init = () => {
        const links = qsAll('.footer-nav a, .footer-contact a');
        links.forEach(link => {
            on(link, 'mouseenter', () => {
                link.style.paddingInlineEnd = '4px';
                link.style.transition = 'all 0.2s ease';
            });
            on(link, 'mouseleave', () => {
                link.style.paddingInlineEnd = '';
            });
        });
    };
    return { init };
})();

/* ============================================================
   20. ACCESSIBILITY — Skip to main content + focus trapping
   ============================================================ */
const Accessibility = (() => {
    const init = () => {
        // Add skip link if not present
        if (!qs('.skip-link')) {
            const skipLink = document.createElement('a');
            skipLink.href  = '#home';
            skipLink.className = 'skip-link';
            skipLink.textContent = 'الانتقال للمحتوى الرئيسي';
            skipLink.style.cssText = `
                position: fixed;
                top: -100px;
                right: 16px;
                z-index: 99999;
                background: #1a56db;
                color: #fff;
                padding: 8px 16px;
                border-radius: 0 0 8px 8px;
                font-family: 'Tajawal', sans-serif;
                font-weight: 700;
                font-size: 14px;
                transition: top 0.2s ease;
                text-decoration: none;
            `;
            on(skipLink, 'focus', () => { skipLink.style.top = '0'; });
            on(skipLink, 'blur',  () => { skipLink.style.top = '-100px'; });
            document.body.prepend(skipLink);
        }
    };
    return { init };
})();

/* ============================================================
   21. PAGE LOAD — Remove loading flash
   ============================================================ */
const PageLoad = (() => {
    const init = () => {
        document.documentElement.classList.add('js-ready');
        // Ensure hero content is immediately visible
        const heroContent = qs('.hero-content');
        if (heroContent) {
            // Hero content is shown via data-reveal — trigger quickly
            setTimeout(() => {
                if (heroContent.dataset.reveal) {
                    heroContent.classList.add('revealed');
                }
            }, 100);
        }
    };
    return { init };
})();

/* ============================================================
   22. HERO ROTATING TEXT — Typewriter Effect
   ============================================================ */
const HeroRotatingText = (() => {

    const phrases = [
        'تصنع فرقًا',
        'لأكثر من 500 مؤسسة',
        'أجهزة · حلول · صيانة',
        'شريكك التقني الموثوق',
        'توريد سريع لكل مكان',
        'خبرة 25 عامًا',
        'دعم فني متواصل',
        'جودة بلا مساومة',
    ];

    const TYPE_SPEED   = 80;   // ms per character — typing
    const DELETE_SPEED = 40;   // ms per character — deleting
    const PAUSE_AFTER  = 2400; // ms pause after full word appears
    const PAUSE_BEFORE = 300;  // ms pause before typing next

    let phraseIndex = 0;
    let charIndex   = 0;
    let isDeleting  = false;
    let timer       = null;

    const tick = (el) => {
        const current = phrases[phraseIndex];

        if (!isDeleting) {
            // Typing forward
            charIndex++;
            el.textContent = current.slice(0, charIndex);

            if (charIndex === current.length) {
                // Full word shown — pause then start deleting
                isDeleting = true;
                timer = setTimeout(() => tick(el), PAUSE_AFTER);
                return;
            }
        } else {
            // Deleting
            charIndex--;
            el.textContent = current.slice(0, charIndex);

            if (charIndex === 0) {
                // Fully deleted — move to next phrase
                isDeleting  = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                timer = setTimeout(() => tick(el), PAUSE_BEFORE);
                return;
            }
        }

        const speed = isDeleting ? DELETE_SPEED : TYPE_SPEED;
        timer = setTimeout(() => tick(el), speed);
    };

    const init = () => {
        const el = qs('#heroRotatingText');
        if (!el) return;

        // Start after preloader (~4s) + small buffer
        setTimeout(() => {
            tick(el);
        }, 400);
    };

    return { init };
})();
const App = {

    modules: [
        Navbar,
        ScrollReveal,
        SmoothScroll,
        BackToTop,
        ProductTabs,
        HeroAnimation,
        CardTilt,
        SectionProgress,
        CapabilitiesReveal,
        SolutionHover,
        ProcessSteps,
        HeroBadge,
        MaintenanceCards,
        EduReveal,
        TrustReveal,
        CorpFlowReveal,
        ResizeHandler,
        ContactInteraction,
        FooterLinks,
        Accessibility,
        PageLoad,
        HeroRotatingText,
        DeptDropdown,
    ],

    init() {
        this.modules.forEach(module => {
            try {
                module.init();
            } catch (err) {
                // Fail gracefully — one module error won't break the rest
                console.warn(`YAS Portfolio: module init failed`, err);
            }
        });
    }

};

/* Run after DOM is ready */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        App.init();
        initLangPicker();
        initPdfDownload();
    });
} else {
    App.init();
    initLangPicker();
    initPdfDownload();
}

/* ============================================================
   LANGUAGE PICKER DROPDOWN
   ============================================================ */
function initLangPicker() {
    const picker = document.getElementById('langPicker');
    if (!picker) return;
    const btn = picker.querySelector('.lang-picker-btn');
    if (!btn) return;

    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        picker.classList.toggle('open');
        btn.setAttribute('aria-expanded', picker.classList.contains('open'));
    });

    document.addEventListener('click', (e) => {
        if (!picker.contains(e.target)) {
            picker.classList.remove('open');
            btn.setAttribute('aria-expanded', 'false');
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            picker.classList.remove('open');
            btn.setAttribute('aria-expanded', 'false');
        }
    });
}

/* ============================================================
   PDF DOWNLOAD FUNCTION
   ============================================================ */
function initPdfDownload() {
    const downloadBtn = document.getElementById('downloadPdfBtn');
    if (!downloadBtn) return;

    downloadBtn.addEventListener('click', () => {
        // Use browser's print function - better for Arabic text
        window.print();
    });
}
