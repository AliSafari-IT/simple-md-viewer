#!/bin/bash

# Test script to verify package exports work correctly

echo "Testing package exports..."

# Check if main files exist
if [ -f "dist/index.esm.js" ]; then
    echo "✅ ESM build exists"
else
    echo "❌ ESM build missing"
fi

if [ -f "dist/index.cjs.js" ]; then
    echo "✅ CJS build exists"
else
    echo "❌ CJS build missing"
fi

if [ -f "dist/index.d.ts" ]; then
    echo "✅ TypeScript declarations exist"
else
    echo "❌ TypeScript declarations missing"
fi

if [ -f "dist/style.css" ]; then
    echo "✅ CSS file exists"
else
    echo "❌ CSS file missing"
fi

if [ -f "dist/style.css.d.ts" ]; then
    echo "✅ CSS declarations exist"
else
    echo "❌ CSS declarations missing"
fi

echo "Package export test complete!"
