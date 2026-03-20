import { setLanguage } from './i18n.js';

// 1. i18n Initialization
const langSwitcher = document.getElementById('lang-switcher');
langSwitcher.addEventListener('change', (e) => setLanguage(e.target.value));
setLanguage('en');

// 2. DOM Elements
const themeSelector = document.getElementById('theme-selector');
const customColorPanel = document.getElementById('custom-color-panel');
const btnInject = document.getElementById('btn-inject');
const exportCodeBlock = document.getElementById('export-code');
const btnCopy = document.getElementById('btn-copy');
const iframe = document.getElementById('preview-frame');
const cardToggles = document.querySelectorAll('.card-toggle');

// 3. System State
let currentConfig = {
    themeId: 'dracula',
    isCustom: false,
    customColors: ['#ffffff', '#00f8da', '#00d7eb'],
    hiddenCards: [] // Array untuk menyimpan class kartu yang disembunyikan
};

// ==========================================
// 4. LIVE PREVIEW SENDER (postMessage API)
// ==========================================

// A. Ganti Tema
themeSelector.addEventListener('change', (e) => {
    const val = e.target.value;
    if (val === 'custom') {
        customColorPanel.style.display = 'block';
        currentConfig.isCustom = true;
    } else {
        customColorPanel.style.display = 'none';
        currentConfig.isCustom = false;
        currentConfig.themeId = val;
        
        // Kirim sinyal instan tanpa reload!
        iframe.contentWindow.postMessage({ type: 'CHANGE_THEME', themeId: val }, '*');
    }
    generateExportCode();
});

// B. Injeksi Tema Custom
btnInject.addEventListener('click', () => {
    currentConfig.customColors = [
        document.getElementById('c-primary').value,
        document.getElementById('c-secondary').value,
        document.getElementById('c-tertiary').value
    ];
    
    // Kirim sinyal warna baru instan tanpa reload!
    iframe.contentWindow.postMessage({ type: 'INJECT_CUSTOM_THEME', colors: currentConfig.customColors }, '*');
    generateExportCode();
});

// C. Toggle Layout (Sembunyikan/Tampilkan Kartu)
cardToggles.forEach(toggle => {
    toggle.addEventListener('change', (e) => {
        const targetClass = e.target.getAttribute('data-target');
        const isVisible = e.target.checked;
        
        // Update State
        if (!isVisible) {
            if (!currentConfig.hiddenCards.includes(targetClass)) currentConfig.hiddenCards.push(targetClass);
        } else {
            currentConfig.hiddenCards = currentConfig.hiddenCards.filter(c => c !== targetClass);
        }

        // Kirim perintah instan ke Engine di Iframe
        iframe.contentWindow.postMessage({ type: 'TOGGLE_CARD', target: targetClass, visible: isVisible }, '*');
        
        // Update kode eksportir
        generateExportCode();
    });
});

// ==========================================
// 5. CODE EXPORTER LOGIC
// ==========================================
function generateExportCode() {
    let jsConfig = `import HZT from './src/hzt.js';\n\n`;

    // Render Theme Config
    if (currentConfig.isCustom) {
        jsConfig += `HZT.Theme.add({
    id: 'custom-build',
    name: 'Custom User Theme',
    colors: ['${currentConfig.customColors[0]}', '${currentConfig.customColors[1]}', '${currentConfig.customColors[2]}']
});\n\n`;
    }

    // Render Layout Config (Jika ada kartu yang disembunyikan)
    if (currentConfig.hiddenCards.length > 0) {
        const hiddenArrayStr = JSON.stringify(currentConfig.hiddenCards);
        jsConfig += `// Auto-generated Layout Modifiers
HZT.Component.register('layout-manager', () => {
    const hiddenCards = ${hiddenArrayStr};
    hiddenCards.forEach(selector => {
        const el = document.querySelector(selector);
        if (el) el.style.display = 'none';
    });
});\n\n`;
    }

    // Render Engine Init
    const activeTheme = currentConfig.isCustom ? 'custom-build' : currentConfig.themeId;
    jsConfig += `HZT.init({ defaultTheme: '${activeTheme}' });`;

    exportCodeBlock.textContent = jsConfig.trim();
}

// ==========================================
// 6. COPY TO CLIPBOARD
// ==========================================
btnCopy.addEventListener('click', () => {
    navigator.clipboard.writeText(exportCodeBlock.textContent).then(() => {
        const originalText = btnCopy.textContent;
        const currentLang = langSwitcher.value;
        
        btnCopy.textContent = currentLang === 'id' ? "Tersalin!" : "Copied!";
        btnCopy.style.background = "#2ea043";
        
        setTimeout(() => {
            btnCopy.textContent = originalText;
            btnCopy.style.background = "#238636";
        }, 2000);
    });
});

// Init on first load
generateExportCode();