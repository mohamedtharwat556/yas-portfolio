/* ============================================================
   YAS CORPORATE PORTFOLIO — script-en.js
   Vanilla JavaScript | LTR | English
   ============================================================ */

'use strict';

/* ============================================================
   UTILITIES
   ============================================================ */
const qs = (selector, parent = document) => parent.querySelector(selector);
const qsAll = (selector, parent = document) => [...parent.querySelectorAll(selector)];
const on = (el, event, handler, options) => { if (el) el.addEventListener(event, handler, options); };
const throttle = (fn, delay = 100) => {
    let lastTime = 0;
    return (...args) => {
        const now = Date.now();
        if (now - lastTime >= delay) { lastTime = now; fn(...args); }
    };
};
const debounce = (fn, delay = 150) => {
    let timer;
    return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); };
};

/* ============================================================
   PRELOADER
   ============================================================ */
(function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;
    document.body.classList.add('preloading');
    setTimeout(() => {
        preloader.classList.add('hidden');
        document.body.classList.remove('preloading');
    }, 4000);
})();

/* ============================================================
   NAVBAR
   ============================================================ */
const Navbar = (() => {
    const navbar    = qs('#navbar');
    const burgerBtn = qs('#burgerBtn');
    const navMenu   = qs('#navMenu');
    const navLinks  = qsAll('.nav-link');
    let overlay     = null;
    const annBar    = qs('#announcementBar');
    let annHidden   = false;

    const handleScroll = throttle(() => {
        if (!navbar) return;
        const sy = window.scrollY;
        navbar.classList.toggle('scrolled', sy > 50);
        if (sy > 80 && !annHidden) {
            annHidden = true;
            if (annBar) { annBar.style.transform = 'translateY(-100%)'; annBar.style.opacity = '0'; }
            navbar.classList.add('ann-hidden');
        } else if (sy <= 80 && annHidden) {
            annHidden = false;
            if (annBar) { annBar.style.transform = 'translateY(0)'; annBar.style.opacity = '1'; }
            navbar.classList.remove('ann-hidden');
        }
    }, 80);

    const createOverlay = () => {
        overlay = document.createElement('div');
        overlay.className = 'nav-overlay';
        overlay.setAttribute('aria-hidden', 'true');
        document.body.appendChild(overlay);
        on(overlay, 'click', closeMenu);
    };

    const openMenu = () => {
        if (!navMenu || !burgerBtn) return;
        navMenu.classList.add('open');
        burgerBtn.classList.add('open');
        burgerBtn.setAttribute('aria-expanded', 'true');
        if (overlay) overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
        if (!navMenu || !burgerBtn) return;
        navMenu.classList.remove('open');
        burgerBtn.classList.remove('open');
        burgerBtn.setAttribute('aria-expanded', 'false');
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = '';
    };

    const toggleMenu = () => navMenu && navMenu.classList.contains('open') ? closeMenu() : openMenu();

    const sections = qsAll('section[id]');
    const updateActiveLink = throttle(() => {
        const scrollY = window.scrollY + 120;
        sections.forEach(section => {
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;
            const id = section.getAttribute('id');
            const link = qs(`.nav-link[href="#${id}"]`);
            if (link) link.classList.toggle('active', scrollY >= top && scrollY < bottom);
        });
    }, 100);

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

    const init = () => {
        createOverlay();
        on(burgerBtn, 'click', toggleMenu);
        on(window, 'scroll', handleScroll, { passive: true });
        on(window, 'scroll', updateActiveLink, { passive: true });
        on(document, 'keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
        bindNavLinks();
        handleScroll();
        updateActiveLink();
    };

    return { init };
})();

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
const ScrollReveal = (() => {
    const init = () => {
        const elements = qsAll('[data-reveal]');
        if (!elements.length) return;
        if (!('IntersectionObserver' in window)) {
            elements.forEach(el => el.classList.add('revealed'));
            return;
        }
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.dataset.delay ? parseInt(entry.target.dataset.delay) : 0;
                    setTimeout(() => entry.target.classList.add('revealed'), delay);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
        elements.forEach(el => observer.observe(el));
    };
    return { init };
})();

/* ============================================================
   SMOOTH SCROLL
   ============================================================ */
const SmoothScroll = (() => {
    const init = () => {
        on(document, 'click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (!link || link.classList.contains('nav-link')) return;
            const href = link.getAttribute('href');
            if (!href || href === '#') return;
            const target = qs(href);
            if (!target) return;
            e.preventDefault();
            const navH = (qs('#navbar') || {}).offsetHeight || 80;
            window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH, behavior: 'smooth' });
        });
    };
    return { init };
})();

