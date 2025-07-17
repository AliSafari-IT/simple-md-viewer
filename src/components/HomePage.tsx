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
      const response = await fetch(
        `http://localhost:3500/api/file?path=${path}`
      );
      const data = await response.json();
      setRootReadmeContent(data.content);
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
