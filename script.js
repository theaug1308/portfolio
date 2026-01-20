// ===================================
// Loading Screen Animation
// ===================================
const loadingScreen = document.getElementById('loadingScreen');
const loaderProgress = document.getElementById('loaderProgress');

let progress = 0;
const loadingInterval = setInterval(() => {
    progress += Math.random() * 30;
    if (progress >= 100) {
        progress = 100;
        clearInterval(loadingInterval);

        // Fade out loading screen
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            // Enable scroll after loading
            document.body.style.overflow = 'auto';
        }, 500);
    }
    loaderProgress.style.width = progress + '%';
}, 200);

// Disable scroll during loading
document.body.style.overflow = 'hidden';

// ===================================
// Particle Background System
// ===================================
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Particle class
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.5 + 0.2;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap around screen
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
    }

    draw() {
        const color = window.currentParticleColor || '#d4af37';
        // Convert hex to rgba
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);

        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Create particles
const particlesArray = [];
const numberOfParticles = 80;

for (let i = 0; i < numberOfParticles; i++) {
    particlesArray.push(new Particle());
}

// Mouse interaction
let mouse = {
    x: null,
    y: null,
    radius: 150
};

window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
});

// Connect particles
function connectParticles() {
    const color = window.currentParticleColor || '#d4af37';
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);

    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            const dx = particlesArray[a].x - particlesArray[b].x;
            const dy = particlesArray[a].y - particlesArray[b].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 120) {
                const opacity = 1 - (distance / 120);
                ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity * 0.2})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

// Mouse repulsion effect
function handleParticles() {
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();

        // Mouse interaction - repel particles
        if (mouse.x != null && mouse.y != null) {
            const dx = particlesArray[i].x - mouse.x;
            const dy = particlesArray[i].y - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouse.radius) {
                const force = (mouse.radius - distance) / mouse.radius;
                const angle = Math.atan2(dy, dx);
                particlesArray[i].x += Math.cos(angle) * force * 3;
                particlesArray[i].y += Math.sin(angle) * force * 3;
            }
        }
    }
}

// Animation loop
function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handleParticles();
    connectParticles();
    requestAnimationFrame(animateParticles);
}

animateParticles();

// Function to update particle colors based on theme
window.updateParticleColors = function (color) {
    window.currentParticleColor = color;
};

// ===================================
// Parallax Geometric Shapes
// ===================================
const shapes = document.querySelectorAll('.shape');
let mouseXParallax = 0;
let mouseYParallax = 0;

document.addEventListener('mousemove', (e) => {
    mouseXParallax = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseYParallax = (e.clientY / window.innerHeight - 0.5) * 2;
});

function animateShapes() {
    shapes.forEach((shape, index) => {
        const speed = (index + 1) * 0.5;
        const x = mouseXParallax * speed * 20;
        const y = mouseYParallax * speed * 20;

        shape.style.transform = `translate(${x}px, ${y}px)`;
    });

    requestAnimationFrame(animateShapes);
}

animateShapes();

// ===================================
// Liquid Glass Cursor Effect
// ===================================
// Create cursor elements
const cursor = document.createElement('div');
cursor.className = 'cursor';
document.body.appendChild(cursor);

const cursorGlow = document.createElement('div');
cursorGlow.className = 'cursor-glow';
document.body.appendChild(cursorGlow);

// Trail particles array
const trailParticles = [];
const maxTrails = 15;

// Create trail particles
for (let i = 0; i < maxTrails; i++) {
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    document.body.appendChild(trail);
    trailParticles.push({
        element: trail,
        x: 0,
        y: 0,
        opacity: 0
    });
}

let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;

// Update mouse position
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Smooth cursor animation
function animateCursor() {
    // Smooth follow with gentler easing
    cursorX += (mouseX - cursorX) * 0.12;
    cursorY += (mouseY - cursorY) * 0.12;

    // Update glow only (no main cursor dot)
    cursorGlow.style.left = (cursorX - 100) + 'px';
    cursorGlow.style.top = (cursorY - 100) + 'px';

    // Update trail particles with smoother easing
    trailParticles.forEach((particle, index) => {
        const delay = index * 0.05;
        const targetX = cursorX + (mouseX - cursorX) * delay;
        const targetY = cursorY + (mouseY - cursorY) * delay;

        // Reduced from 0.1 to 0.06 for smoother transitions
        particle.x += (targetX - particle.x) * 0.06;
        particle.y += (targetY - particle.y) * 0.06;

        particle.element.style.left = particle.x + 'px';
        particle.element.style.top = particle.y + 'px';
        particle.element.style.opacity = (1 - index / maxTrails) * 0.5;
    });

    requestAnimationFrame(animateCursor);
}

