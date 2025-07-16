import React, { useState } from 'react';
import { FileNode } from '../types';

interface FileTreeProps {
  fileTree: FileNode | null;
  onFileSelect: (path: string) => void;
  selectedFile: string | null;
}

const FileTree: React.FC<FileTreeProps> = ({ fileTree, onFileSelect, selectedFile }) => {
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});

  if (!fileTree) {
    return <div>No files available</div>;
  }

  const toggleFolder = (path: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  const renderNode = (node: FileNode, level = 0) => {
    const isExpanded = expandedFolders[node.path] || false;
    const isSelected = selectedFile === node.path;
    
    return (
      <div key={node.path} style={{ marginLeft: `${level * 16}px` }}>
        {node.type === 'folder' ? (
          <>
            <div 
              className={`folder-node ${isExpanded ? 'expanded' : ''}`}
              onClick={() => toggleFolder(node.path)}
            >
              <span className="folder-icon">{isExpanded ? '📂' : '📁'}</span>
              <span className="folder-name">{node.name}</span>
            </div>
            {isExpanded && node.children && (
              <div className="folder-children">
                {node.children.map(child => renderNode(child, level + 1))}
              </div>
            )}
          </>
        ) : (
          <div 
            className={`file-node ${isSelected ? 'selected' : ''}`}
            onClick={() => onFileSelect(node.path)}
          >
            <span className="file-icon">📄</span>
            <span className="file-name">{node.name}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="file-tree">
      {fileTree.children?.map(node => renderNode(node))}
    </div>
  );
};

export default FileTree;