/* ============================================================
   BACK TO TOP
   ============================================================ */
const BackToTop = (() => {
    const btn = qs('#backToTop');
    const init = () => {
        on(btn, 'click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
        on(window, 'scroll', throttle(() => { if (btn) btn.classList.toggle('visible', window.scrollY > 500); }, 100), { passive: true });
    };
    return { init };
})();

/* ============================================================
   PRODUCT TABS
   ============================================================ */
const ProductTabs = (() => {
    const tabBtns   = qsAll('.tab-btn');
    const tabPanels = qsAll('.tab-panel');
    const activateTab = (targetTab) => {
        tabBtns.forEach(btn => { btn.classList.remove('active'); btn.setAttribute('aria-selected', 'false'); });
        tabPanels.forEach(panel => panel.classList.remove('active'));
        const activeBtn   = qs(`.tab-btn[data-tab="${targetTab}"]`);
        const activePanel = qs(`#tab-${targetTab}`);
        if (activeBtn)   { activeBtn.classList.add('active'); activeBtn.setAttribute('aria-selected', 'true'); }
        if (activePanel) {
            activePanel.classList.add('active');
            qsAll('[data-reveal]', activePanel).forEach(el => { if (!el.classList.contains('revealed')) el.classList.add('revealed'); });
        }
    };
    const init = () => {
        if (!tabBtns.length) return;
        tabBtns.forEach(btn => {
            on(btn, 'click', () => { if (btn.dataset.tab) activateTab(btn.dataset.tab); });
            on(btn, 'keydown', (e) => {
                const idx = tabBtns.indexOf(btn);
                let newIdx = idx;
                if (e.key === 'ArrowRight') newIdx = (idx + 1) % tabBtns.length;
                if (e.key === 'ArrowLeft')  newIdx = (idx - 1 + tabBtns.length) % tabBtns.length;
                if (e.key === 'Home') newIdx = 0;
                if (e.key === 'End')  newIdx = tabBtns.length - 1;
                if (newIdx !== idx) { e.preventDefault(); tabBtns[newIdx].focus(); activateTab(tabBtns[newIdx].dataset.tab); }
            });
        });
    };
    return { init };
})();

/* ============================================================
   HERO ANIMATION
   ============================================================ */
const HeroAnimation = (() => {
    const init = () => {
        const cards  = qsAll('.device-card');
        const center = qs('.device-center');
        cards.forEach((card, i) => {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.8)';
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'scale(1)'; }, 300 + i * 120);
        });
        if (center) {
            center.style.opacity = '0'; center.style.transform = 'scale(0.7)';
            center.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            setTimeout(() => { center.style.opacity = '1'; center.style.transform = 'scale(1)'; }, 300 + cards.length * 120);
        }
        if (typeof Element.prototype.animate === 'function') {
            setTimeout(() => {
                cards.forEach((card, i) => {
                    card.animate([{ transform: 'translateY(0px)' }, { transform: `translateY(${i % 2 === 0 ? '-6px' : '6px'})` }, { transform: 'translateY(0px)' }],
                        { duration: 3000 + i * 400, delay: i * 200, iterations: Infinity, easing: 'ease-in-out' });
                });
            }, 1500);
        }
    };
    return { init };
})();

/* ============================================================
   SECTION PROGRESS BAR
   ============================================================ */
const SectionProgress = (() => {
    const init = () => {
        const bar = document.createElement('div');
        bar.style.cssText = 'position:fixed;top:0;left:0;width:0%;height:3px;background:linear-gradient(90deg,#1a56db,#0ea5e9);z-index:9999;transition:width 0.1s linear;pointer-events:none;';
        document.body.appendChild(bar);
        on(window, 'scroll', throttle(() => {
            const progress = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            bar.style.width = Math.min(progress, 100) + '%';
        }, 50), { passive: true });
    };
    return { init };
})();

/* ============================================================
   CARD TILT
   ============================================================ */
const CardTilt = (() => {
    const init = () => {
        qsAll('.why-card, .pillar-card, .maint-card, .flow-step').forEach(card => {
            on(card, 'mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const rotateY = ((e.clientX - rect.left - rect.width / 2) / (rect.width / 2)) * 5;
                const rotateX = -((e.clientY - rect.top - rect.height / 2) / (rect.height / 2)) * 5;
                card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
                card.style.transition = 'transform 0.1s ease';
            });
            on(card, 'mouseleave', () => { card.style.transform = ''; card.style.transition = 'transform 0.4s ease'; });
        });
    };
    return { init };
})();

/* ============================================================
   RESIZE HANDLER
   ============================================================ */
