/**
 * Regenerate metadata from ACTUAL Cloudinary images
 * Uses only the images that exist in Cloudinary
 */

require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Category detection based on filename patterns
function detectCategory(publicId, filename) {
    const lower = publicId.toLowerCase();
    const filenameLower = filename.toLowerCase();
    
    // Check for category keywords
    if (lower.includes('eol') || lower.includes('document') || filenameLower.includes('eol')) {
        return 'documentary';
    }
    if (lower.includes('dsc00') || lower.includes('portrait') || lower.includes('potrait')) {
        return 'portraits';
    }
    if (lower.includes('product') || lower.match(/^\d+_/)) {
        return 'product';
    }
    if (lower.includes('macro')) {
        return 'macro';
    }
    if (lower.includes('dsc01077') || lower.includes('street')) {
        return 'street';
    }
    if (lower.includes('hdr') || lower.includes('interior') || lower.includes('untitled')) {
        return 'interior';
    }
    if (lower.includes('jewel') || lower.includes('dsc01')) {
        return 'jewels';
    }
    
    return 'uncategorized';
}

async function regenerateMetadata() {
    console.log('🔄 Regenerating metadata from actual Cloudinary images...\n');
    
    try {
        // Fetch all images
        let allResources = [];
        let nextCursor = null;
        
        do {
            const options = {
                type: 'upload',
                max_results: 500,
                resource_type: 'image'
            };
            
            if (nextCursor) {
                options.next_cursor = nextCursor;
            }
            
            const result = await cloudinary.api.resources(options);
            allResources = allResources.concat(result.resources);
            nextCursor = result.next_cursor;
            
            console.log(`Fetched ${result.resources.length} images...`);
        } while (nextCursor);
        
        console.log(`✅ Total images: ${allResources.length}\n`);
        
        // Filter out sample images (from Cloudinary's default samples folder)
        const userImages = allResources.filter(img => 
            !img.public_id.startsWith('samples/')
        );
        
        console.log(`📸 User images (excluding samples): ${userImages.length}\n`);
        
        // Base URL for transformations
        const baseUrl = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`;
        
        // Transformation presets
        const transformations = {
            thumbnail: 'c_fill,w_400,h_400,g_auto,q_auto,f_auto',
            small: 'c_limit,w_400,q_auto,f_auto',
            medium: 'c_limit,w_800,q_auto,f_auto',
            large: 'c_limit,w_1200,q_auto,f_auto',
            xlarge: 'c_limit,w_2000,q_auto:best,f_auto',
            gallery: 'c_limit,w_600,q_auto:good,f_auto',
            hero: 'c_fill,w_1920,h_1080,g_auto,q_auto,f_auto',
            placeholder: 'c_limit,w_50,q_auto,e_blur:1000'
        };
        
        // Process images
        const categories = {};
        const images = userImages.map(img => {
            const filename = img.public_id.split('/').pop();
            const category = detectCategory(img.public_id, filename);
            
            // Count categories
            categories[category] = (categories[category] || 0) + 1;
            
            // Generate URLs for different sizes
            const urls = {};
            Object.keys(transformations).forEach(size => {
                urls[size] = `${baseUrl}/${transformations[size]}/${img.public_id}`;
            });
            
            return {
                id: img.public_id.replace(/\//g, '_'),
                publicId: img.public_id,
                category: category,
                filename: filename,
                format: img.format,
                width: img.width,
                height: img.height,
                size: img.bytes,
                sizeKB: Math.round(img.bytes / 1024),
                created: img.created_at,
                urls: urls,
                original: img.secure_url
            };
        });
        
        // Sort by category and filename
        images.sort((a, b) => {
            if (a.category !== b.category) {
                return a.category.localeCompare(b.category);
            }
            return a.filename.localeCompare(b.filename);
        });
        
        // Create metadata object
        const metadata = {
            generated: new Date().toISOString(),
            cloudName: process.env.CLOUDINARY_CLOUD_NAME,
            totalImages: images.length,
            transformations: transformations,
            categories: categories,
            images: images
        };
        
        // Save to file
        const outputPath = path.join(__dirname, 'public', 'data', 'cloudinary-images.json');
        fs.writeFileSync(outputPath, JSON.stringify(metadata, null, 2), 'utf8');
        
        console.log('✅ Metadata saved to:', outputPath);
        console.log('\n📊 Category breakdown:');
        Object.keys(categories).sort().forEach(cat => {
            console.log(`   ${cat}: ${categories[cat]} images`);
        });
        
        // Create simplified version
        const simplified = images.map(img => ({
            id: img.id,
            publicId: img.publicId,
            category: img.category,
            url: img.original,
            thumbnail: img.urls.thumbnail,
            gallery: img.urls.gallery
        }));
        
        const simplifiedPath = path.join(__dirname, 'public', 'data', 'cloudinary-urls-simple.json');
        fs.writeFileSync(simplifiedPath, JSON.stringify(simplified, null, 2), 'utf8');
        
        console.log('✅ Simplified version saved to:', simplifiedPath);
        
        console.log('\n🎉 Successfully regenerated metadata from actual Cloudinary images!');
        
        return metadata;
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.error && error.error.message) {
            console.error('   Details:', error.error.message);
        }
        throw error;
    }
}

// Run the script
regenerateMetadata()
    .then(() => {
        console.log('\n✅ Done! Now run: node generate-category-pages.js');
        process.exit(0);
    })
    .catch(error => {
        console.error('\n❌ Failed:', error.message);
        process.exit(1);
    });

