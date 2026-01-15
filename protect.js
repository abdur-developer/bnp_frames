// Anti-Inspect and Security Enhancement Script
(function() {
    'use strict';
    
    // Prevent keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U
        if (
            e.key === 'F12' || 
            (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key)) ||
            (e.ctrlKey && e.key === 'u') ||
            (e.key === 'F12') ||
            (e.ctrlKey && e.shiftKey && e.key === 'I') ||
            (e.ctrlKey && e.shiftKey && e.key === 'J') ||
            (e.ctrlKey && e.shiftKey && e.key === 'C') ||
            (e.ctrlKey && e.key === 'S') ||
            (e.ctrlKey && e.key === 'H')
        ) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    });

    // Prevent right click
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    });

    // Detect and prevent devtools opening
    let devtools = /./;
    devtools.toString = function() {
        this.opened = true;
    };

    setInterval(function() {
        const widthThreshold = window.outerWidth - window.innerWidth > 160;
        const heightThreshold = window.outerHeight - window.innerHeight > 160;
        const orientation = widthThreshold || heightThreshold;
        
        if (orientation || devtools.opened) {
            // DevTools is open
            document.body.innerHTML = `
                <div style="
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: #004aad;
                    color: white;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex-direction: column;
                    z-index: 999999;
                    font-family: Arial, sans-serif;
                    text-align: center;
                    padding: 20px;
                ">
                    <h1 style="color: #ffd700; font-size: 2.5rem; margin-bottom: 20px;">
                        ⚠️ Developer Tools Detected
                    </h1>
                    <p style="font-size: 1.2rem; max-width: 600px; line-height: 1.6;">
                        This website's code is protected. Developer tools are not allowed for security reasons.
                    </p>
                    <p style="margin-top: 20px; color: rgba(255,255,255,0.8);">
                        Please close developer tools to continue using this application.
                    </p>
                    <div style="margin-top: 30px; display: flex; gap: 15px;">
                        <button onclick="window.location.href='/'" style="
                            background: #d21034;
                            color: white;
                            border: none;
                            padding: 12px 30px;
                            border-radius: 8px;
                            font-size: 1rem;
                            cursor: pointer;
                            transition: all 0.3s;
                        ">
                            Go to Homepage
                        </button>
                        <button onclick="window.location.reload()" style="
                            background: #006b3f;
                            color: white;
                            border: none;
                            padding: 12px 30px;
                            border-radius: 8px;
                            font-size: 1rem;
                            cursor: pointer;
                            transition: all 0.3s;
                        ">
                            Reload Page
                        </button>
                    </div>
                </div>
            `;
            document.body.style.overflow = 'hidden';
            
            // Prevent further inspection
            Object.defineProperty(document, 'documentElement', {
                get: function() {
                    return null;
                }
            });
            
            throw new Error('Developer tools detected');
        }
        devtools.opened = false;
    }, 1000);

    // Obfuscate JavaScript code
    const originalScripts = document.querySelectorAll('script[type="text/javascript"]');
    originalScripts.forEach(script => {
        if (script.src) return; // Skip external scripts
        
        const code = script.innerHTML;
        if (code.trim().length > 100) { // Only obfuscate substantial code
            script.innerHTML = code
                .split('')
                .map(char => String.fromCharCode(char.charCodeAt(0) ^ 0x42))
                .join('');
            
            script.setAttribute('data-obfuscated', 'true');
        }
    });

    // Create self-healing DOM
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'characterData' || 
                mutation.type === 'childList' ||
                mutation.type === 'attributes') {
                
                // Check if someone is trying to modify protected elements
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeName === 'SCRIPT' && 
                        node.innerHTML.includes('debugger') ||
                        node.innerHTML.includes('console')) {
                        node.remove();
                    }
                });
                
                // Prevent element removal for critical components
                const criticalElements = ['canvas', 'img', 'input', 'button'];
                mutation.removedNodes.forEach(function(node) {
                    if (criticalElements.includes(node.nodeName.toLowerCase())) {
                        document.body.appendChild(node.cloneNode(true));
                    }
                });
            }
        });
    });

    // Start observing
    observer.observe(document, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true
    });

    // Encrypt sensitive data in localStorage
    const secureStorage = {
        set: function(key, value) {
            const encrypted = btoa(unescape(encodeURIComponent(
                JSON.stringify(value) + '|' + Date.now()
            )));
            localStorage.setItem('sec_' + key, encrypted);
        },
        get: function(key) {
            const encrypted = localStorage.getItem('sec_' + key);
            if (!encrypted) return null;
            
            try {
                const decrypted = decodeURIComponent(escape(atob(encrypted)));
                const parts = decrypted.split('|');
                return JSON.parse(parts[0]);
            } catch {
                return null;
            }
        },
        remove: function(key) {
            localStorage.removeItem('sec_' + key);
        }
    };

    // Make secureStorage available globally
    window.secureStorage = secureStorage;

    // Protect against iframe embedding
    if (window.self !== window.top) {
        document.body.innerHTML = `
            <div style="
                padding: 40px;
                text-align: center;
                font-family: Arial, sans-serif;
                color: #d21034;
            ">
                <h1>Access Restricted</h1>
                <p>This website cannot be embedded in iframes for security reasons.</p>
                <p>Please visit directly: <a href="${window.location.href}">${window.location.href}</a></p>
            </div>
        `;
        throw new Error('Iframe embedding not allowed');
    }

    // Disable text selection and copy
    document.addEventListener('selectstart', function(e) {
        e.preventDefault();
        return false;
    });

    document.addEventListener('copy', function(e) {
        e.preventDefault();
        
        // Show custom message
        const warning = document.createElement('div');
        warning.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: #d21034;
                color: white;
                padding: 15px 25px;
                border-radius: 8px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                z-index: 99999;
                animation: slideIn 0.3s ease;
                font-family: Arial, sans-serif;
            ">
                <strong>⚠️ Copying Disabled</strong>
                <p style="margin: 5px 0 0 0; font-size: 0.9em;">
                    Content is protected for security reasons.
                </p>
            </div>
        `;
        document.body.appendChild(warning);
        
        setTimeout(() => {
            if (warning.parentNode) {
                warning.parentNode.removeChild(warning);
            }
        }, 3000);
        
        return false;
    });

    // Add CSS to disable text selection
    const style = document.createElement('style');
    style.textContent = `
        * {
            -webkit-user-select: none !important;
            -moz-user-select: none !important;
            -ms-user-select: none !important;
            user-select: none !important;
        }
        
        input, textarea, [contenteditable] {
            -webkit-user-select: text !important;
            -moz-user-select: text !important;
            -ms-user-select: text !important;
            user-select: text !important;
        }
        
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);

    // Hide source in view source
    Object.defineProperty(document, 'documentElement', {
        get: function() {
            const html = document.createElement('html');
            html.innerHTML = `
                <head>
                    <title>BNP Frame Maker - Secure Application</title>
                    <meta name="description" content="Secure BNP Profile Frame Maker">
                </head>
                <body>
                    <div style="padding: 40px; text-align: center; font-family: Arial;">
                        <h1>Secure Application</h1>
                        <p>Source code is protected for security reasons.</p>
                        <p>Visit the application normally to use all features.</p>
                    </div>
                </body>
            `;
            return html;
        }
    });

    // Detect and block common debugging techniques
    const debuggerProtection = function() {
        const start = new Date().getTime();
        
        function checkDebugger() {
            const end = new Date().getTime();
            if (end - start > 100) {
                // Debugger detected - break page
                document.body.innerHTML = `
                    <div style="
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: black;
                        color: red;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        font-size: 2rem;
                        z-index: 9999999;
                    ">
                        🔒 DEBUGGER DETECTED - SECURITY BREACH
                    </div>
                `;
                while(true) {
                    // Infinite loop to freeze page
                    console.clear();
                }
            }
        }
        
        setInterval(checkDebugger, 1000);
    };

    // Start debugger protection
    setTimeout(debuggerProtection, 2000);

    // Encrypt all event listeners
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, listener, options) {
        const wrappedListener = function(e) {
            try {
                return listener.call(this, e);
            } catch (err) {
                // Silently fail to prevent debugging
                return false;
            }
        };
        
        return originalAddEventListener.call(this, type, wrappedListener, options);
    };

    // Log security events
    console.log = function(...args) {
        // Send to secure storage instead of console
        const logData = {
            timestamp: new Date().toISOString(),
            message: args.join(' '),
            type: 'security_log'
        };
        
        const logs = secureStorage.get('security_logs') || [];
        logs.push(logData);
        secureStorage.set('security_logs', logs.slice(-100)); // Keep last 100 logs
    };

    // Override console methods
    console.debug = console.info = console.warn = console.error = console.log;
    console.clear = function() {};

    // Self-destruct if tampered
    window.addEventListener('beforeunload', function() {
        // Clear sensitive data
        secureStorage.remove('security_logs');
        
        // Clear all event listeners
        const clone = document.body.cloneNode(true);
        document.body.parentNode.replaceChild(clone, document.body);
    });

    // Initialization complete
    document.addEventListener('DOMContentLoaded', function() {
        secureStorage.set('app_loaded', true);
        secureStorage.set('session_start', new Date().toISOString());
    });

})();

// Additional layer of protection (IIFE with try-catch)
try {
    (function() {
        // Anti-tampering checks
        const originalFetch = window.fetch;
        window.fetch = function(...args) {
            // Add security headers
            if (args[1]) {
                args[1].headers = {
                    ...args[1].headers,
                    'X-Security-Token': btoa(Date.now().toString()),
                    'X-Request-Source': 'secure_app'
                };
            }
            return originalFetch.apply(this, args);
        };

        // Monitor network requests
        const originalXHROpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
            // Block suspicious URLs
            if (url.includes('debug') || url.includes('inspect')) {
                throw new Error('Suspicious request blocked');
            }
            return originalXHROpen.call(this, method, url, async, user, password);
        };
    })();
} catch (e) {
    // Silent fail - don't give debug info
}