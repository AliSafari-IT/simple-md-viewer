import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileNode } from '../types';
import './HomePage.css';
import MarkdownViewer from './MarkdownViewer';

interface HomePageProps {
  fileTree: FileNode | null;
  findReadmeNode: (node: FileNode) => FileNode | null;
  loading: boolean;
}

const HomePage: React.FC<HomePageProps> = ({ fileTree, findReadmeNode, loading }) => {
  const navigate = useNavigate();
  const [rootReadmeContent, setRootReadmeContent] = React.useState('');
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3500";

  const handleExploreClick = () => {
    if (fileTree) {
      const readmeNode = findReadmeNode(fileTree);
      if (readmeNode) {
        navigate(`${readmeNode.path}`);
      }
    }
  };

  useEffect(() => {
    if (fileTree) {
      const readmeNode = findReadmeNode(fileTree);
      if (readmeNode) {
        fetchFileContent(readmeNode.path);
      }
    }
  }, [fileTree]);

  const fetchFileContent = async (path: string) => {
    try {
      // For GitHub Pages deployment, we need to use a different approach
      // since we don't have a backend server there
      if (window.location.hostname === 'alisafari-it.github.io') {
        // For GitHub Pages, try to fetch the README.md directly from the repo
        const response = await fetch(
          `https://raw.githubusercontent.com/AliSafari-IT/simple-md-viewer/refs/heads/main/README.md`
        );
        if (response.ok) {
          const content = await response.text();
          setRootReadmeContent(content);
        }
      } else {
        // For local development, use the API
        const response = await fetch(
          `${apiBaseUrl}/api/file?path=${path}`
        );
        const data = await response.json();
        setRootReadmeContent(data.content);
      }
    } catch (error) {
      console.error('Error fetching file content:', error);
    }
  };

  return (
    <div className="home-page">
      <div className="cta-buttons">
          <button 
            className="primary-button"
            onClick={handleExploreClick}
            disabled={loading || !fileTree}
          >
            {loading ? 'Loading...' : 'Explore Documentation'}
          </button>
          <a 
            href="https://github.com/alisafari-it/simple-md-viewer" 
            target="_blank" 
            rel="noopener noreferrer"
            className="secondary-button"
          >
            View on GitHub
          </a>
        </div>

      <div className="features-section">
        <div className="feature">
          <div className="feature-icon">📁</div>
          <h3>File Tree Navigation</h3>
          <p>Easily browse through your documentation with an intuitive file tree</p>
        </div>
        <div className="feature">
          <div className="feature-icon">🌓</div>
          <h3>Light/Dark Mode</h3>
          <p>Switch between themes for comfortable reading in any environment</p>
        </div>
        <div className="feature">
          <div className="feature-icon">📱</div>
          <h3>Responsive Design</h3>
          <p>Works seamlessly on desktop, tablet, and mobile devices</p>
        </div>
      </div>
      <div className="markdown-viewer-wrapper">
        <MarkdownViewer content={rootReadmeContent} />
      </div>
    </div>
  );
};

export default HomePage;
