# CSS Import Issue Resolution

## ✅ Problem Fixed!

The error `Cannot find module '@asafarim/simple-md-viewer/dist/style.css'` has been resolved.

## What was Fixed:

1. **Package Exports Configuration**: Added both `/style.css` and `/dist/style.css` export paths
2. **CSS Type Declarations**: Created `dist/style.css.d.ts` for TypeScript support
3. **Build Process**: Updated build script to automatically generate CSS declarations
4. **Documentation**: Updated README with multiple import methods

## How to Use in Your Project:

### Method 1: Standard Import (Recommended)
```tsx
import '@asafarim/simple-md-viewer/dist/style.css';
```

### Method 2: Alternative Path
```tsx
import '@asafarim/simple-md-viewer/style.css';
```

## If You Still Get TypeScript Errors:

Add this to your project's type definitions (e.g., `src/vite-env.d.ts` or `global.d.ts`):

```typescript
declare module '@asafarim/simple-md-viewer/dist/style.css';
declare module '@asafarim/simple-md-viewer/style.css';
```

## Package Structure:
- ✅ `dist/index.esm.js` - ESM build
- ✅ `dist/index.cjs.js` - CommonJS build  
- ✅ `dist/index.d.ts` - TypeScript declarations
- ✅ `dist/style.css` - Compiled styles
- ✅ `dist/style.css.d.ts` - CSS type declarations

## Next Steps:
1. Publish the updated package: `npm publish`
2. Update in your other project: `npm update @asafarim/simple-md-viewer`
3. Restart your TypeScript server/IDE

The CSS import should now work without any errors! 🎉
