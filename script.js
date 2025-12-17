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

// ===== CURSED PARTICLES ANIMATION =====
function createCursedParticles() {
    const particlesContainer = document.querySelector('.cursed-particles');
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'cursed-particle';
        
        // Random properties
        const size = Math.random() * 5 + 2;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const delay = Math.random() * 5;
        const duration = Math.random() * 10 + 10;
        const color = Math.random() > 0.5 ? '#ff0055' : '#6a0dad';
        
        // Set styles
        particle.style.position = 'absolute';
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.backgroundColor = color;
        particle.style.borderRadius = '50%';
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        particle.style.opacity = Math.random() * 0.5 + 0.2;
        particle.style.boxShadow = `0 0 ${size * 2}px ${color}`;
        particle.style.pointerEvents = 'none';
        
        // Animation
        particle.style.animation = `
            float-particle ${duration}s linear ${delay}s infinite
        `;
        
        particlesContainer.appendChild(particle);
    }
}

// Add keyframes for particles
function addParticleKeyframes() {
    const style = document.createElement('style');
    style.textContent = `
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
    `;
    document.head.appendChild(style);
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

// ===== INITIALIZE ALL FEATURES =====
document.addEventListener('DOMContentLoaded', function() {
    // Call existing functions from previous code
    // ... (keep all existing initialization code)
    
    // Add new feature initializations
    initCharacterFilters();
    initTimelineAnimations();
    initAuthorAnimations();
    addParticleKeyframes();
    createCursedParticles();
    
    // Enhanced scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);
    
    // Observe all timeline items
    document.querySelectorAll('.timeline-item').forEach(item => {
        observer.observe(item);
    });
    
    // Observe all character cards
    document.querySelectorAll('.character-card').forEach(card => {
        observer.observe(card);
    });
});

// ===== CURSED CURSOR ANIMATION =====
function createCursedCursor() {
    // Remove any existing cursors
    const existingCursor = document.querySelector('.cursed-cursor');
    if (existingCursor) existingCursor.remove();
    
    const existingTrail = document.querySelector('.cursor-trail');
    if (existingTrail) existingTrail.remove();
    
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
    let trailX = 0;
    let trailY = 0;
    
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

// ===== INITIALIZE ALL MOUSE ANIMATIONS =====
function initMouseAnimations() {
    // Create cursed cursor
    createCursedCursor();
    
    // Create enhanced particles
    createEnhancedCursedParticles();
    
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

// Create energy ring effect on click
function createEnergyRing(x, y) {
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

// ===== UPDATE INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Call existing functions from previous code
    // ... (keep all existing initialization code)
    
    // Initialize mouse animations
    initMouseAnimations();
    addRingAnimation();
    
    // Update the existing DOMContentLoaded function to include:
    initCharacterFilters();
    initTimelineAnimations();
    initAuthorAnimations();
    addParticleKeyframes();
    createCursedParticles();
    
    // Add this to observe elements for animations
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
    document.querySelectorAll('.timeline-item, .character-card, .technique-card').forEach(item => {
        observer.observe(item);
    });

});

