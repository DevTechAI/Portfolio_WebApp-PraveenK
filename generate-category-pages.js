/**
 * Generate individual category gallery pages with Cloudinary lazy loading
 */

const fs = require('fs');
const path = require('path');

// Read the Cloudinary metadata
const metadataPath = path.join(__dirname, 'public', 'data', 'cloudinary-images.json');
const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));

// Category display names
const categoryDisplayNames = {
  'documentary': 'Documentary Photography',
  'portraits': 'Portrait Photography',
  'product': 'Product Photography',
  'macro': 'Macro Photography',
  'street': 'Street Photography',
  'interior': 'Interior Photography',
  'jewels': 'Jewelry Photography',
  'uncategorized': 'Photography Collection'
};

// Group images by category
const imagesByCategory = {};
metadata.images.forEach(image => {
  const category = image.category || 'uncategorized';
  if (!imagesByCategory[category]) {
    imagesByCategory[category] = [];
  }
  imagesByCategory[category].push(image);
});

// Function to generate HTML for a category page
function generateCategoryPage(category, images) {
  const displayName = categoryDisplayNames[category] || category.charAt(0).toUpperCase() + category.slice(1);
  const photoCount = images.length;

  // Generate image gallery items
  const galleryItems = images.map(image => `
            <div class="col-md-6 col-lg-3 item">
              <a href="${image.urls.large}" class="item-wrap" data-fancybox="gallery">
                <span class="icon-search2"></span>
                <img 
                  src="${image.urls.placeholder}" 
                  data-src="${image.urls.gallery}" 
                  alt="${displayName} - ${image.filename}" 
                  class="img-fluid placeholder">
              </a>
            </div>`).join('\n');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <title>${displayName} - Praveen K Photography Portfolio</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <meta name="description" content="${displayName} - Professional photography portfolio featuring ${photoCount} stunning images">
  
  <link href="https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@400;700&family=Roboto+Mono:wght@400;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="fonts/icomoon/style.css">
  <link rel="stylesheet" href="css/bootstrap.min.css">
  <link rel="stylesheet" href="css/magnific-popup.css">
  <link rel="stylesheet" href="css/jquery-ui.css">
  <link rel="stylesheet" href="css/owl.carousel.min.css">
  <link rel="stylesheet" href="css/owl.theme.default.min.css">
  <link rel="stylesheet" href="css/lightgallery.min.css">    
  <link rel="stylesheet" href="css/bootstrap-datepicker.css">
  <link rel="stylesheet" href="fonts/flaticon/font/flaticon.css">
  <link rel="stylesheet" href="css/swiper.css">
  <link rel="stylesheet" href="css/aos.css">
  <link rel="stylesheet" href="css/style.css">
  <link rel="stylesheet" href="css/lazy-loading.css">
</head>
<body>
  <div class="site-wrap">
    <div class="site-mobile-menu">
      <div class="site-mobile-menu-header">
        <div class="site-mobile-menu-close mt-3">
          <span class="icon-close2 js-menu-toggle"></span>
        </div>
      </div>
      <div class="site-mobile-menu-body"></div>
    </div>

    <header class="site-navbar py-3" role="banner">
      <div class="container-fluid">
        <div class="row align-items-center">
          <div class="col-6 col-xl-2" data-aos="fade-down">
            <h1 class="mb-0"><a href="index.html" class="text-white h2 mb-0">Praveen K</a></h1>
          </div>
          <div class="col-10 col-md-8 d-none d-xl-block" data-aos="fade-down">
            <nav class="site-navigation position-relative text-right text-lg-center" role="navigation">
              <ul class="site-menu js-clone-nav mx-auto d-none d-lg-block">
                <li><a href="index.html">Home</a></li>
                <li class="has-children active">
                  <a href="gallery.html">Gallery</a>
                  <ul class="dropdown">
                    <li><a href="documentary.html">Documentary</a></li>
                    <li><a href="portraits.html">Portraits</a></li>
                    <li><a href="product.html">Product</a></li>
                    <li><a href="macro.html">Macro</a></li>
                    <li><a href="street.html">Street</a></li>
                    <li><a href="interior.html">Interior</a></li>
                    <li><a href="uncategorized.html">Uncategorized</a></li>
                  </ul>
                </li>
                <li><a href="about.html">About</a></li>
                <li><a href="contact.html">Contact</a></li>
              </ul>
            </nav>
          </div>
          <div class="col-6 col-xl-2 text-right" data-aos="fade-down">
            <div class="d-none d-xl-inline-block">
              <ul class="site-menu js-clone-nav ml-auto list-unstyled d-flex text-right mb-0" data-class="social">
                <li><a href="#" class="pl-0 pr-3"><span class="icon-facebook"></span></a></li>
                <li><a href="#" class="pl-3 pr-3"><span class="icon-twitter"></span></a></li>
                <li><a href="#" class="pl-3 pr-3"><span class="icon-instagram"></span></a></li>
                <li><a href="#" class="pl-3 pr-3"><span class="icon-youtube-play"></span></a></li>
              </ul>
            </div>
            <div class="d-inline-block d-xl-none ml-md-0 mr-auto py-3" style="position: relative; top: 3px;">
              <a href="#" class="site-menu-toggle js-menu-toggle text-black"><span class="icon-menu h3"></span></a>
            </div>
          </div>
        </div>
      </div>
    </header>

    <div class="site-section" data-aos="fade">
      <div class="container-fluid">
        <div class="row justify-content-center">
          <div class="col-md-7 text-center">
            <div class="row mb-5">
              <div class="col-12">
                <h2 class="site-section-heading text-center">${displayName}</h2>
                <p class="lead">${photoCount} Professional Photos</p>
              </div>
            </div>
          </div>
        </div>

        <div class="row" id="lightgallery">
${galleryItems}
        </div>

      </div>
    </div>

    <div class="footer py-4">
      <div class="container-fluid text-center">
        <p>Copyright &copy;<script>document.write(new Date().getFullYear());</script> Praveen K Photography | All rights reserved</p>
      </div>
    </div>
  </div>

  <script src="js/jquery-3.3.1.min.js"></script>
  <script src="js/jquery-migrate-3.0.1.min.js"></script>
  <script src="js/jquery-ui.js"></script>
  <script src="js/popper.min.js"></script>
  <script src="js/bootstrap.min.js"></script>
  <script src="js/owl.carousel.min.js"></script>
  <script src="js/jquery.stellar.min.js"></script>
  <script src="js/jquery.countdown.min.js"></script>
  <script src="js/jquery.magnific-popup.min.js"></script>
  <script src="js/bootstrap-datepicker.min.js"></script>
  <script src="js/swiper.min.js"></script>
  <script src="js/aos.js"></script>
  <script src="js/picturefill.min.js"></script>
  <script src="js/lightgallery-all.min.js"></script>
  <script src="js/jquery.mousewheel.min.js"></script>
  <script src="js/main.js"></script>
  <script src="js/cloudinary-loader.js"></script>
  
  <script>
    $(document).ready(function(){
      // Initialize lightGallery
      $('#lightgallery').lightGallery({
        thumbnail: true,
        animateThumb: false,
        showThumbByDefault: false
      });
      
      // Initialize lazy loading for all images
      if (window.CloudinaryLoader && window.CloudinaryLoader.lazy) {
        window.CloudinaryLoader.lazy.observeAll();
      }
    });
  </script>
</body>
</html>
`;

  return html;
}

// Generate pages for each category
console.log('Generating category gallery pages...\n');

let pagesGenerated = 0;
Object.keys(imagesByCategory).forEach(category => {
  const images = imagesByCategory[category];
  const html = generateCategoryPage(category, images);
  const filename = `${category}.html`;
  const filepath = path.join(__dirname, 'public', filename);
  
  fs.writeFileSync(filepath, html, 'utf8');
  console.log(`✓ Generated ${filename} (${images.length} images)`);
  pagesGenerated++;
});

console.log(`\n✅ Successfully generated ${pagesGenerated} category gallery pages!`);
console.log('\nGenerated pages:');
Object.keys(imagesByCategory).forEach(category => {
  console.log(`  - ${category}.html (${imagesByCategory[category].length} images)`);
});

console.log('\n📸 All category pages are now loaded with lazy loading from Cloudinary!');
console.log('🌐 View them at: http://localhost:3000/[category].html');

