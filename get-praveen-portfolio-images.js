/**
 * Get images from Praveen-PortfolioPics folder in Cloudinary
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

async function getImagesFromFolder() {
    console.log('🔍 Fetching images from "Praveen-PortfolioPics" folder...\n');
    
    // Try different folder name variations
    const folderVariations = [
        'Praveen-PortfolioPics',
        'praveen-portfoliopics',
        'Praveen-Portfoliopics',
        'praveen-PortfolioPics'
    ];
    
    for (const folder of folderVariations) {
        console.log(`Trying folder: "${folder}"`);
        
        try {
            let allResources = [];
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
                    allResources = allResources.concat(result.resources);
                    nextCursor = result.next_cursor;
                    console.log(`  ✅ Found ${result.resources.length} images (total: ${allResources.length})`);
                } else {
                    console.log(`  ❌ No images found`);
                    break;
                }
            } while (nextCursor);
            
            if (allResources.length > 0) {
                console.log(`\n✅ SUCCESS! Found ${allResources.length} images in "${folder}"\n`);
                
                // Analyze the structure
                const subfolders = {};
                allResources.forEach(img => {
                    const parts = img.public_id.split('/');
                    if (parts.length > 2) {
                        const subfolder = parts[1];
                        if (!subfolders[subfolder]) {
                            subfolders[subfolder] = [];
                        }
                        subfolders[subfolder].push(img);
                    } else if (parts.length === 2) {
                        if (!subfolders['(root of ' + folder + ')']) {
                            subfolders['(root of ' + folder + ')'] = [];
                        }
                        subfolders['(root of ' + folder + ')'].push(img);
                    }
                });
                
                console.log('📁 Folder structure:');
                Object.keys(subfolders).sort().forEach(sub => {
                    console.log(`   ${sub}: ${subfolders[sub].length} images`);
                    // Show first 3 images
                    subfolders[sub].slice(0, 3).forEach(img => {
                        const filename = img.public_id.split('/').pop();
                        console.log(`      - ${filename}`);
                    });
                });
                
                // Generate metadata
                console.log('\n📝 Generating metadata...');
                await generateMetadata(allResources, folder);
                
                return allResources;
            }
            
        } catch (error) {
            console.log(`  ❌ Error: ${error.message}`);
        }
        
        console.log('');
    }
    
    console.log('❌ Could not find images in any folder variation.');
    console.log('\n💡 Let me check what folders exist...\n');
    
    // List all folders
    try {
        const folders = await cloudinary.api.root_folders();
        console.log('Available root folders:');
        folders.folders.forEach(f => {
            console.log(`   - ${f.name}`);
        });
        
        // List subfolders
        console.log('\nChecking subfolders...');
        for (const folder of folders.folders) {
            try {
                const subfolders = await cloudinary.api.sub_folders(folder.name);
                if (subfolders.folders && subfolders.folders.length > 0) {
                    console.log(`\n${folder.name}:`);
                    subfolders.folders.forEach(sf => {
                        console.log(`   - ${sf.name}`);
                    });
                }
            } catch (e) {
                // Skip if no subfolders
            }
        }
    } catch (error) {
        console.error('Error listing folders:', error.message);
    }
}

async function generateMetadata(resources, folderName) {
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
    
    // Detect category from folder structure
    function detectCategory(publicId) {
        const parts = publicId.split('/');
        if (parts.length > 2) {
            const subfolder = parts[1].toLowerCase();
            
            // Map folder names to categories
            const folderMap = {
                'documentry': 'documentary',
                'documentary': 'documentary',
                'potraits': 'portraits',
                'portraits': 'portraits',
                'product': 'product',
                'macro': 'macro',
                'street': 'street',
                'interior': 'interior',
                'jelws': 'jewels',
                'jewels': 'jewels'
            };
            
            return folderMap[subfolder] || 'uncategorized';
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
    
    images.sort((a, b) => {
        if (a.category !== b.category) {
            return a.category.localeCompare(b.category);
        }
        return a.filename.localeCompare(b.filename);
    });
    
    const metadata = {
        generated: new Date().toISOString(),
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        sourceFolder: folderName,
        totalImages: images.length,
        transformations: transformations,
        categories: categories,
        images: images
    };
    
    const outputPath = path.join(__dirname, 'public', 'data', 'cloudinary-images.json');
    fs.writeFileSync(outputPath, JSON.stringify(metadata, null, 2), 'utf8');
    
    console.log(`✅ Metadata saved: ${outputPath}`);
    console.log('\n📊 Category breakdown:');
    Object.keys(categories).sort().forEach(cat => {
        console.log(`   ${cat}: ${categories[cat]} images`);
    });
    
    const simplifiedPath = path.join(__dirname, 'public', 'data', 'cloudinary-urls-simple.json');
    const simplified = images.map(img => ({
        id: img.id,
        publicId: img.publicId,
        category: img.category,
        thumbnail: img.urls.thumbnail,
        gallery: img.urls.gallery,
        original: img.original
    }));
    fs.writeFileSync(simplifiedPath, JSON.stringify(simplified, null, 2), 'utf8');
    console.log(`✅ Simplified version saved: ${simplifiedPath}`);
}

getImagesFromFolder()
    .then(() => {
        console.log('\n✅ Done!');
        process.exit(0);
    })
    .catch(error => {
        console.error('\n❌ Failed:', error.message);
        process.exit(1);
    });

