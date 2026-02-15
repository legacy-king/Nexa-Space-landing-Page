/* ===================================
   NEXA SPACE - MAIN JAVASCRIPT
   ================================== */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // ========== MOBILE MENU TOGGLE ==========
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            
            // Animate hamburger icon
            const spans = this.querySelectorAll('span');
            if (mobileMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = '';
                spans[1].style.opacity = '1';
                spans[2].style.transform = '';
            }
        });
    }
    
    // Close mobile menu when clicking on a link
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            // Reset hamburger icon
            const spans = mobileMenuToggle.querySelectorAll('span');
            spans[0].style.transform = '';
            spans[1].style.opacity = '1';
            spans[2].style.transform = '';
        });
    });
    
    
    // ========== SMOOTH SCROLLING ==========
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if href is just "#"
            if (href === '#') {
                e.preventDefault();
                return;
            }
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    
    // ========== FORM VALIDATION & SUBMISSION ==========
    
    // Seeker Form Handler
    const seekerForm = document.getElementById('seeker-form');
    if (seekerForm) {
        seekerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Basic validation
            if (!validateEmail(data.email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            // Log data (for testing)
            console.log('Seeker signup:', data);
            
            // TODO: Replace with your backend endpoint or Google Sheets API
            // Example: await submitToBackend(data, 'seeker');
            
            // For now, just show success message
            showNotification('Thanks for joining! We\'ll notify you when we launch.', 'success');
            
            // Reset form
            this.reset();
            
            // Optional: Track with analytics
            // trackEvent('signup', 'seeker', data.location);
        });
    }
    
    // Agent Form Handler
    const agentForm = document.getElementById('agent-form');
    if (agentForm) {
        agentForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Basic validation
            if (!validateEmail(data.email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            if (!validatePhone(data.phone)) {
                showNotification('Please enter a valid phone number', 'error');
                return;
            }
            
            // Log data (for testing)
            console.log('Agent signup:', data);
            
            // TODO: Replace with your backend endpoint or Google Sheets API
            // Example: await submitToBackend(data, 'agent');
            
            // Show success message
            showNotification('Thanks for applying! We\'ll review your application and get back to you within 48 hours.', 'success');
            
            // Reset form
            this.reset();
            
            // Optional: Track with analytics
            // trackEvent('signup', 'agent', data.company);
        });
    }
    
    
    // ========== FORM SUBMISSION FUNCTIONS ==========
    
    /**
     * Submit form data to backend API
     */
    async function submitToBackend(data, formType) {
        try {
            const response = await fetch('https://api.sheetbest.com/sheets/d8d0f795-4a51-4335-b3ad-e36d525adddd', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...data,
                    type: formType,
                    timestamp: new Date().toISOString()
                })
            });
            
            if (!response.ok) {
                throw new Error('Submission failed');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Submission error:', error);
            throw error;
        }
    }
    
    /**
     * Submit to Google Sheets using SheetMonkey or similar service
     * Get your webhook URL from: https://sheetmonkey.io
     */
    async function submitToGoogleSheets(data, webhookUrl) {
        try {
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                throw new Error('Google Sheets submission failed');
            }
            
            return true;
        } catch (error) {
            console.error('Google Sheets error:', error);
            throw error;
        }
    }
    
    
    // ========== VALIDATION FUNCTIONS ==========
    
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function validatePhone(phone) {
        // Basic phone validation (accepts various formats)
        if (!phone) return true; // Phone is optional in seeker form
        const re = /^[\d\s\-\+\(\)]+$/;
        return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
    }
    
    
    // ========== NOTIFICATION SYSTEM ==========
    
    function showNotification(message, type = 'success') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            background-color: ${type === 'success' ? '#10B981' : '#EF4444'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            font-weight: 500;
            max-width: 400px;
            animation: slideIn 0.3s ease-out;
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 5000);
    }
    
    // Add notification animations to page
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    
    // ========== SCROLL ANIMATIONS (OPTIONAL) ==========
    
    // Fade in elements as they come into view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all sections
    document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
    });
    
    
    // ========== ANALYTICS TRACKING (OPTIONAL) ==========
    
    /**
     * Track events with Google Analytics or your analytics platform
     * Uncomment and configure when you add analytics
     */
    function trackEvent(category, action, label) {
        // Google Analytics 4 example:
        // gtag('event', action, {
        //     'event_category': category,
        //     'event_label': label
        // });
        
        // Facebook Pixel example:
        // fbq('track', action, {
        //     category: category,
        //     label: label
        // });
        
        console.log('Event tracked:', category, action, label);
    }
    
    
    // ========== SCROLL TO TOP BUTTON (OPTIONAL) ==========
    
    // Create scroll to top button
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.innerHTML = '↑';
    scrollTopBtn.className = 'scroll-top-btn';
    scrollTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: var(--color-primary);
        color: white;
        border: none;
        font-size: 24px;
        cursor: pointer;
        display: none;
        z-index: 999;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(scrollTopBtn);
    
    // Show/hide scroll to top button
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollTopBtn.style.display = 'block';
        } else {
            scrollTopBtn.style.display = 'none';
        }
    });
    
    // Scroll to top when clicked
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    scrollTopBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
    });
    
    scrollTopBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
    
    
    // ========== CONSOLE MESSAGE ==========
    console.log('%cNexa Space 🏠', 'color: #4F46E5; font-size: 24px; font-weight: bold;');
    console.log('%cBuilding the future of Nigerian real estate', 'color: #6B7280; font-size: 14px;');
    console.log('%cInterested in joining the team? Email: hello@nexaspace.ng', 'color: #10B981; font-size: 12px;');
    
});


// ========== EXAMPLE: CONNECTING TO GOOGLE SHEETS ==========

/**
 * STEP-BY-STEP GUIDE TO CONNECT FORMS TO GOOGLE SHEETS
 * 
 * 1. Go to https://sheetmonkey.io or https://sheet.best
 * 2. Sign up with your Google account
 * 3. Create a new connection to Google Sheets
 * 4. Get your webhook URL (looks like: https://api.sheetmonkey.io/form/abc123)
 * 5. Replace the form submission code with:
 * 
 * seekerForm.addEventListener('submit', async function(e) {
 *     e.preventDefault();
 *     const formData = new FormData(this);
 *     const data = Object.fromEntries(formData);
 *     
 *     try {
 *         await fetch('YOUR_WEBHOOK_URL_HERE', {
 *             method: 'POST',
 *             headers: { 'Content-Type': 'application/json' },
 *             body: JSON.stringify(data)
 *    

// ========== EXAMPLE: GOOGLE ANALYTICS SETUP ==========

/**
 * HOW TO ADD GOOGLE ANALYTICS
 * 
 * 1. Go to https://analytics.google.com
 * 2. Create a new property
 * 3. Get your Measurement ID (looks like G-XXXXXXXXXX)
 * 4. Add this code to the <head> of index.html BEFORE the closing </head> tag:
 * 
 * <!-- Google Analytics -->
 * <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
 * <script>
 *   window.dataLayer = window.dataLayer || [];
 *   function gtag(){dataLayer.push(arguments);}
 *   gtag('js', new Date());
 *   gtag('config', 'G-XXXXXXXXXX');
 * </script>
 * 
 * 5. Then you can track events with:
 * gtag('event', 'signup', { 'event_category': 'seeker' });
 */