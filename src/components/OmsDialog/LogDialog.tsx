import React, { useEffect, useRef, useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
// import DialogTitle from '@material-ui/core/DialogTitle';
// import DialogContent from '@material-ui/core/DialogContent';
// import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';
import styles from './styles';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import DialogContent from '@material-ui/core/DialogContent';

type tProps = {
  open: boolean;
  text: string;
  title: string;
  toClose: () => any;
};

export default function LogDialog({ open = false, title, text = '', toClose }: tProps) {
  // const [isOpen, setIsOpen] = useState<boolean>(open);
  const classes = makeStyles(styles)();
  const msgRef = useRef<any>(null);
  // const [terminal, setTerminal] = useState<null | Terminal>(null);

  // useEffect(() => {
  //   try {
  //     // const div = msgRef.current as HTMLDivElement;
  //     // if (div) {
  //     //   div.scrollTop = div.scrollHeight;
  //     // }
  //     // msgRef?.current?.scrollToBottom(); // 收到新消息滚动条自动滚到底部
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }, [text, msgRef]);

  useEffect(() => {
    const term = new Terminal();
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);

    const timer = setTimeout(() => {
      fitAddon.fit();
      term.open(document.getElementById('logTerminal') as HTMLElement);
      term.writeln(text);
    }, 60);
    const termResize = () => {
      fitAddon.fit();
    };
    msgRef?.current?.addEventListener('resize', termResize);

    return () => {
      clearTimeout(timer);
      term.dispose();
      msgRef?.current?.removeEventListener('resize', termResize);
    };
  }, [open, msgRef]);

  const closeDialog = () => {
    if (toClose) {
      toClose();
    }
    // setIsOpen(false);
  };

  return (
    <Dialog open={open} onClose={closeDialog} fullWidth maxWidth="md">
      <DialogTitle className={classes.dialogTitle}>{title}</DialogTitle>
      <DialogContent>
        <div id="logTerminal" ref={msgRef} />
      </DialogContent>
      <DialogActions className={classes.dialogActions}>
        <Button onClick={closeDialog} className={classes.dialogActionButton}>
          关闭
        </Button>
      </DialogActions>
    </Dialog>
  );
}
