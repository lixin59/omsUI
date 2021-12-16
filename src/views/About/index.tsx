import React, { useEffect } from 'react';
import BodyBox from '../../components/Bodybox';
import OmsViewMarkdown from '../../components/OmsViewMarkdown';
import OmsSyntaxHighlight from '../../components/OmsSyntaxHighligh';

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
        <OmsViewMarkdown textContent={markdown}/>
        <OmsSyntaxHighlight textContent={csst} language={'css'} darkMode/>
      </div>
    </BodyBox>
  );
}
