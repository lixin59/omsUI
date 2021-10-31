import React, { ReactNode } from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';

type tProps = {
  open: boolean,
  title: string,
  content: ReactNode,
  toClose: () => any,
  todo?: () => any
}

export default function FormDialog({ open = false, title, content, toClose, todo }: tProps) {

  const closeDialog = () => {
    if (toClose) {
      toClose();
    }
  };

  const determine = () => {
    if (todo) {
      todo();
    }
    toClose();
  };

  return (
    <Dialog open={open} onClose={closeDialog} aria-labelledby='form-dialog'>
      <DialogTitle id='form-dialog'>{title}</DialogTitle>
      <DialogContent>
        {content || null}
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog} color='primary'>
          取消
        </Button>
        <Button onClick={determine} color='primary'>
          确认
        </Button>
      </DialogActions>
    </Dialog>
  );
}
