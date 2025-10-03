# Portfolio_WebApp-PraveenK

Professional Photographer's Portfolio Web Application

## 🎨 Project Overview

A modern, responsive portfolio web application designed specifically for photographers to showcase their work beautifully.

## 📁 Project Structure

```
Portfolio_WebApp-PraveenK/
├── public/                    # Public facing files
│   ├── index.html            # Main HTML file
│   ├── css/                  # Stylesheets
│   │   └── styles.css        # Main CSS file
│   ├── js/                   # JavaScript files
│   │   └── main.js           # Main JavaScript
│   └── assets/               # Static assets
│       ├── images/           # Portfolio images
│       ├── videos/           # Video content
│       └── fonts/            # Custom fonts
├── src/                      # Source files
│   └── data/                 # Data files
│       └── portfolio-data.json  # Portfolio content data
├── config/                   # Configuration files
│   └── site.config.js        # Site configuration
├── package.json              # Dependencies and scripts
├── .gitignore               # Git ignore rules
├── LICENSE                  # MIT License
└── README.md               # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## 📝 Theme Integration

Once you have your theme files (HTML, CSS, JavaScript):

1. **HTML**: Copy your HTML content into `public/index.html`
2. **CSS**: Add your styles to `public/css/styles.css` (or create additional CSS files)
3. **JavaScript**: Add your JavaScript to `public/js/main.js` (or create additional JS files)
4. **Assets**: Place images, fonts, and other assets in the `public/assets/` directory

## 🛠️ Available Scripts

- `npm run dev` - Start development server with live reload
- `npm run build` - Build and minify CSS and JavaScript for production
- `npm run minify:css` - Minify CSS files
- `npm run minify:js` - Minify JavaScript files

## 📦 Features

- ✨ Clean, organized project structure
- 🎨 Ready for theme integration
- 📱 Mobile-responsive design ready
- 🖼️ Gallery system support
- 📧 Contact form ready
- 🔍 SEO optimized structure
- ⚡ Performance optimized
- 🎭 Lightbox gallery support

## ✅ Setup Status

**COMPLETE!** Your portfolio website is ready to use with all your photos integrated.

See [SETUP_COMPLETE.md](SETUP_COMPLETE.md) for detailed information.

## 🚀 Quick Start

### View Your Portfolio

**Option 1: Direct Open**
```bash
open public/index.html
```

**Option 2: Local Server (Recommended)**
```bash
# Using Python
cd public && python3 -m http.server 3000

# Using PHP  
cd public && php -S localhost:3000

# Using Node.js
npx http-server public -p 3000 -o
```

Then visit: `http://localhost:3000`

## 📄 Pages Created

- **Home** - `public/index.html` - Main portfolio showcase
- **Gallery** - `public/gallery.html` - All 16 photos with filtering
- **About** - `public/about.html` - About the photographer
- **Contact** - `public/contact.html` - Contact information

## 🎯 Next Steps

1. View your portfolio by opening `public/index.html`
2. Customize text content in each HTML file
3. Update contact information in `contact.html`
4. Add your logo to replace theme logos
5. Deploy to GitHub Pages, Netlify, or your hosting

## 📄 License

MIT License - see LICENSE file for details

## 👤 Author

DevTechAI.Org

---

**Note**: This is a starter structure. Integrate your theme files and customize as needed for your photography portfolio.