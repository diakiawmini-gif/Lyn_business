// ================================
// ZELYN BUSINESS - PROFESSIONAL PORTFOLIO
// Smooth, Professional JavaScript
// ================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavbar();
    initParticles();
    initScrollAnimations();
    initCounterAnimation();
    initFilterTabs();
    initMobileMenu();
    initSmoothScroll();
    initContactForm();
    initScrollReveal();
});

// ================================
// NAVBAR SCROLL EFFECT
// ================================
function initNavbar() {
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add/remove scrolled class
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Update active nav link
        updateActiveNavLink();
        
        lastScroll = currentScroll;
    });
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
}

// ================================
// PARTICLE ANIMATION
// ================================
function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;
    let isActive = true;
    
    // Check for touch device
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resize();
    window.addEventListener('resize', resize);
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.2;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(99, 102, 241, ${this.opacity})`;
            ctx.fill();
        }
    }
    
    // Create particles - fewer on mobile
    const particleCount = isTouchDevice ? 15 : 25;
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    function connectParticles() {
        const maxDistance = 100;
        const maxConnections = 3;
        
        for (let i = 0; i < particles.length; i++) {
            let connections = 0;
            
            for (let j = i + 1; j < particles.length; j++) {
                if (connections >= maxConnections) break;
                
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < maxDistance) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(99, 102, 241, ${0.2 * (1 - distance / maxDistance)})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                    connections++;
                }
            }
        }
    }
    
    let frameCount = 0;
    function animate() {
        if (!isActive) return;
        
        // Render every 2nd frame on mobile for performance
        frameCount++;
        if (isTouchDevice && frameCount % 2 !== 0) {
            animationId = requestAnimationFrame(animate);
            return;
        }
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        connectParticles();
        
        animationId = requestAnimationFrame(animate);
    }
    
    // Visibility check for performance
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            isActive = false;
            cancelAnimationFrame(animationId);
        } else {
            isActive = true;
            animate();
        }
    });
    
    // Pause when not in viewport
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                isActive = true;
                animate();
            } else {
                isActive = false;
                cancelAnimationFrame(animationId);
            }
        });
    }, { threshold: 0.1 });
    
    observer.observe(canvas);
    
    animate();
}

// ================================
// SCROLL ANIMATIONS
// ================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });
}

// ================================
// COUNTER ANIMATION
// ================================
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');
    let animated = false;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                counters.forEach(counter => {
                    const target = parseInt(counter.getAttribute('data-count'));
                    animateCounter(counter, target);
                });
            }
        });
    }, { threshold: 0.5 });
    
    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
        observer.observe(statsSection);
    }
}

function animateCounter(element, target) {
    let current = 0;
    const duration = 2000;
    const increment = target / (duration / 16);
    
    function update() {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(update);
        } else {
            element.textContent = target;
        }
    }
    
    update();
}

// ================================
// FILTER TABS
// ================================
function initFilterTabs() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const designCards = document.querySelectorAll('.design-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            
            // Filter cards with animation
            designCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 10);
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

// ================================
// MOBILE MENU
// ================================
function initMobileMenu() {
    const menuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    
    if (!menuBtn || !navLinks) return;
    
    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menuBtn.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// ================================
// SMOOTH SCROLL
// ================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ================================
// CONTACT FORM
// ================================
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Validate required fields
        if (!data.name || !data.email || !data.message) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        // Compose email
        const subject = `New Website Request from ${data.name}`;
        const body = `
Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone || 'Not provided'}
Business Type: ${data.businessType || 'Not specified'}
Selected Design: ${data.design || 'Not selected'}

