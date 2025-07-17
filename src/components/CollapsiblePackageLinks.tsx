import React, { useState } from "react";
import { PackageLinks } from "@asafarim/shared";

// Collapsible wrapper for PackageLinks component
export const CollapsiblePackageLinks: React.FC<{
  packageName: string;
  githubPath: string;
  demoPath: string;
}> = ({ packageName, githubPath, demoPath }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="package-links-wrapper">
      <button 
        className="package-links-toggle" 
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        aria-label="Toggle package links"
      >
        <span className="toggle-icon">{isExpanded ? '−' : '+'}</span>
        <span className="toggle-text">Links</span>
      </button>
      <div className={`collapsible-content ${isExpanded ? 'expanded' : ''}`}>
        <PackageLinks
          packageName={packageName}
          githubPath={githubPath}
          demoPath={demoPath}
        />
      </div>
    </div>
  );
};

export default CollapsiblePackageLinks;

