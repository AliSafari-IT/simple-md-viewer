# 🤝 Contributing to Simple Markdown Viewer

Thank you for your interest in contributing to Simple Markdown Viewer! We welcome contributions from the community and are grateful for any help you can provide.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)
- [Issue Reporting](#issue-reporting)
- [Feature Requests](#feature-requests)
- [Community](#community)

## 🤝 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please be respectful, inclusive, and constructive in all interactions.

### Our Pledge

- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **pnpm** (v8 or higher) - We use pnpm as our package manager
- **Git**

### Development Setup

1. **Fork the repository**

   ```bash
   # Click the "Fork" button on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/simple-md-viewer.git
   cd simple-md-viewer
   ```

2. **Add the upstream remote**

   ```bash
   git remote add upstream https://github.com/AliSafari-IT/simple-md-viewer.git
   ```

3. **Install dependencies**

   ```bash
   pnpm install
   ```

4. **Start the development environment**

   ```bash
   pnpm start
   ```

   This will start:
   - Frontend dev server on `http://localhost:3501`
   - Backend API server on `http://localhost:3500`

5. **Verify everything works**
   - Open `http://localhost:3501` in your browser
   - You should see the markdown viewer with the default documentation

## 🛠️ How to Contribute

### Types of Contributions

We welcome various types of contributions:

- 🐛 **Bug fixes**
- ✨ **New features**
- 📚 **Documentation improvements**
- 🎨 **UI/UX enhancements**
- ⚡ **Performance optimizations**
- 🧪 **Tests**
- 🌐 **Accessibility improvements**
- 🔧 **Build and tooling improvements**

### Contribution Workflow

1. **Check existing issues**
   - Look for existing issues or discussions
   - Comment on the issue if you want to work on it

2. **Create a new issue** (if needed)
   - Describe the bug, feature, or improvement
   - Wait for feedback before starting work on large changes

3. **Create a feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

4. **Make your changes**
   - Write clean, readable code
   - Follow our coding standards
   - Add tests if applicable
   - Update documentation

5. **Test your changes**

   ```bash
   # Run the development servers
   pnpm start
   
   # Test in different browsers
   # Test responsive design
   # Test both light and dark themes
   ```

6. **Commit your changes**

   ```bash
   git add .
   git commit -m "feat: add awesome new feature"
   ```

7. **Push and create a Pull Request**

   ```bash
   git push origin feature/your-feature-name
   ```

## 📥 Pull Request Process

### Before Submitting

- ✅ Ensure your code follows our coding standards
- ✅ Test your changes thoroughly
- ✅ Update documentation if needed
- ✅ Add or update tests if applicable
- ✅ Ensure your branch is up to date with main

### Pull Request Guidelines

1. **Use a clear and descriptive title**

   ```
   feat: add keyboard navigation to file tree
   fix: resolve mobile sidebar overflow issue
   docs: update installation instructions
   ```

2. **Fill out the PR template**
   - Describe what changes you made
   - Explain why you made them
   - Include screenshots for UI changes
   - List any breaking changes

3. **Link related issues**

   ```markdown
   Closes #123
   Relates to #456
   ```

4. **Keep PRs focused**
   - One feature or fix per PR
   - Avoid mixing unrelated changes

### PR Review Process

1. **Automated checks** will run (if configured)
2. **Maintainer review** - we'll review your code and provide feedback
3. **Address feedback** - make requested changes
4. **Approval and merge** - once approved, we'll merge your PR

## 📝 Coding Standards

### TypeScript/JavaScript

```typescript
// Use TypeScript for type safety
interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: FileNode[];
}

// Use descriptive variable names
const selectedFileNode = findFileByPath(filePath);

// Use consistent formatting
const handleFileSelect = async (path: string): Promise<void> => {
  try {
    const content = await fetchFileContent(path);
    setSelectedFile(content);
  } catch (error) {
    console.error('Failed to load file:', error);
  }
};
```

### React Components

```tsx
// Use functional components with hooks
const FileTree: React.FC<FileTreeProps> = ({ fileTree, onFileSelect }) => {
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});

  // Use proper prop types
  interface FileTreeProps {
    fileTree: FileNode | null;
    onFileSelect: (path: string) => void;
    selectedFile: string | null;
  }

  // Use meaningful component and prop names
  return (
    <div className="file-tree">
      {/* Component JSX */}
    </div>
  );
};
```

### CSS/Styling

```css
/* Use CSS custom properties for theming */
:root {
  --primary-color: #2196f3;
  --spacing-md: 1rem;
}

/* Use BEM-like naming convention */
.file-tree {
  /* Container styles */
}

.file-tree__item {
  /* Item styles */
}

.file-tree__item--selected {
  /* Selected state */
}

/* Use consistent spacing */
.component {
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-sm);
}
```

### Commit Messages

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Build process or auxiliary tool changes

**Examples:**

```bash
feat: add dark theme toggle
fix: resolve mobile navigation overflow
docs: update API documentation
style: format code with prettier
refactor: extract file tree logic to custom hook
test: add unit tests for markdown parser
chore: update build dependencies
```

## 🧪 Testing

### Manual Testing

Before submitting your PR, please test:

1. **Functionality**
   - File tree navigation works
   - Markdown rendering is correct
   - Theme switching works
   - Responsive design on mobile/tablet

2. **Browser Compatibility**
   - Chrome (latest)
   - Firefox (latest)
   - Safari (if possible)
   - Edge (latest)

3. **Accessibility**
   - Keyboard navigation
   - Screen reader compatibility
   - Color contrast ratios

### Future: Automated Testing

We plan to add automated testing in the future:

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Coverage report
pnpm test:coverage
```

## 📚 Documentation

### Code Documentation

- Add JSDoc comments for complex functions
- Use TypeScript types for better self-documentation
- Comment non-obvious code logic

```typescript
/**
 * Recursively builds a file tree structure from a directory path
 * @param dirPath - The directory path to scan
 * @param relativePath - The relative path for building node paths
 * @returns Array of FileNode objects representing the directory structure
 */
function getFolderStructure(dirPath: string, relativePath = ""): FileNode[] {
  // Implementation
}
```

### README Updates

When adding new features:

- Update the features list
- Add usage examples
- Update configuration options
- Add any new dependencies

## 🐛 Issue Reporting

### Bug Reports

When reporting bugs, please include:

1. **Clear description** of the issue
2. **Steps to reproduce** the problem
3. **Expected behavior** vs actual behavior
4. **Environment information**:
   - OS and version
   - Browser and version
   - Node.js version
   - Package version

5. **Screenshots or videos** (if applicable)
6. **Console errors** (if any)

### Bug Report Template

```markdown
**Bug Description**
A clear description of what the bug is.

**To Reproduce**
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

**Expected Behavior**
What you expected to happen.

**Screenshots**
Add screenshots to help explain your problem.

**Environment:**
- OS: [e.g. Windows 11, macOS 13]
- Browser: [e.g. Chrome 120, Firefox 119]
- Version: [e.g. 1.0.1]

**Additional Context**
Any other context about the problem.
```

## 💡 Feature Requests

We love feature ideas! When suggesting new features:

1. **Check existing issues** first
2. **Describe the problem** you're trying to solve
3. **Propose a solution** with implementation ideas
4. **Consider alternatives** you've thought of
5. **Think about impact** on existing users

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
A clear description of what the problem is.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Alternative solutions or features you've considered.

**Additional context**
Any other context, mockups, or examples.
```

## 🌟 Recognition

Contributors will be:

- Added to the contributors list
- Mentioned in release notes for significant contributions
- Given credit in documentation for major features

## 📞 Community

### Getting Help

- 💬 **GitHub Discussions** - For questions and general discussion
- 🐛 **GitHub Issues** - For bug reports and feature requests: <https://github.com/AliSafari-IT/simple-md-viewer/issues>
- 📧 **Email** - For private inquiries

### Stay Updated

- ⭐ **Star the repository** to stay notified
- 👀 **Watch releases** for new versions
- 🐦 **Follow us** on social media (if applicable)

## 📄 License

By contributing to Simple Markdown Viewer, you agree that your contributions will be licensed under the same MIT License that covers the project.

---

## 🙏 Thank You

Thank you for taking the time to contribute! Every contribution, no matter how small, helps make Simple Markdown Viewer better for everyone.

**Happy contributing! 🚀**
