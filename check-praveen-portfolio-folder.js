/**
 * Check Praveen-PortfolioPics folder specifically
 */

const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

async function checkFolder(folderPath) {
    try {
        const resources = await cloudinary.api.resources({
            type: 'upload',
            prefix: folderPath,
            max_results: 500
        });
        return resources.resources || [];
    } catch (error) {
        console.error(`Error checking ${folderPath}:`, error.message);
        return [];
    }
}

async function main() {
    console.log('\n🔍 CHECKING PRAVEEN-PORTFOLIOPICS FOLDER\n');
    console.log('='.repeat(70));
    
    const mainFolder = 'Praveen-PortfolioPics';
    
    // Get subfolders
    try {
        const subfolders = await cloudinary.api.sub_folders(mainFolder);
        
        console.log(`\n📁 ${mainFolder}/\n`);
        
        if (subfolders.folders && subfolders.folders.length > 0) {
            for (const subfolder of subfolders.folders) {
                const folderPath = `${mainFolder}/${subfolder.name}`;
                const images = await checkFolder(folderPath);
                
                console.log(`\n📂 ${subfolder.name}/`);
                console.log('─'.repeat(70));
                console.log(`   Images: ${images.length}`);
                
                if (images.length > 0) {
                    const totalSize = images.reduce((sum, img) => sum + img.bytes, 0);
                    console.log(`   Total Size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
                    console.log(`\n   Sample Images:`);
                    
                    // Show first 10 images
                    images.slice(0, 10).forEach((img, idx) => {
                        const filename = img.public_id.split('/').pop();
                        const size = (img.bytes / 1024).toFixed(1);
                        const prefix = idx === Math.min(9, images.length - 1) ? '   └─' : '   ├─';
                        console.log(`${prefix} ${filename} (${size} KB, ${img.width}x${img.height}px)`);
                    });
                    
                    if (images.length > 10) {
                        console.log(`   └─ ... and ${images.length - 10} more images`);
                    }
                    
                    // Show actual Cloudinary URLs for first image
                    if (images.length > 0) {
                        const firstImage = images[0];
                        console.log(`\n   📸 Example Cloudinary URL:`);
                        console.log(`   ${firstImage.secure_url}`);
                        console.log(`\n   📸 Optimized URL:`);
                        console.log(`   https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/c_limit,w_800,q_auto,f_auto/${firstImage.public_id}`);
                    }
                }
            }
        }
        
        console.log('\n' + '='.repeat(70));
        console.log('✅ Check complete!\n');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

main().catch(error => {
    console.error('❌ Error:', error.message);
    process.exit(1);
});