Project Details:
${data.message}
        `;
        
        // Open email client
        const mailtoLink = `mailto:daikiawmini@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.open(mailtoLink, '_blank');
        
        // Show success modal
        showSuccessModal(data.email);
        
        // Reset form
        form.reset();
        clearSelectedDesign();
    });
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 24px;
        background: ${type === 'error' ? '#ef4444' : '#6366f1'};
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        gap: 12px;
        font-weight: 500;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        z-index: 3000;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function showSuccessModal(email) {
    const modal = document.getElementById('successModal');
    const emailSpan = document.getElementById('successEmail');
    
    if (emailSpan) {
        emailSpan.textContent = email;
    }
    
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ================================
// DESIGN SELECTION
// ================================
let selectedDesignData = null;

function selectDesign(name, price, category) {
    selectedDesignData = { name, price, category };
    
    // Update UI
    const infoDiv = document.getElementById('selectedDesignInfo');
    const nameSpan = document.getElementById('selectedDesignName');
    const priceSpan = document.getElementById('selectedDesignPrice');
    const designSelect = document.getElementById('design');
    
    if (infoDiv) {
        infoDiv.style.display = 'flex';
        if (nameSpan) nameSpan.textContent = name;
        if (priceSpan) priceSpan.textContent = price;
    }
    
    // Update select dropdown
    if (designSelect) {
        const options = Array.from(designSelect.options);
        const option = options.find(opt => opt.value === name);
        if (option) {
            designSelect.value = name;
        }
    }
    
    // Update button states
    document.querySelectorAll('.select-design-btn').forEach(btn => {
        btn.classList.remove('selected');
        btn.innerHTML = '<i class="fas fa-check"></i> Select This Design';
    });
    
    event.target.closest('.select-design-btn').classList.add('selected');
    event.target.closest('.select-design-btn').innerHTML = '<i class="fas fa-check-circle"></i> Selected';
    
    // Scroll to contact form
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    
    showNotification(`${name} selected! Fill out the form to request a quote.`, 'success');
}

function clearSelectedDesign() {
    selectedDesignData = null;
    const infoDiv = document.getElementById('selectedDesignInfo');
    if (infoDiv) {
        infoDiv.style.display = 'none';
    }
    
    document.querySelectorAll('.select-design-btn').forEach(btn => {
        btn.classList.remove('selected');
        btn.innerHTML = '<i class="fas fa-check"></i> Select This Design';
    });
}

function selectDesignFromModal() {
    if (selectedDesignData) {
        closeDesignModal();
        document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    }
}

// ================================
// DESIGN MODAL
// ================================
const designDetails = {
    'corporate-pro': {
        title: 'Corporate Pro',
        category: 'Business',
        price: '$1,499',
        description: 'A professional, modern business website perfect for corporations, agencies, and professional services. Features clean layouts, strong typography, and conversion-focused design elements.',
        features: ['5 Custom Pages', 'Contact Form Integration', 'Google Maps', 'Social Media Links', 'Mobile Responsive', 'SEO Optimized', 'Fast Loading Speed']
    },
    'shop-master': {
        title: 'Shop Master',
        category: 'E-Commerce',
        price: '$2,499',
        description: 'Complete e-commerce solution with everything you need to start selling online. Includes product management, secure checkout, and inventory tracking.',
        features: ['Up to 50 Products', 'Secure Payment Gateway', 'Shopping Cart', 'User Accounts', 'Order Management', 'Product Reviews', 'Discount Codes']
    },
    'brand-essentials': {
        title: 'Brand Essentials',
        category: 'Brand',
        price: '$999',
        description: 'Stunning single-page brand showcase designed to make a lasting impression. Perfect for personal brands, startups, and creative professionals.',
        features: ['Single Page Design', 'Hero Section', 'About Section', 'Services Grid', 'Contact Form', 'Social Links', 'Brand Colors Integration']
    },
    'creative-portfolio': {
        title: 'Creative Portfolio',
        category: 'Portfolio',
        price: '$1,299',
        description: 'Showcase your creative work with style. Features masonry layouts, lightbox galleries, and smooth animations to highlight your projects.',
        features: ['Project Gallery', 'Lightbox Viewer', 'Category Filtering', 'About Section', 'Contact Form', 'Blog Ready', 'Smooth Animations']
    },
    'enterprise-suite': {
        title: 'Enterprise Suite',
        category: 'Business',
        price: '$1,999',
        description: 'Advanced multi-page business solution with comprehensive features. Perfect for established businesses looking for a complete web presence.',
        features: ['10+ Pages', 'Blog System', 'Team Profiles', 'Testimonials', 'FAQ Section', 'Multiple Contact Forms', 'Analytics Integration']
    },
    'marketplace-pro': {
        title: 'Marketplace Pro',
        category: 'E-Commerce',
        price: '$3,999',
        description: 'Multi-vendor marketplace platform allowing multiple sellers to list and sell products. Advanced features for large-scale e-commerce operations.',
        features: ['Multi-Vendor Support', 'Vendor Dashboards', 'Commission System', 'Advanced Search', 'Vendor Ratings', 'Bulk Product Upload', 'Advanced Analytics']
    },
    'luxury-brand': {
        title: 'Luxury Brand',
        category: 'Brand',
        price: '$1,499',
        description: 'High-end luxury brand presentation with elegant design, premium feel, and sophisticated interactions. Perfect for luxury goods and services.',
        features: ['Premium Design', 'High-Quality Imagery', 'Elegant Typography', 'Smooth Transitions', 'VIP Contact Form', 'Brand Story Section', 'Exclusive Feel']
    },
    'minimal-portfolio': {
        title: 'Minimal Portfolio',
        category: 'Portfolio',
        price: '$999',
        description: 'Clean, minimal design focusing on your work. Perfect for designers, photographers, and creatives who want their work to speak for itself.',
        features: ['Minimal Design', 'Project Showcase', 'Clean Typography', 'Fast Loading', 'Mobile First', 'Easy Navigation', 'Contact Integration']
    }
};

function openDesignModal(designId) {
    const modal = document.getElementById('designModal');
    const details = designDetails[designId];
    
    if (!details || !modal) return;
    
    // Update modal content
    document.getElementById('modalTitle').textContent = details.title;
    document.getElementById('modalCategory').textContent = details.category;
    document.getElementById('modalPrice').textContent = details.price;
    document.getElementById('modalDescription').textContent = details.description;
    
    const featuresList = document.getElementById('modalFeatures');
    featuresList.innerHTML = details.features.map(f => `<li>${f}</li>`).join('');
    
    // Update placeholder color
    const placeholder = document.getElementById('modalPlaceholder');
    const categoryClass = designId.split('-')[0];
    placeholder.className = `modal-placeholder ${categoryClass}-1`;
    
    // Store selected design
    const priceNum = parseInt(details.price.replace(/[^0-9]/g, ''));
    selectedDesignData = {
        name: details.title,
        price: priceNum,
        category: details.category.toLowerCase()
    };
    
    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeDesignModal() {
    const modal = document.getElementById('designModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Close modal on outside click
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        closeDesignModal();
        closeSuccessModal();
    }
});

// Close modal on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeDesignModal();
        closeSuccessModal();
    }
});

// ================================
// SCROLL REVEAL ANIMATION
// ================================
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.design-card, .service-card, .contact-card, .value-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ================================
// ADDITIONAL CSS ANIMATIONS (injected via JS for keyframes)
// ================================
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
    
    .notification-success {
        background: #10b981 !important;
    }
`;
document.head.appendChild(style);

