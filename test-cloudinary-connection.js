/**
 * Test Cloudinary Connection and List Folders
 * This script verifies your Cloudinary credentials and lists existing folders
 */

const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

console.log('\n🔗 Testing Cloudinary Connection...\n');
console.log(`Cloud Name: ${process.env.CLOUDINARY_CLOUD_NAME || '❌ NOT SET'}`);
console.log(`API Key: ${process.env.CLOUDINARY_API_KEY ? '✅ SET' : '❌ NOT SET'}`);
console.log(`API Secret: ${process.env.CLOUDINARY_API_SECRET ? '✅ SET' : '❌ NOT SET'}\n`);

async function testConnection() {
    try {
        // Test connection by fetching account details
        console.log('📡 Connecting to Cloudinary...\n');
        
        const usage = await cloudinary.api.usage();
        console.log('✅ Connection Successful!\n');
        console.log('📊 Account Details:');
        console.log('─'.repeat(50));
        console.log(`Plan: ${usage.plan || 'Free'}`);
        console.log(`Credits Used: ${usage.credits?.used || 0} / ${usage.credits?.limit || 0}`);
        console.log(`Storage Used: ${((usage.storage?.used || 0) / 1024 / 1024).toFixed(2)} MB`);
        console.log(`Bandwidth Used: ${((usage.bandwidth?.used || 0) / 1024 / 1024).toFixed(2)} MB`);
        console.log(`Resources: ${usage.resources || 0} files`);
        console.log('─'.repeat(50));
        
    } catch (error) {
        console.error('❌ Connection Failed!');
        console.error('Error:', error.message || error);
        if (error.error) {
            console.error('Details:', JSON.stringify(error.error, null, 2));
        }
        console.log('\n💡 Please check your credentials in .env file');
        console.log('Make sure you have:');
        console.log('- Valid Cloud Name (no spaces, lowercase)');
        console.log('- Valid API Key (numbers only)');
        console.log('- Valid API Secret (letters and numbers)');
        process.exit(1);
    }
}

async function listFolders() {
    try {
        console.log('\n📁 Listing Folders in Cloudinary...\n');
        
        // Get root folders
        const rootFolders = await cloudinary.api.root_folders();
        
        if (rootFolders.folders && rootFolders.folders.length > 0) {
            console.log('Root Folders:');
            console.log('─'.repeat(50));
            
            for (const folder of rootFolders.folders) {
                console.log(`📂 ${folder.name}`);
                
                // Get subfolders
                try {
                    const subfolders = await cloudinary.api.sub_folders(folder.name);
                    if (subfolders.folders && subfolders.folders.length > 0) {
                        for (const subfolder of subfolders.folders) {
                            console.log(`   └─ 📁 ${subfolder.name}`);
                        }
                    }
                } catch (err) {
                    // Ignore subfolder errors
                }
            }
            console.log('─'.repeat(50));
        } else {
            console.log('📭 No folders found in Cloudinary');
            console.log('\n💡 Your Cloudinary account is empty. Ready to upload photos!');
        }
        
    } catch (error) {
        console.error('❌ Error listing folders:', error.message);
    }
}

async function listResources() {
    try {
        console.log('\n🖼️  Listing Resources (Images)...\n');
        
        const resources = await cloudinary.api.resources({
            type: 'upload',
            max_results: 30
        });
        
        if (resources.resources && resources.resources.length > 0) {
            console.log(`Found ${resources.total_count} images (showing first 30):`);
            console.log('─'.repeat(50));
            
            resources.resources.forEach((resource, index) => {
                const folder = resource.public_id.includes('/') 
                    ? resource.public_id.substring(0, resource.public_id.lastIndexOf('/'))
                    : 'root';
                const filename = resource.public_id.includes('/')
                    ? resource.public_id.substring(resource.public_id.lastIndexOf('/') + 1)
                    : resource.public_id;
                const size = (resource.bytes / 1024).toFixed(2);
                
                console.log(`${index + 1}. 📁 ${folder}/ ${filename}`);
                console.log(`   Size: ${size} KB | Format: ${resource.format} | ${resource.width}x${resource.height}px`);
            });
            console.log('─'.repeat(50));
        } else {
            console.log('📭 No images found in Cloudinary');
        }
        
    } catch (error) {
        console.error('❌ Error listing resources:', error.message);
    }
}

async function checkPortfolioFolder() {
    try {
        console.log('\n🎯 Checking for Portfolio Folder...\n');
        
        const folders = await cloudinary.api.sub_folders('portfolio');
        
        if (folders.folders && folders.folders.length > 0) {
            console.log('✅ Portfolio folder exists with subfolders:');
            console.log('─'.repeat(50));
            folders.folders.forEach(folder => {
                console.log(`📂 portfolio/${folder.name}`);
            });
            console.log('─'.repeat(50));
        }
        
    } catch (error) {
        if (error.error && error.error.message.includes('not find folder')) {
            console.log('📭 Portfolio folder does not exist yet');
            console.log('💡 It will be created automatically when you upload photos');
        } else {
            console.log('ℹ️  Portfolio folder not found or empty');
        }
    }
}

// Run all tests
async function main() {
    await testConnection();
    await listFolders();
    await checkPortfolioFolder();
    await listResources();
    
    console.log('\n' + '='.repeat(50));
    console.log('✅ Cloudinary Connection Test Complete!');
    console.log('='.repeat(50));
    console.log('\n📝 Next Steps:');
    console.log('1. If no folders exist, run: node upload-to-cloudinary.js');
    console.log('2. This will upload all your portfolio photos');
    console.log('3. Then update HTML files: node update-to-cloudinary.js YOUR_CLOUD_NAME\n');
}

main().catch(error => {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
});

