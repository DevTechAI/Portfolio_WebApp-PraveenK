/**
 * Cloudinary Configuration
 * Replace YOUR_CLOUD_NAME with your actual Cloudinary cloud name
 */

const CLOUDINARY_CONFIG = {
    cloudName: 'YOUR_CLOUD_NAME',  // Replace with your Cloudinary cloud name
    baseUrl: 'https://res.cloudinary.com',
    
    // Folder structure in Cloudinary (optional)
    folders: {
        documentary: 'portfolio/documentary',
        portraits: 'portfolio/portraits',
        product: 'portfolio/product',
        macro: 'portfolio/macro',
        street: 'portfolio/street',
        interior: 'portfolio/interior',
        jewels: 'portfolio/jewels',
        featured: 'portfolio/featured'
    },
    
    // Image transformations for different use cases
    transformations: {
        thumbnail: 'c_fill,w_400,h_400,q_auto,f_auto',
        medium: 'c_limit,w_800,q_auto,f_auto',
        large: 'c_limit,w_1200,q_auto,f_auto',
        hero: 'c_fill,w_1920,h_1080,q_auto,f_auto',
        gallery: 'c_limit,w_600,q_auto:good,f_auto',
        fullscreen: 'c_limit,w_2000,q_auto:best,f_auto'
    }
};

/**
 * Generate Cloudinary URL for an image
 * @param {string} category - The photo category (documentary, portraits, etc.)
 * @param {string} filename - The image filename (without extension)
 * @param {string} transformation - The transformation preset (thumbnail, medium, large, etc.)
 * @returns {string} - Full Cloudinary URL
 */
function getCloudinaryUrl(category, filename, transformation = 'medium') {
    const folder = CLOUDINARY_CONFIG.folders[category] || 'portfolio';
    const transform = CLOUDINARY_CONFIG.transformations[transformation] || '';
    
    // Remove file extension if present
    const name = filename.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '');
    
    return `${CLOUDINARY_CONFIG.baseUrl}/${CLOUDINARY_CONFIG.cloudName}/image/upload/${transform}/${folder}/${name}`;
}

/**
 * Replace local image paths with Cloudinary URLs
 * Call this after DOM is loaded to convert all images
 */
function enableCloudinary() {
    // Get all images with data-cloudinary attributes
    document.querySelectorAll('[data-cloudinary]').forEach(img => {
        const category = img.getAttribute('data-category');
        const filename = img.getAttribute('data-filename');
        const transformation = img.getAttribute('data-transform') || 'medium';
        
        if (category && filename) {
            const cloudinaryUrl = getCloudinaryUrl(category, filename, transformation);
            
            if (img.tagName === 'IMG') {
                img.src = cloudinaryUrl;
            } else {
                img.style.backgroundImage = `url('${cloudinaryUrl}')`;
            }
        }
    });
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CLOUDINARY_CONFIG, getCloudinaryUrl, enableCloudinary };
}

