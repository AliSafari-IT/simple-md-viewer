// Shim for fsevents on non-macOS platforms
// This prevents import resolution errors

if (process.platform !== 'darwin') {
  module.exports = function() {
    // No-op function for non-macOS platforms
    return null;
  };
} else {
  try {
    module.exports = require('fsevents');
  } catch (error) {
    module.exports = function() {
      return null;
    };
  }
}
