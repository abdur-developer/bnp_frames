// Facebook in-app browser detection and redirect
(function() {
    'use strict';
    
    // Function to detect Facebook in-app browser
    function isFacebookInAppBrowser() {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        
        // Check for Facebook in-app browser indicators
        const isFacebookApp = /FBAN|FBAV|FB_IAB|FB4A/i.test(userAgent);
        const isInstagram = /Instagram/i.test(userAgent);
        
        // Check for iOS webview (Facebook uses UIWebView/WKWebView)
        const isIOSWebView = /iPhone|iPad|iPod/.test(userAgent) && 
                             /AppleWebKit/.test(userAgent) && 
                             !/Safari/.test(userAgent) &&
                             !/CriOS/.test(userAgent) && 
                             !/FxiOS/.test(userAgent);
        
        // Check for Android webview (Facebook uses WebView)
        const isAndroidWebView = /Android/.test(userAgent) && 
                                 /AppleWebKit/.test(userAgent) && 
                                 !/Chrome/.test(userAgent) &&
                                 !/Firefox/.test(userAgent) &&
                                 !/SamsungBrowser/.test(userAgent);
        
        return isFacebookApp || isInstagram || isIOSWebView || isAndroidWebView;
    }
    
    // Function to redirect to external browser
    function redirectToExternalBrowser() {
        // Get current URL
        const currentUrl = encodeURIComponent(window.location.href);
        
        // Create platform-specific redirect URLs
        const redirectUrls = {
            android: `intent://bnpframe.vercel.app/#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=https://bnpframe.vercel.app/;end;`,
            ios: `googlechrome://bnpframe.vercel.app/`,
            fallback: `https://bnpframe.vercel.app/`
        };
        
        // Create redirect page
        const redirectPage = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>BNP Frame Maker - Open in Browser</title>
                <style>
                    body {
                        font-family: 'Arial', sans-serif;
                        background: linear-gradient(135deg, #034703, #028402);
                        color: white;
                        margin: 0;
                        padding: 20px;
                        min-height: 100vh;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        text-align: center;
                    }
                    .container {
                        max-width: 500px;
                        background: rgba(255, 255, 255, 0.1);
                        padding: 40px;
                        border-radius: 20px;
                        backdrop-filter: blur(10px);
                        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                    }
                    h1 {
                        color: #ffd700;
                        margin-bottom: 20px;
                        font-size: 28px;
                    }
                    p {
                        line-height: 1.6;
                        margin-bottom: 20px;
                        font-size: 16px;
                    }
                    .btn {
                        display: inline-block;
                        background: #ffd700;
                        color: #034703;
                        padding: 15px 30px;
                        border-radius: 50px;
                        text-decoration: none;
                        font-weight: bold;
                        font-size: 18px;
                        margin: 10px;
                        border: 2px solid white;
                        transition: all 0.3s;
                        box-shadow: 0 5px 15px rgba(255, 215, 0, 0.3);
                    }
                    .btn:hover {
                        transform: translateY(-3px);
                        box-shadow: 0 8px 20px rgba(255, 215, 0, 0.4);
                    }
                    .steps {
                        background: rgba(255, 255, 255, 0.15);
                        padding: 20px;
                        border-radius: 10px;
                        margin: 25px 0;
                        text-align: left;
                    }
                    .steps ol {
                        padding-left: 20px;
                    }
                    .steps li {
                        margin-bottom: 10px;
                        padding-left: 5px;
                    }
                    .icon {
                        font-size: 50px;
                        margin-bottom: 20px;
                        animation: bounce 2s infinite;
                    }
                    @keyframes bounce {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-10px); }
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="icon">🔓</div>
                    <h1>Open in Browser</h1>
                    <p>For better experience and download support, please open this website in your default browser.</p>
                    
                    <div class="steps">
                        <p><strong>Follow these steps:</strong></p>
                        <ol>
                            <li>Tap the button below</li>
                            <li>Select "Open in Browser" or "Chrome"</li>
                            <li>Allow downloads in browser settings</li>
                            <li>Enjoy full features!</li>
                        </ol>
                    </div>
                    
                    <a href="${redirectUrls.android}" class="btn" id="androidBtn">
                        Open in Chrome Browser
                    </a>
                    
                    <p style="margin-top: 20px; font-size: 14px; opacity: 0.9;">
                        If the button doesn't work, copy this URL and paste in your browser:<br>
                        <strong style="color: #ffd700;">bnpframe.vercel.app</strong>
                    </p>
                </div>
                
                <script>
                    // Auto-detect platform and redirect
                    const userAgent = navigator.userAgent;
                    const isAndroid = /Android/i.test(userAgent);
                    const isIOS = /iPhone|iPad|iPod/i.test(userAgent);
                    
                    if (isAndroid) {
                        // Try Android intent first
                        setTimeout(() => {
                            window.location = '${redirectUrls.android}';
                        }, 100);
                        
                        // Fallback after 2 seconds
                        setTimeout(() => {
                            window.location = '${redirectUrls.fallback}';
                        }, 2000);
                    } else if (isIOS) {
                        // Try Chrome for iOS
                        setTimeout(() => {
                            window.location = '${redirectUrls.ios}';
                        }, 100);
                        
                        // Fallback to Safari
                        setTimeout(() => {
                            window.location = '${redirectUrls.fallback}';
                        }, 2000);
                    }
                    
                    // Button click handlers
                    document.getElementById('androidBtn').addEventListener('click', function(e) {
                        if (isAndroid) {
                            window.location = '${redirectUrls.android}';
                        } else if (isIOS) {
                            window.location = '${redirectUrls.ios}';
                        } else {
                            window.location = '${redirectUrls.fallback}';
                        }
                    });
                </script>
            </body>
            </html>
        `;
        
        // Replace current page with redirect page
        document.open();
        document.write(redirectPage);
        document.close();
    }
    
    // Check if in Facebook in-app browser on page load
    if (isFacebookInAppBrowser()) {
        // Add a small delay to ensure page loads
        setTimeout(redirectToExternalBrowser, 500);
    }
    
    // Also check on page visibility change (if user switches back to Facebook)
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden && isFacebookInAppBrowser()) {
            redirectToExternalBrowser();
        }
    });
    
    // Make function available globally for manual trigger
    window.redirectToBrowser = redirectToExternalBrowser;
    
    // Add a button in your app to manually trigger redirect
    function addManualRedirectButton() {
        const button = document.createElement('button');
        button.innerHTML = '🔓 Open in Browser';
        button.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #ffd700;
            color: #034703;
            border: none;
            padding: 12px 20px;
            border-radius: 25px;
            font-weight: bold;
            cursor: pointer;
            z-index: 9999;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            font-size: 14px;
            display: none;
        `;
        
        button.onclick = redirectToExternalBrowser;
        document.body.appendChild(button);
        
        // Show button only in Facebook browser
        if (isFacebookInAppBrowser()) {
            button.style.display = 'block';
        }
    }
    
    // Add manual redirect button after page loads
    window.addEventListener('load', function() {
        setTimeout(addManualRedirectButton, 1000);
    });
})();

