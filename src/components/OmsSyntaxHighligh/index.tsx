import React, { ReactNode } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, materialLight, darcula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useSnackbar } from 'notistack';
import IconButton from '@material-ui/core/IconButton';
import FileCopyTwoToneIcon from '@mui/icons-material/FileCopyTwoTone';
import Tooltip from '@material-ui/core/Tooltip';

type tProps = {
  textContent: string | ReactNode;
  language: string;
  darkMode?: boolean;
};

const them = {
  dark: vscDarkPlus,
  light: materialLight
};

const OmsSyntaxHighlight = (props: tProps) => {
  const { textContent, darkMode, language = 'txt' } = props;
  if (typeof darkMode === 'undefined') {
    them.light = darcula;
  }
  if (typeof darkMode === 'boolean') {
    them.light = materialLight;
  }

  const { enqueueSnackbar } = useSnackbar();

  const copy = (content: string) => {
    navigator.clipboard
      .writeText(content)
      .then(
        function () {
          /* clipboard successfully set */
          enqueueSnackbar('复制成功', {
            autoHideDuration: 3000,
            variant: 'success'
          });
        },
        function () {
          /* clipboard write failed */
          enqueueSnackbar(`复制失败`, {
            autoHideDuration: 3000,
            variant: 'error'
          });
        }
      )
      .catch((e) => {
        enqueueSnackbar(`复制失败；${JSON.stringify(e)}`, {
          autoHideDuration: 3000,
          variant: 'error'
        });
      });
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Tooltip
        title="复制内容"
        placement="left-start"
        style={{ position: 'absolute', top: '6px', right: '0px', zIndex: 9999 }}>
        <IconButton aria-label="hostCard" color="secondary" size="small" onClick={() => copy(textContent as string)}>
          <FileCopyTwoToneIcon />
        </IconButton>
      </Tooltip>
      <div style={{ width: '100%' }}>
        <SyntaxHighlighter
          lineProps={{ style: { wordBreak: 'break-all', whiteSpace: 'pre-wrap' } }}
          showLineNumbers={true}
          lineNumberStyle={{ color: '#ddd', fontSize: 10 }}
          style={darkMode ? them.dark : them.light}
          language={language}
          wrapLines={true}
          wrapLongLines={true}
          PreTag="div">
          {String(textContent).replace(/\n$/, '')}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default OmsSyntaxHighlight;
