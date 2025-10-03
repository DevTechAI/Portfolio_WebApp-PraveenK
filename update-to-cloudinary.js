/**
 * Automated HTML Updater for Cloudinary
 * Updates all HTML files to use Cloudinary URLs
 * 
 * Usage: node update-to-cloudinary.js YOUR_CLOUD_NAME
 */

const fs = require('fs');
const path = require('path');

// Get cloud name from command line
const CLOUD_NAME = process.argv[2];

if (!CLOUD_NAME) {
    console.error('❌ Error: Please provide your Cloudinary cloud name');
    console.log('\nUsage: node update-to-cloudinary.js YOUR_CLOUD_NAME');
    console.log('Example: node update-to-cloudinary.js praveenk-portfolio\n');
    process.exit(1);
}

console.log(`\n🔄 Updating HTML files to use Cloudinary...`);
console.log(`Cloud Name: ${CLOUD_NAME}\n`);

// Mapping of local paths to Cloudinary paths
const PATH_MAPPINGS = {
    'Photos/portfolio/documentry/': 'portfolio/documentary/',
    'Photos/portfolio/potraits/': 'portfolio/portraits/',
    'Photos/portfolio/product/': 'portfolio/product/',
    'Photos/portfolio/macro/': 'portfolio/macro/',
    'Photos/portfolio/street/': 'portfolio/street/',
    'Photos/portfolio/interior/': 'portfolio/interior/',
    'Photos/portfolio/jelws/': 'portfolio/jewels/',
    'Photos/': 'portfolio/featured/'
};

// Transformation settings
const DEFAULT_TRANSFORM = 'c_limit,w_800,q_auto,f_auto';

/**
 * Generate Cloudinary URL
 */
function generateCloudinaryUrl(localPath) {
    // Extract folder and filename
    let cloudinaryPath = localPath;
    
    // Replace folder paths
    for (const [local, cloud] of Object.entries(PATH_MAPPINGS)) {
        if (localPath.includes(local)) {
            cloudinaryPath = localPath.replace(local, cloud);
            break;
        }
    }
    
    // Remove file extension
    cloudinaryPath = cloudinaryPath.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '');
    
    // Build Cloudinary URL
    return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${DEFAULT_TRANSFORM}/${cloudinaryPath}`;
}

/**
 * Update HTML file
 */
function updateHTMLFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let updated = false;
        let changeCount = 0;
        
        // Backup original
        fs.writeFileSync(filePath + '.backup', content);
        
        // Replace image sources
        const imgRegex = /(<img[^>]*src=["'])Photos\/([^"']+)(["'][^>]*>)/g;
        content = content.replace(imgRegex, (match, prefix, path, suffix) => {
            changeCount++;
            const cloudinaryUrl = generateCloudinaryUrl('Photos/' + path);
            return `${prefix}${cloudinaryUrl}${suffix}`;
        });
        
        // Replace background images in data-setbg attributes
        const setBgRegex = /(data-setbg=["'])Photos\/([^"']+)(["'])/g;
        content = content.replace(setBgRegex, (match, prefix, path, suffix) => {
            changeCount++;
            const cloudinaryUrl = generateCloudinaryUrl('Photos/' + path);
            return `${prefix}${cloudinaryUrl}${suffix}`;
        });
        
        if (changeCount > 0) {
            // Add lazy loading
            content = content.replace(/<img([^>]*)>/g, (match) => {
                if (!match.includes('loading=')) {
                    return match.replace('>', ' loading="lazy">');
                }
                return match;
            });
            
            fs.writeFileSync(filePath, content);
            console.log(`✅ ${path.basename(filePath)} - Updated ${changeCount} images`);
            return true;
        } else {
            // Remove backup if no changes
            fs.unlinkSync(filePath + '.backup');
            console.log(`⏭️  ${path.basename(filePath)} - No images to update`);
            return false;
        }
    } catch (error) {
        console.error(`❌ Error updating ${filePath}:`, error.message);
        return false;
    }
}

/**
 * Main function
 */
function main() {
    const htmlFiles = [
        'public/index.html',
        'public/gallery.html',
        'public/documentary.html',
        'public/portraits.html',
        'public/product.html',
        'public/macro.html',
        'public/street.html',
        'public/interior.html',
        'public/jewels.html',
        'public/about.html',
        'public/contact.html'
    ];
    
    let totalUpdated = 0;
    
    htmlFiles.forEach(file => {
        if (fs.existsSync(file)) {
            if (updateHTMLFile(file)) {
                totalUpdated++;
            }
        }
    });
    
    console.log('\n' + '='.repeat(50));
    console.log(`🎉 Complete! Updated ${totalUpdated} files`);
    console.log('='.repeat(50));
    console.log('\n✨ Next steps:');
    console.log('1. Test your site: http://localhost:3000');
    console.log('2. Check all images load correctly');
    console.log('3. Original files backed up as .backup');
    console.log('4. Delete .backup files once confirmed working\n');
    console.log('💡 Tip: Hard refresh browser (Cmd+Shift+R) to see changes\n');
}

// Run the script
main();

