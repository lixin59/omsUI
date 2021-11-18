import React from 'react';
import Dialog from '@material-ui/core/Dialog';
// import DialogTitle from '@material-ui/core/DialogTitle';
// import DialogContent from '@material-ui/core/DialogContent';
// import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';

type tProps = {
  open: boolean,
  text: string,
  title: string,
  toClose: () => any,
}

export default function LogDialog({ open = false, title, text = '', toClose }: tProps) {

  // const [isOpen, setIsOpen] = useState<boolean>(open);

  const closeDialog = () => {
    if (toClose) {
      toClose();
    }
    // setIsOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={closeDialog}
      fullWidth
      maxWidth='md'
    >
      <DialogTitle style={{ backgroundColor: '#ffe2c0' }}>{title}</DialogTitle>
      <div style={{ whiteSpace: 'pre-line', wordWrap: 'break-word', wordBreak: 'break-all' }}>
        {text}
      </div>
      <DialogActions>
        <Button onClick={closeDialog} style={{ backgroundColor: '#ec5353' }}>
          确定
        </Button>
      </DialogActions>
    </Dialog>
  );
}
