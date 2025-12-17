// ===== MOBILE DETECTION =====
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// ===== FIX MOBILE VIEWPORT HEIGHT =====
function fixMobileViewport() {
    if (isMobileDevice()) {
        // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
        let vh = window.innerHeight * 0.01;
        // Then we set the value in the --vh custom property to the root of the document
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        
        // We listen to the resize event
        window.addEventListener('resize', () => {
            // We execute the same script as before
            let vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        });
    }
}

// ===== MOBILE VIDEO FIXES =====
function fixMobileVideo() {
    const video = document.getElementById('background-video');
    if (!video) return;
    
    // iOS Safari specific fixes
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    
    // Force inline playback on iOS
    if (isIOS) {
        video.setAttribute('playsinline', '');
        video.setAttribute('webkit-playsinline', '');
        video.setAttribute('x-webkit-airplay', 'deny');
    }
    
    // Ensure video is muted and has no controls
    video.muted = true;
    video.volume = 0;
    video.controls = false;
    
    // Try to play video with error handling
    function tryPlayVideo() {
        const playPromise = video.play();
        
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log('Video autoplay prevented:', error.name);
                
                // Try to play on user interaction
                const playOnInteraction = () => {
                    video.play().catch(e => console.log('Video play failed:', e));
                    document.removeEventListener('click', playOnInteraction);
                    document.removeEventListener('touchstart', playOnInteraction);
                };
                
                document.addEventListener('click', playOnInteraction, { once: true });
                document.addEventListener('touchstart', playOnInteraction, { once: true });
            });
        }
    }
    
    // Try to play when video can play
    video.addEventListener('canplay', tryPlayVideo, { once: true });
    
    // Also try on page load
    window.addEventListener('load', () => {
        setTimeout(tryPlayVideo, 1000);
    });
    
    // Handle page visibility changes
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            video.pause();
        } else {
            video.play().catch(e => console.log('Resume play failed:', e));
        }
    });
}

// ===== HEADER SCROLL EFFECT =====
function initHeaderScroll() {
    const header = document.getElementById('main-header');
    if (!header) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// ===== MOBILE MENU TOGGLE =====
function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!menuToggle || !mainNav) return;
    
    // Toggle menu
    menuToggle.addEventListener('click', () => {
        mainNav.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        if (mainNav.classList.contains('active')) {
            icon.classList.replace('fa-bars', 'fa-times');
            document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
        } else {
            icon.classList.replace('fa-times', 'fa-bars');
            document.body.style.overflow = ''; // Restore scrolling
        }
    });
    
    // Close menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Only close menu on mobile
            if (window.innerWidth <= 768) {
                mainNav.classList.remove('active');
                menuToggle.querySelector('i').classList.replace('fa-times', 'fa-bars');
                document.body.style.overflow = ''; // Restore scrolling
            }
            
            // Update active link
            navLinks.forEach(item => item.classList.remove('active'));
            link.classList.add('active');
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (mainNav.classList.contains('active') && 
            !mainNav.contains(e.target) && 
            !menuToggle.contains(e.target) &&
            window.innerWidth <= 768) {
            mainNav.classList.remove('active');
            menuToggle.querySelector('i').classList.replace('fa-times', 'fa-bars');
            document.body.style.overflow = ''; // Restore scrolling
        }
    });
}

// ===== SCROLL TO TOP BUTTON =====
function initScrollToTop() {
    const scrollTopButton = document.getElementById('scroll-top');
    if (!scrollTopButton) return;
    
    // Show/hide button on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollTopButton.classList.add('visible');
        } else {
            scrollTopButton.classList.remove('visible');
        }
    });
    
    // Scroll to top when clicked
    scrollTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== SMOOTH SCROLLING =====
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                const headerHeight = document.getElementById('main-header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== CHARACTER FILTERING =====
function initCharacterFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const characterCards = document.querySelectorAll('.character-card');
    
    if (filterButtons.length === 0 || characterCards.length === 0) return;
    
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
                    setTimeout(() => {
                        card.style.opacity = '1';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// ===== TIMELINE ANIMATIONS =====
function initTimelineAnimations() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineProgress = document.querySelector('.timeline-progress');
    
    if (timelineItems.length === 0) return;
    
    function updateTimeline() {
        let totalHeight = 0;
        let animatedHeight = 0;
        const windowHeight = window.innerHeight;
        
        timelineItems.forEach((item, index) => {
            const rect = item.getBoundingClientRect();
            
            // Calculate visible items
            if (rect.top < windowHeight * 0.8) {
                item.classList.add('animated');
                
                // Calculate progress
                if (rect.top < windowHeight * 0.5) {
                    animatedHeight = rect.bottom;
                }
            }
            
            // Calculate total height for last item
            if (index === timelineItems.length - 1) {
                totalHeight = rect.bottom;
            }
        });
        
        // Update progress bar
        if (timelineProgress && totalHeight > 0) {
            const progressPercentage = (animatedHeight / totalHeight) * 100;
            timelineProgress.style.height = `${Math.min(100, progressPercentage)}%`;
        }
    }
    
    // Initial update
    updateTimeline();
    
    // Update on scroll with throttling
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(() => {
                updateTimeline();
                scrollTimeout = null;
            }, 100);
        }
    });
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    // Add animation classes to elements when they come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                
                // Fill level bars for characters
                if (entry.target.classList.contains('character-card')) {
                    const levelFills = entry.target.querySelectorAll('.level-fill');
                    levelFills.forEach(bar => {
                        const level = bar.getAttribute('data-level');
                        setTimeout(() => {
                            bar.style.width = level + '%';
                        }, 300);
                    });
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe elements
    const elementsToObserve = document.querySelectorAll(
        '.timeline-item, .character-card, .technique-card, .section-title, .section-subtitle'
    );
    
    elementsToObserve.forEach(element => {
        if (element) observer.observe(element);
    });
}

