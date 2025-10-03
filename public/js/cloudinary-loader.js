/**
 * Cloudinary Image Loader with Lazy Loading Support
 * Loads and manages images from Cloudinary with progressive loading
 */

class CloudinaryImageLoader {
    constructor() {
        this.metadata = null;
        this.imagesByCategory = {};
        this.isLoaded = false;
        this.loadingPromise = null;
    }

    /**
     * Load the metadata file
     */
    async loadMetadata() {
        if (this.loadingPromise) {
            return this.loadingPromise;
        }

        this.loadingPromise = fetch('data/cloudinary-images.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load metadata: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                this.metadata = data;
                this.organizeByCategory();
                this.isLoaded = true;
                return this.metadata;
            })
            .catch(error => {
                console.error('Error loading Cloudinary metadata:', error);
                throw error;
            });

        return this.loadingPromise;
    }

    /**
     * Organize images by category for easier access
     */
    organizeByCategory() {
        this.imagesByCategory = {};
        
        if (this.metadata && this.metadata.images) {
            this.metadata.images.forEach(image => {
                const category = image.category || 'uncategorized';
                if (!this.imagesByCategory[category]) {
                    this.imagesByCategory[category] = [];
                }
                this.imagesByCategory[category].push(image);
            });
        }
    }

    /**
     * Get all images for a specific category
     */
    getImagesByCategory(category) {
        if (!this.isLoaded) {
            console.warn('Metadata not loaded yet. Call loadMetadata() first.');
            return [];
        }
        return this.imagesByCategory[category] || [];
    }

    /**
     * Get a random image from a category (useful for thumbnails)
     */
    getRandomImageFromCategory(category) {
        const images = this.getImagesByCategory(category);
        if (images.length === 0) return null;
        return images[Math.floor(Math.random() * images.length)];
    }

    /**
     * Get the first image from a category
     */
    getFirstImageFromCategory(category) {
        const images = this.getImagesByCategory(category);
        return images.length > 0 ? images[0] : null;
    }

    /**
     * Get all categories
     */
    getCategories() {
        if (!this.isLoaded) {
            console.warn('Metadata not loaded yet. Call loadMetadata() first.');
            return [];
        }
        return Object.keys(this.imagesByCategory);
    }

    /**
     * Get category statistics
     */
    getCategoryStats() {
        if (!this.isLoaded) {
            console.warn('Metadata not loaded yet. Call loadMetadata() first.');
            return {};
        }
        return this.metadata.categories || {};
    }

    /**
     * Get total number of images
     */
    getTotalImages() {
        if (!this.isLoaded) return 0;
        return this.metadata.totalImages || 0;
    }
}

/**
 * Lazy Loading Manager
 * Handles progressive image loading with placeholders
 */
class LazyImageLoader {
    constructor() {
        this.observer = null;
        this.setupObserver();
    }

    /**
     * Setup Intersection Observer for lazy loading
     */
    setupObserver() {
        // Check if browser supports Intersection Observer
        if (!('IntersectionObserver' in window)) {
            console.warn('Intersection Observer not supported. Loading all images immediately.');
            this.loadAllImages();
            return;
        }

        const options = {
            root: null, // viewport
            rootMargin: '50px', // Start loading 50px before entering viewport
            threshold: 0.01 // Trigger when 1% of image is visible
        };

        this.observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, options);
    }

    /**
     * Observe an image element for lazy loading
     */
    observe(imgElement) {
        if (this.observer) {
            this.observer.observe(imgElement);
        } else {
            // Fallback: load immediately if observer not available
            this.loadImage(imgElement);
        }
    }

    /**
     * Load a single image
     */
    loadImage(imgElement) {
        const fullSrc = imgElement.getAttribute('data-src');
        const fullSrcset = imgElement.getAttribute('data-srcset');
        
        if (!fullSrc) return;

        // Create a new image to preload
        const img = new Image();
        
        img.onload = () => {
            // Replace placeholder with full image
            imgElement.src = fullSrc;
            if (fullSrcset) {
                imgElement.srcset = fullSrcset;
            }
            imgElement.classList.add('loaded');
            imgElement.classList.remove('loading');
        };

        img.onerror = () => {
            console.error('Failed to load image:', fullSrc);
            imgElement.classList.add('error');
            imgElement.classList.remove('loading');
        };

        imgElement.classList.add('loading');
        img.src = fullSrc;
    }

    /**
     * Load all images immediately (fallback)
     */
    loadAllImages() {
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => this.loadImage(img));
    }

    /**
     * Observe all lazy images on the page
     */
    observeAll() {
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => this.observe(img));
    }
}

// Create global instances
const cloudinaryLoader = new CloudinaryImageLoader();
const lazyLoader = new LazyImageLoader();

// Export for use in other scripts
window.CloudinaryLoader = {
    loader: cloudinaryLoader,
    lazy: lazyLoader
};

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        cloudinaryLoader.loadMetadata().catch(err => {
            console.error('Failed to initialize Cloudinary loader:', err);
        });
    });
} else {
    cloudinaryLoader.loadMetadata().catch(err => {
        console.error('Failed to initialize Cloudinary loader:', err);
    });
}