// Application Configuration
const CONFIG = {
    canvasSize: 2048, // HD Quality
    previewSize: 320,
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    frames: [
        {
            id: 11,
            file: '11.png'
        },
        {
            id: 10,
            file: '10.png'
        },
        {
            id: 9,
            file: '9.png'
        },
        {
            id: 1,
            file: '1.png'
        },
        {
            id: 2,
            file: '2.png'
        },
        {
            id: 3,
            file: '3.png'
        },
        {
            id: 4,
            file: '4.png'
        },
        {
            id: 5,
            file: '5.png'
        },
        {
            id: 6,
            file: '6.png'
        },
        {
            id: 7,
            file: '7.png'
        },
        {
            id: 8,
            file: '8.png'
        }
    ]
};

// Global State
const state = {
    userImage: null,
    userImageUrl: null,
    currentFrame: CONFIG.frames[0],
    settings: {
        zoom: 1.0,
        rotate: 0,
        brightness: 100,
        flipHorizontal: false,
        flipVertical: false
    },
    isImageLoaded: false
};

// DOM Elements
const elements = {
    // Preview elements
    userImage: document.getElementById('userImage'),
    frameOverlay: document.getElementById('frameOverlay'),
    defaultPreview: document.getElementById('defaultPreview'),
    previewWrapper: document.getElementById('previewWrapper'),
    
    // Input elements
    fileInput: document.getElementById('fileInput'),
    uploadBtn: document.getElementById('uploadBtn'),
    downloadBtn: document.getElementById('downloadBtn'),
    resetBtn: document.getElementById('resetBtn'),
    
    // Control elements
    zoomSlider: document.getElementById('zoomSlider'),
    rotateSlider: document.getElementById('rotateSlider'),
    brightnessSlider: document.getElementById('brightnessSlider'),
    zoomValue: document.getElementById('zoomValue'),
    rotateValue: document.getElementById('rotateValue'),
    brightnessValue: document.getElementById('brightnessValue'),
    flipHorizontal: document.getElementById('flipHorizontal'),
    flipVertical: document.getElementById('flipVertical'),
    
    // Frames elements
    framesGrid: document.getElementById('framesGrid'),
    
    // Quick action elements
    sampleBtn: document.getElementById('sampleBtn'),
    savePresetBtn: document.getElementById('savePresetBtn'),
    shareBtn: document.getElementById('shareBtn'),
    
    // Loading overlay
    loadingOverlay: document.getElementById('loadingOverlay')
};

