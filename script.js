// Mobile Navigation Toggle
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 70; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Liquid Glass Navigation Indicator
function updateNavIndicator() {
    const indicator = document.getElementById('nav-indicator');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    if (!indicator || navLinks.length === 0) return;
    
    // Get current scroll position
    const scrollPosition = window.scrollY + 100; // Offset for better detection
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    // Find the active section
    let activeSection = 'home';
    let activeLink = null;
    
    // Special case for top of page
    if (window.scrollY < 50) {
        activeSection = 'home';
    } else {
        // Check each section
        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const isLastSection = index === sections.length - 1;
            
            // For the last section, check if we're past the previous section
            if (isLastSection) {
                if (scrollPosition >= sectionTop - 100) {
                    activeSection = sectionId;
                }
            } else {
                // For other sections, check if we're within the section bounds
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    activeSection = sectionId;
                }
            }
        });
        
        // Fallback: if we're near the bottom of the page, activate the last section
        if (window.scrollY + windowHeight >= documentHeight - 50) {
            const lastSection = sections[sections.length - 1];
            if (lastSection) {
                activeSection = lastSection.getAttribute('id');
            }
        }
    }
    
    // Find and update the active link
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === activeSection) {
            link.classList.add('active');
            activeLink = link;
        }
    });
    
    // Update indicator position
    if (activeLink) {
        const linkRect = activeLink.getBoundingClientRect();
        const menuRect = document.getElementById('nav-menu').getBoundingClientRect();
        
        indicator.style.width = `${linkRect.width}px`;
        indicator.style.left = `${linkRect.left - menuRect.left}px`;
        indicator.classList.add('active');
    } else {
        indicator.classList.remove('active');
    }
}

// Initialize indicator on page load
document.addEventListener('DOMContentLoaded', () => {
    updateNavIndicator();
    
    // Update on scroll
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateNavIndicator();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Update on resize
    window.addEventListener('resize', () => {
        updateNavIndicator();
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    // Add fade-in class to elements that should animate
    const animateElements = document.querySelectorAll('.project-card, .skill-item, .stat-item, .education-item');
    animateElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // Animate skill bars when skills section comes into view
    const skillsSection = document.querySelector('.skills');
    const skillBars = document.querySelectorAll('.skill-bar');
    
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                skillBars.forEach(bar => {
                    const level = bar.getAttribute('data-level');
                    setTimeout(() => {
                        bar.style.width = level + '%';
                    }, 200);
                });
            }
        });
    }, { threshold: 0.5 });

    if (skillsSection) {
        skillsObserver.observe(skillsSection);
    }
});


// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 5000);
}

// Typing animation for hero section
function typeWriter(element, speed = 80) {
    return new Promise((resolve) => {
        const textBefore = "Hi, I'm ";
        const textAfter = "Andrew";
        const totalLength = textBefore.length + textAfter.length;
        
        // Wait a moment, then start typing animation
        setTimeout(() => {
            let i = 0;
            
            function type() {
                if (i < textBefore.length) {
                    // Type "Hi, I'm " character by character
                    const currentText = textBefore.substring(0, i + 1);
                    element.innerHTML = currentText;
                    i++;
                    setTimeout(type, speed);
                } else if (i < totalLength) {
                    // Type "Andrew" character by character with highlight
                    const andrewProgress = i - textBefore.length;
                    const currentAndrew = textAfter.substring(0, andrewProgress + 1);
                    element.innerHTML = textBefore + '<span class="highlight">' + currentAndrew + '</span>';
                    i++;
                    setTimeout(type, speed);
                } else {
                    // Animation complete - ensure final state
                    element.innerHTML = textBefore + '<span class="highlight">' + textAfter + '</span>';
                    // Remove width and height constraints after animation completes
                    setTimeout(() => {
                        element.style.width = '';
                        element.style.minHeight = '';
                    }, 100);
                    // Resolve promise to signal completion
                    resolve();
                }
            }
            
            // Start with empty content
            element.innerHTML = '';
            type();
        }, 100);
    });
}

// Initialize typing animation when page loads
document.addEventListener('DOMContentLoaded', () => {
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroDescription = document.querySelector('.hero-description');
    const heroButtons = document.querySelector('.hero-buttons');
    const codeAnimation = document.querySelector('.code-animation');
    const codeLines = document.querySelectorAll('.code-line');
    
    // Code lines, subtitle, description, and buttons are hidden by default (opacity: 0 in CSS)
    // They will be animated after typing completes
    
    if (heroTitle) {
        // Store original dimensions immediately to prevent any layout shift
        const originalHeight = heroTitle.offsetHeight;
        const originalWidth = heroTitle.offsetWidth;
        
        // Lock dimensions to prevent shifting
        heroTitle.style.minHeight = originalHeight + 'px';
        heroTitle.style.width = originalWidth + 'px';
        
        // Hide text immediately so animation starts from empty
        heroTitle.innerHTML = '';
        
        setTimeout(() => {
            typeWriter(heroTitle, 80).then(() => {
                // Start all animations after typing completes
                // Animate subtitle, description, and buttons
                if (heroSubtitle) heroSubtitle.classList.add('animate');
                if (heroDescription) heroDescription.classList.add('animate');
                if (heroButtons) heroButtons.classList.add('animate');
                
                // Start code block background animation first, then code lines
                if (codeAnimation) codeAnimation.classList.add('animate');
                codeLines.forEach((line) => {
                    line.classList.add('animate');
                });
            });
        }, 1000);
    }
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Add hover effects to project cards
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Add click effects to buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        // Create ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add ripple animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Lazy loading for images (if you add images later)
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// Add smooth reveal animation for sections
function revealSections() {
    const sections = document.querySelectorAll('section');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        revealObserver.observe(section);
    });
}

// Initialize section reveals
document.addEventListener('DOMContentLoaded', revealSections);

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close mobile menu
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    }
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll events
const debouncedScrollHandler = debounce(() => {
    // Your scroll handling code here
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Add CSS for loading state
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
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    body:not(.loaded)::after {
        content: 'Loading...';
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: white;
        font-size: 1.5rem;
        font-weight: 600;
        z-index: 10000;
    }
`;
document.head.appendChild(loadingStyle);



