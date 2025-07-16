import React, { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useParams,
  useNavigate,
} from "react-router-dom";
import MarkdownViewer from "./components/MarkdownViewer";
import FileTree from "./components/FileTree";
import { FileNode } from "./types";
import { PackageLinks } from "@asafarim/shared";
import "./App.css";

// Main content component that handles file loading and display
const MarkdownContent: React.FC = () => {
  const { "*": filePath } = useParams<{ "*": string }>();
  const navigate = useNavigate();
  const [fileTree, setFileTree] = useState<FileNode | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [markdownContent, setMarkdownContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    // Get theme from localStorage or default to light
    const savedTheme = localStorage.getItem("md-viewer-theme");
    return (savedTheme as "light" | "dark") || "light";
  });

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
  }, []);

  // Save theme to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("md-viewer-theme", theme);
    document.body.className = theme;
  }, [theme]);

  // Handle file path from URL params
  useEffect(() => {
    if (!fileTree) return;

    if (!filePath || filePath === "") {
      // Default to README.md
      const readmeNode = findReadmeNode(fileTree);
      if (readmeNode) {
        navigate(`/${readmeNode.path}`);
      }
    } else {
      // Load the file from the URL path
      handleFileSelect(filePath);
    }
  }, [fileTree, filePath, navigate]);

  // Add event listener for popstate to handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === "/") return;

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
        `http://localhost:3500/api/file?path=${normalizedPath}`
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

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className={`app ${theme}`}>
      <header className="header">
        <div className="logo-container">
          <img
            src="/logo.svg"
            alt="Simple Markdown Viewer Logo"
            className="logo"
            onClick={() => navigate("/")}
          />
          <h1 className="title">SMV</h1>
          <p className="subtitle">
            A simple markdown viewer that displays files from a specified folder
          </p>
        </div>
        <PackageLinks
          packageName="@asafarim/simple-md-viewer"
          githubPath="simple-md-viewer"
          demoPath="simple-md-viewer"
        />
        <button
          onClick={toggleTheme}
          className="theme-toggle"
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>
      </header>

      <main className="main">
        <aside className="sidebar">
          <h2>Files</h2>
          {loading && !fileTree ? (
            <p>Loading file tree...</p>
          ) : error && !fileTree ? (
            <p className="error">{error}</p>
          ) : (
            <FileTree
              fileTree={fileTree}
              onFileSelect={handleFileSelect}
              selectedFile={selectedFile}
            />
          )}
        </aside>

        <section className="content">
          {loading && !markdownContent ? (
            <p>Loading content...</p>
          ) : error && !markdownContent ? (
            <p className="error">{error}</p>
          ) : markdownContent ? (
            <MarkdownViewer content={markdownContent} />
          ) : (
            <p>Select a file to view its content</p>
          )}
        </section>
      </main>

      <footer className="footer">
        <p>Simple Markdown Viewer - {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

// Main App component that sets up routing
const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Handle the root path */}
        <Route path="/" element={<MarkdownContent />} />

        {/* Handle any path, including nested paths with slashes */}
        <Route path="/*" element={<MarkdownContent />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