// Initialize the application
function init() {
    setupEventListeners();
    renderFrames();
    updateUI();
    // showToast('স্বাগতম! ছবি আপলোড করে শুরু করুন।', 'info');
    //loadSampleImage();
    // selectFrame(CONFIG.frames[0]);
}

// Setup all event listeners
function setupEventListeners() {
    // File upload
    elements.uploadBtn.addEventListener('click', () => elements.fileInput.click());
    elements.fileInput.addEventListener('change', handleFileUpload);
    
    // Controls
    elements.zoomSlider.addEventListener('input', handleControlChange);
    elements.rotateSlider.addEventListener('input', handleControlChange);
    elements.brightnessSlider.addEventListener('input', handleControlChange);
    elements.flipHorizontal.addEventListener('click', toggleFlipHorizontal);
    elements.flipVertical.addEventListener('click', toggleFlipVertical);
    
    // Actions
    elements.downloadBtn.addEventListener('click', handleDownload);
    elements.resetBtn.addEventListener('click', resetControls);
    elements.sampleBtn.addEventListener('click', loadSampleImage);
    // elements.savePresetBtn.addEventListener('click', savePreset);
    elements.shareBtn.addEventListener('click', shareImage);
}

// Render frames grid
function renderFrames() {
    elements.framesGrid.innerHTML = '';
    
    CONFIG.frames.forEach(frame => {
        const frameElement = document.createElement('div');
        frameElement.className = `frame-item ${frame.id === state.currentFrame.id ? 'selected' : ''}`;
        frameElement.innerHTML = `
            <div class="frame-preview">
                <img src="assets/abdur.png" class="frame-image" alt="Frame preview">
                <img src="frames/${frame.file}" class="frame-overlay-preview">
            </div>
        `;
        
        // Update preview image if user image exists
        const frameImage = frameElement.querySelector('.frame-image');
        if (state.userImage) {
            frameImage.src = state.userImageUrl;
            frameImage.style.transform = `scale(${state.settings.zoom}) rotate(${state.settings.rotate}deg)`;
            frameImage.style.filter = `brightness(${state.settings.brightness}%)`;
        }
        
        frameElement.addEventListener('click', () => selectFrame(frame));
        elements.framesGrid.appendChild(frameElement);
    });
}

// Handle file upload
function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validate file
    if (file.size > CONFIG.maxFileSize) {
        showToast('ফাইল সাইজ ৫MB এর বেশি হতে পারবে না।', 'error');
        return;
    }
    
    if (!CONFIG.allowedTypes.includes(file.type)) {
        showToast('দয়া করে JPEG, PNG, অথবা WebP ফরম্যাটের ছবি আপলোড করুন।', 'error');
        return;
    }
    
    // Show loading
    showLoading();
    
    // Check if this is first upload
    const isFirstUpload = !state.isImageLoaded;
    
    // Read file
    const reader = new FileReader();
    reader.onload = function(e) {
        loadImage(e.target.result);
        showToast('ছবি সফলভাবে আপলোড হয়েছে!', 'success');
        hideLoading();
        
        // Call selectFrame on first upload
        if (isFirstUpload) {
            selectFrame(CONFIG.frames[0]);
        }
    };
    reader.onerror = function() {
        showToast('ছবি লোড করতে সমস্যা হয়েছে।', 'error');
        hideLoading();
    };
    reader.readAsDataURL(file);
    
}

