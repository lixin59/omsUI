import React, { useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import Editor from '@monaco-editor/react';
import { TransitionProps } from '@mui/material/transitions';
import Slide from '@mui/material/Slide';

type tProps = {
  open: boolean;
  fileName: string;
  defaultValue: string;
  language: string;
  darkMode: boolean;
  onClose: () => void;
  onSave: (value: string) => void;
};

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function FullScreenEditorDialog({ open, fileName, language, darkMode, defaultValue, onClose, onSave }: tProps) {
  const [value, setValue] = React.useState(defaultValue);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const handleClose = () => {
    onClose();
  };

  const handleSave = () => {
    onSave(value);
    handleClose();
  };

  function handleEditorChange(value, event) {
    setValue(value);
  }

  return (
    <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
      <AppBar sx={{ position: 'relative' }} enableColorOnDark color="secondary">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            {fileName || '未知文件'}
          </Typography>
          <Button autoFocus color="inherit" variant="outlined" onClick={handleSave}>
            保存
          </Button>
        </Toolbar>
      </AppBar>
      <Editor language={language} value={value} theme={darkMode ? 'vs-dark' : 'light'} onChange={handleEditorChange} />
    </Dialog>
  );
}

export default FullScreenEditorDialog;
