import React, { useState, useEffect, createContext, useContext } from "react";

// Create a theme context to share theme across components
export const ThemeContext = createContext<{
  theme: "light" | "dark";
  toggleTheme?: () => void;
}>({ theme: "light" });
import MenuIcon from "./components/icons/MenuIcon";
import CloseIcon from "./components/icons/CloseIcon";
import {
  HashRouter,
  Routes,
  Route,
  useParams,
  useNavigate,
} from "react-router-dom";
import MarkdownViewer from "./components/MarkdownViewer";
import FileTree from "./components/FileTree";
import { FileNode } from "./types";
import CollapsiblePackageLinks from "./components/CollapsiblePackageLinks";
import "./App.css";
import "./components/ResponsiveSidebar.css";
import "./components/CollapsiblePackageLinks.css";
import HomePage from "./components/HomePage";

// Main content component that handles file loading and display
const MarkdownContent: React.FC<{ showHomePage?: boolean }> = ({
  showHomePage = false,
}) => {
  const { "*": filePath } = useParams<{ "*": string }>();
  const navigate = useNavigate();
  const [fileTree, setFileTree] = useState<FileNode | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [markdownContent, setMarkdownContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const { theme, toggleTheme } = useContext(ThemeContext);

  // Fetch file tree on component mount
  useEffect(() => {
    fetchFileTree();

    // Check for redirect path in sessionStorage (for handling direct navigation)
    const redirectPath = sessionStorage.getItem("redirect_path");
    if (redirectPath) {
      // Clear the redirect path from sessionStorage
      sessionStorage.removeItem("redirect_path");

      // Remove leading slash if present
      const normalizedPath = redirectPath.startsWith("/")
        ? redirectPath.substring(1)
        : redirectPath;

      // Navigate to the redirect path once the file tree is loaded
      setTimeout(() => {
        // With HashRouter, don't use leading slash
        navigate(`${normalizedPath}`);
      }, 100);
    }
  }, []);

  // Theme is now managed by the context
  // No need to save to localStorage here as it's handled in the App component

  // Handle file path from URL params
  useEffect(() => {
    if (!fileTree) return;

    if (!filePath || filePath === "") {
      // Only navigate to README.md if we're not showing the homepage
      if (!showHomePage) {
        const readmeNode = findReadmeNode(fileTree);
        if (readmeNode) {
          // With HashRouter, don't use leading slash
          navigate(`${readmeNode.path}`);
        }
      }
    } else {
      // Load the file from the URL path
      handleFileSelect(filePath);
    }
  }, [fileTree, filePath, navigate, showHomePage]);

  // Add event listener for popstate to handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      // With HashRouter, we need to look at the hash part of the URL
      const hash = window.location.hash;
      if (!hash || hash === "#/") return;

      // Extract the path from the hash (remove #/ prefix)
      const filePath = hash.substring(2); // Skip the #/ part
      if (filePath) {
        handleFileSelect(filePath);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const fetchFileTree = async () => {
    try {
      setLoading(true);
      
      // Check if we're running on GitHub Pages
      if (window.location.hostname === 'alisafari-it.github.io') {
        // For GitHub Pages, we'll use a static file structure since we don't have a backend server
        // This is a simplified file tree that represents the main markdown files in the repository
        const staticFileTree: FileNode = {
          name: "root",
          path: "",
          type: 'folder' as const,
          children: [
            {
              name: "README.md",
              path: "README.md",
              type: 'file' as const
            },
            {
              name: "CHANGELOG.md",
              path: "CHANGELOG.md",
              type: 'file' as const
            },
            {
              name: "CONTRIBUTING.md",
              path: "CONTRIBUTING.md",
              type: 'file' as const
            },
            {
              name: "docs",
              path: "docs",
              type: 'folder' as const,
              children: [
                {
                  name: "API.md",
                  path: "docs/API.md",
                  type: 'file' as const
                },
                {
                  name: "USAGE.md",
                  path: "docs/USAGE.md",
                  type: 'file' as const
                }
              ]
            }
          ]
        };
        
        setFileTree(staticFileTree);
        setLoading(false);
      } else {
        // For local development, use the API
        const response = await fetch(
          "http://localhost:3500/api/folder-structure"
        );
        const data = await response.json();

        if (data && data.nodes) {
          setFileTree({
            name: "root",
            path: "",
            type: "folder",
            children: data.nodes,
          });
        }
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching file tree:", error);
      setError(
        "Failed to load file tree. Please check your connection or try again later."
      );
      setLoading(false);
    }
  };

  const handleFileSelect = async (path: string) => {
    try {
      setLoading(true);
      setSelectedFile(path);

      // Use React Router navigation instead of pushState
      if (path !== filePath) {
        // With HashRouter, don't use leading slash
        navigate(`${path}`);
      }

      // Normalize the path by removing any leading slash
      const normalizedPath = path.startsWith("/") ? path.substring(1) : path;

      // Check if we're running on GitHub Pages
      if (window.location.hostname === 'alisafari-it.github.io') {
        // For GitHub Pages, try to fetch the file directly from GitHub raw content
        // Extract the file path from the normalized path
        try {
          const response = await fetch(
            `https://raw.githubusercontent.com/alisafari-it/simple-md-viewer/main/md-docs/${normalizedPath}`
          );
          
          if (response.status === 404) {
            setError(`File not found: ${path}`);
            setMarkdownContent("");
            setLoading(false);
            return;
          }
          
          if (!response.ok) {
            throw new Error(`Failed to fetch file: ${response.statusText}`);
          }

          const content = await response.text();
          setMarkdownContent(content);
          setError(""); // Clear any previous errors
        } catch (error) {
          console.error('Error fetching from GitHub raw content:', error);
          setError(`Failed to load markdown content. The file may not exist.`);
          setMarkdownContent("");
        }
      } else {
        // For local development, use the API
        const response = await fetch(
          `http://localhost:3500/api/file?path=${normalizedPath}`
        );
        
        if (response.status === 404) {
          setError(`File not found: ${path}`);
          setMarkdownContent("");
          setLoading(false);
          return;
        }
        
        if (!response.ok) {
          throw new Error(`Failed to fetch file: ${response.statusText}`);
        }

        const data = await response.json();
        setMarkdownContent(data.content);
        setError(""); // Clear any previous errors
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching markdown content:", error);
      setError("Failed to load markdown content. The file may not exist.");
      setMarkdownContent("");
      setLoading(false);
    }
  };

  const findReadmeNode = (node: FileNode): FileNode | null => {
    if (node.type === "file" && node.name.toLowerCase() === "readme.md") {
      return node;
    }

    if (node.children) {
      for (const child of node.children) {
        const found = findReadmeNode(child);
        if (found) return found;
      }
    }

    return null;
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Close sidebar when clicking outside on mobile
  const handleOverlayClick = () => {
    setSidebarOpen(false);
  };

  return (
    <div className={`app ${theme}`}>
      <header className="header">
        <div
          className="logo-container"
          onClick={() => navigate("/")}
          title="Go to homepage"
        >
          <img
            src="./smv-logo.svg"
            alt="Simple Markdown Viewer Logo"
            className="logo"
          />
          <div>
            <h1 className="title">SMV</h1>
            <p className="subtitle">
              A simple markdown viewer that displays files from a specified folder
            </p>
          </div>
        </div>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>
        <CollapsiblePackageLinks
          packageName="@asafarim/simple-md-viewer"
          githubPath="simple-md-viewer"
          demoPath="https://alisafari-it.github.io/simple-md-viewer/#/"
        />
      </header>

      <main className={`main ${sidebarOpen ? 'sidebar-open' : ''}`}>
        {/* Sidebar overlay for mobile - only visible when sidebar is open */}
        {sidebarOpen && (
          <div 
            className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`} 
            onClick={handleOverlayClick}
            aria-hidden="true"
          />
        )}
        
        <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <h2>Files</h2>
          <FileTree
            fileTree={{
              name: "root",
              path: "",
              type: "folder",
              children: fileTree?.children || []
            }}
            onFileSelect={(path) => {
              handleFileSelect(path);
              // Close sidebar after selection on mobile
              setSidebarOpen(false);
            }}
            selectedFile={selectedFile}
          />
        </aside>

        {/* Sidebar toggle button - always visible on mobile */}
        <div className="mobile-sidebar-toggle-container">
          <button 
            className="sidebar-toggle" 
            onClick={toggleSidebar}
            aria-label={`${sidebarOpen ? 'Close' : 'Open'} sidebar menu`}
          >
            <div className="toggle-icon-wrapper">
              {sidebarOpen ? <CloseIcon /> : <MenuIcon />}
            </div>
          </button>
        </div>

        <section className="content">
          {showHomePage ? (
            <HomePage 
              fileTree={fileTree || null} 
              findReadmeNode={findReadmeNode} 
              loading={loading} 
            />
          ) : loading ? (
            <p>Loading...</p>
          ) : error ? (
            <div className="error-container">
              <p className="error">
                {error.includes("not found") ? (
                  <>
                    <strong>404 - File Not Found</strong><br />
                    The requested file could not be found. It may have been moved or deleted.
                  </>
                ) : (
                  error
                )}
              </p>
              {error.includes("not found") && (
                <button 
                  className="home-button" 
                  onClick={() => navigate("/")}
                >
                  Return to Homepage
                </button>
              )}
            </div>
          ) : markdownContent ? (
            <MarkdownViewer content={markdownContent} />
          ) : (
            <p>Select a markdown file to view</p>
          )}
        </section>
      </main>

      <footer className="footer">
        <p>
          Simple Markdown Viewer - {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
};

// Main App component that sets up routing
const App: React.FC = () => {
  const [appTheme, setAppTheme] = useState<"light" | "dark">(() => {
    // Get theme from localStorage or default to light
    const savedTheme = localStorage.getItem("md-viewer-theme");
    return (savedTheme as "light" | "dark") || "light";
  });

  // Toggle theme function
  const toggleAppTheme = () => {
    setAppTheme(prevTheme => {
      const newTheme = prevTheme === "light" ? "dark" : "light";
      localStorage.setItem("md-viewer-theme", newTheme);
      document.body.className = newTheme;
      return newTheme;
    });
  };

  // Set initial body class
  useEffect(() => {
    document.body.className = appTheme;
  }, []);

  // We've updated the Vite config to use a consistent base path for all environments
  
  return (
    <ThemeContext.Provider value={{ theme: appTheme, toggleTheme: toggleAppTheme }}>
      <HashRouter>
        <Routes>
          {/* Handle the root path */}
          <Route path="/" element={<MarkdownContent showHomePage={true} />} />
          
          {/* Handle any path, including nested paths with slashes */}
          <Route path="/*" element={<MarkdownContent showHomePage={false} />} />
        </Routes>
      </HashRouter>
    </ThemeContext.Provider>
  );
};

export default App;