// Load image from URL/data URL
function loadImage(src) {
    // Clean up previous image URL
    if (state.userImageUrl) {
        URL.revokeObjectURL(state.userImageUrl);
    }
    
    state.userImageUrl = src;
    state.userImage = new Image();
    state.userImage.crossOrigin = 'anonymous';
    state.userImage.src = src;
    
    state.userImage.onload = function() {
        state.isImageLoaded = true;
        updatePreview();
        updateFramePreviews();
        updateUI();
        hideLoading();
    };
    
    state.userImage.onerror = function() {
        showToast('ছবি লোড করতে সমস্যা হয়েছে।', 'error');
        state.isImageLoaded = false;
        updateUI();
        hideLoading();
    };
}

// Handle control changes
function handleControlChange(event) {
    const control = event.target.id;
    const value = event.target.value;
    
    switch(control) {
        case 'zoomSlider':
            state.settings.zoom = parseFloat(value);
            elements.zoomValue.textContent = `${value}x`;
            break;
        case 'rotateSlider':
            state.settings.rotate = parseInt(value);
            elements.rotateValue.textContent = `${value}°`;
            break;
        case 'brightnessSlider':
            state.settings.brightness = parseInt(value);
            elements.brightnessValue.textContent = `${value}%`;
            break;
    }
    
    updatePreview();
    updateFramePreviews();
}

// Toggle flip horizontal
function toggleFlipHorizontal() {
    state.settings.flipHorizontal = !state.settings.flipHorizontal;
    updatePreview();
    updateFramePreviews();
}

// Toggle flip vertical
function toggleFlipVertical() {
    state.settings.flipVertical = !state.settings.flipVertical;
    updatePreview();
    updateFramePreviews();
}

// Update preview image
function updatePreview() {
    if (!state.isImageLoaded) return;
    elements.userImage.src = state.userImageUrl;
    const transform = [];
    
    // Apply flip
    if (state.settings.flipHorizontal) {
        transform.push('scaleX(-1)');
    }
    if (state.settings.flipVertical) {
        transform.push('scaleY(-1)');
    }
    
    // Apply zoom and rotate
    transform.push(`scale(${state.settings.zoom})`);
    transform.push(`rotate(${state.settings.rotate}deg)`);
    
    // Apply brightness
    const filter = `brightness(${state.settings.brightness}%)`;
    
    // Update image
    elements.userImage.style.transform = transform.join(' ');
    elements.userImage.style.filter = filter;
    
    // Show user image, hide default preview
    elements.userImage.classList.remove('hidden');
    elements.defaultPreview.classList.add('hidden');
}

// Update all frame previews
function updateFramePreviews() {
    const frameImages = document.querySelectorAll('.frame-image');
    frameImages.forEach(img => {
        if (state.userImageUrl) {
            img.src = state.userImageUrl;
            
            const transform = [];
            if (state.settings.flipHorizontal) transform.push('scaleX(-1)');
            if (state.settings.flipVertical) transform.push('scaleY(-1)');
            transform.push(`scale(${state.settings.zoom})`);
            transform.push(`rotate(${state.settings.rotate}deg)`);
            
            img.style.transform = transform.join(' ');
            img.style.filter = `brightness(${state.settings.brightness}%)`;
        }
    });
}

