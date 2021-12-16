import React, { useEffect } from 'react';
import BodyBox from '../../components/Bodybox';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow, darcula, vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const sty = vscDarkPlus;

// a11yDark 比较好看
// darcula webstorm
// vscDarkPlus vscode暗色主题


const markdown = `
## Here is some TypeScript code:
~~~ts
export function getFileType(filePath: any): string {
  if (typeof filePath !== 'string') {
    return '';
  }
  const startIndex = filePath.lastIndexOf('.');
  if (startIndex !== -1) { return filePath.substring(startIndex + 1, filePath.length).toLowerCase(); } else return '';
}
~~~
## Here is some css code:
~~~css
div {
  flex: 0 1 150px;
  text-align: right;
  min-width: 200px;
  padding: 2px 8px;
  z-index: 20;
  overflow: hidden;
  font-size: 14px;
  box-sizing: border-box;
  white-space: nowrap;
}
~~~
`;

const csst = `
body {
   margin: 0;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
`;

export default function About() {
  useEffect(() => {
  }, []);

  return (
    <BodyBox>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', marginTop: '40px' }}>
        <div style={{ fontSize: '40px' }}>😉开源不易,如果喜欢我们的项目💗，请到GitHub上点个⭐</div>
      </div>
      <div style={{ width: '80%', margin: '0 auto' }}>
        <ReactMarkdown
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <SyntaxHighlighter
                  showLineNumbers={true}
                  lineNumberStyle={{ color: '#ddd', fontSize: 10 }}
                  style={sty}
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
          {markdown}
        </ReactMarkdown>
        <SyntaxHighlighter
          showLineNumbers={true}
          lineNumberStyle={{ color: '#ddd', fontSize: 10 }}
          style={sty}
          language={'css'}
          PreTag='div'
        >
          {String(csst).replace(/\n$/, '')}
        </SyntaxHighlighter>
      </div>
    </BodyBox>
  );
}
