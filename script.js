// ===== MOBILE VIDEO FIXES =====
function fixMobileVideo() {
    const video = document.getElementById('background-video');
    const mobilePlayBtn = document.getElementById('mobile-video-play');
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (!video) return;
    
    // iOS Safari specific fixes
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    
    // Force inline playback on iOS
    if (isIOS) {
        video.setAttribute('playsinline', '');
        video.setAttribute('webkit-playsinline', '');
        video.setAttribute('x-webkit-airplay', 'deny');
        
        // iOS sometimes ignores muted, so we set volume to 0
        video.volume = 0;
        video.muted = true;
    }
    
    // Check if video can autoplay
    function checkAutoplay() {
        const promise = video.play();
        
        if (promise !== undefined) {
            promise.catch(error => {
                // Autoplay prevented
                console.log('Autoplay prevented:', error);
                
                // Show mobile play button
                if (mobilePlayBtn) {
                    mobilePlayBtn.style.display = 'flex';
                    mobilePlayBtn.innerHTML = '<i class="fas fa-play"></i>';
                    
                    // Add click handler
                    mobilePlayBtn.addEventListener('click', function() {
                        video.play().then(() => {
                            this.innerHTML = '<i class="fas fa-pause"></i>';
                            this.classList.add('playing');
                        }).catch(e => {
                            console.log('Manual play failed:', e);
                        });
                    });
                    
                    // Pause on button click when playing
                    video.addEventListener('play', function() {
                        if (mobilePlayBtn) {
                            mobilePlayBtn.innerHTML = '<i class="fas fa-pause"></i>';
                            mobilePlayBtn.classList.add('playing');
                        }
                    });
                    
                    video.addEventListener('pause', function() {
                        if (mobilePlayBtn) {
                            mobilePlayBtn.innerHTML = '<i class="fas fa-play"></i>';
                            mobilePlayBtn.classList.remove('playing');
                        }
                    });
                }
            }).then(() => {
                // Autoplay succeeded
                if (mobilePlayBtn) {
                    mobilePlayBtn.style.display = 'none';
                }
            });
        }
    }
    
    // Try to play video on load
    window.addEventListener('load', function() {
        // Add a small delay for mobile
        setTimeout(checkAutoplay, 1000);
    });
    
    // Also try on user interaction (required by some browsers)
    document.addEventListener('click', function firstClick() {
        checkAutoplay();
        document.removeEventListener('click', firstClick);
    });
    
    // Handle page visibility changes
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            // Page is hidden, pause video
            video.pause();
        } else {
            // Page is visible, try to play
            if (!video.paused) return;
            setTimeout(() => {
                video.play().catch(e => console.log('Resume play failed:', e));
            }, 300);
        }
    });
    
    // Handle page resize/orientation change
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            // Re-center video after resize
            video.style.transform = 'translate(-50%, -50%)';
            
            // On mobile, check if we need to restart video
            if (isMobile && video.paused) {
                setTimeout(checkAutoplay, 500);
            }
        }, 250);
    });
    
    // Prevent video from opening in separate player on mobile
    video.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    });
    
    // Prevent context menu on video
    video.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });
    
    // Load video metadata before trying to play
    video.addEventListener('loadedmetadata', function() {
        // Set video properties
        video.volume = 0;
        video.muted = true;
        
        // On mobile, wait a bit before trying to play
        if (isMobile) {
            setTimeout(checkAutoplay, 1500);
        }
    });
    
    // Handle video errors
    video.addEventListener('error', function(e) {
        console.error('Video error:', video.error);
        
        // Show fallback background
        const fallback = document.querySelector('.video-fallback');
        if (fallback) {
            fallback.style.display = 'block';
        }
        
        // Hide play button if video fails
        if (mobilePlayBtn) {
            mobilePlayBtn.style.display = 'none';
        }
    });
    
    // Force video to stay in background
    function keepVideoInBackground() {
        // Remove any video controls that might appear
        video.controls = false;
        video.removeAttribute('controls');
        
        // Set video styles to ensure it stays in background
        video.style.position = 'absolute';
        video.style.top = '50%';
        video.style.left = '50%';
        video.style.transform = 'translate(-50%, -50%)';
        video.style.zIndex = '-2';
        video.style.pointerEvents = 'none';
        
        // Make sure parent container has proper styles
        const container = video.parentElement;
        if (container) {
            container.style.position = 'fixed';
            container.style.top = '0';
            container.style.left = '0';
            container.style.width = '100%';
            container.style.height = '100%';
            container.style.zIndex = '-2';
            container.style.overflow = 'hidden';
        }
    }
    
    // Apply background fix
    keepVideoInBackground();
    
    // Re-apply on interval (some mobile browsers revert styles)
    setInterval(keepVideoInBackground, 1000);
}

