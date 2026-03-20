/**
 * [HZT] Engine - Cinematic Web Experience
 * Core System & Extensibility API (Full Merged Version)
 */
const HZT = (function () {
    'use strict';
    
    // === 1. CORE CONFIGURATION ===
    const Config = {
        selectors: {
            engine: '.hzt-engine',
            navLinks: '.hzt-nav-links',
            hamburger: '.hzt-hamburger',
            themePicker: '#hzt-theme-picker',
            themePanel: '#hzt-control-panel',
            slider: '.hzt-hero-slider',
            slide: '.hzt-slide',
            githubModal: '#hzt-github-modal',
            embedOverlay: '#hzt-embed-overlay'
        },
        sliderInterval: 12000, 
        defaultTheme: 'dracula' // Sesuaikan dengan tema default di main.js
    };

    let CurrentConfig = { ...Config };

    let State = {
        themes: [
            { id: 'aether', name: '✨ Aether Signature', colors: ['#ffffff', '#00f8da', '#00d7eb'] }
        ],
        components: {} 
    };

    // === 2. SECURITY & UTILS ===
    const Security = {
        isValidColor: (color) => /^#([0-9A-F]{3}){1,2}$|^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+(?:\s*,\s*[\d.]+\s*)?\)$/i.test(color),
        sanitizeId: (id) => typeof id === 'string' ? id.toLowerCase().replace(/[^a-z0-9-]/g, '') : '',
        escapeHTML: (str) => typeof str === 'string' ? str.replace(/[&<>'"]/g, tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag])) : ''
    };

    const Utils = {
        safeSelect: (selector) => document.querySelectorAll(selector) || []
    };

    // === 3. THEME ENGINE ===
    const ThemeEngine = {
        applyTheme: (themeId) => {
            const cleanId = Security.sanitizeId(themeId);
            const theme = State.themes.find(t => t.id === cleanId) || State.themes[0];
            const engineEl = document.querySelector(CurrentConfig.selectors.engine) || document.documentElement;
            
            engineEl.style.setProperty('--shine-1', theme.colors[0]); 
            engineEl.style.setProperty('--shine-2', theme.colors[1]); 
            engineEl.style.setProperty('--shine-3', theme.colors[2]);
            
            const panel = document.querySelector(CurrentConfig.selectors.themePanel);
            if(panel) panel.style.borderColor = theme.colors[1];
        },
        register: (newTheme) => {
            if (!newTheme || typeof newTheme !== 'object') throw new Error('[HZT] Theme must be an object.');
            if (!Array.isArray(newTheme.colors) || newTheme.colors.length < 3) throw new Error('[HZT] Theme requires 3 colors.');
            const safeTheme = {
                id: Security.sanitizeId(newTheme.id),
                name: Security.escapeHTML(newTheme.name),
                colors: newTheme.colors.map(color => {
                    if (!Security.isValidColor(color)) throw new Error(`[HZT] Invalid color format: ${color}`);
                    return color;
                })
            };
            const exists = State.themes.findIndex(t => t.id === safeTheme.id);
            if (exists !== -1) State.themes[exists] = safeTheme; else State.themes.push(safeTheme);
            ThemeEngine.renderPicker();
        },
        renderPicker: () => {
            const picker = document.querySelector(CurrentConfig.selectors.themePicker);
            if (!picker) return;
            picker.innerHTML = ''; 
            State.themes.forEach(theme => {
                const option = document.createElement('option');
                option.value = theme.id;
                option.textContent = theme.name;
                if (theme.id === CurrentConfig.defaultTheme) option.selected = true;
                picker.appendChild(option);
            });
        }
    };

    // === 4. COMPONENT REGISTRY ===
    const ComponentEngine = {
        register: (componentName, initFunction) => {
            if (typeof initFunction === 'function') State.components[Security.sanitizeId(componentName)] = initFunction;
        },
        initializeAll: () => Object.values(State.components).forEach(fn => { try { fn(); } catch(e) { console.error(e); } })
    };

    // === 5. UI, SLIDER & ANIMATIONS (RESTORED) ===
    const UI = {
        initNav: () => {
            const hamburger = document.querySelector(CurrentConfig.selectors.hamburger);
            const navLinks = document.querySelector(CurrentConfig.selectors.navLinks);
            
            // 1. Ambil semua link yang ada di dalam navigasi
            const links = navLinks ? navLinks.querySelectorAll('a') : [];

            if (hamburger && navLinks) {
                // Toggle menu saat hamburger diklik
                hamburger.addEventListener('click', () => { 
                    navLinks.classList.toggle('hzt-active'); 
                    hamburger.classList.toggle('hzt-toggle'); 
                    navLinks.classList.remove('hzt-vapor-out'); 
                });

                // 2. Tambahkan event listener ini untuk efek "Uap" saat link diklik
                links.forEach(link => {
                    link.addEventListener('click', () => {
                        // Hanya eksekusi jika menu mobile sedang terbuka
                        if (navLinks.classList.contains('hzt-active')) {
                            navLinks.classList.add('hzt-vapor-out'); // Picu animasi CSS vapor
                            hamburger.classList.remove('hzt-toggle'); // Kembalikan icon hamburger
                            
                            // Tunggu animasi selesai, lalu reset class
                            setTimeout(() => {
                                navLinks.classList.remove('hzt-active');
                                navLinks.classList.remove('hzt-vapor-out');
                            }, 400); 
                        }
                    });
                });
            }
        },
        initModals: () => {
            const githubLink = document.getElementById('hzt-github-link'), modal = document.querySelector(CurrentConfig.selectors.githubModal);
            if(githubLink && modal) githubLink.addEventListener('click', (e) => { e.preventDefault(); modal.classList.add('hzt-active'); });
            const btnStay = document.getElementById('hzt-btnStay'); if(btnStay) btnStay.addEventListener('click', () => modal.classList.remove('hzt-active'));
        },
        initCinematicSlider: () => {
            const slider = document.querySelector(CurrentConfig.selectors.slider), slides = Utils.safeSelect(CurrentConfig.selectors.slide);
            if (!slider || slides.length === 0) return;
            let current = 0, isAnimating = false, slideInterval;
            slides.forEach((s, i) => s.style.zIndex = i === 0 ? 3 : 1);
            
            const goToSlide = (index) => {
                if (isAnimating || index === current) return;
                isAnimating = true; slides[current].style.zIndex = 2; slides[index].style.zIndex = 3; slides[index].classList.add('hzt-active'); 
                setTimeout(() => { slides[current].classList.remove('hzt-active'); slides[current].style.zIndex = 1; current = index; isAnimating = false; }, 1500); 
            };
            const next = () => { goToSlide((current + 1) % slides.length); resetTimer(); };
            const prev = () => { goToSlide((current - 1 + slides.length) % slides.length); resetTimer(); };
            const resetTimer = () => { clearInterval(slideInterval); slideInterval = setInterval(next, CurrentConfig.sliderInterval); };
            slideInterval = setInterval(next, CurrentConfig.sliderInterval);

            const nextBtn = document.querySelector('.hzt-nav-next'), prevBtn = document.querySelector('.hzt-nav-prev');
            if(nextBtn) nextBtn.addEventListener('click', next); if(prevBtn) prevBtn.addEventListener('click', prev);
        },
        initCharts: () => {
            const observer = new IntersectionObserver((entries) => { entries.forEach(entry => { if (entry.isIntersecting) entry.target.style.width = entry.target.getAttribute('data-width'); }); }, { threshold: 0.5 });
            Utils.safeSelect('.hzt-stat-bar-fill').forEach(bar => { bar.style.width = '0%'; bar.style.transition = 'width 1.5s ease'; observer.observe(bar); });
        }
    };

    const Interactions = {
        magnetic: (selector) => {
            Utils.safeSelect(selector).forEach(el => {
                el.addEventListener('mousemove', (e) => {
                    const rect = el.getBoundingClientRect(); 
                    el.style.transform = `translate(${(e.clientX - rect.left - rect.width / 2) * 0.15}px, ${(e.clientY - rect.top - rect.height / 2) * 0.15}px)`;
                });
                el.addEventListener('mouseleave', () => el.style.transform = 'translate(0px, 0px)');
            });
        },
        ripple: (event, button) => {
            const circle = document.createElement('span'), diameter = Math.max(button.clientWidth, button.clientHeight);
            circle.style.width = circle.style.height = `${diameter}px`;
            circle.style.left = `${event.clientX - button.offsetLeft - diameter/2}px`; circle.style.top = `${event.clientY - button.offsetTop - diameter/2}px`;
            circle.classList.add('hzt-ripple-effect'); 
            const existing = button.querySelector('.hzt-ripple-effect'); if (existing) existing.remove(); button.appendChild(circle);
        }
    };

    const Animations = {
        initScroll: () => {
            const observer = new IntersectionObserver((entries) => { entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('hzt-visible'); }); }, { threshold: 0.1 });
            Utils.safeSelect('.hzt-animate, .hzt-bento-card').forEach(el => observer.observe(el));
        }
    };

    // === 6. PUBLIC API ===
    return {
        init: (options = {}) => {
            CurrentConfig = { ...CurrentConfig, ...options };
            ThemeEngine.renderPicker();
            ThemeEngine.applyTheme(CurrentConfig.defaultTheme);
            
            const picker = document.querySelector(CurrentConfig.selectors.themePicker);
            if (picker) picker.addEventListener('change', function() { ThemeEngine.applyTheme(this.value); });

            // Inisialisasi semua sistem bawaan
            UI.initNav(); UI.initModals(); UI.initCinematicSlider(); UI.initCharts(); Animations.initScroll();
            Utils.safeSelect('.hzt-btn-epic, .hzt-nav-btn').forEach(btn => btn.addEventListener('click', (e) => Interactions.ripple(e, btn)));
            
            // Eksekusi custom modules dari kontributor
            ComponentEngine.initializeAll();
        },
        Theme: { add: ThemeEngine.register, set: ThemeEngine.applyTheme },
        Component: { register: ComponentEngine.register },
        Interactions 
    };
})();

export default HZT;