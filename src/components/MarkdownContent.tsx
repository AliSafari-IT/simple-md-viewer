import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MarkdownViewer from "./MarkdownViewer";
import FileTree from "./FileTree";
import { FileNode } from "../types";
import CollapsiblePackageLinks from "./CollapsiblePackageLinks";
import HomePage from "./HomePage";
import { ThemeContext } from "../contexts/ThemeContext";
import MenuIcon from "./icons/MenuIcon";
import CloseIcon from "./icons/CloseIcon";
import logoSvg from "/smv-logo.svg";

interface MarkdownContentProps {
  showHomePage?: boolean;
  /**
   * Whether to hide the file tree sidebar and expand content to full width.
   * Useful for mobile or when you want a distraction-free view.
   * Default is false, showing the file tree.
   */
  hideFileTree?: boolean;
  /**
   * Whether to hide the header section (including the logo and menu).
   * Useful for a more minimalistic view.
   * Default is false, showing the header.
   */
  hideHeader?: boolean;
  /**
   * Base URL for the API endpoints.
   * Default is "http://localhost:3500".
   */
  apiBaseUrl?: string;
  /**
   * Whether to hide the footer section.
   * Useful for a more minimalistic view.
   * Default is false, showing the footer.
   */
  hideFooter?: boolean;
  /**
   * Whether to show YAML front matter in markdown files.
   * Default is true, showing front matter.
   */
  showFrontMatter?: boolean;
  /**
   * How to display YAML front matter.
   * - 'full': Complete metadata display with all fields
   * - 'minimal': Basic metadata only (author, date, version)
   * - 'header-only': Just title and description
   * - 'hidden': Parse but don't display front matter
   * Default is 'full'.
   */
  frontMatterMode?: 'full' | 'minimal' | 'header-only' | 'hidden';
}

const MarkdownContent: React.FC<MarkdownContentProps> = ({
  showHomePage = true,
  apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3500",
  hideFileTree = false,
  hideHeader = false,
  hideFooter = false,
  showFrontMatter = true,
  frontMatterMode = 'full',
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
        navigate(`/${normalizedPath}`);
      }, 100);
    }
  }, [navigate]);

  // Handle file path from URL params
  useEffect(() => {
    if (!fileTree) return;

    if (!filePath || filePath === "") {
      if (showHomePage) {
        // Show homepage
        setMarkdownContent("");
        setSelectedFile(null);
        return;
      }
      // Default to README.md
      const readmeNode = findReadmeNode(fileTree);
      if (readmeNode) {
        navigate(`/${readmeNode.path}`);
      }
    } else {
      // Load the file from the URL path
      handleFileSelect(filePath);
    }
  }, [fileTree, filePath, navigate, showHomePage]);

  // Add event listener for popstate to handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.hash.slice(1); // Remove # from hash
      if (path === "/" || path === "") return;

      // Remove leading slash
      const filePath = path.startsWith("/") ? path.substring(1) : path;
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
      const response = await fetch(`${apiBaseUrl}/api/folder-structure`);
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
    } catch (error) {
      console.error("Error fetching file tree:", error);
      setError(
        "Failed to load file tree. Please make sure the server is running."
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
        navigate(`/${path}`);
      }

      // Normalize the path by removing any leading slash
      const normalizedPath = path.startsWith("/") ? path.substring(1) : path;

      const response = await fetch(
        `${apiBaseUrl}/api/file?path=${normalizedPath}`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.statusText}`);
      }

      const data = await response.json();
      setMarkdownContent(data.content);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching markdown content:", error);
      setError("Failed to load markdown content.");
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

  return (
    <div className={`app ${theme}`}>
      {!hideHeader && (
        <header className="header">
          <div
            className="logo-container"
            onClick={() => {
              navigate("/");
              setSelectedFile(null);
              setMarkdownContent("");
              setSidebarOpen(false);
            }}
          >
            <img
              src={logoSvg}
              alt="Simple Markdown Viewer Logo"
              className="logo"
            />
            <div>
              <h1 className="title">SMV</h1>
              <p className="subtitle">
                A simple markdown viewer that displays files from a specified
                folder
              </p>
            </div>
          </div>

          <div className="package-links-wrapper">
            <CollapsiblePackageLinks
              packageName="@asafarim/simple-md-viewer"
              githubPath="simple-md-viewer"
              demoPath="https://alisafari-it.github.io/simple-md-viewer/#/"
            />
          </div>

          <div className="header-controls">
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label={`Switch to ${
                theme === "light" ? "dark" : "light"
              } theme`}
            >
              {theme === "light" ? "🌙" : "☀️"}
            </button>

            {!hideFileTree && (
              <button
                className="menu-toggle"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label="Toggle menu"
              >
                {sidebarOpen ? <CloseIcon /> : <MenuIcon />}
              </button>
            )}
          </div>
        </header>
      )}

      <main className={`main ${hideFileTree ? "no-sidebar" : ""}`}>
        {/* Mobile sidebar overlay - only render if not hiding file tree */}
        {!hideFileTree && (
          <div
            className={`sidebar-overlay ${sidebarOpen ? "open" : ""}`}
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar - only render if not hiding file tree */}
        {!hideFileTree && (
          <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
            <h2>Files</h2>
            {loading && !fileTree ? (
              <p>Loading file tree...</p>
            ) : error && !fileTree ? (
              <p className="error">{error}</p>
            ) : (
              <FileTree
                fileTree={fileTree}
                onFileSelect={(path) => {
                  handleFileSelect(path);
                  setSidebarOpen(false); // Close sidebar on mobile after selecting a file
                }}
                selectedFile={selectedFile}
              />
            )}
          </aside>
        )}

        <section className="content">
          {showHomePage && (!filePath || filePath === "") ? (
            <HomePage
              fileTree={fileTree}
              findReadmeNode={findReadmeNode}
              loading={loading}
            />
          ) : loading && !markdownContent ? (
            <p>Loading content...</p>
          ) : error && !markdownContent ? (
            <p className="error">{error}</p>
          ) : markdownContent ? (
            <MarkdownViewer 
              content={markdownContent} 
              showFrontMatter={showFrontMatter}
              frontMatterMode={frontMatterMode}
            />
          ) : (
            <p>Select a file to view its content</p>
          )}
        </section>
      </main>

      {!hideFooter && (
        <footer className="footer">
          <p>Simple Markdown Viewer - {new Date().getFullYear()}</p>
        </footer>
      )}
    </div>
  );
};

export default MarkdownContent;
