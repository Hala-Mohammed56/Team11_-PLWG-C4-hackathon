// Landing Page JavaScript

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    initializeNavigation();
    initializeCounters();
    initializeScrollEffects();
});

// Initialize animations
function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll(
        '.feature-card, .step, .demo-content > *, .section-header'
    );
    
    animateElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });

    // Add CSS for animations
    addAnimationStyles();
}

// Add animation styles dynamically
function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .animate-on-scroll {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .animate-on-scroll.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .feature-card.animate-on-scroll {
            transition-delay: 0.1s;
        }
        
        .feature-card:nth-child(2).animate-on-scroll {
            transition-delay: 0.2s;
        }
        
        .feature-card:nth-child(3).animate-on-scroll {
            transition-delay: 0.3s;
        }
        
        .step.animate-on-scroll {
            transition-delay: 0.2s;
        }
        
        .step:nth-child(2).animate-on-scroll {
            transition-delay: 0.4s;
        }
        
        .step:nth-child(3).animate-on-scroll {
            transition-delay: 0.6s;
        }
    `;
    document.head.appendChild(style);
}

// Initialize navigation functionality
function initializeNavigation() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 70; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-links');
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('mobile-open');
        });
    }

    // Navbar background on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.backdropFilter = 'blur(20px)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(20px)';
        }
    });
}

// Initialize counter animations
function initializeCounters() {
    const stats = document.querySelectorAll('.stat-number');
    let animated = false;

    const animateCounters = () => {
        if (animated) return;
        
        stats.forEach(stat => {
            const target = stat.textContent;
            const isPercentage = target.includes('%');
            const isMultiplier = target.includes('x');
            const isPlus = target.includes('+');
            
            let numericTarget;
            if (isPercentage) {
                numericTarget = parseInt(target.replace('%', ''));
            } else if (isMultiplier) {
                numericTarget = parseInt(target.replace('x', ''));
            } else if (isPlus) {
                numericTarget = parseInt(target.replace('+', ''));
            } else {
                numericTarget = parseInt(target);
            }
            
            animateCounter(stat, numericTarget, isPercentage, isMultiplier, isPlus);
        });
        
        animated = true;
    };

    // Trigger counter animation when hero section is visible
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(animateCounters, 1000); // Delay for effect
            }
        });
    }, { threshold: 0.5 });

    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroObserver.observe(heroSection);
    }
}

// Animate individual counter
function animateCounter(element, target, isPercentage, isMultiplier, isPlus) {
    let current = 0;
    const increment = target / 50; // 50 steps
    const duration = 2000; // 2 seconds
    const stepTime = duration / 50;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        let displayValue = Math.floor(current);
        if (isPercentage) {
            displayValue += '%';
        } else if (isMultiplier) {
            displayValue += 'x';
        } else if (isPlus) {
            displayValue += '+';
        }
        
        element.textContent = displayValue;
    }, stepTime);
}

// Initialize scroll effects
function initializeScrollEffects() {
    // Parallax effect for floating cards
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        const cards = document.querySelectorAll('.resume-card');
        cards.forEach((card, index) => {
            const offset = rate + (index * 10);
            card.style.transform = `translateY(${offset}px)`;
        });
    });

    // Add floating animation to hero cards
    enhanceFloatingCards();
}

// Enhance floating cards with mouse interaction
function enhanceFloatingCards() {
    const cards = document.querySelectorAll('.resume-card');
    const heroVisual = document.querySelector('.hero-visual');
    
    if (!heroVisual) return;
    
    heroVisual.addEventListener('mousemove', function(e) {
        const rect = heroVisual.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        cards.forEach((card, index) => {
            const speed = (index + 1) * 0.02;
            const moveX = (x - rect.width / 2) * speed;
            const moveY = (y - rect.height / 2) * speed;
            
            card.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    });
    
    heroVisual.addEventListener('mouseleave', function() {
        cards.forEach(card => {
            card.style.transform = 'translate(0, 0)';
        });
    });
}

// Add some interactive features
function addInteractiveFeatures() {
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            createRipple(e, this);
        });
    });

    // Add hover effects to feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-12px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Create ripple effect
function createRipple(event, element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    // Add ripple styles
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Add ripple animation styles
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Initialize interactive features after DOM load
document.addEventListener('DOMContentLoaded', addInteractiveFeatures);

// Add mobile menu styles
const mobileMenuStyle = document.createElement('style');
mobileMenuStyle.textContent = `
    @media (max-width: 768px) {
        .nav-links {
            position: fixed;
            top: 70px;
            left: 0;
            right: 0;
            background: white;
            flex-direction: column;
            padding: 20px;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
            transform: translateY(-100%);
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }
        
        .nav-links.mobile-open {
            transform: translateY(0);
            opacity: 1;
            visibility: visible;
        }
        
        .nav-links a {
            padding: 10px 0;
            font-size: 1.1rem;
        }
        
        .cta-btn {
            margin-top: 10px;
            text-align: center;
        }
    }
`;
document.head.appendChild(mobileMenuStyle);

// Performance optimization - throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Apply throttling to scroll events
window.addEventListener('scroll', throttle(function() {
    // Existing scroll handlers are already throttled
}, 16)); // ~60fps

// Add loading animation
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

// Add CSS for loading animation
const loadingStyle = document.createElement('style');
loadingStyle.textContent = `
    body:not(.loaded) {
        overflow: hidden;
    }
    
    body:not(.loaded)::before {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: white;
        z-index: 9999;
        transition: opacity 0.5s ease;
    }
    
    body.loaded::before {
        opacity: 0;
        pointer-events: none;
    }
`;
document.head.appendChild(loadingStyle); 