// Select a frame
function selectFrame(frame) {
    state.currentFrame = frame;
    
    // Update frame overlay
    elements.frameOverlay.src = `frames/${frame.file}`;
    
    // Update selected state in frames grid
    document.querySelectorAll('.frame-item').forEach(item => {
        item.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');
    
    showToast(`ফ্রেম সিলেক্ট করা হয়েছে`, 'success');
}

// Handle download
async function handleDownload() {
    if (!state.isImageLoaded) {
        showToast('প্রথমে একটি ছবি আপলোড করুন।', 'error');
        return;
    }
    
    showLoading();
    
    try {
        // Create a temporary canvas for HD image
        const canvas = document.createElement('canvas');
        canvas.width = CONFIG.canvasSize;
        canvas.height = CONFIG.canvasSize;
        const ctx = canvas.getContext('2d');
        
        // Draw background
        ctx.fillStyle = '#034703';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw user image with transformations
        await drawUserImageOnCanvas(ctx);
        
        // Draw frame overlay
        await drawFrameOnCanvas(ctx);
        
        // Convert to blob and download
        canvas.toBlob(blob => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = `bnp_abdur09266@gmail.com_${Math.floor(1000 + Math.random() * 9000)}.png`;
            link.href = url;
            link.click();
            
            // Cleanup
            URL.revokeObjectURL(url);
            
            hideLoading();
            showToast('HD ছবি ডাউনলোড শুরু হয়েছে!', 'success');
        }, 'image/png', 1.0);
        
    } catch (error) {
        console.error('Download error:', error);
        hideLoading();
        showToast('ডাউনলোড করতে সমস্যা হয়েছে।', 'error');
    }
}

// Draw user image on canvas with transformations
async function drawUserImageOnCanvas(ctx) {
    return new Promise((resolve) => {
        const canvasSize = CONFIG.canvasSize;
        
        // ১. সবুজ ব্যাকগ্রাউন্ড
        ctx.fillStyle = '#00a524';
        ctx.fillRect(0, 0, canvasSize, canvasSize);
        
        ctx.save();
        
        // ২. ক্যানভাসের মাঝে নিন
        ctx.translate(canvasSize / 2, canvasSize / 2);
        
        // ৩. রোটেশন অ্যাপ্লাই করুন
        ctx.rotate(state.settings.rotate * Math.PI / 180);
        
        // ৪. ফ্লিপ অ্যাপ্লাই করুন
        if (state.settings.flipHorizontal) {
            ctx.scale(-1, 1);
        }
        if (state.settings.flipVertical) {
            ctx.scale(1, -1);
        }
        
        // ৫. ইমেজের aspect ratio এবং ক্যানভাসের aspect ratio ক্যালকুলেট করুন
        const imgWidth = state.userImage.naturalWidth;
        const imgHeight = state.userImage.naturalHeight;
        const imgAspect = imgWidth / imgHeight;
        const canvasAspect = 1; // square canvas
        
        let drawWidth, drawHeight;
        
        // ৬. Cover mode: ইমেজ সম্পূর্ণ ক্যানভাস জুড়ে থাকবে (কোন ফাঁকা থাকবে না)
        if (imgAspect > canvasAspect) {
            // ইমেজ wider - height ক্যানভাসের মত রেখে width orড়ান
            drawHeight = canvasSize;
            drawWidth = drawHeight * imgAspect;
        } else {
            // ইমেজ taller - width ক্যানভাসের মত রেখে height orড়ান
            drawWidth = canvasSize;
            drawHeight = drawWidth / imgAspect;
        }
        
        // ৭. জুম অ্যাপ্লাই করুন
        drawWidth *= state.settings.zoom;
        drawHeight *= state.settings.zoom;
        
        // ৮. ইমেজ draw করুন (সম্পূর্ণ ক্যানভাস কভার করবে)
        ctx.drawImage(
            state.userImage,
            -drawWidth / 2,
            -drawHeight / 2,
            drawWidth,
            drawHeight
        );
        
        ctx.restore();
        resolve();
    });
}

// Draw frame on canvas
async function drawFrameOnCanvas(ctx) {
    return new Promise((resolve) => {
        const canvasSize = CONFIG.canvasSize;
        const frameImage = new Image();
        frameImage.crossOrigin = 'anonymous';
        frameImage.src = `frames/${state.currentFrame.file}`;
        
        frameImage.onload = function() {
            ctx.drawImage(frameImage, 0, 0, canvasSize, canvasSize);
            resolve();
        };
        
        frameImage.onerror = function() {
            resolve(); // Continue without frame if error
        };
    });
}

// Reset all controls to default
function resetControls() {
    state.settings = {
        zoom: 1.0,
        rotate: 0,
        brightness: 100,
        flipHorizontal: false,
        flipVertical: false
    };
    
    // Update sliders
    elements.zoomSlider.value = state.settings.zoom;
    elements.rotateSlider.value = state.settings.rotate;
    elements.brightnessSlider.value = state.settings.brightness;
    
    // Update display values
    elements.zoomValue.textContent = `${state.settings.zoom}x`;
    elements.rotateValue.textContent = `${state.settings.rotate}°`;
    elements.brightnessValue.textContent = `${state.settings.brightness}%`;
    
    updatePreview();
    updateFramePreviews();
    showToast('সকল সেটিংস রিসেট করা হয়েছে।', 'info');
}

// Load sample image
function loadSampleImage() {
    showLoading();
    
    // Use a sample image URL
    const sampleImageUrl = './assets/abdur.png';
    
    // Direct fetch without proxy (for same-origin requests)
    fetch(sampleImageUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.blob();
        })
        .then(blob => {
            const reader = new FileReader();
            reader.onload = function(e) {
                loadImage(e.target.result);
                showToast('স্যাম্পল ছবি লোড করা হয়েছে!', 'success');
                hideLoading();
            };
            reader.onloadend = function() {
                hideLoading();
            };
            reader.onerror = function() {
                showToast('ছবি লোড করতে সমস্যা হয়েছে।', 'error');
                hideLoading();
            };
            reader.readAsDataURL(blob);
        })
        .catch(error => {
            console.error('Sample image load error:', error);
            showToast('স্যাম্পল ছবি লোড করতে সমস্যা হয়েছে।', 'error');
            hideLoading();
            loadImage(sampleImageUrl);
        });
}

