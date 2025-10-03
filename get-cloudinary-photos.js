/**
 * Get photos from Cloudinary account
 * Checks the actual structure and retrieves available images
 */

require('dotenv').config();
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

async function getAllImages() {
    console.log('🔍 Fetching all images from Cloudinary...\n');
    
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
        
        console.log(`\n✅ Total images found: ${allResources.length}\n`);
        
        // Group by folder structure
        const byFolder = {};
        const rootImages = [];
        
        allResources.forEach(img => {
            // Extract folder from public_id
            const parts = img.public_id.split('/');
            
            if (parts.length > 1) {
                // Has folder structure
                const folder = parts.slice(0, -1).join('/');
                if (!byFolder[folder]) {
                    byFolder[folder] = [];
                }
                byFolder[folder].push(img);
            } else {
                // Root level
                rootImages.push(img);
            }
        });
        
        // Display results
        console.log('📁 FOLDER STRUCTURE:\n');
        
        if (rootImages.length > 0) {
            console.log(`ROOT (${rootImages.length} images):`);
            rootImages.slice(0, 5).forEach(img => {
                console.log(`  - ${img.public_id} (${img.format}, ${Math.round(img.bytes/1024)}KB)`);
            });
            if (rootImages.length > 5) {
                console.log(`  ... and ${rootImages.length - 5} more`);
            }
            console.log('');
        }
        
        Object.keys(byFolder).sort().forEach(folder => {
            const images = byFolder[folder];
            console.log(`${folder}/ (${images.length} images):`);
            images.slice(0, 5).forEach(img => {
                const filename = img.public_id.split('/').pop();
                console.log(`  - ${filename} (${img.format}, ${Math.round(img.bytes/1024)}KB)`);
            });
            if (images.length > 5) {
                console.log(`  ... and ${images.length - 5} more`);
            }
            console.log('');
        });
        
        // Look specifically for Praveen-PortfolioPics
        console.log('\n🔍 SEARCHING FOR "Praveen-PortfolioPics":');
        const praveenFolder = Object.keys(byFolder).find(f => 
            f.toLowerCase().includes('praveen') || f.toLowerCase().includes('portfolio')
        );
        
        if (praveenFolder) {
            console.log(`✅ Found folder: "${praveenFolder}"`);
            console.log(`   Contains ${byFolder[praveenFolder].length} images\n`);
            
            // Show subfolder structure
            const subfolders = {};
            byFolder[praveenFolder].forEach(img => {
                const fullPath = img.public_id;
                const pathParts = fullPath.split('/');
                if (pathParts.length > 2) {
                    const subfolder = pathParts[1]; // The folder after Praveen-PortfolioPics
                    if (!subfolders[subfolder]) {
                        subfolders[subfolder] = [];
                    }
                    subfolders[subfolder].push(img);
                }
            });
            
            if (Object.keys(subfolders).length > 0) {
                console.log('   Subfolders:');
                Object.keys(subfolders).sort().forEach(sub => {
                    console.log(`     - ${sub}/ (${subfolders[sub].length} images)`);
                });
            }
        } else {
            console.log('❌ No folder matching "Praveen-PortfolioPics" found');
        }
        
        // Sample image URLs
        console.log('\n🌐 SAMPLE IMAGE URLS:\n');
        const sampleImage = allResources[0];
        if (sampleImage) {
            const baseUrl = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`;
            console.log(`Original: ${sampleImage.secure_url}`);
            console.log(`Thumbnail: ${baseUrl}/c_fill,w_400,h_400,g_auto,q_auto,f_auto/${sampleImage.public_id}`);
            console.log(`Medium: ${baseUrl}/c_limit,w_800,q_auto,f_auto/${sampleImage.public_id}`);
        }
        
        return allResources;
        
    } catch (error) {
        console.error('❌ Error fetching images:', error.message);
        if (error.error && error.error.message) {
            console.error('   Details:', error.error.message);
        }
        throw error;
    }
}

// Run the script
getAllImages()
    .then(() => {
        console.log('\n✅ Done!');
        process.exit(0);
    })
    .catch(error => {
        console.error('\n❌ Failed:', error.message);
        process.exit(1);
    });

