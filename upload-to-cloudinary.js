/**
 * Cloudinary Bulk Upload Script
 * Uploads all portfolio photos to Cloudinary
 * 
 * Setup:
 * 1. npm install cloudinary dotenv
 * 2. Create .env file with:
 *    CLOUDINARY_CLOUD_NAME=your_cloud_name
 *    CLOUDINARY_API_KEY=your_api_key
 *    CLOUDINARY_API_SECRET=your_api_secret
 * 3. Run: node upload-to-cloudinary.js
 */

const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Portfolio categories and their local folders
const CATEGORIES = {
    'documentary': 'public/Photos/portfolio/documentry',
    'portraits': 'public/Photos/portfolio/potraits',
    'product': 'public/Photos/portfolio/product',
    'macro': 'public/Photos/portfolio/macro',
    'street': 'public/Photos/portfolio/street',
    'interior': 'public/Photos/portfolio/interior',
    'jewels': 'public/Photos/portfolio/jelws'
};

/**
 * Upload a single image to Cloudinary
 */
async function uploadImage(filePath, category) {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: `portfolio/${category}`,
            use_filename: true,
            unique_filename: false,
            resource_type: 'image',
            // Add transformations for eager loading
            eager: [
                { width: 400, height: 400, crop: 'fill', quality: 'auto', fetch_format: 'auto' },
                { width: 800, crop: 'limit', quality: 'auto', fetch_format: 'auto' }
            ]
        });
        
        return result;
    } catch (error) {
        console.error(`Error uploading ${filePath}:`, error.message);
        return null;
    }
}

/**
 * Upload all images in a category
 */
async function uploadCategory(category, folderPath) {
    console.log(`\n📸 Uploading ${category}...`);
    
    if (!fs.existsSync(folderPath)) {
        console.log(`⚠️  Folder not found: ${folderPath}`);
        return;
    }
    
    const files = fs.readdirSync(folderPath)
        .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file));
    
    console.log(`   Found ${files.length} images`);
    
    let uploaded = 0;
    let failed = 0;
    
    for (const file of files) {
        const filePath = path.join(folderPath, file);
        process.stdout.write(`   Uploading ${file}...`);
        
        const result = await uploadImage(filePath, category);
        
        if (result) {
            uploaded++;
            console.log(` ✅`);
        } else {
            failed++;
            console.log(` ❌`);
        }
        
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log(`   ✅ Uploaded: ${uploaded} | ❌ Failed: ${failed}`);
}

/**
 * Main upload function
 */
async function uploadAll() {
    console.log('🚀 Starting Cloudinary Upload...\n');
    console.log(`Cloud Name: ${process.env.CLOUDINARY_CLOUD_NAME}\n`);
    
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY) {
        console.error('❌ Error: Cloudinary credentials not found!');
        console.log('\nPlease create a .env file with:');
        console.log('CLOUDINARY_CLOUD_NAME=your_cloud_name');
        console.log('CLOUDINARY_API_KEY=your_api_key');
        console.log('CLOUDINARY_API_SECRET=your_api_secret');
        console.log('\nGet your credentials from: https://cloudinary.com/console\n');
        process.exit(1);
    }
    
    const startTime = Date.now();
    let totalUploaded = 0;
    
    // Upload each category
    for (const [category, folderPath] of Object.entries(CATEGORIES)) {
        await uploadCategory(category, folderPath);
    }
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    
    console.log('\n' + '='.repeat(50));
    console.log('🎉 Upload Complete!');
    console.log(`⏱️  Time taken: ${duration} seconds`);
    console.log('='.repeat(50));
    console.log('\n✨ Next steps:');
    console.log('1. Update js/cloudinary-config.js with your cloud name');
    console.log('2. Update HTML files to use Cloudinary URLs');
    console.log('3. See CLOUDINARY_SETUP.md for detailed instructions\n');
}

// Run the upload
uploadAll().catch(error => {
    console.error('\n❌ Upload failed:', error.message);
    process.exit(1);
});

