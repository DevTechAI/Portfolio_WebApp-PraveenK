/**
 * Fetch images from Praveen-PortfolioPics and its subfolders
 */

require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const subfolders = [
    'Praveen-PortfolioPics/Documentary',
    'Praveen-PortfolioPics/Interior',
    'Praveen-PortfolioPics/Jewellery',
    'Praveen-PortfolioPics/Macro',
    'Praveen-PortfolioPics/Potraits',
    'Praveen-PortfolioPics/Product',
    'Praveen-PortfolioPics/Street'
];

async function fetchAllImages() {
    console.log('🔍 Fetching images from Praveen-PortfolioPics subfolders...\n');
    
    let allImages = [];
    const categoryMap = {
        'Documentary': 'documentary',
        'Interior': 'interior',
        'Jewellery': 'jewels',
        'Macro': 'macro',
        'Potraits': 'portraits',
        'Product': 'product',
        'Street': 'street'
    };
    
    for (const folder of subfolders) {
        console.log(`📁 Fetching from: ${folder}`);
        
        try {
            let folderImages = [];
            let nextCursor = null;
            
            do {
                const options = {
                    type: 'upload',
                    prefix: folder,
                    max_results: 500,
                    resource_type: 'image'
                };
                
                if (nextCursor) {
                    options.next_cursor = nextCursor;
                }
                
                const result = await cloudinary.api.resources(options);
                
                if (result.resources && result.resources.length > 0) {
                    folderImages = folderImages.concat(result.resources);
                    nextCursor = result.next_cursor;
                } else {
                    break;
                }
            } while (nextCursor);
            
            console.log(`   ✅ Found ${folderImages.length} images`);
            
            // Show sample filenames
            if (folderImages.length > 0) {
                folderImages.slice(0, 3).forEach(img => {
                    const filename = img.public_id.split('/').pop();
                    console.log(`      - ${filename}`);
                });
                if (folderImages.length > 3) {
                    console.log(`      ... and ${folderImages.length - 3} more`);
                }
            }
            
            allImages = allImages.concat(folderImages);
            
        } catch (error) {
            console.log(`   ❌ Error: ${error.message}`);
        }
    }
    
    console.log(`\n✅ Total images fetched: ${allImages.length}\n`);
    
    if (allImages.length > 0) {
        await generateMetadata(allImages, categoryMap);
    }
    
    return allImages;
}

async function generateMetadata(resources, categoryMap) {
    console.log('📝 Generating metadata...\n');
    
    const baseUrl = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`;
    
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
    
    function detectCategory(publicId) {
        const parts = publicId.split('/');
        if (parts.length >= 2) {
            const subfolder = parts[1]; // e.g., "Documentary", "Interior"
            return categoryMap[subfolder] || 'uncategorized';
        }
        return 'uncategorized';
    }
    
    const categories = {};
    const images = resources.map(img => {
        const filename = img.public_id.split('/').pop();
        const category = detectCategory(img.public_id);
        
        categories[category] = (categories[category] || 0) + 1;
        
        const urls = {};
        Object.keys(transformations).forEach(size => {
            urls[size] = `${baseUrl}/${transformations[size]}/${img.public_id}`;
        });
        
        return {
            id: img.public_id.replace(/[\/\-\s]/g, '_'),
            publicId: img.public_id,
            category: category,
            filename: filename,
            format: img.format,
            width: img.width || 0,
            height: img.height || 0,
            size: img.bytes,
            sizeKB: Math.round(img.bytes / 1024),
            created: img.created_at,
            urls: urls,
            original: img.secure_url
        };
    });
    
    images.sort((a, b) => {
        if (a.category !== b.category) {
            return a.category.localeCompare(b.category);
        }
        return a.filename.localeCompare(b.filename);
    });
    
    const metadata = {
        generated: new Date().toISOString(),
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        sourceFolder: 'Praveen-PortfolioPics',
        totalImages: images.length,
        transformations: transformations,
        categories: categories,
        images: images
    };
    
    // Save full metadata
    const outputPath = path.join(__dirname, 'public', 'data', 'cloudinary-images.json');
    fs.writeFileSync(outputPath, JSON.stringify(metadata, null, 2), 'utf8');
    console.log(`✅ Metadata saved: ${outputPath}`);
    
    // Save simplified version
    const simplified = images.map(img => ({
        id: img.id,
        publicId: img.publicId,
        category: img.category,
        thumbnail: img.urls.thumbnail,
        gallery: img.urls.gallery,
        original: img.original
    }));
    const simplifiedPath = path.join(__dirname, 'public', 'data', 'cloudinary-urls-simple.json');
    fs.writeFileSync(simplifiedPath, JSON.stringify(simplified, null, 2), 'utf8');
    console.log(`✅ Simplified version saved: ${simplifiedPath}`);
    
    console.log('\n📊 Category breakdown:');
    Object.keys(categories).sort().forEach(cat => {
        console.log(`   ${cat}: ${categories[cat]} images`);
    });
    
    console.log('\n🎉 Metadata generation complete!');
}

fetchAllImages()
    .then(() => {
        console.log('\n✅ Done! Now run: node generate-category-pages.js');
        process.exit(0);
    })
    .catch(error => {
        console.error('\n❌ Failed:', error.message);
        process.exit(1);
    });