const ResizeHandler = (() => {
    const init = () => {
        on(window, 'resize', debounce(() => {
            if (window.innerWidth >= 1025) {
                const navMenu = qs('#navMenu'), burgerBtn = qs('#burgerBtn'), overlay = qs('.nav-overlay');
                if (navMenu)   navMenu.classList.remove('open');
                if (burgerBtn) { burgerBtn.classList.remove('open'); burgerBtn.setAttribute('aria-expanded', 'false'); }
                if (overlay)   overlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        }, 200));
    };
    return { init };
})();

/* ============================================================
   HERO ROTATING TEXT — English phrases
   ============================================================ */
const HeroRotatingText = (() => {
    const phrases = [
        'That Make a Difference',
        'For 500+ Institutions',
        'Devices · Solutions · Maintenance',
        'Your Trusted Tech Partner',
        'Fast Supply Nationwide',
        '25 Years of Expertise',
        'Continuous Tech Support',
        'Quality Without Compromise',
    ];
    const TYPE_SPEED = 80, DELETE_SPEED = 40, PAUSE_AFTER = 2400, PAUSE_BEFORE = 300;
    let phraseIndex = 0, charIndex = 0, isDeleting = false;

    const tick = (el) => {
        const current = phrases[phraseIndex];
        if (!isDeleting) {
            el.textContent = current.slice(0, ++charIndex);
            if (charIndex === current.length) { isDeleting = true; setTimeout(() => tick(el), PAUSE_AFTER); return; }
        } else {
            el.textContent = current.slice(0, --charIndex);
            if (charIndex === 0) { isDeleting = false; phraseIndex = (phraseIndex + 1) % phrases.length; setTimeout(() => tick(el), PAUSE_BEFORE); return; }
        }
        setTimeout(() => tick(el), isDeleting ? DELETE_SPEED : TYPE_SPEED);
    };

    const init = () => {
        const el = qs('#heroRotatingText');
        if (!el) return;
        setTimeout(() => tick(el), 400);
    };
    return { init };
})();

/* ============================================================
   APP INIT
   ============================================================ */
const DeptDropdown = (() => {
    const init = () => {
        const wraps = qsAll('.nav-dropdown-wrap');
        wraps.forEach(wrap => {
            const btn = wrap.querySelector('.nav-dropdown-btn');
            const menu = wrap.querySelector('.nav-dropdown-menu');
            if (!btn || !menu) return;
            on(btn, 'click', (e) => {
                e.stopPropagation();
                const isOpen = wrap.classList.contains('open');
                qsAll('.nav-dropdown-wrap.open').forEach(w => { if (w !== wrap) { w.classList.remove('open'); w.querySelector('.nav-dropdown-btn')?.setAttribute('aria-expanded', 'false'); } });
                wrap.classList.toggle('open', !isOpen);
                btn.setAttribute('aria-expanded', String(!isOpen));
            });
            menu.querySelectorAll('.nav-dropdown-item').forEach(item => { on(item, 'click', () => { wrap.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }); });
        });
        on(document, 'click', () => { qsAll('.nav-dropdown-wrap.open').forEach(w => { w.classList.remove('open'); w.querySelector('.nav-dropdown-btn')?.setAttribute('aria-expanded', 'false'); }); });
        on(document, 'keydown', (e) => { if (e.key === 'Escape') qsAll('.nav-dropdown-wrap.open').forEach(w => { w.classList.remove('open'); w.querySelector('.nav-dropdown-btn')?.setAttribute('aria-expanded', 'false'); }); });
    };
    return { init };
})();

const App = {
    modules: [Navbar, ScrollReveal, SmoothScroll, BackToTop, ProductTabs, HeroAnimation, SectionProgress, CardTilt, ResizeHandler, HeroRotatingText, DeptDropdown],
    init() {
        this.modules.forEach(m => { try { m.init(); } catch(e) { console.warn('YAS EN: module failed', e); } });
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        App.init();
        initPdfDownload();
    });
} else {
    App.init();
    initPdfDownload();
}

(function initLangPicker() {
    const picker = document.getElementById('langPicker');
    if (!picker) return;
    const btn = picker.querySelector('.lang-picker-btn');
    btn.addEventListener('click', (e) => { e.stopPropagation(); picker.classList.toggle('open'); btn.setAttribute('aria-expanded', picker.classList.contains('open')); });
    document.addEventListener('click', () => { picker.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { picker.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); } });
})();

/* ============================================================
   PDF DOWNLOAD FUNCTION
   ============================================================ */
function initPdfDownload() {
    const downloadBtn = document.getElementById('downloadPdfBtn');
    if (!downloadBtn) return;

    downloadBtn.addEventListener('click', () => {
        window.print();
    });
}
})();
