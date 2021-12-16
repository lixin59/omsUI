import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, coyWithoutShadows, darcula } from 'react-syntax-highlighter/dist/esm/styles/prism';

// darcula webstorm
// vscDarkPlus vscode暗色主题

type tProps = {
  textContent: string
  darkMode?: boolean;
}

const them = {
  dark: vscDarkPlus,
  light: coyWithoutShadows
};

const OmsViewMarkdown = (props: tProps) => {
  const { textContent, darkMode } = props;
  if (typeof darkMode === 'undefined') {
    them.light = darcula;
  }
  if (typeof darkMode === 'boolean') {
    them.light = coyWithoutShadows;
  }
  return (
    <ReactMarkdown
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          return !inline && match ? (
            <SyntaxHighlighter
              showLineNumbers={true}
              style={darkMode ? them.dark : them.light}
              language={match[1]}
              PreTag='div'
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
      {textContent}
    </ReactMarkdown>
  );
};

export default OmsViewMarkdown;