// ===== INITIALIZE HERO ANIMATIONS =====
function initHeroAnimations() {
    // Start hero animations with delays
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

// ===== FIX MOBILE TOUCH ISSUES =====
function fixMobileTouch() {
    if (!isMobileDevice()) return;
    
    // Add touch-friendly class to body
    document.body.classList.add('mobile-touch');
    
    // Increase tap targets for mobile
    const touchElements = document.querySelectorAll('a, button, .character-card, .filter-btn, .cta-button');
    touchElements.forEach(el => {
        el.style.minHeight = '44px';
        el.style.minWidth = '44px';
    });
    
    // Disable hover effects on mobile
    const style = document.createElement('style');
    style.textContent = `
        .mobile-touch .character-card:hover {
            transform: none !important;
        }
        .mobile-touch .cta-button:hover {
            transform: none !important;
        }
        .mobile-touch .filter-btn:hover {
            transform: none !important;
        }
        .mobile-touch .technique-card:hover {
            transform: none !important;
        }
    `;
    document.head.appendChild(style);
}

// ===== FIX SCROLLING ON MOBILE =====
function fixMobileScrolling() {
    if (!isMobileDevice()) return;
    
    // Prevent address bar hiding issues on iOS
    document.body.style.height = '100%';
    document.body.style.overflowY = 'auto';
    document.body.style.webkitOverflowScrolling = 'touch';
    
    // Fix for iOS Safari bounce effect
    document.addEventListener('touchmove', (e) => {
        if (e.target.tagName === 'VIDEO') {
            e.preventDefault();
        }
    }, { passive: false });
}

// ===== MAIN INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing Jujutsu Kaisen website...');
    
    // Fix mobile viewport first
    fixMobileViewport();
    
    // Fix mobile scrolling
    fixMobileScrolling();
    
    // Fix mobile touch issues
    fixMobileTouch();
    
    // Initialize mobile video
    fixMobileVideo();
    
    // Initialize core features
    initHeaderScroll();
    initMobileMenu();
    initSmoothScrolling();
    initScrollToTop();
    
    // Initialize content features
    initCharacterFilters();
    initTimelineAnimations();
    initScrollAnimations();
    
    // Initialize hero animations
    initHeroAnimations();
    
    console.log('Website initialization complete!');
});

// ===== WINDOW LOAD HANDLER =====
window.addEventListener('load', () => {
    // Ensure everything is properly loaded
    setTimeout(() => {
        // Re-calculate viewport on load
        fixMobileViewport();
        
        // Try to play video again
        const video = document.getElementById('background-video');
        if (video) {
            video.play().catch(e => console.log('Video play on load:', e.name));
        }
    }, 500);
});

// ===== WINDOW RESIZE HANDLER =====
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        fixMobileViewport();
        
        // Close mobile menu on resize to desktop
        const mainNav = document.getElementById('main-nav');
        const menuToggle = document.getElementById('menu-toggle');
        
        if (window.innerWidth > 768 && mainNav && mainNav.classList.contains('active')) {
            mainNav.classList.remove('active');
            if (menuToggle && menuToggle.querySelector('i')) {
                menuToggle.querySelector('i').classList.replace('fa-times', 'fa-bars');
            }
            document.body.style.overflow = '';
        }
    }, 250);
});

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
    console.error('Error occurred:', e.error);
});

// ===== FALLBACK FOR OLD BROWSERS =====
if (!('IntersectionObserver' in window)) {
    console.warn('IntersectionObserver not supported, using fallback');
    // Simple fallback: show all animated elements
    document.querySelectorAll('.timeline-item, .character-card, .technique-card').forEach(el => {
        el.classList.add('animated');
    });
}
