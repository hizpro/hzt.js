import HZT from './src/hzt.js';

// 1. INJEKSI TEMA BAWAAN
HZT.Theme.add({
    id: 'dracula',
    name: '🧛‍♂️ Dracula Night',
    colors: ['#f8f8f2', '#ff79c6', '#bd93f9']
});

HZT.Theme.add({
    id: 'matrix',
    name: '📟 The Matrix',
    colors: ['#ffffff', '#00ff41', '#008f11']
});

// 2. INISIALISASI ENGINE
HZT.init({ defaultTheme: 'dracula' });

// ==========================================
// 🔴 [TELINGA HZT BUILDER] LIVE PREVIEW RECEIVER
// ==========================================
window.addEventListener('message', (event) => {
    const data = event.data;
    if (!data || !data.type) return;

    // Ganti Tema Bawaan
    if (data.type === 'CHANGE_THEME') {
        HZT.Theme.set(data.themeId);
    }
    
    // Injeksi Tema Custom (Dari Color Picker)
    if (data.type === 'INJECT_CUSTOM_THEME') {
        HZT.Theme.add({ id: 'custom-build', name: 'Custom Builder Theme', colors: data.colors });
        HZT.Theme.set('custom-build');
    }

    // Toggle Sembunyikan/Tampilkan Kartu
    if (data.type === 'TOGGLE_CARD') {
        const element = document.querySelector(data.target);
        if (element) {
            element.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            if (data.visible) {
                element.style.display = '';
                setTimeout(() => { element.style.opacity = '1'; element.style.transform = 'scale(1)'; }, 10);
            } else {
                element.style.opacity = '0';
                element.style.transform = 'scale(0.9)';
                setTimeout(() => { element.style.display = 'none'; }, 300);
            }
        }
    }
});