import React from 'react';
import ReactMarkdown from 'react-markdown';
import OmsSyntaxHighlight from '../OmsSyntaxHighligh/index';

// darcula webstorm
// vscDarkPlus vscode暗色主题

type tProps = {
  textContent: string;
  darkMode?: boolean;
};

const OmsViewMarkdown = (props: tProps) => {
  const { textContent, darkMode } = props;

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactMarkdown
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <OmsSyntaxHighlight textContent={children} language={match[1]} darkMode={darkMode} />
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          }
        }}>
        {textContent}
      </ReactMarkdown>
    </div>
  );
};

export default OmsViewMarkdown;
