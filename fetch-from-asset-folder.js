/**
 * Fetch images using asset folder API
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

async function fetchImages() {
    console.log('🔍 Fetching images using different methods...\n');
    
    // Method 1: Try resources_by_asset_folder
    console.log('Method 1: Trying resources_by_asset_folder API...');
    try {
        const result = await cloudinary.api.resources_by_asset_folder('Praveen-PortfolioPics', {
            max_results: 500
        });
        console.log(`✅ Found ${result.resources.length} images`);
        if (result.resources.length > 0) {
            return result.resources;
        }
    } catch (error) {
        console.log(`❌ Error: ${error.message}`);
    }
    
    // Method 2: Search with expression
    console.log('\nMethod 2: Trying search API...');
    try {
        const result = await cloudinary.search
            .expression('folder:Praveen-PortfolioPics/*')
            .max_results(500)
            .execute();
        console.log(`✅ Found ${result.resources.length} images`);
        if (result.resources.length > 0) {
            return result.resources;
        }
    } catch (error) {
        console.log(`❌ Error: ${error.message}`);
    }
    
    // Method 3: List all resources and filter
    console.log('\nMethod 3: Fetching all resources and filtering...');
    try {
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
            
            console.log(`Fetched ${result.resources.length} images (total: ${allResources.length})...`);
        } while (nextCursor);
        
        // Filter for Praveen-PortfolioPics
        const praveenImages = allResources.filter(img => 
            img.asset_folder && img.asset_folder.startsWith('Praveen-PortfolioPics')
        );
        
        console.log(`✅ Found ${praveenImages.length} images in Praveen-PortfolioPics`);
        
        if (praveenImages.length > 0) {
            // Show folder breakdown
            const folderBreakdown = {};
            praveenImages.forEach(img => {
                const folder = img.asset_folder || 'unknown';
                folderBreakdown[folder] = (folderBreakdown[folder] || 0) + 1;
            });
            
            console.log('\n📁 Folder breakdown:');
            Object.keys(folderBreakdown).sort().forEach(folder => {
                console.log(`   ${folder}: ${folderBreakdown[folder]} images`);
            });
            
            return praveenImages;
        }
        
        // If still nothing, show what we have
        console.log('\n📊 Sample of all images:');
        allResources.slice(0, 10).forEach(img => {
            console.log(`   - ${img.public_id}`);
            console.log(`     asset_folder: ${img.asset_folder || 'none'}`);
            console.log(`     folder: ${img.folder || 'none'}`);
        });
        
    } catch (error) {
        console.log(`❌ Error: ${error.message}`);
    }
    
    return [];
}

async function generateMetadata(resources) {
    if (resources.length === 0) {
        console.log('\n❌ No images to process');
        return;
    }
    
    console.log('\n📝 Generating metadata...\n');
    
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
    
    function detectCategory(assetFolder, publicId) {
        if (assetFolder) {
            const folder = assetFolder.toLowerCase();
            if (folder.includes('documentary')) return 'documentary';
            if (folder.includes('interior')) return 'interior';
            if (folder.includes('jewel')) return 'jewels';
            if (folder.includes('macro')) return 'macro';
            if (folder.includes('potrait') || folder.includes('portrait')) return 'portraits';
            if (folder.includes('product')) return 'product';
            if (folder.includes('street')) return 'street';
        }
        
        const id = publicId.toLowerCase();
        if (id.includes('eol')) return 'documentary';
        if (id.includes('dsc00')) return 'portraits';
        if (id.includes('hdr')) return 'interior';
        
        return 'uncategorized';
    }
    
    const categories = {};
    const images = resources.map(img => {
        const filename = img.public_id.split('/').pop();
        const category = detectCategory(img.asset_folder, img.public_id);
        
        categories[category] = (categories[category] || 0) + 1;
        
        const urls = {};
        Object.keys(transformations).forEach(size => {
            urls[size] = `${baseUrl}/${transformations[size]}/${img.public_id}`;
        });
        
        return {
            id: img.public_id.replace(/[\/\-\s]/g, '_'),
            publicId: img.public_id,
            assetFolder: img.asset_folder || null,
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
    
    const outputPath = path.join(__dirname, 'public', 'data', 'cloudinary-images.json');
    fs.writeFileSync(outputPath, JSON.stringify(metadata, null, 2), 'utf8');
    console.log(`✅ Metadata saved: ${outputPath}`);
    
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

fetchImages()
    .then(images => generateMetadata(images))
    .then(() => {
        console.log('\n✅ Done! Now run: node generate-category-pages.js');
        process.exit(0);
    })
    .catch(error => {
        console.error('\n❌ Failed:', error.message);
        process.exit(1);
    });

