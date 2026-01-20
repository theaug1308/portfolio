// Theme Color Definitions
const themes = {
    gold: {
        primary: '#d4af37',
        hover: '#f4d03f',
        glow: '#ffd700'
    },
    blue: {
        primary: '#4a90e2',
        hover: '#67b5ff',
        glow: '#5dade2'
    },
    purple: {
        primary: '#9b59b6',
        hover: '#c084fc',
        glow: '#a78bfa'
    },
    green: {
        primary: '#2ecc71',
        hover: '#4ade80',
        glow: '#34d399'
    },
    red: {
        primary: '#e74c3c',
        hover: '#f87171',
        glow: '#ef4444'
    },
    cyan: {
        primary: '#1abc9c',
        hover: '#22d3ee',
        glow: '#06b6d4'
    },
    orange: {
        primary: '#f39c12',
        hover: '#fb923c',
        glow: '#fdba74'
    },
    pink: {
        primary: '#e91e63',
        hover: '#f472b6',
        glow: '#f9a8d4'
    },
    teal: {
        primary: '#009688',
        hover: '#14b8a6',
        glow: '#2dd4bf'
    },
    indigo: {
        primary: '#3f51b5',
        hover: '#818cf8',
        glow: '#a5b4fc'
    },
    lime: {
        primary: '#8bc34a',
        hover: '#a3e635',
        glow: '#bef264'
    },
    white: {
        primary: '#e0e0e0',
        hover: '#ffffff',
        glow: '#f5f5f5'
    }
};

// Helper to convert hex to rgb (supports 3 and 6 digits)
function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
    });

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

// Apply theme colors to CSS variables
function applyTheme(themeName) {
    const theme = themes[themeName];
    if (!theme) return;

    // Set new semantic variables
    document.documentElement.style.setProperty('--color-theme-primary', theme.primary);
    document.documentElement.style.setProperty('--color-theme-hover', theme.hover);
    document.documentElement.style.setProperty('--color-theme-glow', theme.glow);

    // Maintain legacy support just in case (optional, but good for transition)
    document.documentElement.style.setProperty('--color-gold-primary', theme.primary);
    document.documentElement.style.setProperty('--color-gold-hover', theme.hover);
    document.documentElement.style.setProperty('--color-gold-glow', theme.glow);

    // Convert primary hex to rgb for rgba usage
    const rgb = hexToRgb(theme.primary);
    if (rgb) {
        document.documentElement.style.setProperty('--color-primary-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
    }

    // Save to localStorage
    localStorage.setItem('portfolio-theme', themeName);

    // Update active state
    document.querySelectorAll('.color-option').forEach(option => {
        option.classList.remove('active');
        if (option.dataset.color === themeName) {
            option.classList.add('active');
        }
    });

    // Trigger particle color update
    if (window.updateParticleColors) {
        window.updateParticleColors(theme.primary);
    }
}

// Load saved theme on page load
function loadSavedTheme() {
    const savedTheme = localStorage.getItem('portfolio-theme') || 'gold';
    applyTheme(savedTheme);
}

// Initialize theme picker
document.addEventListener('DOMContentLoaded', () => {
    loadSavedTheme();

    // Add click handlers to color options
    document.querySelectorAll('.color-option').forEach(option => {
        option.addEventListener('click', () => {
            const color = option.dataset.color;
            applyTheme(color);
        });
    });
});
