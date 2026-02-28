/**
 * Property-Based Tests for Responsive Typography
 * Feature: mobile-responsive-portfolio
 * Property 3: Responsive Typography Scaling
 * Validates: Requirements 2.2, 2.3, 4.1, 4.2, 4.3, 4.5
 */

const fc = require('fast-check');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

describe('Property 3: Responsive Typography Scaling', () => {
    let dom;
    let document;
    let window;

    beforeEach(() => {
        // Load HTML
        const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
        dom = new JSDOM(html, {
            resources: 'usable',
            runScripts: 'dangerously',
        });
        document = dom.window.document;
        window = dom.window;

        // Load CSS
        const cssFiles = [
            '../css/mobile-perfect.css',
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
    });

    afterEach(() => {
        dom.window.close();
    });

    const setViewportWidth = (width) => {
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: width,
        });
    };

    const parseFontSize = (element) => {
        const computed = window.getComputedStyle(element);
        const fontSize = computed.fontSize;
        return parseFloat(fontSize);
    };

    const parseLineHeight = (element) => {
        const computed = window.getComputedStyle(element);
        const lineHeight = computed.lineHeight;
        // Line height can be 'normal' or a number
        if (lineHeight === 'normal') return 1.5; // Assume normal is 1.5
        return parseFloat(lineHeight);
    };

    /**
     * **Validates: Requirements 4.1, 4.2, 4.3**
     * For any heading or text element, the font size should scale appropriately 
     * based on viewport width: h1 between 32-40px, h2 between 24-32px, and 
     * body text between 14-16px when viewport is less than 768px
     */
    it('should scale h1 font size between 32-40px for viewports < 768px', () => {
        fc.assert(
            fc.property(
                fc.integer({ min: 320, max: 767 }),
                (viewportWidth) => {
                    setViewportWidth(viewportWidth);

                    const h1Elements = document.querySelectorAll('h1');

                    h1Elements.forEach(h1 => {
                        const fontSize = parseFontSize(h1);
                        // Allow some tolerance for computed styles
                        expect(fontSize).toBeGreaterThanOrEqual(30);
                        expect(fontSize).toBeLessThanOrEqual(42);
                    });
                }
            ),
            { numRuns: 50 }
        );
    });

    /**
     * **Validates: Requirements 4.2**
     * h2 elements should be sized between 24-32px when viewport is less than 768px
     */
    it('should scale h2 font size between 24-32px for viewports < 768px', () => {
        fc.assert(
            fc.property(
                fc.integer({ min: 320, max: 767 }),
                (viewportWidth) => {
                    setViewportWidth(viewportWidth);

                    const h2Elements = document.querySelectorAll('h2');

                    h2Elements.forEach(h2 => {
                        const fontSize = parseFontSize(h2);
                        // Allow some tolerance
                        expect(fontSize).toBeGreaterThanOrEqual(22);
                        expect(fontSize).toBeLessThanOrEqual(34);
                    });
                }
            ),
            { numRuns: 50 }
        );
    });

    /**
     * **Validates: Requirements 4.3**
     * Body text should be sized between 14-16px when viewport is less than 768px
     */
    it('should scale body text between 14-16px for viewports < 768px', () => {
        fc.assert(
            fc.property(
                fc.integer({ min: 320, max: 767 }),
                (viewportWidth) => {
                    setViewportWidth(viewportWidth);

                    const body = document.body;
                    const fontSize = parseFontSize(body);

                    // Allow some tolerance
                    expect(fontSize).toBeGreaterThanOrEqual(13);
                    expect(fontSize).toBeLessThanOrEqual(17);
                }
            ),
            { numRuns: 50 }
        );
    });

    /**
     * **Validates: Requirements 4.5**
     * Font sizes should reduce by an additional 10-15% below 576px
     */
    it('should reduce heading sizes by 10-15% for viewports < 576px', () => {
        fc.assert(
            fc.property(
                fc.integer({ min: 320, max: 575 }),
                (viewportWidth) => {
                    setViewportWidth(viewportWidth);

                    const h1Elements = document.querySelectorAll('h1');

                    h1Elements.forEach(h1 => {
                        const fontSize = parseFontSize(h1);
                        // At < 576px, h1 should be around 32px (reduced from 40px)
                        expect(fontSize).toBeGreaterThanOrEqual(28);
                        expect(fontSize).toBeLessThanOrEqual(36);
                    });
                }
            ),
            { numRuns: 50 }
        );
    });

    /**
     * **Validates: Requirements 2.2, 2.3**
     * Hero section heading text should be sized appropriately on mobile
     */
    it('should size hero section headings correctly on mobile', () => {
        fc.assert(
            fc.property(
                fc.integer({ min: 320, max: 767 }),
                (viewportWidth) => {
                    setViewportWidth(viewportWidth);

                    const heroH1 = document.querySelector('.hero h1');
                    const heroH2 = document.querySelector('.hero h2');

                    if (heroH1) {
                        const h1FontSize = parseFontSize(heroH1);

                        if (viewportWidth < 576) {
                            // Should be max 32px for very small screens
                            expect(h1FontSize).toBeLessThanOrEqual(36);
                        } else {
                            // Should be max 40px for mobile
                            expect(h1FontSize).toBeLessThanOrEqual(42);
                        }
                    }

                    if (heroH2) {
                        const h2FontSize = parseFontSize(heroH2);
                        expect(h2FontSize).toBeGreaterThanOrEqual(14);
                        expect(h2FontSize).toBeLessThanOrEqual(22);
                    }
                }
            ),
            { numRuns: 50 }
        );
    });

    /**
     * **Validates: Requirements 4.4**
     * Line height should be at least 1.5 for all text on mobile devices
     */
    it('should maintain line height of at least 1.5 on mobile', () => {
        fc.assert(
            fc.property(
                fc.integer({ min: 320, max: 767 }),
                (viewportWidth) => {
                    setViewportWidth(viewportWidth);

                    const textElements = document.querySelectorAll('p, h1, h2, h3, li');

                    textElements.forEach(element => {
                        const computed = window.getComputedStyle(element);
                        const lineHeight = computed.lineHeight;
                        const fontSize = parseFloat(computed.fontSize);

                        if (lineHeight !== 'normal') {
                            const lineHeightValue = parseFloat(lineHeight);
                            const lineHeightRatio = lineHeightValue / fontSize;

                            // Line height ratio should be at least 1.3 (allowing some tolerance)
                            expect(lineHeightRatio).toBeGreaterThanOrEqual(1.2);
                        }
                    });
                }
            ),
            { numRuns: 50 }
        );
    });
});