// ===== FIX HERO VIDEO FOR MOBILE =====
function fixHeroVideo() {
    const heroVideo = document.querySelector('.hero-video');
    if (!heroVideo) return;
    
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        // Apply mobile-specific fixes to hero video
        heroVideo.setAttribute('playsinline', '');
        heroVideo.setAttribute('webkit-playsinline', '');
        heroVideo.muted = true;
        heroVideo.volume = 0;
        
        // Prevent hero video from opening separately
        heroVideo.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        });
        
        // Style fixes
        heroVideo.style.position = 'absolute';
        heroVideo.style.top = '50%';
        heroVideo.style.left = '50%';
        heroVideo.style.transform = 'translate(-50%, -50%)';
        heroVideo.style.objectFit = 'cover';
        heroVideo.style.pointerEvents = 'none';
        heroVideo.style.zIndex = '-1';
    }
}

// ===== DETECT MOBILE AND APPLY FIXES =====
function detectMobileAndApplyFixes() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        // Add mobile class to body
        document.body.classList.add('mobile-device');
        
        // Disable some heavy animations on mobile
        const particles = document.querySelector('.cursed-particles');
        if (particles) {
            particles.style.display = 'none';
        }
        
        // Disable cursor effects on mobile
        const cursor = document.querySelector('.cursed-cursor');
        if (cursor) {
            cursor.style.display = 'none';
        }
        
        // Optimize video for mobile
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            // Lower quality settings for mobile
            video.preload = 'metadata';
            
            // Add loading attribute for better performance
            video.setAttribute('loading', 'lazy');
            
            // Ensure videos don't play sound
            video.muted = true;
            video.volume = 0;
        });
    }
}

// ===== CURSED CURSOR ANIMATION =====
function createCursedCursor() {
    // Remove any existing cursors
    const existingCursor = document.querySelector('.cursed-cursor');
    if (existingCursor) existingCursor.remove();
    
    const existingTrail = document.querySelector('.cursor-trail');
    if (existingTrail) existingTrail.remove();
    
    // Check if mobile (don't create cursor on mobile)
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) return;
    
    // Create main cursor
    const cursor = document.createElement('div');
    cursor.className = 'cursed-cursor';
    document.body.appendChild(cursor);
    
    // Create trail cursor
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    document.body.appendChild(trail);
    
    // Mouse move event
    let mouseX = 0;
    let mouseY = 0;
    
    // For trail effect
    const trailPositions = [];
    const maxTrailLength = 10;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Update cursor position
        cursor.style.left = `${mouseX}px`;
        cursor.style.top = `${mouseY}px`;
        
        // Store trail positions
        trailPositions.push({x: mouseX, y: mouseY});
        if (trailPositions.length > maxTrailLength) {
            trailPositions.shift();
        }
        
        // Update trail position (delayed)
        if (trailPositions.length > 0) {
            const trailPos = trailPositions[0];
            trail.style.left = `${trailPos.x}px`;
            trail.style.top = `${trailPos.y}px`;
            trail.style.opacity = '0.6';
            
            // Fade out trail
            setTimeout(() => {
                trail.style.opacity = '0';
            }, 100);
        }
        
        // Update CSS variables for glow effects
        document.documentElement.style.setProperty('--x', `${mouseX}px`);
        document.documentElement.style.setProperty('--y', `${mouseY}px`);
        
        // Update interactive element glow positions
        updateElementGlowPositions(e);
    });
    
    // Click animation
    document.addEventListener('click', (e) => {
        const clickEffect = document.createElement('div');
        clickEffect.className = 'cursor-click';
        clickEffect.style.left = `${e.clientX}px`;
        clickEffect.style.top = `${e.clientY}px`;
        document.body.appendChild(clickEffect);
        
        // Remove after animation
        setTimeout(() => {
            clickEffect.remove();
        }, 500);
    });
    
    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        trail.style.opacity = '0';
    });
    
    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
    });
    
    // Hover effects
    const interactiveElements = document.querySelectorAll('a, button, .character-card, .filter-btn, .cta-button');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.style.width = '40px';
            cursor.style.height = '40px';
            cursor.style.background = 'radial-gradient(circle, rgba(255, 0, 85, 1) 0%, rgba(255, 0, 85, 0.6) 40%, rgba(106, 13, 173, 0.3) 70%, transparent 80%)';
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.style.width = '20px';
            cursor.style.height = '20px';
            cursor.style.background = 'radial-gradient(circle, rgba(255, 0, 85, 0.8) 0%, rgba(255, 0, 85, 0.4) 30%, rgba(106, 13, 173, 0.2) 60%, transparent 70%)';
        });
    });
}

