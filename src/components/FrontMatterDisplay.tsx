import React from 'react';
import { FrontMatter, formatDate } from '../utils/frontMatter';
import './FrontMatterDisplay.css';

interface FrontMatterDisplayProps {
  frontMatter: FrontMatter;
  mode?: 'full' | 'minimal' | 'header-only';
}

const FrontMatterDisplay: React.FC<FrontMatterDisplayProps> = ({ 
  frontMatter, 
  mode = 'full' 
}) => {
  if (!frontMatter) return null;

  // Header-only mode: Just show title and description
  if (mode === 'header-only') {
    return (
      <div className="front-matter-header">
        {frontMatter.title && (
          <h1 className="front-matter-title">{frontMatter.title}</h1>
        )}
        {frontMatter.description && (
          <p className="front-matter-description">{frontMatter.description}</p>
        )}
      </div>
    );
  }

  // Minimal mode: Basic metadata only
  if (mode === 'minimal') {
    return (
      <div className="front-matter-minimal">
        <div className="front-matter-meta">
          {frontMatter.author && (
            <span className="front-matter-author">By {frontMatter.author}</span>
          )}
          {frontMatter.lastModified && (
            <span className="front-matter-date">
              Updated {formatDate(frontMatter.lastModified, frontMatter.locale)}
            </span>
          )}
          {frontMatter.version && (
            <span className="front-matter-version">v{frontMatter.version}</span>
          )}
        </div>
      </div>
    );
  }

  // Full mode: Complete metadata display
  return (
    <div className="front-matter-display">
      <div className="front-matter-main">
        {frontMatter.title && (
          <h1 className="front-matter-title">{frontMatter.title}</h1>
        )}
        
        {frontMatter.description && (
          <p className="front-matter-description">{frontMatter.description}</p>
        )}

        <div className="front-matter-meta">
          {frontMatter.author && (
            <div className="front-matter-item">
              <span className="front-matter-label">Author:</span>
              <span className="front-matter-value">{frontMatter.author}</span>
            </div>
          )}
          
          {frontMatter.lastModified && (
            <div className="front-matter-item">
              <span className="front-matter-label">Last Modified:</span>
              <span className="front-matter-value">
                {formatDate(frontMatter.lastModified, frontMatter.locale)}
              </span>
            </div>
          )}
          
          {frontMatter.version && (
            <div className="front-matter-item">
              <span className="front-matter-label">Version:</span>
              <span className="front-matter-value">v{frontMatter.version}</span>
            </div>
          )}
          
          {frontMatter.category && (
            <div className="front-matter-item">
              <span className="front-matter-label">Category:</span>
              <span className="front-matter-value">{frontMatter.category}</span>
            </div>
          )}
        </div>

        {frontMatter.tags && frontMatter.tags.length > 0 && (
          <div className="front-matter-tags">
            <span className="front-matter-label">Tags:</span>
            <div className="front-matter-tag-list">
              {frontMatter.tags.map((tag, index) => (
                <span key={index} className="front-matter-tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {frontMatter.breadcrumbs && frontMatter.breadcrumbs.length > 0 && (
          <div className="front-matter-breadcrumbs">
            <nav aria-label="Breadcrumb">
              {frontMatter.breadcrumbs.map((crumb, index) => (
                <span key={index}>
                  {index > 0 && <span className="breadcrumb-separator"> / </span>}
                  <span className="breadcrumb-item">{crumb.name}</span>
                </span>
              ))}
            </nav>
          </div>
        )}
      </div>

      {frontMatter.related && frontMatter.related.length > 0 && (
        <div className="front-matter-related">
          <h3 className="front-matter-related-title">Related Pages</h3>
          <ul className="front-matter-related-list">
            {frontMatter.related.map((item, index) => (
              <li key={index}>
                <a href={item.path} className="front-matter-related-link">
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FrontMatterDisplay;
