/**
 * Detailed Cloudinary Structure Check
 */

const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

async function getAllResources() {
    try {
        const resources = await cloudinary.api.resources({
            type: 'upload',
            max_results: 500
        });
        return resources;
    } catch (error) {
        console.error('Error:', error.message);
        return null;
    }
}

async function main() {
    console.log('\n🔍 DETAILED CLOUDINARY STRUCTURE CHECK\n');
    console.log('='.repeat(70));
    
    // Get all resources
    const result = await getAllResources();
    
    if (!result || !result.resources) {
        console.log('❌ Could not retrieve resources');
        return;
    }
    
    const resources = result.resources;
    console.log(`\n📊 Total Resources: ${result.total_count || resources.length}\n`);
    
    // Organize by folder
    const folderMap = {};
    
    resources.forEach(resource => {
        const path = resource.public_id;
        
        if (path.includes('/')) {
            // Extract folder path
            const parts = path.split('/');
            const folder = parts.slice(0, -1).join('/');
            
            if (!folderMap[folder]) {
                folderMap[folder] = [];
            }
            folderMap[folder].push(resource);
        } else {
            // Root level
            if (!folderMap['ROOT']) {
                folderMap['ROOT'] = [];
            }
            folderMap['ROOT'].push(resource);
        }
    });
    
    // Display folder structure
    const folders = Object.keys(folderMap).sort();
    
    console.log('📂 FOLDER STRUCTURE:\n');
    console.log('─'.repeat(70));
    
    folders.forEach(folder => {
        const images = folderMap[folder];
        const totalSize = images.reduce((sum, img) => sum + img.bytes, 0);
        const avgSize = (totalSize / images.length / 1024).toFixed(1);
        
        if (folder === 'ROOT') {
            console.log(`\n📁 Root Directory (${images.length} images)`);
        } else {
            console.log(`\n📁 ${folder}/ (${images.length} images)`);
        }
        console.log(`   Total Size: ${(totalSize / 1024 / 1024).toFixed(2)} MB | Avg: ${avgSize} KB`);
        
        // Show first 5 images
        console.log(`   Images:`);
        images.slice(0, 5).forEach((img, idx) => {
            const filename = img.public_id.split('/').pop();
            const size = (img.bytes / 1024).toFixed(1);
            const prefix = idx === Math.min(4, images.length - 1) ? '└─' : '├─';
            console.log(`   ${prefix} ${filename} (${size} KB, ${img.width}x${img.height}px)`);
        });
        
        if (images.length > 5) {
            console.log(`   └─ ... and ${images.length - 5} more images`);
        }
    });
    
    console.log('\n' + '='.repeat(70));
    
    // Summary
    console.log('\n📈 SUMMARY:\n');
    console.log(`Total Folders: ${folders.length}`);
    console.log(`Total Images: ${resources.length}`);
    console.log(`Total Storage: ${(result.total_count * 300 / 1024 / 1024).toFixed(2)} MB (approx)`);
    
    console.log('\n' + '='.repeat(70));
    
    // List all unique folder paths
    console.log('\n📋 ALL FOLDER PATHS:\n');
    folders.forEach(folder => {
        const count = folderMap[folder].length;
        if (folder === 'ROOT') {
            console.log(`   / (root) - ${count} images`);
        } else {
            console.log(`   ${folder}/ - ${count} images`);
        }
    });
    
    console.log('\n✅ Check complete!\n');
}

main().catch(error => {
    console.error('❌ Error:', error.message);
    process.exit(1);
});

