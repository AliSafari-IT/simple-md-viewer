import React, { useContext, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { default as tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism/tomorrow";
import { default as oneLight } from "react-syntax-highlighter/dist/esm/styles/prism/one-light";
import { ThemeContext } from '../App';

// Define the props for the MarkdownViewer component
interface MarkdownViewerProps {
  content: string;
}

const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ content }) => {
  // Get current theme from context
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);
  
  return (
    <div className="markdown-viewer">
      <ReactMarkdown
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
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownViewer;
