// Minimal Security Protection
(() => {
    'use strict';
    
    // Basic right-click disable
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        return false;
    });
    
    // Basic copy protection
    document.addEventListener('copy', (e) => {
        e.preventDefault();
        return false;
    });
    
    // Add minimal CSS for user-select
    const style = document.createElement('style');
    style.textContent = `
        body *:not(input):not(textarea):not([contenteditable]) {
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
        }
    `;
    document.head.appendChild(style);
    
    // Simple keyboard shortcut block
    document.addEventListener('keydown', (e) => {
        // Only block F12
        if (e.key === 'F12') {
            e.preventDefault();
            return false;
        }
        
        // Block Ctrl+Shift+I and Ctrl+Shift+J
        if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) {
            e.preventDefault();
            return false;
        }
    });
    
    // Simple devtools detection (lightweight)
    const checkDevTools = () => {
        const threshold = 160;
        const widthDiff = window.outerWidth - window.innerWidth;
        const heightDiff = window.outerHeight - window.innerHeight;
        
        if (widthDiff > threshold || heightDiff > threshold) {
            // Simple warning without breaking functionality
            console.warn('Developer tools detected');
        }
    };
    
    // Check less frequently to save performance
    setInterval(checkDevTools, 3000);
    
    // Performance monitoring
    const perfStart = performance.now();
    
    // Optional: Add a small delay for page load to prevent quick inspection
    window.addEventListener('load', () => {
        const perfEnd = performance.now();
        const loadTime = perfEnd - perfStart;
        
        // Only show protection if page loaded too fast (bot detection)
        if (loadTime < 100) {
            document.body.style.opacity = '0';
            setTimeout(() => {
                document.body.style.opacity = '1';
            }, 100);
        }
    });
})();

// Optional: Simple view source protection
if (window.location.protocol === 'file:') {
    console.log('Local file access detected');
}

// Simple iframe protection
if (window.self !== window.top) {
    try {
        window.top.location = window.self.location;
    } catch (e) {
        document.body.innerHTML = '<p style="padding:20px;text-align:center;">This site cannot be framed.</p>';
    }
}

// Minimal console protection (non-blocking)
const originalLog = console.log;
console.log = function(...args) {
    // Allow logging but add watermark
    originalLog.apply(console, ['🔒 Secure App:', ...args]);
};

// Clean version - no heavy obfuscation
