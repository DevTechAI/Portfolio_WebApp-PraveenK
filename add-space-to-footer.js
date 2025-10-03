/**
 * Add space after "by" in footer branding
 */

const fs = require('fs');
const path = require('path');

const htmlFiles = [
    'index.html',
    'gallery.html',
    'about.html',
    'contact.html',
    'documentary.html',
    'interior.html',
    'jewels.html',
    'macro.html',
    'portraits.html',
    'product.html',
    'street.html'
];

const publicDir = path.join(__dirname, 'public');

console.log('🔄 Adding space after "by" in footer...\n');

htmlFiles.forEach(file => {
    const filePath = path.join(publicDir, file);
    
    if (!fs.existsSync(filePath)) {
        console.log(`⚠️  Skipping ${file} (not found)`);
        return;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace "Powered by <a" with "Powered by  <a" (note the double space)
    content = content.replace(
        /Powered by <a href=/g,
        'Powered by  <a href='
    );
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Updated ${file}`);
});

console.log('\n🎉 All footers updated with extra space after "by"!');
console.log('\nNow shows: "Powered by  DevTechAi.Org" (with double space)');

