/**
 * List all folders and images in Cloudinary
 */

const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

async function listFolderContents(folderPath = '') {
    try {
        const resources = await cloudinary.api.resources({
            type: 'upload',
            prefix: folderPath,
            max_results: 500
        });
        
        return resources.resources || [];
    } catch (error) {
        console.error(`Error listing ${folderPath}:`, error.message);
        return [];
    }
}

async function main() {
    console.log('\n📂 CLOUDINARY FOLDER STRUCTURE\n');
    console.log('='.repeat(60));
    
    // Get root folders
    const rootFolders = await cloudinary.api.root_folders();
    
    if (!rootFolders.folders || rootFolders.folders.length === 0) {
        console.log('📭 No folders found in Cloudinary');
        return;
    }
    
    for (const rootFolder of rootFolders.folders) {
        console.log(`\n📁 ${rootFolder.name}/`);
        console.log('─'.repeat(60));
        
        // Get subfolders
        try {
            const subfolders = await cloudinary.api.sub_folders(rootFolder.name);
            
            if (subfolders.folders && subfolders.folders.length > 0) {
                for (const subfolder of subfolders.folders) {
                    // Get images in this subfolder
                    const folderPath = `${rootFolder.name}/${subfolder.name}`;
                    const images = await listFolderContents(folderPath);
                    
                    console.log(`   └─ 📂 ${subfolder.name}/ (${images.length} images)`);
                    
                    // Show first 3 images as examples
                    if (images.length > 0) {
                        images.slice(0, 3).forEach((img, idx) => {
                            const filename = img.public_id.split('/').pop();
                            const size = (img.bytes / 1024).toFixed(1);
                            console.log(`      ${idx === images.length - 1 && images.length <= 3 ? '└' : '├'}─ ${filename} (${size} KB, ${img.width}x${img.height})`);
                        });
                        if (images.length > 3) {
                            console.log(`      └─ ... and ${images.length - 3} more`);
                        }
                    }
                }
            } else {
                // Check for images in root folder
                const images = await listFolderContents(rootFolder.name);
                if (images.length > 0) {
                    console.log(`   ${images.length} images`);
                    images.slice(0, 5).forEach((img, idx) => {
                        const filename = img.public_id.split('/').pop();
                        const size = (img.bytes / 1024).toFixed(1);
                        console.log(`   ├─ ${filename} (${size} KB)`);
                    });
                    if (images.length > 5) {
                        console.log(`   └─ ... and ${images.length - 5} more`);
                    }
                }
            }
        } catch (error) {
            console.log(`   (No subfolders)`);
        }
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ Complete!\n');
}

main().catch(error => {
    console.error('❌ Error:', error.message);
    process.exit(1);
});