animateCursor();

// Hide cursor when leaving window
document.addEventListener('mouseleave', () => {
    cursorGlow.style.opacity = '0';
    trailParticles.forEach(p => p.element.style.opacity = '0');
});

document.addEventListener('mouseenter', () => {
    cursorGlow.style.opacity = '1';
});

// No need for click effect on main cursor since it's hidden
// Removed mousedown/mouseup listeners for cursor

// ===================================
// Typing Effect for Hero Section
// ===================================
const typingText = document.getElementById('typingText');
const roles = [
    'Script Developer',
    'Web Developer',
    'Community Builder',
    'Business Owner',
    'Problem Solver'
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function typeEffect() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
        // Deleting characters
        typingText.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
    } else {
        // Typing characters
        typingText.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
    }

    // Check if word is complete
    if (!isDeleting && charIndex === currentRole.length) {
        // Pause at end of word
        typingSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        // Move to next word
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingSpeed = 500;
    }

    setTimeout(typeEffect, typingSpeed);
}

// Start typing effect after page loads
window.addEventListener('load', () => {
    setTimeout(typeEffect, 1000);
});

// ===================================
// Animated Counter for Numbers
// ===================================
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    let current = 0;

    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = '$' + Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = '$' + target;
        }
    };

    updateCounter();
}

// Observe counters and animate when visible
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            entry.target.classList.add('counted');
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.counter').forEach(counter => {
    counterObserver.observe(counter);
});

// ===================================
// Smooth Scroll Navigation
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
});

// ===================================
// Mobile Navigation Toggle
// ===================================
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

// ===================================
// Scroll Animations (Intersection Observer)
// ===================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            // Add stagger delay for multiple items
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, index * 100);
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all fade-in elements
document.querySelectorAll('.fade-in').forEach((element) => {
    observer.observe(element);
});

// ===================================
// Navbar Background on Scroll
// ===================================
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Add/remove background based on scroll position
    if (currentScroll > 100) {
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
        // Get current theme color from CSS variable
        const rgb = getComputedStyle(document.documentElement).getPropertyValue('--color-primary-rgb').trim();
        navbar.style.boxShadow = `0 2px 20px rgba(${rgb}, 0.1)`;
    } else {
        navbar.style.background = 'rgba(10, 10, 10, 0.9)';
        navbar.style.boxShadow = 'none';
    }

    lastScroll = currentScroll;
});

// ===================================
// Scroll Progress Indicator
// ===================================
const scrollProgress = document.querySelector('.scroll-progress');

window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.pageYOffset / windowHeight) * 100;
    scrollProgress.style.width = scrolled + '%';
});

// ===================================
// Enhanced Parallax Scrolling
// ===================================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;

    // Hero parallax
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        hero.style.opacity = 1 - (scrolled / 700);
    }

    // Cards parallax
    const cards = document.querySelectorAll('.glass-card');
    cards.forEach((card, index) => {
        const speed = (index % 2 === 0) ? 0.05 : -0.05;
        const rect = card.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            card.style.transform = `translateY(${scrolled * speed}px)`;
        }
    });
});

// ===================================
// Dynamic Year in Footer
// ===================================
document.getElementById('year').textContent = new Date().getFullYear();

// ===================================
// Add Glow Effect on Mouse Move (Optional)
// ===================================
document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.glass-card, .project-card, .experience-card, .skill-card, .about-card');

    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Only apply if mouse is over the card (optimization, though radial gradient handles it visually)
        // Also helps with tilt effects
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

// ===================================
// Skill Cards Animation on Hover
// ===================================
const skillCards = document.querySelectorAll('.skill-card');

skillCards.forEach(card => {
    card.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });

    card.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// ===================================
// Project Cards 3D Tilt Effect
// ===================================
const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// ===================================
// Smooth Page Load Animation
// ===================================
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// ===================================
// Active Navigation Link Highlight
// ===================================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function highlightNavigation() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', highlightNavigation);

// ===================================
// Console Message (Easter Egg)
// ===================================
console.log('%c👋 Hello there!', 'color: #d4af37; font-size: 20px; font-weight: bold;');
console.log('%cLooking for something? Feel free to reach out!', 'color: #999; font-size: 14px;');
console.log('%c📧 vuthaison672@gmail.com', 'color: #d4af37; font-size: 14px;');

// ===================================
// Magnetic Button Effect
// ===================================
const magneticButtons = document.querySelectorAll('.btn, .social-link');

