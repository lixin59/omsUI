import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

type tProps = {
  open: boolean;
  title: string;
  text: string;
  toClose: () => any;
  todo?: () => any;
};

export default function TipDialog({ open = false, title = '', text = '', toClose, todo }: tProps) {
  // const [isOpen, setIsOpen] = useState<boolean>(open);

  const closeDialog = () => {
    if (toClose) {
      toClose();
    }
    // setIsOpen(false);
  };

  const determine = () => {
    if (todo) {
      todo();
    }
    toClose();
    // setIsOpen(false);
  };

  return (
    <Dialog open={open} onClose={closeDialog} aria-labelledby="is-delete-host">
      <DialogTitle style={{ backgroundColor: '#ecad5a' }}>{title}</DialogTitle>
      <DialogContent dividers>
        <DialogContentText>{text}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog} color="primary">
          取消
        </Button>
        <Button onClick={determine} color="primary">
          确定
        </Button>
      </DialogActions>
    </Dialog>
  );
}
