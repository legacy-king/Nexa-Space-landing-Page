/* ===================================
   NEXA SPACE - MAIN JAVASCRIPT
   Complete and corrected version
   ================================== */

// ========== CONFIGURATION ==========
const SEEKER_API_URL = 'https://api.sheetbest.com/sheets/d8d0f795-4a51-4335-b3ad-e36d525adddd';
const AGENT_API_URL = 'https://api.sheetbest.com/sheets/8e445630-20f4-4076-91c0-98b548b1547c';

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
            if (mobileMenu) {
                mobileMenu.classList.remove('active');
            }
            // Reset hamburger icon
            if (mobileMenuToggle) {
                const spans = mobileMenuToggle.querySelectorAll('span');
                spans[0].style.transform = '';
                spans[1].style.opacity = '1';
                spans[2].style.transform = '';
            }
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
            
            // Add timestamp
            data.timestamp = new Date().toLocaleString('en-US', { 
                timeZone: 'Africa/Lagos',
                dateStyle: 'short',
                timeStyle: 'short'
            });
            
            // Basic validation
            if (!validateEmail(data.email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            // Sanitize inputs (prevent XSS)
            Object.keys(data).forEach(key => {
                if (typeof data[key] === 'string') {
                    data[key] = sanitizeInput(data[key]);
                }
            });
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Submitting...';
            submitBtn.disabled = true;
            
            try {
                // Submit to Property Seekers sheet
                await submitToSheetBest(data, SEEKER_API_URL);
                
                // Success!
                showNotification('Thanks for joining! We\'ll notify you when we launch.', 'success');
                this.reset();
                
                // Track event (if analytics is setup)
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'signup', { 
                        'event_category': 'form',
                        'event_label': 'seeker'
                    });
                }
                
            } catch (error) {
                console.error('Submission error:', error);
                showNotification('Something went wrong. Please try again or email us directly.', 'error');
            } finally {
                // Restore button state
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
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
            
            // Add timestamp
            data.timestamp = new Date().toLocaleString('en-US', { 
                timeZone: 'Africa/Lagos',
                dateStyle: 'short',
                timeStyle: 'short'
            });
            
            // Validate email
            if (!validateEmail(data.email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            // Validate phone (required for agents)
            if (!data.phone || !validatePhone(data.phone)) {
                showNotification('Please enter a valid phone number', 'error');
                return;
            }
            
            // Sanitize inputs
            Object.keys(data).forEach(key => {
                if (typeof data[key] === 'string') {
                    data[key] = sanitizeInput(data[key]);
                }
            });
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Submitting...';
            submitBtn.disabled = true;
            
            try {
                // Submit to Agents sheet
                await submitToSheetBest(data, AGENT_API_URL);
                
                // Success!
                showNotification('Thanks for applying! We\'ll review your application and get back to you within 48 hours.', 'success');
                this.reset();
                
                // Track event
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'signup', { 
                        'event_category': 'form',
                        'event_label': 'agent'
                    });
                }
                
            } catch (error) {
                console.error('Submission error:', error);
                showNotification('Something went wrong. Please try again or email us directly.', 'error');
            } finally {
                // Restore button state
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }
    
    
    // ========== FORM SUBMISSION FUNCTION ==========
    
    /**
     * Submit form data to SheetBest API
     * @param {Object} data - Form data to submit
     * @param {string} apiUrl - API endpoint URL (seeker or agent)
     * @returns {Promise} - Resolves if successful, rejects on error
     */
    async function submitToSheetBest(data, apiUrl) {
        const response = await fetch(apiUrl, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            // Try to get error message from response
            let errorMessage = 'Submission failed';
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } catch (e) {
                // Use default error message
            }
            throw new Error(errorMessage);
        }
        
        return await response.json();
    }
    
    
    // ========== VALIDATION FUNCTIONS ==========
    
    /**
     * Validate email address format
     * @param {string} email - Email to validate
     * @returns {boolean} - True if valid
     */
    function validateEmail(email) {
        if (!email || typeof email !== 'string') return false;
        
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email.trim().toLowerCase());
    }
    
    /**
     * Validate phone number format
     * @param {string} phone - Phone to validate
     * @returns {boolean} - True if valid
     */
    function validatePhone(phone) {
        if (!phone || typeof phone !== 'string') return false;
        
        // Remove all non-numeric characters
        const cleanPhone = phone.replace(/\D/g, '');
        
        // Must be at least 10 digits
        return cleanPhone.length >= 10;
    }
    
    /**
     * Sanitize user input to prevent XSS
     * @param {string} input - User input to sanitize
     * @returns {string} - Sanitized input
     */
    function sanitizeInput(input) {
        if (typeof input !== 'string') return input;
        
        // Create a temporary div to use browser's HTML parser
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;');
    }
    
    
    // ========== NOTIFICATION SYSTEM ==========
    
    /**
     * Show notification message to user
     * @param {string} message - Message to display
     * @param {string} type - 'success' or 'error'
     */
    function showNotification(message, type = 'success') {
        // Remove any existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(n => n.remove());
        
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
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }
    
    // Add notification animations
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
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
    }
    
    
    // ========== SCROLL ANIMATIONS ==========
    
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
    
    
    // ========== SCROLL TO TOP BUTTON ==========
    
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.innerHTML = '↑';
    scrollTopBtn.className = 'scroll-top-btn';
    scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
    scrollTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: #4F46E5;
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
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            if (window.pageYOffset > 300) {
                scrollTopBtn.style.display = 'block';
            } else {
                scrollTopBtn.style.display = 'none';
            }
        }, 100);
    }, { passive: true });
    
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