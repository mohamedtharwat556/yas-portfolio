/* YAS — script-zh.js | 中文 | LTR */
'use strict';
const qs = (s, p = document) => p.querySelector(s);
const qsAll = (s, p = document) => [...p.querySelectorAll(s)];
const on = (el, ev, fn, opt) => { if (el) el.addEventListener(ev, fn, opt); };
const throttle = (fn, d = 100) => { let t = 0; return (...a) => { const n = Date.now(); if (n - t >= d) { t = n; fn(...a); } }; };
const debounce = (fn, d = 150) => { let tm; return (...a) => { clearTimeout(tm); tm = setTimeout(() => fn(...a), d); }; };

(function() {
    const p = document.getElementById('preloader');
    if (!p) return;
    document.body.classList.add('preloading');
    setTimeout(() => { p.classList.add('hidden'); document.body.classList.remove('preloading'); }, 4000);
})();

const Navbar = (() => {
    const navbar = qs('#navbar'), burgerBtn = qs('#burgerBtn'), navMenu = qs('#navMenu'), navLinks = qsAll('.nav-link');
    let overlay = null;
    const annBar = qs('#announcementBar'); let annHidden = false;
    const handleScroll = throttle(() => {
        if (!navbar) return;
        const sy = window.scrollY;
        navbar.classList.toggle('scrolled', sy > 50);
        if (sy > 80 && !annHidden) { annHidden = true; if (annBar) { annBar.style.transform = 'translateY(-100%)'; annBar.style.opacity = '0'; } navbar.classList.add('ann-hidden'); }
        else if (sy <= 80 && annHidden) { annHidden = false; if (annBar) { annBar.style.transform = ''; annBar.style.opacity = '1'; } navbar.classList.remove('ann-hidden'); }
    }, 80);
    const createOverlay = () => { overlay = document.createElement('div'); overlay.className = 'nav-overlay'; overlay.setAttribute('aria-hidden', 'true'); document.body.appendChild(overlay); on(overlay, 'click', closeMenu); };
    const openMenu = () => { if (!navMenu || !burgerBtn) return; navMenu.classList.add('open'); burgerBtn.classList.add('open'); burgerBtn.setAttribute('aria-expanded', 'true'); if (overlay) overlay.classList.add('active'); document.body.style.overflow = 'hidden'; };
    const closeMenu = () => { if (!navMenu || !burgerBtn) return; navMenu.classList.remove('open'); burgerBtn.classList.remove('open'); burgerBtn.setAttribute('aria-expanded', 'false'); if (overlay) overlay.classList.remove('active'); document.body.style.overflow = ''; };
    const toggleMenu = () => navMenu && navMenu.classList.contains('open') ? closeMenu() : openMenu();
    const sections = qsAll('section[id]');
    const updateActiveLink = throttle(() => { const sy = window.scrollY + 120; sections.forEach(s => { const link = qs(`.nav-link[href="#${s.id}"]`); if (link) link.classList.toggle('active', sy >= s.offsetTop && sy < s.offsetTop + s.offsetHeight); }); }, 100);
    const bindNavLinks = () => { navLinks.forEach(link => { on(link, 'click', (e) => { const href = link.getAttribute('href'); if (href && href.startsWith('#')) { e.preventDefault(); closeMenu(); const target = qs(href); if (target) window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - (navbar ? navbar.offsetHeight : 80), behavior: 'smooth' }); } }); }); };
    const init = () => { createOverlay(); on(burgerBtn, 'click', toggleMenu); on(window, 'scroll', handleScroll, { passive: true }); on(window, 'scroll', updateActiveLink, { passive: true }); on(document, 'keydown', (e) => { if (e.key === 'Escape') closeMenu(); }); bindNavLinks(); handleScroll(); updateActiveLink(); };
    return { init };
})();

