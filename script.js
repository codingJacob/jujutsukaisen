// ===== FIX iOS VIDEO AUTOPLAY =====
function fixIOSVideo() {
    const video = document.getElementById('background-video');
    if (!video) return;
    
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    
    if (isIOS) {
        // Add iOS specific attributes
        video.setAttribute('playsinline', '');
        video.setAttribute('webkit-playsinline', '');
        video.setAttribute('x-webkit-airplay', 'deny');
        
        // Force mute and disable controls
        video.muted = true;
        video.volume = 0;
        video.controls = false;
        
        // Try to play video
        const playPromise = video.play();
        
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log('iOS video autoplay prevented:', error);
                
                // Create play button for iOS
                const playButton = document.createElement('button');
                playButton.innerHTML = '▶ Play Video';
                playButton.style.cssText = `
                    position: fixed;
                    bottom: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: #6a0dad;
                    color: white;
                    border: 2px solid #ff0055;
                    padding: 10px 20px;
                    border-radius: 5px;
                    z-index: 10000;
                    cursor: pointer;
                    font-family: inherit;
                `;
                
                playButton.addEventListener('click', () => {
                    video.play();
                    playButton.remove();
                });
                
                document.body.appendChild(playButton);
            });
        }
    }
}

// ===== INITIALIZE HERO ANIMATIONS =====
function initHeroAnimations() {
    const titleWords = document.querySelectorAll('.title-word');
    const subtitle = document.querySelector('.hero-subtitle');
    const description = document.querySelector('.hero-description');
    const buttons = document.querySelector('.hero-buttons');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    // Animate title words
    titleWords.forEach((word, index) => {
        setTimeout(() => {
            word.style.opacity = '1';
            word.style.transform = 'translateY(0)';
        }, 500 + (index * 300));
    });
    
    // Animate other elements
    setTimeout(() => {
        if (subtitle) {
            subtitle.style.opacity = '1';
            subtitle.style.transform = 'translateY(0)';
        }
    }, 1200);
    
    setTimeout(() => {
        if (description) {
            description.style.opacity = '1';
            description.style.transform = 'translateY(0)';
        }
    }, 1500);
    
    setTimeout(() => {
        if (buttons) {
            buttons.style.opacity = '1';
            buttons.style.transform = 'translateY(0)';
        }
    }, 1800);
    
    setTimeout(() => {
        if (scrollIndicator) {
            scrollIndicator.style.opacity = '1';
            scrollIndicator.style.transform = 'translateY(0)';
        }
    }, 2100);
}

// ===== CHARACTER FILTERING =====
function initCharacterFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const characterCards = document.querySelectorAll('.
