import React, { useContext, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { default as tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism/tomorrow";
import { default as oneLight } from "react-syntax-highlighter/dist/esm/styles/prism/one-light";
import { ThemeContext } from '../contexts/ThemeContext';
import { parseFrontMatter } from '../utils/frontMatter';
import FrontMatterDisplay from './FrontMatterDisplay';

// Define the props for the MarkdownViewer component
interface MarkdownViewerProps {
  content: string;
  showFrontMatter?: boolean;
  frontMatterMode?: 'full' | 'minimal' | 'header-only' | 'hidden';
}

const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ 
  content, 
  showFrontMatter = true, 
  frontMatterMode = 'full' 
}) => {
  // Get current theme from context
  const { theme } = useContext(ThemeContext);

  // Parse front matter from content
  const { frontMatter, content: markdownContent } = parseFrontMatter(content);

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);
  
  return (
    <div className="markdown-viewer">
      {/* Display front matter if present and enabled */}
      {showFrontMatter && frontMatter && frontMatterMode !== 'hidden' && (
        <FrontMatterDisplay 
          frontMatter={frontMatter} 
          mode={frontMatterMode}
        />
      )}
      
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                // Use light theme for light mode, dark theme for dark mode
                style={(theme === "light" ? oneLight : tomorrow) as any}
                language={match[1]}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          }
        }}
      >
        {markdownContent}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownViewer;