const ScrollReveal = (() => {
    const init = () => {
        const els = qsAll('[data-reveal]');
        if (!els.length) return;
        if (!('IntersectionObserver' in window)) { els.forEach(el => el.classList.add('revealed')); return; }
        const obs = new IntersectionObserver((entries) => { entries.forEach(e => { if (e.isIntersecting) { setTimeout(() => e.target.classList.add('revealed'), e.target.dataset.delay ? parseInt(e.target.dataset.delay) : 0); obs.unobserve(e.target); } }); }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
        els.forEach(el => obs.observe(el));
    };
    return { init };
})();

const BackToTop = (() => {
    const init = () => { const btn = qs('#backToTop'); on(btn, 'click', () => window.scrollTo({ top: 0, behavior: 'smooth' })); on(window, 'scroll', throttle(() => { if (btn) btn.classList.toggle('visible', window.scrollY > 500); }, 100), { passive: true }); };
    return { init };
})();

const ProductTabs = (() => {
    const init = () => {
        const btns = qsAll('.tab-btn'), panels = qsAll('.tab-panel');
        if (!btns.length) return;
        btns.forEach(btn => { on(btn, 'click', () => { btns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); }); panels.forEach(p => p.classList.remove('active')); btn.classList.add('active'); btn.setAttribute('aria-selected', 'true'); const panel = qs(`#tab-${btn.dataset.tab}`); if (panel) panel.classList.add('active'); }); });
    };
    return { init };
})();

const HeroRotatingText = (() => {
    const phrases = ['创造不同', '服务500多家机构', '设备 · 解决方案 · 维护', '您信赖的技术合作伙伴', '快速全国配送', '25年丰富经验', '持续技术支持', '品质无妥协'];
    let pi = 0, ci = 0, del = false;
    const tick = (el) => {
        const cur = phrases[pi];
        if (!del) { el.textContent = cur.slice(0, ++ci); if (ci === cur.length) { del = true; setTimeout(() => tick(el), 2400); return; } }
        else { el.textContent = cur.slice(0, --ci); if (ci === 0) { del = false; pi = (pi + 1) % phrases.length; setTimeout(() => tick(el), 300); return; } }
        setTimeout(() => tick(el), del ? 40 : 100);
    };
    const init = () => { const el = qs('#heroRotatingText'); if (!el) return; setTimeout(() => tick(el), 400); };
    return { init };
})();

const SectionProgress = (() => {
    const init = () => {
        const bar = document.createElement('div');
        bar.style.cssText = 'position:fixed;top:0;left:0;width:0%;height:3px;background:linear-gradient(90deg,#1a56db,#0ea5e9);z-index:9999;pointer-events:none;transition:width 0.1s linear;';
        document.body.appendChild(bar);
        on(window, 'scroll', throttle(() => { bar.style.width = Math.min((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100, 100) + '%'; }, 50), { passive: true });
    };
    return { init };
})();

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

const App = { modules: [Navbar, ScrollReveal, BackToTop, ProductTabs, HeroRotatingText, SectionProgress, DeptDropdown], init() { this.modules.forEach(m => { try { m.init(); } catch(e) {} }); } };
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => { App.init(); initPdfDownload(); });
else { App.init(); initPdfDownload(); }

(function initLangPicker() {
    const picker = document.getElementById('langPicker');
    if (!picker) return;
    const btn = picker.querySelector('.lang-picker-btn');
    btn.addEventListener('click', (e) => { e.stopPropagation(); picker.classList.toggle('open'); btn.setAttribute('aria-expanded', picker.classList.contains('open')); });
    document.addEventListener('click', () => { picker.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { picker.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); } });
})();

/* PDF Download Function */
function initPdfDownload() {
    const downloadBtn = document.getElementById('downloadPdfBtn');
    if (!downloadBtn) return;
    downloadBtn.addEventListener('click', () => {
        const html = document.documentElement;
        const lang = html.getAttribute('lang') || 'zh';
        const filename = `YAS-Portfolio-${lang}.pdf`;
        const opt = { margin: 10, filename: filename, image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2, useCORS: true }, jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' } };
        const element = document.body;
        const btnText = downloadBtn.innerHTML;
        downloadBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 生成中...';
        downloadBtn.disabled = true;
        html2pdf().set(opt).from(element).save().then(() => { downloadBtn.innerHTML = btnText; downloadBtn.disabled = false; }).catch(err => { console.error('PDF generation failed:', err); downloadBtn.innerHTML = btnText; downloadBtn.disabled = false; alert('生成PDF时出错。请重试。'); });
    });
}
