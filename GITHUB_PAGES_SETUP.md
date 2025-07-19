# 🔧 GitHub Pages Setup Instructions

## Manual GitHub Pages Configuration

To fix the "Pages site failed" error, you need to enable GitHub Pages in your repository settings:

### Step 1: Enable GitHub Pages

1. Go to your repository: `https://github.com/AliSafari-IT/simple-md-viewer`
2. Click on **Settings** tab
3. Scroll down to **Pages** section in the left sidebar
4. Under **Source**, select **GitHub Actions**
5. Click **Save**

### Step 2: Verify Repository Permissions

Make sure your repository has the correct permissions:

1. In **Settings** → **Actions** → **General**
2. Under **Workflow permissions**, select:
   - ✅ **Read and write permissions**
   - ✅ **Allow GitHub Actions to create and approve pull requests**

### Step 3: Repository Visibility

- Ensure your repository is **Public** (GitHub Pages free tier requires public repos)
- If private, you need GitHub Pro/Team/Enterprise

### Step 4: Check Branch Protection

1. Go to **Settings** → **Branches**
2. Make sure the `main` branch allows Actions to run
3. No branch protection rules should block the deployment

## Alternative Solutions

### Option 1: Use the Alternative Workflow

I've created `deploy-demo-alternative.yml` which uses `peaceiris/actions-gh-pages@v3` instead of the official GitHub Actions. This action is more reliable for initial setups.

To use it:
1. Delete or rename the current `deploy-demo.yml`
2. Rename `deploy-demo-alternative.yml` to `deploy-demo.yml`
3. Push to trigger the workflow

### Option 2: Manual Enablement via CLI

If you have GitHub CLI installed:

```bash
# Enable Pages programmatically
gh api repos/AliSafari-IT/simple-md-viewer/pages \
  --method POST \
  --field source[branch]=main \
  --field source[path]=/
```

### Option 3: Create a Simple HTML Demo

Create a basic `index.html` in the root and enable Pages from main branch:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Simple Markdown Viewer Demo</title>
    <meta http-equiv="refresh" content="0; url=./dist/index.html">
</head>
<body>
    <p>Redirecting to demo...</p>
</body>
</html>
```

## Troubleshooting

### Common Issues:

1. **Repository not public**: Make repository public or upgrade to GitHub Pro
2. **Missing permissions**: Enable read/write permissions for Actions
3. **Branch name mismatch**: Ensure workflow targets the correct branch name
4. **First-time setup**: Sometimes takes 5-10 minutes for Pages to activate

### Verification Steps:

1. Check that the workflow runs without errors
2. Verify that the `dist` folder is created with your built files
3. Ensure the GitHub Pages URL is accessible (usually `https://alisafari-it.github.io/simple-md-viewer/#/`)

## Expected Demo URL

Once configured, your demo will be available at:
`https://alisafari-it.github.io/simple-md-viewer/#/`

## Workflow Features

The updated workflow includes:

- ✅ **Automatic demo content creation** if md-docs doesn't exist
- ✅ **Better error handling** and logging
- ✅ **Manual workflow dispatch** option
- ✅ **Robust Pages configuration** with enablement parameter
- ✅ **Sample markdown content** for demonstration

After following these steps, your GitHub Actions workflow should successfully deploy your Simple Markdown Viewer demo to GitHub Pages! 🚀