// Update glow effect positions on elements
function updateElementGlowPositions(event) {
    const interactiveElements = document.querySelectorAll('a:hover, button:hover, .character-card:hover, .filter-btn:hover, .cta-button:hover');
    
    interactiveElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const mouseXInElement = event.clientX - rect.left;
        const mouseYInElement = event.clientY - rect.top;
        
        element.style.setProperty('--mouse-x', `${mouseXInElement}px`);
        element.style.setProperty('--mouse-y', `${mouseYInElement}px`);
    });
}

// ===== ENHANCED CURSED PARTICLES =====
function createEnhancedCursedParticles() {
    const particlesContainer = document.querySelector('.cursed-particles');
    if (!particlesContainer) return;
    
    // Check if mobile (don't create particles on mobile for performance)
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
        particlesContainer.style.display = 'none';
        return;
    }
    
    // Clear existing particles
    particlesContainer.innerHTML = '';
    
    // Create particles
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'cursed-particle';
        
        // Random properties
        const size = Math.random() * 4 + 1;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const delay = Math.random() * 10;
        const duration = Math.random() * 20 + 10;
        const color = Math.random() > 0.7 ? '#ff0055' : 
                     Math.random() > 0.5 ? '#6a0dad' : '#ffffff';
        const animationType = Math.floor(Math.random() * 3) + 1;
        
        // Set styles
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.backgroundColor = color;
        particle.style.boxShadow = `0 0 ${size * 3}px ${color}`;
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        
        // Set animation
        particle.style.animation = `
            particle-float-${animationType} ${duration}s linear ${delay}s infinite
        `;
        
        particlesContainer.appendChild(particle);
    }
}

// ===== MOUSE CURSED ENERGY PULSE =====
function createMouseEnergyPulse() {
    // Check if mobile (don't create pulses on mobile)
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) return;
    
    let pulseTimeout;
    
    document.addEventListener('mousemove', (e) => {
        // Clear any existing timeout
        if (pulseTimeout) clearTimeout(pulseTimeout);
        
        // Create energy pulse
        const pulse = document.createElement('div');
        pulse.style.position = 'fixed';
        pulse.style.left = `${e.clientX}px`;
        pulse.style.top = `${e.clientY}px`;
        pulse.style.width = '100px';
        pulse.style.height = '100px';
        pulse.style.borderRadius = '50%';
        pulse.style.background = 'radial-gradient(circle, rgba(255, 0, 85, 0.3) 0%, transparent 70%)';
        pulse.style.transform = 'translate(-50%, -50%)';
        pulse.style.pointerEvents = 'none';
        pulse.style.zIndex = '9998';
        pulse.style.animation = 'pulse-expand 1s ease-out forwards';
        
        document.body.appendChild(pulse);
        
        // Remove after animation
        setTimeout(() => {
            pulse.remove();
        }, 1000);
        
        // Set timeout for next pulse
        pulseTimeout = setTimeout(() => {}, 500);
    });
}

