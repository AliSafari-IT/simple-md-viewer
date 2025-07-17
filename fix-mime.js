// This script helps fix MIME type issues on GitHub Pages
document.addEventListener('DOMContentLoaded', function() {
  // Check if we're on GitHub Pages
  if (window.location.hostname === 'alisafari-it.github.io') {
    // Create a new script element with the correct type
    const script = document.createElement('script');
    script.src = '/simple-md-viewer/assets/index.js';
    script.type = 'text/javascript'; // Use standard script type instead of module
    
    // Append it to the document
    document.body.appendChild(script);
  }
});
