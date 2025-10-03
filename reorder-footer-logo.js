/**
 * Reorder footer: "Powered by [Logo] DevTechAi.Org"
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

const newFooterContent = `          <div class="powered-by">
            <p class="powered-by-text">
              Powered by <img src="assets/images/devtechai-logo.png" alt="DevTechAi.Org Logo" class="powered-by-logo" onerror="this.style.display='none'"> <a href="https://devtechai.org" target="_blank" rel="noopener noreferrer" class="powered-by-link">DevTechAi.Org</a>
            </p>
          </div>`;

console.log('🔄 Reordering footer: Powered by [Logo] DevTechAi.Org\n');

htmlFiles.forEach(file => {
    const filePath = path.join(publicDir, file);
    
    if (!fs.existsSync(filePath)) {
        console.log(`⚠️  Skipping ${file} (not found)`);
        return;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Match the current footer structure and replace it
    const footerRegex = /<div class="powered-by">[\s\S]*?<\/div>/;
    
    if (footerRegex.test(content)) {
        content = content.replace(footerRegex, newFooterContent);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Updated ${file}`);
    } else {
        console.log(`⚠️  Could not find footer in ${file}`);
    }
});

console.log('\n🎉 All footers updated!');
console.log('\nNew layout: "Powered by [Logo] DevTechAi.Org"');

