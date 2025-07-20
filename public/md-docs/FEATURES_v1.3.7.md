# 🚀 Simple Markdown Viewer v1.3.7 - New Features Summary

## ✨ New Props Added to `MarkdownContent` Component

### 🎛️ **`hideFileTree?: boolean` (default: false)**
Hide the file tree sidebar and expand content to full width.

**Perfect for:**
- 📱 Mobile-first applications
- 🎯 Single document focus
- 🔧 Embedded viewers
- 📖 Blog post display
- 🎪 Presentation mode

### 🎨 **`hideHeader?: boolean` (default: false)**
Hide the header section including logo, theme toggle, and menu.

**Perfect for:**
- 🔗 API documentation widgets
- 📱 Ultra-clean mobile apps
- 🎛️ Dashboard integration
- 📖 Help systems
- 🎯 Content-only views

### 🦶 **`hideFooter?: boolean` (default: false)**
Hide the footer section for a more minimalistic view.

**Perfect for:**
- 🎨 White-label solutions
- 📱 Mobile space optimization
- 🔧 Embedded widgets
- 🎯 Clean integration

## 📝 Updated Documentation

### ✅ Enhanced README.md with:
- 🎛️ New minimalistic UI options feature
- 📖 4 different Quick Start options
- 🎯 7 comprehensive use cases
- ⚙️ 5 configuration examples
- 📚 Updated API reference

### ✅ Configuration Examples Added:
1. **Full-Featured Documentation Site**
2. **Mobile-Optimized Content Viewer**  
3. **Embedded Widget (Minimal Chrome)**
4. **Dashboard Documentation Panel**
5. **Blog Post Reader**

## 🎯 Use Cases Now Supported

### Standard Documentation (All props `false`)
```tsx
<MarkdownContent 
  showHomePage={true}
  hideFileTree={false}
  hideHeader={false}
  hideFooter={false}
/>
```

### Full-Width Content (`hideFileTree={true}`)
```tsx
<MarkdownContent 
  showHomePage={true}
  hideFileTree={true}
  hideHeader={false}
  hideFooter={false}
/>
```

### Ultra-Minimal Embedded (`all hide props true`)
```tsx
<MarkdownContent 
  showHomePage={false}
  hideFileTree={true}
  hideHeader={true}
  hideFooter={true}
/>
```

## 🚀 Ready for Publication

- ✅ TypeScript declarations updated
- ✅ CSS styling handles all layouts
- ✅ README comprehensively updated
- ✅ All props documented with examples
- ✅ Build system working correctly

Your package is now ready for `npm publish` with these awesome new flexible layout options! 🎉
