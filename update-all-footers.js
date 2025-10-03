/**
 * Update all pages with DevTechAi.Org footer branding
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

const newFooter = `    <div class="footer py-4">
      <div class="container-fluid">
        <div class="footer-content">
          <p class="copyright-text">
            Copyright &copy;<script>document.write(new Date().getFullYear());</script> Praveen K Photography | All rights reserved
          </p>
          
          <hr class="footer-divider">
          
          <div class="powered-by">
            <img src="assets/images/devtechai-logo.png" alt="DevTechAi.Org Logo" class="powered-by-logo" onerror="this.style.display='none'">
            <p class="powered-by-text">
              Powered by <a href="https://devtechai.org" target="_blank" rel="noopener noreferrer" class="powered-by-link">DevTechAi.Org</a>
            </p>
          </div>
        </div>
      </div>
    </div>`;

// Find all HTML files
const publicDir = path.join(__dirname, 'public');
const htmlFiles = [
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

console.log('🔄 Updating footer branding on all pages...\n');

htmlFiles.forEach(file => {
    const filePath = path.join(publicDir, file);
    
    if (!fs.existsSync(filePath)) {
        console.log(`⚠️  Skipping ${file} (not found)`);
        return;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Add footer branding CSS if not already present
    if (!content.includes('footer-branding.css')) {
        content = content.replace(
            /<link rel="stylesheet" href="css\/style\.css">/,
            `<link rel="stylesheet" href="css/style.css">\n  <link rel="stylesheet" href="css/footer-branding.css">`
        );
    }
    
    // Replace old footer with new one
    const footerRegex = /<div class="footer[^>]*>[\s\S]*?<\/div>\s*<\/div>/;
    if (footerRegex.test(content)) {
        content = content.replace(footerRegex, newFooter);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Updated ${file}`);
    } else {
        console.log(`⚠️  Could not find footer in ${file}`);
    }
});

console.log('\n🎉 All footers updated with DevTechAi.Org branding!');
console.log('\n📝 Next step: Add your logo file to:');
console.log('   public/assets/images/devtechai-logo.png');
console.log('\n   Recommended size: 32x32px or 64x64px (PNG with transparent background)');