// Add pulse animation
function addPulseAnimation() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse-expand {
            0% {
                transform: translate(-50%, -50%) scale(0);
                opacity: 0.8;
            }
            100% {
                transform: translate(-50%, -50%) scale(3);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Create energy ring effect on click
function createEnergyRing(x, y) {
    // Check if mobile (don't create rings on mobile)
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) return;
    
    const ring = document.createElement('div');
    ring.style.position = 'fixed';
    ring.style.left = `${x}px`;
    ring.style.top = `${y}px`;
    ring.style.width = '50px';
    ring.style.height = '50px';
    ring.style.borderRadius = '50%';
    ring.style.border = '2px solid rgba(255, 0, 85, 0.8)';
    ring.style.transform = 'translate(-50%, -50%)';
    ring.style.pointerEvents = 'none';
    ring.style.zIndex = '9997';
    ring.style.animation = 'ring-expand 0.8s ease-out forwards';
    
    document.body.appendChild(ring);
    
    // Remove after animation
    setTimeout(() => {
        ring.remove();
    }, 800);
}

// Add ring animation
function addRingAnimation() {
    if (!document.querySelector('#ring-animation')) {
        const style = document.createElement('style');
        style.id = 'ring-animation';
        style.textContent = `
            @keyframes ring-expand {
                0% {
                    transform: translate(-50%, -50%) scale(0);
                    opacity: 1;
                    border-width: 2px;
                }
                50% {
                    opacity: 0.7;
                    border-width: 1px;
                }
                100% {
                    transform: translate(-50%, -50%) scale(4);
                    opacity: 0;
                    border-width: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// ===== INITIALIZE ALL MOUSE ANIMATIONS =====
function initMouseAnimations() {
    // Check if mobile (skip mouse animations on mobile)
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (!isMobile) {
        // Create cursed cursor
        createCursedCursor();
        
        // Add pulse animation
        addPulseAnimation();
        
        // Initialize mouse energy effect
        const energyEffect = document.querySelector('.cursed-energy-effect');
        if (energyEffect) {
            document.addEventListener('mousemove', (e) => {
                energyEffect.style.setProperty('--x', `${e.clientX}px`);
                energyEffect.style.setProperty('--y', `${e.clientY}px`);
                energyEffect.style.opacity = '1';
                
                // Reset opacity after delay
                clearTimeout(window.energyEffectTimeout);
                window.energyEffectTimeout = setTimeout(() => {
                    energyEffect.style.opacity = '0';
                }, 300);
            });
        }
        
        // Create mouse energy pulses on click
        document.addEventListener('click', (e) => {
            createEnergyRing(e.clientX, e.clientY);
        });
    }
}

// ===== CHARACTER FILTERING =====
function initCharacterFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const characterCards = document.querySelectorAll('.character-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            // Filter character cards
            characterCards.forEach(card => {
                const categories = card.getAttribute('data-category').split(' ');
                
                if (filterValue === 'all' || categories.includes(filterValue)) {
                    card.style.display = 'block';
                    // Add animation when showing
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// ===== ENHANCED TIMELINE ANIMATIONS =====
function initTimelineAnimations() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineProgress = document.querySelector('.timeline-progress');
    
    function updateTimeline() {
        let totalHeight = 0;
        let animatedHeight = 0;
        
        timelineItems.forEach((item, index) => {
            const rect = item.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            // Calculate total timeline height
            if (index === timelineItems.length - 1) {
                totalHeight = rect.bottom;
            }
            
            // Animate item when in view
            if (rect.top < windowHeight * 0.8) {
                if (!item.classList.contains('animated')) {
                    // Stagger animation
                    setTimeout(() => {
                        item.classList.add('animated');
                    }, index * 300);
                }
                
                // Calculate progress for this item
                if (rect.top < windowHeight * 0.5) {
                    animatedHeight = rect.bottom;
                }
            }
        });
        
        // Update progress bar
        if (timelineProgress && totalHeight > 0) {
            const progressPercentage = (animatedHeight / totalHeight) * 100;
            timelineProgress.style.height = `${progressPercentage}%`;
        }
    }
    
    // Initial update
    updateTimeline();
    
    // Update on scroll
    window.addEventListener('scroll', updateTimeline);
    
    // Add hover effects to timeline circles
    timelineItems.forEach(item => {
        const circle = item.querySelector('.circle-content');
        
        circle.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.2)';
            this.style.boxShadow = '0 0 20px rgba(255, 0, 85, 0.5)';
        });
        
        circle.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = 'none';
        });
    });
}

// ===== AUTHOR SECTION ANIMATIONS =====
function initAuthorAnimations() {
    const authorFrame = document.querySelector('.author-frame');
    
    if (authorFrame) {
        authorFrame.addEventListener('mouseenter', function() {
            const energy = this.querySelector('.author-energy');
            if (energy) {
                energy.style.animationDuration = '1s';
            }
        });
        
        authorFrame.addEventListener('mouseleave', function() {
            const energy = this.querySelector('.author-energy');
            if (energy) {
                energy.style.animationDuration = '4s';
            }
        });
    }
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                
                // Add special effect for character cards
                if (entry.target.classList.contains('character-card')) {
                    const image = entry.target.querySelector('.character-image');
                    if (image) {
                        image.style.animation = 'cursed-frame-appear 0.5s ease-out';
                    }
                }
            }
        });
    }, observerOptions);
    
    // Add frame appear animation
    const frameStyle = document.createElement('style');
    frameStyle.textContent = `
        @keyframes cursed-frame-appear {
            0% {
                opacity: 0;
                transform: scale(0.9);
            }
            100% {
                opacity: 1;
                transform: scale(1);
            }
        }
    `;
    document.head.appendChild(frameStyle);
    
    // Observe all elements
    document.querySelectorAll('.timeline-item, .character-card, .technique-card, .section-title, .section-subtitle').forEach(item => {
        observer.observe(item);
    });
}

// ===== HEADER SCROLL EFFECT =====
function initHeaderScroll() {
    const header = document.getElementById('main-header');
    
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
}

// ===== SCROLL TO TOP BUTTON =====
function initScrollToTop() {
    const scrollTopButton = document.getElementById('scroll-top');
    
    if (scrollTopButton) {
        // Show/hide button on scroll
        window.addEventListener('scroll', function() {
            if (window.scrollY > 500) {
                scrollTopButton.classList.add('visible');
            } else {
                scrollTopButton.classList.remove('visible');
            }
        });
        
        // Scroll to top when clicked
        scrollTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ===== SMOOTH SCROLLING =====
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#') return;
            
            e.preventDefault();
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== MOBILE MENU TOGGLE =====
function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            // Change icon based on menu state
            const icon = menuToggle.querySelector('i');
            if (mainNav.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // Close mobile menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                mainNav.classList.remove('active');
                menuToggle.querySelector('i').classList.remove('fa-times');
                menuToggle.querySelector('i').classList.add('fa-bars');
                
                // Update active link
                navLinks.forEach(item => item.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }
}

// ===== MAIN INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing Jujutsu Kaisen website...');
    
    // Mobile fixes first
    fixMobileVideo();
    fixHeroVideo();
    detectMobileAndApplyFixes();
    
    // Initialize core features
    initHeaderScroll();
    initMobileMenu();
    initSmoothScrolling();
    initScrollToTop();
    
    // Initialize animations
    initMouseAnimations();
    addRingAnimation();
    initCharacterFilters();
    initTimelineAnimations();
    initAuthorAnimations();
    initScrollAnimations();
    
    // Create particles (mobile detection is inside this function)
    createEnhancedCursedParticles();
    
    // Add particle keyframes
    const particleStyle = document.createElement('style');
    particleStyle.textContent = `
        @keyframes float-particle {
            0% {
                transform: translate(0, 0) rotate(0deg);
                opacity: 0.2;
            }
            25% {
                transform: translate(20px, -50px) rotate(90deg);
                opacity: 0.7;
            }
            50% {
                transform: translate(40px, 0) rotate(180deg);
                opacity: 0.2;
            }
            75% {
                transform: translate(20px, 50px) rotate(270deg);
                opacity: 0.7;
            }
            100% {
                transform: translate(0, 0) rotate(360deg);
                opacity: 0.2;
            }
        }
        
        @keyframes particle-float-1 {
            0%, 100% {
                transform: translate(0, 0);
                opacity: 0;
            }
            50% {
                transform: translate(50px, -50px);
                opacity: 0.6;
            }
        }
        
        @keyframes particle-float-2 {
            0%, 100% {
                transform: translate(0, 0);
                opacity: 0;
            }
            50% {
                transform: translate(-50px, -70px);
                opacity: 0.6;
            }
        }
        
        @keyframes particle-float-3 {
            0%, 100% {
                transform: translate(0, 0);
                opacity: 0;
            }
            50% {
                transform: translate(70px, 30px);
                opacity: 0.6;
            }
        }
    `;
    document.head.appendChild(particleStyle);
    
    console.log('Website initialization complete!');
});

// ===== WINDOW LOAD HANDLER =====
window.addEventListener('load', function() {
    // Fill level bars for characters
    const levelFills = document.querySelectorAll('.level-fill');
    levelFills.forEach(bar => {
        const level = bar.getAttribute('data-level');
        setTimeout(() => {
            bar.style.width = level + '%';
        }, 1000);
    });
    
    // Re-check video autoplay on load
    const video = document.getElementById('background-video');
    if (video) {
        setTimeout(() => {
            video.play().catch(e => console.log('Video autoplay on load failed:', e));
        }, 2000);
    }
});
