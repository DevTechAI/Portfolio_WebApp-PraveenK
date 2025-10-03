/**
 * Update index.html and gallery.html with correct Cloudinary image URLs
 */

const fs = require('fs');
const path = require('path');

// Read metadata
const metadataPath = path.join(__dirname, 'public', 'data', 'cloudinary-images.json');
const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));

// Get first image from each category
const categoryImages = {};
metadata.images.forEach(img => {
    if (!categoryImages[img.category]) {
        categoryImages[img.category] = img;
    }
});

console.log('📸 Sample images per category:\n');
Object.keys(categoryImages).forEach(cat => {
    const img = categoryImages[cat];
    console.log(`${cat}: ${img.filename}`);
});

// Generate image HTML for a category
function generateImageHTML(category, count) {
    const img = categoryImages[category];
    if (!img) return '';
    
    return `            <img 
              src="${img.urls.placeholder}" 
              data-src="${img.urls.hero}" 
              alt="${category.charAt(0).toUpperCase() + category.slice(1)} Photography" 
              class="img-fluid placeholder">`;
}

function generateGalleryImageHTML(category, count) {
    const img = categoryImages[category];
    if (!img) return '';
    
    return `                <img 
                  src="${img.urls.placeholder}" 
                  data-src="${img.urls.gallery}" 
                  alt="${category.charAt(0).toUpperCase() + category.slice(1)}" 
                  class="img-fluid placeholder">`;
}

// Update index.html
console.log('\n📝 Updating index.html...');
const indexPath = path.join(__dirname, 'public', 'index.html');
let indexHTML = fs.readFileSync(indexPath, 'utf8');

// Documentary
if (categoryImages.documentary) {
    const count = metadata.categories.documentary || 0;
    indexHTML = indexHTML.replace(
        /<div class="col-lg-4">\s*<div class="image-wrap-2">\s*<div class="image-info">\s*<h2 class="mb-3">Documentary<\/h2>\s*<a href="documentary\.html"[^>]*>View \d+ Photos<\/a>\s*<\/div>\s*<img[\s\S]*?class="img-fluid placeholder">\s*<\/div>\s*<\/div>/,
        `<div class="col-lg-4">
          <div class="image-wrap-2">
            <div class="image-info">
              <h2 class="mb-3">Documentary</h2>
              <a href="documentary.html" class="btn btn-outline-white py-2 px-4">View ${count} Photos</a>
            </div>
${generateImageHTML('documentary', count)}
          </div>
        </div>`
    );
}

// Portraits
if (categoryImages.portraits) {
    const count = metadata.categories.portraits || 0;
    indexHTML = indexHTML.replace(
        /<div class="col-lg-4">\s*<div class="image-wrap-2">\s*<div class="image-info">\s*<h2 class="mb-3">Portraits<\/h2>\s*<a href="portraits\.html"[^>]*>View \d+ Photos<\/a>\s*<\/div>\s*<img[\s\S]*?class="img-fluid placeholder">\s*<\/div>\s*<\/div>/,
        `<div class="col-lg-4">
          <div class="image-wrap-2">
            <div class="image-info">
              <h2 class="mb-3">Portraits</h2>
              <a href="portraits.html" class="btn btn-outline-white py-2 px-4">View ${count} Photos</a>
            </div>
${generateImageHTML('portraits', count)}
          </div>
        </div>`
    );
}

// Product
if (categoryImages.product) {
    const count = metadata.categories.product || 0;
    indexHTML = indexHTML.replace(
        /<div class="col-lg-4">\s*<div class="image-wrap-2">\s*<div class="image-info">\s*<h2 class="mb-3">Product<\/h2>\s*<a href="product\.html"[^>]*>View \d+ Photos<\/a>\s*<\/div>\s*<img[\s\S]*?class="img-fluid placeholder">\s*<\/div>\s*<\/div>/,
        `<div class="col-lg-4">
          <div class="image-wrap-2">
            <div class="image-info">
              <h2 class="mb-3">Product</h2>
              <a href="product.html" class="btn btn-outline-white py-2 px-4">View ${count} Photos</a>
            </div>
${generateImageHTML('product', count)}
          </div>
        </div>`
    );
}

// Macro
if (categoryImages.macro) {
    const count = metadata.categories.macro || 0;
    indexHTML = indexHTML.replace(
        /<div class="col-lg-4">\s*<div class="image-wrap-2">\s*<div class="image-info">\s*<h2 class="mb-3">Macro<\/h2>\s*<a href="macro\.html"[^>]*>View \d+ Photos<\/a>\s*<\/div>\s*<img[\s\S]*?class="img-fluid placeholder">\s*<\/div>\s*<\/div>/,
        `<div class="col-lg-4">
          <div class="image-wrap-2">
            <div class="image-info">
              <h2 class="mb-3">Macro</h2>
              <a href="macro.html" class="btn btn-outline-white py-2 px-4">View ${count} Photos</a>
            </div>
${generateImageHTML('macro', count)}
          </div>
        </div>`
    );
}

