#!/bin/bash

# Generate gallery pages for each category

CATEGORIES=("documentry" "potraits" "product" "macro" "street" "interior" "jelws")
CATEGORY_NAMES=("Documentary" "Portraits" "Product" "Macro" "Street" "Interior" "Jewels")
OUTPUT_NAMES=("documentary" "portraits" "product" "macro" "street" "interior" "jewels")

for i in "${!CATEGORIES[@]}"; do
    CATEGORY="${CATEGORIES[$i]}"
    NAME="${CATEGORY_NAMES[$i]}"
    OUTPUT="${OUTPUT_NAMES[$i]}"
    
    echo "Generating $NAME gallery..."
    
    # Get list of photos
    PHOTOS=(public/Photos/portfolio/$CATEGORY/*.jpg)
    COUNT=${#PHOTOS[@]}
    
    # Create HTML file
    cat > "public/${OUTPUT}.html" <<EOF
<!DOCTYPE html>
<html lang="en">
<head>
  <title>$NAME Photography - Praveen K Portfolio</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  
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
                    <li><a href="jewels.html">Jewels</a></li>
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
          <div class="col-md-7">
            <div class="row mb-5">
              <div class="col-12">
                <h2 class="site-section-heading text-center">$NAME Photography</h2>
                <p class="text-center">$COUNT Professional Photos</p>
              </div>
            </div>
          </div>
        </div>

        <div class="row" id="lightgallery">
EOF

    # Add photos to gallery
    for photo in "${PHOTOS[@]}"; do
        PHOTO_PATH=$(echo "$photo" | sed 's|public/||')
        cat >> "public/${OUTPUT}.html" <<EOF
          <div class="col-sm-6 col-md-4 col-lg-3 col-xl-3 item" data-aos="fade" data-src="$PHOTO_PATH" data-sub-html="<h4>$NAME</h4>">
            <a href="#"><img src="$PHOTO_PATH" alt="$NAME" class="img-fluid"></a>
          </div>
EOF
    done

    # Close HTML
    cat >> "public/${OUTPUT}.html" <<EOF
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
  
  <script>
    \$(document).ready(function(){
      \$('#lightgallery').lightGallery();
    });
  </script>
</body>
</html>
EOF

    echo "✅ Created ${OUTPUT}.html with $COUNT photos"
done

echo ""
echo "🎉 All gallery pages generated successfully!"

