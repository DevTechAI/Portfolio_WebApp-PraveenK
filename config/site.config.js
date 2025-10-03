/**
 * Site Configuration
 * Update these settings based on your needs
 */

const siteConfig = {
    // Site metadata
    siteName: 'Praveen K Photography',
    siteDescription: 'Professional Photography Portfolio',
    siteUrl: 'https://praveenk-portfolio.com',
    
    // SEO
    keywords: ['photography', 'portfolio', 'professional photographer', 'Praveen K'],
    
    // Analytics (add your tracking IDs)
    googleAnalytics: '',
    
    // Features
    features: {
        lightbox: true,
        lazyLoading: true,
        imageOptimization: true,
        contactForm: true,
        blog: false
    },
    
    // Gallery settings
    gallery: {
        imagesPerPage: 12,
        thumbnailSize: { width: 400, height: 400 },
        fullImageSize: { width: 1920, height: 1080 }
    },
    
    // Contact
    contact: {
        email: 'contact@praveenk.com',
        phone: '',
        location: ''
    },
    
    // Social media
    social: {
        instagram: '',
        facebook: '',
        twitter: '',
        linkedin: '',
        pinterest: ''
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = siteConfig;
}

