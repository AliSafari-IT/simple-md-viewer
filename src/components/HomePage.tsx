import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileNode } from '../types';

interface HomePageProps {
  fileTree: FileNode | null;
  findReadmeNode: (node: FileNode) => FileNode | null;
  loading: boolean;
}

const HomePage: React.FC<HomePageProps> = ({ fileTree, findReadmeNode, loading }) => {
  const navigate = useNavigate();

  const handleExploreClick = () => {
    if (fileTree) {
      const readmeNode = findReadmeNode(fileTree);
      if (readmeNode) {
        navigate(`${readmeNode.path}`);
      }
    }
  };

  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="logo-container">
          <div className="app-logo">SMV</div>
        </div>
        <h1>Simple Markdown Viewer</h1>
        <p className="tagline">A clean, elegant way to browse and read markdown documentation</p>
        
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
    </div>
  );
};

export default HomePage;