magneticButtons.forEach(button => {
    // Skip if button is inside context menu
    if (button.closest('.context-menu')) {
        return;
    }

    button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        // Calculate distance from center
        const distance = Math.sqrt(x * x + y * y);
        const maxDistance = 100;

        if (distance < maxDistance) {
            const strength = (maxDistance - distance) / maxDistance;
            const moveX = x * strength * 0.3;
            const moveY = y * strength * 0.3;

            button.style.transform = `translate(${moveX}px, ${moveY}px)`;
        }
    });

    button.addEventListener('mouseleave', () => {
        button.style.transform = 'translate(0, 0)';
    });
});

// ===================================
// Text Reveal on Scroll
// ===================================
// Split text into characters for reveal effect
function splitTextToChars(element) {
    const text = element.textContent;
    element.textContent = '';
    element.style.opacity = '1';

    text.split('').forEach((char, index) => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.display = 'inline-block';
        span.style.opacity = '0';
        span.style.transform = 'translateY(20px)';
        span.style.transition = `all 0.5s ease ${index * 0.03}s`;
        element.appendChild(span);
    });
}

// Apply to section titles (except contact section to avoid layout issues)
const revealTitles = document.querySelectorAll('.section-title:not(.contact .section-title)');
revealTitles.forEach(title => {
    splitTextToChars(title);
});

// Observe and reveal
const textRevealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const chars = entry.target.querySelectorAll('span');
            chars.forEach(char => {
                char.style.opacity = '1';
                char.style.transform = 'translateY(0)';
            });
            textRevealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

revealTitles.forEach(title => {
    textRevealObserver.observe(title);
});

// ===================================
// Ripple Click Effect
// ===================================
function createRipple(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();

    const diameter = Math.max(rect.width, rect.height);
    const radius = diameter / 2;

    ripple.style.width = ripple.style.height = `${diameter}px`;
    ripple.style.left = `${event.clientX - rect.left - radius}px`;
    ripple.style.top = `${event.clientY - rect.top - radius}px`;
    ripple.classList.add('ripple');

    const existingRipple = button.querySelector('.ripple');
    if (existingRipple) {
        existingRipple.remove();
    }

    button.appendChild(ripple);

    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Apply ripple to buttons and cards
const rippleElements = document.querySelectorAll('.btn, .glass-card, .social-link');
rippleElements.forEach(element => {
    element.addEventListener('click', createRipple);
});

// ===================================
// Custom Context Menu (Hover)
// ===================================
const contextMenu = document.getElementById('contextMenu');
const contactBtn = document.getElementById('contactBtn');
const copyEmailBtn = document.getElementById('copyEmail');

let menuTimeout;

// Show context menu on hover
contactBtn.addEventListener('mouseenter', (e) => {
    clearTimeout(menuTimeout);

    // Position menu to the right of button
    const rect = contactBtn.getBoundingClientRect();
    contextMenu.style.left = (rect.right + 10) + 'px';
    contextMenu.style.top = rect.top + 'px';

    // Show menu
    contextMenu.classList.add('active');

    // Adjust position if menu goes off screen
    setTimeout(() => {
        const menuRect = contextMenu.getBoundingClientRect();
        if (menuRect.right > window.innerWidth) {
            contextMenu.style.left = (window.innerWidth - menuRect.width - 20) + 'px';
        }
    }, 10);
});

// Keep menu open when hovering over it
contextMenu.addEventListener('mouseenter', () => {
    clearTimeout(menuTimeout);
});

// Hide menu when leaving button or menu
contactBtn.addEventListener('mouseleave', () => {
    menuTimeout = setTimeout(() => {
        contextMenu.classList.remove('active');
    }, 300);
});

contextMenu.addEventListener('mouseleave', () => {
    menuTimeout = setTimeout(() => {
        contextMenu.classList.remove('active');
    }, 300);
});

// Copy email to clipboard
copyEmailBtn.addEventListener('click', async () => {
    const email = 'vuthaison672@gmail.com';

    try {
        await navigator.clipboard.writeText(email);

        // Show success feedback
        const originalText = copyEmailBtn.querySelector('span').textContent;
        copyEmailBtn.querySelector('span').textContent = 'Copied!';
        copyEmailBtn.style.color = 'var(--color-gold-primary)';

        setTimeout(() => {
            copyEmailBtn.querySelector('span').textContent = originalText;
            copyEmailBtn.style.color = '';
            contextMenu.classList.remove('active');
        }, 1500);
    } catch (err) {
        console.error('Failed to copy email:', err);
    }
});
