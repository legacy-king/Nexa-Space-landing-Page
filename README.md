# Nexa Space Landing Page 🏠

A clean, professional landing page for a virtual-tour-first real estate marketplace targeting the Nigerian market.

## 🎯 Project Overview

This is a validation MVP landing page to test market demand before building the full platform. The goal is to collect 100+ email signups and validate the product idea within 2 weeks.

## 📁 Project Structure

```
nexa-space-landing/
│
├── index.html              # Main HTML file
├── css/
│   └── styles.css          # All CSS styles
├── js/
│   └── main.js             # JavaScript functionality
├── images/                 # Image assets (add as needed)
├── CODE_ALONG_GUIDE.md    # Step-by-step learning guide
└── README.md              # This file
```

## 🚀 Quick Start

### Option 1: Open Directly
1. Double-click `index.html`
2. Opens in your default browser

### Option 2: Use VS Code Live Server (Recommended)
1. Open project folder in VS Code
2. Install "Live Server" extension
3. Right-click `index.html` → "Open with Live Server"
4. Page opens with auto-reload on save

### Option 3: Use Python Server
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Then visit: http://localhost:8000
```

## 📖 Learning Path

### For Beginners:
1. Read `CODE_ALONG_GUIDE.md` - detailed explanations
2. Build section by section
3. Test each part before moving on
4. Complete the practice exercises

### For Experienced Developers:
1. Review the code structure
2. Customize branding and content
3. Connect forms to your backend
4. Deploy immediately

## ✅ Features

- ✨ Clean, modern design
- 📱 Fully responsive (mobile-first)
- 🎨 Easy to customize (CSS variables)
- 📧 Form validation
- 🚀 Smooth scrolling
- 💬 Custom notifications
- 🎯 SEO-friendly HTML
- ⚡ Fast loading (no dependencies)

## 🎨 Customization

### Change Colors
Edit `css/styles.css`:
```css
:root {
    --color-primary: #4F46E5;    /* Change this to your brand color */
    --color-gray-900: #111827;   /* Dark text */
    /* ... other variables ... */
}
```

### Change Content
Edit `index.html`:
- Update headlines and copy
- Add/remove sections
- Modify form fields
- Change contact information

### Add Images
1. Place images in `images/` folder
2. Reference in HTML: `<img src="images/your-image.jpg">`
3. Or update CSS backgrounds

## 📝 Form Setup

### Option 1: Google Sheets (Easiest)
1. Go to [SheetMonkey](https://sheetmonkey.io)
2. Create account and get webhook URL
3. Update `js/main.js` line ~50 with your URL
4. Test form submission

### Option 2: Your Own Backend
1. Create API endpoint
2. Update fetch URL in `js/main.js`
3. Handle CORS if needed

### Option 3: Email (Simple)
Forms currently log to console. For email:
```javascript
// Replace fetch with:
window.location.href = `mailto:your@email.com?subject=Signup&body=${JSON.stringify(data)}`;
```

## 📊 Analytics Setup

### Google Analytics
Add to `<head>` in `index.html`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Facebook Pixel
Add before `</head>`:
```html
<!-- Facebook Pixel Code -->
<script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', 'YOUR_PIXEL_ID');
  fbq('track', 'PageView');
</script>
```

## 🌐 Deployment

### Netlify (Recommended)
1. Go to [Netlify](https://netlify.com)
2. Drag entire folder to deploy
3. Get instant live URL
4. Optional: Add custom domain

### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel` in project folder
3. Follow prompts

### GitHub Pages
1. Create GitHub repo
2. Push project files
3. Enable Pages in repo settings
4. Select main branch

## 🔧 Tech Stack

- **HTML5** - Structure
- **CSS3** - Styling (no frameworks!)
- **Vanilla JavaScript** - Functionality (no jQuery/React)
- **No build tools** - Simple and fast

## 📱 Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers

## ⚡ Performance

- **Lighthouse Score:** 95+ (after deployment)
- **Load Time:** <1s (no external dependencies)
- **Bundle Size:** <50KB total

## 🎓 Learning Resources

### If you're new to web development:
- [MDN Web Docs](https://developer.mozilla.org) - Best reference
- [CSS-Tricks](https://css-tricks.com) - CSS tutorials
- [JavaScript.info](https://javascript.info) - JS fundamentals

### Specific to this project:
- Flexbox: [Flexbox Froggy](https://flexboxfroggy.com/)
- Grid: [Grid Garden](https://cssgridgarden.com/)
- Forms: [MDN Form Guide](https://developer.mozilla.org/en-US/docs/Learn/Forms)

## 🐛 Troubleshooting

### Forms not submitting?
1. Check browser console for errors (F12)
2. Verify webhook URL is correct
3. Check CORS if using own backend

### Styles not loading?
1. Check file paths in `index.html`
2. Clear browser cache (Ctrl+Shift+R)
3. Verify CSS file is in correct folder

### JavaScript not working?
1. Check console for errors (F12)
2. Verify `main.js` is linked correctly
3. Make sure script is before `</body>`

## 📈 Success Metrics

Track these in your first 2 weeks:
- [ ] 100+ email signups
- [ ] 10+ agent applications
- [ ] 5+ tour requests (manual fulfillment)
- [ ] 1000+ page visits

**If you hit these → Start building the full platform**
**If not → Pivot based on feedback**

## 🤝 Contributing

This is a personal project, but feedback is welcome!
- Found a bug? Open an issue
- Have a suggestion? Let me know
- Want to contribute? Fork and PR

## 📄 License

Free to use for your own projects. Just change the content!

## 📞 Contact

- **Email:** hello@nexaspace.ng (update this!)
- **Twitter:** @nexaspace (update this!)
- **Website:** nexaspace.ng (after deployment!)

## 🎯 Next Steps

1. **Deploy today** ✅
2. **Get first 10 signups** (this week)
3. **Talk to 10 agents** (this week)
4. **Manually fulfill 2 tours** (next week)
5. **Validate demand** (2 weeks)
6. **Build full platform** (after validation)

---

**Built with ❤️ for the Nigerian real estate market**

**Good luck with your launch! 🚀**