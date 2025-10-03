/**
 * Cloudinary Helper - Easy Image Loading
 * Loads and provides easy access to Cloudinary images
 */

class CloudinaryHelper {
    constructor() {
        this.metadata = null;
        this.loaded = false;
    }

    /**
     * Load metadata from JSON file
     */
    async load() {
        if (this.loaded) return this.metadata;
        
        try {
            const response = await fetch('/data/cloudinary-images.json');
            this.metadata = await response.json();
            this.loaded = true;
            console.log('✅ Cloudinary metadata loaded:', this.metadata.totalImages, 'images');
            return this.metadata;
        } catch (error) {
            console.error('❌ Error loading Cloudinary metadata:', error);
            throw error;
        }
    }

    /**
     * Get images by category
     * @param {string} category - Category name (documentary, portraits, etc.)
     * @returns {Array} Array of image objects
     */
    getByCategory(category) {
        if (!this.loaded) {
            console.error('Metadata not loaded. Call load() first.');
            return [];
        }
        return this.metadata.byCategory[category] || [];
    }

    /**
     * Get all categories with counts
     * @returns {Object} Categories and image counts
     */
    getCategories() {
        if (!this.loaded) {
            console.error('Metadata not loaded. Call load() first.');
            return {};
        }
        return this.metadata.categories;
    }

    /**
     * Get image URL by ID and size
     * @param {string} imageId - Image public ID
     * @param {string} size - Size preset (thumbnail, small, medium, large, etc.)
     * @returns {string} Cloudinary URL
     */
    getUrl(imageId, size = 'medium') {
        if (!this.loaded) {
            console.error('Metadata not loaded. Call load() first.');
            return '';
        }
        
        const image = this.metadata.images.find(img => img.id === imageId);
        if (!image) {
            console.warn(`Image not found: ${imageId}`);
            return '';
        }
        
        return image.urls[size] || image.urls.medium;
    }

    /**
     * Get random images
     * @param {number} count - Number of random images to return
     * @param {string} category - Optional category filter
     * @returns {Array} Array of random image objects
     */
    getRandom(count = 10, category = null) {
        if (!this.loaded) {
            console.error('Metadata not loaded. Call load() first.');
            return [];
        }
        
        const source = category ? this.getByCategory(category) : this.metadata.images;
        const shuffled = [...source].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count);
    }

    /**
     * Get all images
     * @returns {Array} All images
     */
    getAllImages() {
        if (!this.loaded) {
            console.error('Metadata not loaded. Call load() first.');
            return [];
        }
        return this.metadata.images;
    }

    /**
     * Search images by filename
     * @param {string} query - Search query
     * @returns {Array} Matching images
     */
    search(query) {
        if (!this.loaded) {
            console.error('Metadata not loaded. Call load() first.');
            return [];
        }
        
        const lowerQuery = query.toLowerCase();
        return this.metadata.images.filter(img => 
            img.id.toLowerCase().includes(lowerQuery) ||
            img.filename.toLowerCase().includes(lowerQuery) ||
            img.category.toLowerCase().includes(lowerQuery)
        );
    }

    /**
     * Generate responsive srcset attribute
     * @param {string} imageId - Image public ID
     * @returns {string} srcset attribute value
     */
    getSrcSet(imageId) {
        if (!this.loaded) return '';
        
        const image = this.metadata.images.find(img => img.id === imageId);
        if (!image) return '';
        
        return `${image.urls.small} 400w, ${image.urls.medium} 800w, ${image.urls.large} 1200w`;
    }

    /**
     * Get image with all URLs and metadata
     * @param {string} imageId - Image public ID
     * @returns {Object} Complete image object
     */
    getImage(imageId) {
        if (!this.loaded) {
            console.error('Metadata not loaded. Call load() first.');
            return null;
        }
        
        return this.metadata.images.find(img => img.id === imageId);
    }
}

// Create singleton instance
const cloudinary = new CloudinaryHelper();

// Auto-load on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        cloudinary.load().catch(err => console.error('Failed to load Cloudinary metadata:', err));
    });
} else {
    cloudinary.load().catch(err => console.error('Failed to load Cloudinary metadata:', err));
}

// Export for use in modules or global scope
if (typeof module !== 'undefined' && module.exports) {
    module.exports = cloudinary;
}

