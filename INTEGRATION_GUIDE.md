# Theme Integration Guide

This guide will help you integrate your HTML/CSS/JavaScript theme files into this portfolio web app.

## 📋 Step-by-Step Integration

### 1. HTML Integration

**Location**: `public/index.html`

- Replace the content inside the `<body>` tag with your theme's HTML
- Keep the `<head>` section but add any additional meta tags or links your theme needs
- Make sure to update page title and meta descriptions

### 2. CSS Integration

**Location**: `public/css/styles.css`

**Option A**: Single CSS file
- Replace the content of `styles.css` with your theme's CSS

**Option B**: Multiple CSS files
- Keep your theme's CSS file structure
- Create additional CSS files in `public/css/`
- Link them in `index.html`:
  ```html
  <link rel="stylesheet" href="./css/styles.css">
  <link rel="stylesheet" href="./css/your-theme.css">
  <link rel="stylesheet" href="./css/responsive.css">
  ```

### 3. JavaScript Integration

**Location**: `public/js/main.js`

**Option A**: Single JS file
- Add your theme's JavaScript code to `main.js`
- Wrap in DOMContentLoaded if needed:
  ```javascript
  document.addEventListener('DOMContentLoaded', function() {
      // Your theme code here
  });
  ```

**Option B**: Multiple JS files
- Create additional JS files in `public/js/`
- Link them in `index.html` (before closing `</body>`):
  ```html
  <script src="./js/vendor.js"></script>
  <script src="./js/main.js"></script>
  <script src="./js/your-theme.js"></script>
  ```

### 4. Assets Integration

**Images**: `public/assets/images/`
- Copy all your portfolio images here
- Organize by category if needed:
  ```
  images/
  ├── portfolio/
  ├── about/
  ├── testimonials/
  └── gallery/
  ```

**Fonts**: `public/assets/fonts/`
- Copy custom font files here
- Update CSS with correct paths:
  ```css
  @font-face {
      font-family: 'YourFont';
      src: url('../assets/fonts/yourfont.woff2') format('woff2');
  }
  ```

**Other Assets**: `public/assets/`
- Icons, videos, PDFs, etc.

### 5. Update Configuration

**File**: `config/site.config.js`

Update with your information:
```javascript
const siteConfig = {
    siteName: 'Your Name Photography',
    siteDescription: 'Your description',
    // ... update all fields
};
```

**File**: `src/data/portfolio-data.json`

Add your portfolio content:
```json
{
  "photographer": {
    "name": "Your Name",
    "title": "Professional Photographer",
    // ... update all fields
  }
}
```

## 🔧 Common Adjustments

### Path Adjustments

If your theme uses different paths, update them:

**Before** (from theme):
```html
<img src="images/photo.jpg">
<link href="css/style.css">
<script src="js/script.js">
```

**After** (in this structure):
```html
<img src="./assets/images/photo.jpg">
<link href="./css/style.css">
<script src="./js/script.js">
```

### External Libraries

If your theme uses libraries (jQuery, Bootstrap, etc.):

**Option A**: CDN (faster initial setup)
```html
<script src="https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js"></script>
```

**Option B**: npm install (better for production)
```bash
npm install jquery
```

## ✅ Testing Checklist

After integration, verify:

- [ ] All pages load without errors
- [ ] Images display correctly
- [ ] CSS styles are applied
- [ ] JavaScript functions work
- [ ] Links and navigation work
- [ ] Responsive design works on mobile
- [ ] Contact form (if any) works
- [ ] Gallery/lightbox works
- [ ] No console errors
- [ ] All assets load correctly

## 🐛 Troubleshooting

### Images not showing
- Check file paths are correct (relative to HTML file)
- Verify image files are in `public/assets/images/`
- Check file names match exactly (case-sensitive)

### CSS not applying
- Verify CSS file path in HTML
- Check browser console for 404 errors
- Clear browser cache

### JavaScript not working
- Check browser console for errors
- Verify script tags are in correct order
- Make sure scripts load after DOM elements

## 📞 Need Help?

If you encounter issues:
1. Check browser console for errors (F12)
2. Verify all file paths
3. Test in different browsers
4. Check this guide for common issues

## 🎉 Next Steps

After successful integration:
1. Customize colors and branding
2. Add your portfolio images
3. Update contact information
4. Test on multiple devices
5. Optimize images for web
6. Deploy to production

Happy building! 🚀

