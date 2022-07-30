import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, coyWithoutShadows, darcula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useSnackbar } from 'notistack';
import IconButton from '@material-ui/core/IconButton';
import CopyAllIcon from '@mui/icons-material/CopyAll';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import Tooltip from '@material-ui/core/Tooltip';

type tProps = {
  textContent: string;
  language: string;
  darkMode?: boolean;
};

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
    <>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
        <Tooltip title="复制内容" placement="left-start">
          <IconButton aria-label="hostCard" color="secondary" size="small" onClick={() => copy(textContent)}>
            <CopyAllIcon />
          </IconButton>
        </Tooltip>
      </div>
      <SyntaxHighlighter
        lineProps={{ style: { wordBreak: 'break-all', whiteSpace: 'pre-wrap' } }}
        showLineNumbers={true}
        lineNumberStyle={{ color: '#ddd', fontSize: 10 }}
        style={darkMode ? them.dark : them.light}
        language={language}
        wrapLines={true}
        PreTag="div">
        {String(textContent).replace(/\n$/, '')}
      </SyntaxHighlighter>
    </>
  );
};

export default OmsSyntaxHighlight;
