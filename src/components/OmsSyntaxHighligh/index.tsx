import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, coyWithoutShadows, darcula } from 'react-syntax-highlighter/dist/esm/styles/prism';

type tProps = {
  textContent: string;
  language: string;
  darkMode?: boolean;
}

const them = {
  dark: vscDarkPlus,
  light: coyWithoutShadows
};

const OmsSyntaxHighlight = (props: tProps) => {
  const { textContent, darkMode, language = 'txt' } = props;
  if (typeof darkMode === 'undefined') {
    them.light = darcula;
  }
  if (typeof darkMode === 'boolean') {
    them.light = coyWithoutShadows;
  }
  return (
    <SyntaxHighlighter
      showLineNumbers={true}
      lineNumberStyle={{ color: '#ddd', fontSize: 10 }}
      style={darkMode ? them.dark : them.light}
      language={language}
      PreTag='div'
    >
      {String(textContent).replace(/\n$/, '')}
    </SyntaxHighlighter>
  );
};

export default OmsSyntaxHighlight;
