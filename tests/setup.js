/**
 * Test Setup for Mobile Responsive Portfolio
 * Configures JSDOM environment for testing CSS and DOM interactions
 */

// Set up viewport helper
global.setViewportWidth = (width) => {
    Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: width,
    });

    Object.defineProperty(document.documentElement, 'clientWidth', {
        writable: true,
        configurable: true,
        value: width,
    });

    // Trigger resize event
    window.dispatchEvent(new Event('resize'));
};

// Helper to load HTML and CSS
global.loadPortfolioPage = () => {
    const fs = require('fs');
    const path = require('path');

    // Load HTML
    const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
    document.documentElement.innerHTML = html;

    // Load CSS files
    const cssFiles = [
        '../css/mobile-perfect.css',
        '../css/desktop-fix.css',
        '../css/style.css'
    ];

    cssFiles.forEach(cssFile => {
        const cssPath = path.join(__dirname, cssFile);
        if (fs.existsSync(cssPath)) {
            const css = fs.readFileSync(cssPath, 'utf8');
            const style = document.createElement('style');
            style.textContent = css;
            document.head.appendChild(style);
        }
    });
};

// Helper to get computed style
global.getComputedStyleValue = (element, property) => {
    const computed = window.getComputedStyle(element);
    return computed.getPropertyValue(property);
};

// Helper to check if element is visible
global.isElementVisible = (element) => {
    const style = window.getComputedStyle(element);
    return style.display !== 'none' &&
        style.visibility !== 'hidden' &&
        style.opacity !== '0';
};

// Helper to get element dimensions
global.getElementDimensions = (element) => {
    const rect = element.getBoundingClientRect();
    const computed = window.getComputedStyle(element);

    return {
        width: rect.width,
        height: rect.height,
        minWidth: parseFloat(computed.minWidth) || 0,
        minHeight: parseFloat(computed.minHeight) || 0,
    };
};

// Helper to parse pixel values
global.parsePx = (value) => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
        const match = value.match(/^([\d.]+)px$/);
        return match ? parseFloat(match[1]) : 0;
    }
    return 0;
};

// Mock matchMedia for media query testing
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

// Extend expect with custom matchers
expect.extend({
    toBeWithinRange(received, min, max) {
        const pass = received >= min && received <= max;
        if (pass) {
            return {
                message: () => `expected ${received} not to be within range ${min}-${max}`,
                pass: true,
            };
        } else {
            return {
                message: () => `expected ${received} to be within range ${min}-${max}`,
                pass: false,
            };
        }
    },

    toHaveMinimumTouchTarget(received) {
        const MIN_SIZE = 44;
        const rect = received.getBoundingClientRect();
        const pass = rect.width >= MIN_SIZE && rect.height >= MIN_SIZE;

        if (pass) {
            return {
                message: () => `expected element not to have minimum touch target of ${MIN_SIZE}px`,
                pass: true,
            };
        } else {
            return {
                message: () => `expected element to have minimum touch target of ${MIN_SIZE}px, but got ${rect.width}x${rect.height}`,
                pass: false,
            };
        }
    },
});
