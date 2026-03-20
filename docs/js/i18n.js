/**
 * [HZT] Playground - Internationalization (i18n) Module
 */
export const translations = {
    en: {
        "nav_title": "HZT Builder",
        "tab_theme": "Theme Engine",
        "tab_layout": "Layout Config",
        "tab_export": "Export Code",
        "lbl_select_lang": "Language",
        "lbl_active_theme": "Active Protocol",
        "lbl_custom_colors": "Custom Core Colors",
        "btn_apply": "Apply Changes",
        "btn_copy": "Copy Exported JS",
        "msg_copied": "Code Copied!",
        "desc_export": "Your custom JS engine config is ready.",
        "lbl_toggle_cards": "Toggle Arsenal Cards",
        "lbl_c_skm": "SKM Dashboard",
        "lbl_c_converter": "Data Converter",
        "lbl_c_radar": "Radar Scanner",
        "lbl_c_games": "Community Games",
        "lbl_c_os": "Cross-Platform OS",
        "lbl_c_twibbon": "Twibbon Generator"
    },
    id: {
        "nav_title": "Perakit HZT",
        "tab_theme": "Mesin Tema",
        "tab_layout": "Konfigurasi Tata Letak",
        "tab_export": "Ekspor Kode",
        "lbl_select_lang": "Bahasa",
        "lbl_active_theme": "Protokol Aktif",
        "lbl_custom_colors": "Warna Inti Kustom",
        "btn_apply": "Terapkan Perubahan",
        "btn_copy": "Salin Ekspor JS",
        "msg_copied": "Kode Disalin!",
        "desc_export": "Konfigurasi JS kustom Anda sudah siap.",
        "lbl_toggle_cards": "Tampilkan Kartu Arsenal",
        "lbl_c_skm": "Dasbor SKM",
        "lbl_c_converter": "Konverter Data",
        "lbl_c_radar": "Pemindai Radar",
        "lbl_c_games": "Game Komunitas",
        "lbl_c_os": "OS Lintas Platform",
        "lbl_c_twibbon": "Generator Twibbon"
    }
};

export function setLanguage(lang) {
    if (!translations[lang]) lang = 'en';
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });
    document.documentElement.lang = lang;
}