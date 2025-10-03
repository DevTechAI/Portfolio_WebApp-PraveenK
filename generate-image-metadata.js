/**
 * Generate Image Metadata File
 * Creates a JSON file with all Cloudinary image URLs and metadata
 */

const cloudinary = require('cloudinary').v2;
const fs = require('fs');
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;

// Image transformation presets
const TRANSFORMATIONS = {
    thumbnail: 'c_fill,w_400,h_400,g_auto,q_auto,f_auto',
    small: 'c_limit,w_400,q_auto,f_auto',
    medium: 'c_limit,w_800,q_auto,f_auto',
    large: 'c_limit,w_1200,q_auto,f_auto',
    xlarge: 'c_limit,w_2000,q_auto:best,f_auto',
    gallery: 'c_limit,w_600,q_auto:good,f_auto',
    hero: 'c_fill,w_1920,h_1080,g_auto,q_auto,f_auto',
    placeholder: 'c_limit,w_50,q_auto,e_blur:1000'
};

/**
 * Generate URLs for all transformation sizes
 */
function generateUrls(publicId) {
    const urls = {};
    Object.entries(TRANSFORMATIONS).forEach(([name, transform]) => {
        urls[name] = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transform}/${publicId}`;
    });
    return urls;
}

/**
 * Categorize image based on filename pattern
 */
function categorizeImage(publicId) {
    const id = publicId.toLowerCase();
    
    if (id.includes('eol')) return 'documentary';
    if (id.includes('dsc00') || id.includes('portrait')) return 'portraits';
    if (id.includes('dsc01') && (id.includes('077') || id.includes('street'))) return 'street';
    if (id.includes('dsc01') && (id.includes('213') || id.includes('macro'))) return 'macro';
    if (id.includes('untitled_hdr') || id.includes('interior')) return 'interior';
    if (id.includes('product') || /^\d+_/.test(id)) return 'product';
    if (id.includes('jewel') || id.includes('watch')) return 'jewels';
    
    // Default categorization by pattern
    if (/^\d+_/.test(id)) return 'featured';
    
    return 'uncategorized';
}

/**
 * Main function to generate metadata
 */
async function generateMetadata() {
    console.log('\n🔄 Generating Image Metadata...\n');
    console.log('='.repeat(70));
    
    try {
        // Fetch all images
        const result = await cloudinary.search
            .expression('folder:Praveen-PortfolioPics/*')
            .sort_by('created_at', 'desc')
            .max_results(500)
            .execute();
        
        console.log(`\n📊 Found ${result.total_count} images\n`);
        
        const metadata = {
            generated: new Date().toISOString(),
            cloudName: CLOUD_NAME,
            totalImages: result.total_count,
            transformations: TRANSFORMATIONS,
            categories: {},
            images: [],
            byCategory: {}
        };
        
        // Process each image
        result.resources.forEach(resource => {
            const category = categorizeImage(resource.public_id);
            
            const imageData = {
                id: resource.public_id,
                category: category,
                filename: resource.public_id.split('/').pop(),
                format: resource.format,
                width: resource.width,
                height: resource.height,
                size: resource.bytes,
                sizeKB: Math.round(resource.bytes / 1024),
                created: resource.created_at,
                urls: generateUrls(resource.public_id),
                original: resource.secure_url
            };
            
            metadata.images.push(imageData);
            
            // Group by category
            if (!metadata.byCategory[category]) {
                metadata.byCategory[category] = [];
            }
            metadata.byCategory[category].push(imageData);
        });
        
        // Count by category
        Object.keys(metadata.byCategory).forEach(cat => {
            metadata.categories[cat] = metadata.byCategory[cat].length;
        });
        
        // Sort images by category
        metadata.images.sort((a, b) => {
            if (a.category !== b.category) {
                return a.category.localeCompare(b.category);
            }
            return a.id.localeCompare(b.id);
        });
        
        // Write to file
        const outputPath = 'public/data/cloudinary-images.json';
        fs.mkdirSync('public/data', { recursive: true });
        fs.writeFileSync(outputPath, JSON.stringify(metadata, null, 2));
        
        console.log('✅ Metadata generated successfully!\n');
        console.log('📁 Output:', outputPath);
        console.log('\n📊 Summary:');
        console.log('─'.repeat(70));
        console.log(`Total Images: ${metadata.totalImages}`);
        console.log('\nBy Category:');
        Object.entries(metadata.categories).forEach(([cat, count]) => {
            console.log(`  ${cat.padEnd(20)} ${count} images`);
        });
        
        console.log('\n' + '='.repeat(70));
        console.log('✨ You can now use this metadata in your webapp!\n');
        
        return metadata;
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        throw error;
    }
}

// Also create a simplified version for easy reference
async function generateSimplifiedMetadata() {
    try {
        const result = await cloudinary.search
            .expression('folder:Praveen-PortfolioPics/*')
            .max_results(500)
            .execute();
        
        const simplified = {
            cloudName: CLOUD_NAME,
            baseUrl: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`,
            images: {}
        };
        
        result.resources.forEach(resource => {
            const id = resource.public_id;
            simplified.images[id] = {
                thumbnail: `c_fill,w_400,h_400,g_auto,q_auto,f_auto/${id}`,
                medium: `c_limit,w_800,q_auto,f_auto/${id}`,
                large: `c_limit,w_1200,q_auto,f_auto/${id}`,
                full: `c_limit,w_2000,q_auto:best,f_auto/${id}`
            };
        });
        
        fs.writeFileSync('public/data/cloudinary-urls-simple.json', JSON.stringify(simplified, null, 2));
        console.log('📝 Also created simplified version: public/data/cloudinary-urls-simple.json\n');
        
    } catch (error) {
        console.error('Error creating simplified metadata:', error.message);
    }
}

// Run
(async () => {
    try {
        await generateMetadata();
        await generateSimplifiedMetadata();
        
        console.log('🎉 All metadata files created!\n');
        console.log('📖 Usage examples:');
        console.log('─'.repeat(70));
        console.log(`
// JavaScript - Load metadata
fetch('/data/cloudinary-images.json')
  .then(res => res.json())
  .then(data => {
    // Get all documentary images
    const documentary = data.byCategory.documentary;
    
    // Get medium size URL for first image
    const url = documentary[0].urls.medium;
    console.log(url);
  });

// Or use the simplified version
fetch('/data/cloudinary-urls-simple.json')
  .then(res => res.json())
  .then(data => {
    const imageId = 'EOL01550_ki1e13';
    const url = data.baseUrl + '/' + data.images[imageId].medium;
    console.log(url);
  });
        `);
        
    } catch (error) {
        console.error('Failed:', error.message);
        process.exit(1);
    }
})();