// Street
if (categoryImages.street) {
    const count = metadata.categories.street || 0;
    indexHTML = indexHTML.replace(
        /<div class="col-lg-4">\s*<div class="image-wrap-2">\s*<div class="image-info">\s*<h2 class="mb-3">Street<\/h2>\s*<a href="street\.html"[^>]*>View \d+ Photos<\/a>\s*<\/div>\s*<img[\s\S]*?class="img-fluid placeholder">\s*<\/div>\s*<\/div>/,
        `<div class="col-lg-4">
          <div class="image-wrap-2">
            <div class="image-info">
              <h2 class="mb-3">Street</h2>
              <a href="street.html" class="btn btn-outline-white py-2 px-4">View ${count} Photos</a>
            </div>
${generateImageHTML('street', count)}
          </div>
        </div>`
    );
}

// Interior
if (categoryImages.interior) {
    const count = metadata.categories.interior || 0;
    indexHTML = indexHTML.replace(
        /<div class="col-lg-4">\s*<div class="image-wrap-2">\s*<div class="image-info">\s*<h2 class="mb-3">Interior<\/h2>\s*<a href="interior\.html"[^>]*>View \d+ Photos<\/a>\s*<\/div>\s*<img[\s\S]*?class="img-fluid placeholder">\s*<\/div>\s*<\/div>/,
        `<div class="col-lg-4">
          <div class="image-wrap-2">
            <div class="image-info">
              <h2 class="mb-3">Interior</h2>
              <a href="interior.html" class="btn btn-outline-white py-2 px-4">View ${count} Photos</a>
            </div>
${generateImageHTML('interior', count)}
          </div>
        </div>`
    );
}

// Jewels
if (categoryImages.jewels) {
    const count = metadata.categories.jewels || 0;
    indexHTML = indexHTML.replace(
        /<div class="col-lg-4">\s*<div class="image-wrap-2">\s*<div class="image-info">\s*<h2 class="mb-3">Uncategorized<\/h2>\s*<a href="uncategorized\.html"[^>]*>View \d+ Photos<\/a>\s*<\/div>\s*<img[\s\S]*?class="img-fluid placeholder">\s*<\/div>\s*<\/div>/,
        `<div class="col-lg-4">
          <div class="image-wrap-2">
            <div class="image-info">
              <h2 class="mb-3">Jewels</h2>
              <a href="jewels.html" class="btn btn-outline-white py-2 px-4">View ${count} Photos</a>
            </div>
${generateImageHTML('jewels', count)}
          </div>
        </div>`
    );
}

// All Work - use documentary image
indexHTML = indexHTML.replace(
    /<div class="col-lg-4">\s*<div class="image-wrap-2">\s*<div class="image-info">\s*<h2 class="mb-3">All Work<\/h2>\s*<a href="gallery\.html"[^>]*>View All \d+ Photos<\/a>\s*<\/div>\s*<img[\s\S]*?class="img-fluid placeholder">\s*<\/div>\s*<\/div>/,
    `<div class="col-lg-4">
          <div class="image-wrap-2">
            <div class="image-info">
              <h2 class="mb-3">All Work</h2>
              <a href="gallery.html" class="btn btn-outline-white py-2 px-4">View All ${metadata.totalImages} Photos</a>
            </div>
${generateImageHTML('documentary', metadata.totalImages)}
          </div>
        </div>`
);

fs.writeFileSync(indexPath, indexHTML, 'utf8');
console.log('✅ Updated index.html');

// Update gallery.html
console.log('\n📝 Updating gallery.html...');
const galleryPath = path.join(__dirname, 'public', 'gallery.html');
let galleryHTML = fs.readFileSync(galleryPath, 'utf8');

// Update each category in gallery.html
Object.keys(metadata.categories).forEach(category => {
    const count = metadata.categories[category];
    const capitalizedCategory = category.charAt(0).toUpperCase() + category.slice(1);
    
    const regex = new RegExp(
        `<div class="col-lg-4 col-md-6">\\s*<div class="image-wrap-2">\\s*<div class="image-info">\\s*<h2 class="mb-3">${capitalizedCategory}<\\/h2>\\s*<a href="${category}\\.html"[^>]*>\\d+ Photos<\\/a>\\s*<\\/div>\\s*<img[\\s\\S]*?class="img-fluid placeholder">\\s*<\\/div>\\s*<\\/div>`,
        ''
    );
    
    galleryHTML = galleryHTML.replace(
        regex,
        `<div class="col-lg-4 col-md-6">
              <div class="image-wrap-2">
                <div class="image-info">
                  <h2 class="mb-3">${capitalizedCategory}</h2>
                  <a href="${category}.html" class="btn btn-outline-white py-2 px-4">${count} Photos</a>
                </div>
${generateGalleryImageHTML(category, count)}
              </div>
            </div>`
    );
});

fs.writeFileSync(galleryPath, galleryHTML, 'utf8');
console.log('✅ Updated gallery.html');

console.log('\n🎉 Homepage and gallery updated with correct Cloudinary images!');
console.log(`\n📊 Total images: ${metadata.totalImages}`);
console.log('🌐 Test at: http://localhost:3000/index.html');

