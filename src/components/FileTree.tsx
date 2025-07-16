import React, { useState, useEffect } from 'react';
import { FileNode } from '../types';

interface FileTreeProps {
  fileTree: FileNode | null;
  onFileSelect: (path: string) => void;
  selectedFile: string | null;
}

const FileTree: React.FC<FileTreeProps> = ({ fileTree, onFileSelect, selectedFile }) => {
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>(() => {
    // Load expanded state from localStorage
    const saved = localStorage.getItem('md-viewer-expanded-folders');
    return saved ? JSON.parse(saved) : {};
  });

  // Save expanded state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('md-viewer-expanded-folders', JSON.stringify(expandedFolders));
  }, [expandedFolders]);

  // Auto-expand parent folders when selectedFile changes
  useEffect(() => {
    if (selectedFile && fileTree) {
      const pathsToExpand = getParentPaths(selectedFile);
      const newExpanded = { ...expandedFolders };
      let hasChanges = false;

      pathsToExpand.forEach(path => {
        if (!newExpanded[path]) {
          newExpanded[path] = true;
          hasChanges = true;
        }
      });

      if (hasChanges) {
        setExpandedFolders(newExpanded);
      }
    }
  }, [selectedFile, fileTree]);

  // Helper function to get all parent folder paths for a given file path
  const getParentPaths = (filePath: string): string[] => {
    const parts = filePath.split('/');
    const paths: string[] = [];
    
    for (let i = 1; i < parts.length; i++) {
      const path = parts.slice(0, i).join('/');
      if (path) {
        paths.push(path);
      }
    }
    
    return paths;
  };

  if (!fileTree) {
    return <div>No files available</div>;
  }

  const toggleFolder = (path: string) => {
    setExpandedFolders(prev => {
      const newState = {
        ...prev,
        [path]: !prev[path]
      };
      return newState;
    });
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