// Save preset (simulate)
function savePreset() {
    const preset = {
        settings: state.settings,
        frame: state.currentFrame,
        timestamp: Date.now()
    };
    
    localStorage.setItem('profilePreset', JSON.stringify(preset));
    showToast('প্রিসেট সংরক্ষণ করা হয়েছে!', 'success');
}

// Share image
async function shareImage() {
    if (!state.isImageLoaded) {
        showToast('প্রথমে একটি ছবি তৈরি করুন।', 'error');
        return;
    }
    
    showLoading();
    
    try {
        // Create a smaller canvas for sharing
        const canvas = document.createElement('canvas');
        canvas.width = 1200;
        canvas.height = 1200;
        const ctx = canvas.getContext('2d');
        
        // Draw background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw user image
        await drawUserImageOnCanvas(ctx);
        
        // Draw frame overlay
        await drawFrameOnCanvas(ctx);
        
        // Convert to blob
        canvas.toBlob(blob => {
            if (navigator.share) {
                // Use Web Share API if available
                const file = new File([blob], 'profile-picture.png', { type: 'image/png' });
                navigator.share({
                    title: 'আমার প্রোফাইল পিকচার',
                    text: 'এই প্রোফাইল পিকচারটি তৈরি হয়েছে Profile Picture Generator ব্যবহার করে!',
                    files: [file]
                })
                .then(() => {
                    hideLoading();
                    showToast('শেয়ার সফল হয়েছে!', 'success');
                })
                .catch(error => {
                    console.error('Share error:', error);
                    hideLoading();
                    showToast('শেয়ার করতে সমস্যা হয়েছে।', 'error');
                });
            } else {
                // Fallback: Copy to clipboard
                canvas.toBlob(blob => {
                    const item = new ClipboardItem({ 'image/png': blob });
                    navigator.clipboard.write([item])
                        .then(() => {
                            hideLoading();
                            showToast('ছবি ক্লিপবোর্ডে কপি হয়েছে!', 'success');
                        })
                        .catch(error => {
                            console.error('Copy error:', error);
                            hideLoading();
                            showToast('ক্লিপবোর্ডে কপি করতে সমস্যা হয়েছে।', 'error');
                        });
                });
            }
        }, 'image/png', 1.0);
        
    } catch (error) {
        console.error('Share error:', error);
        hideLoading();
        showToast('শেয়ার করতে সমস্যা হয়েছে।', 'error');
    }
}

// Update UI state
function updateUI() {
    const hasImage = state.isImageLoaded;
    
    // Enable/disable download button
    elements.downloadBtn.disabled = !hasImage;
    if (hasImage) {
        elements.downloadBtn.classList.remove('hidden');
    }
    
    // Show/hide reset button
    elements.resetBtn.classList.toggle('hidden', !hasImage);
}

// Show loading overlay
function showLoading() {
    elements.loadingOverlay.classList.remove('hidden');
}

// Hide loading overlay
function hideLoading() {
    elements.loadingOverlay.classList.add('hidden');
}

// Show toast notification
function showToast(message, type = 'info') {
    // You can use toastr.js or create custom toasts
    if (typeof toastr !== 'undefined') {
        const config = {
            closeButton: true,
            progressBar: true,
            positionClass: 'toast-top-right',
            timeOut: 3000
        };
        
        switch(type) {
            case 'success':
                toastr.success(message, 'সফল!', config);
                break;
            case 'error':
                toastr.error(message, 'ত্রুটি!', config);
                break;
            case 'warning':
                toastr.warning(message, 'সতর্কতা!', config);
                break;
            default:
                toastr.info(message, 'মেসেজ', config);
        }
    } else {
        // Fallback: Use browser alert
        alert(message);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
