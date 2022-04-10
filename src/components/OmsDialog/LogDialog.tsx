import React, { useEffect, useRef } from 'react';
import Dialog from '@material-ui/core/Dialog';
// import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
// import DialogContentText from '@material-ui/core/DialogContentText';
import { Scrollbars } from 'react-custom-scrollbars';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';
import styles from './styles';

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

  useEffect(() => {
    try {
      // const div = msgRef.current as HTMLDivElement;
      // div.scrollTop = div.scrollHeight;
      msgRef?.current?.scrollToBottom(); // 收到新消息滚动条自动滚到底部
    } catch (e) {
      console.log(e);
    }
  }, [text, msgRef]);

  const closeDialog = () => {
    if (toClose) {
      toClose();
    }
    // setIsOpen(false);
  };

  return (
    <Dialog open={open} onClose={closeDialog} fullWidth maxWidth="md">
      <DialogTitle className={classes.dialogTitle}>{title}</DialogTitle>
      {/* <div style={{ whiteSpace: 'pre-line', wordWrap: 'break-word', wordBreak: 'break-all' }}>*/}
      <div className={classes.dialogContent}>
        <Scrollbars ref={msgRef} className={classes.scrollbars}>
          {text}
        </Scrollbars>
      </div>
      <DialogActions className={classes.dialogActions}>
        <Button onClick={closeDialog} className={classes.dialogActionButton}>
          关闭
        </Button>
      </DialogActions>
    </Dialog>
  );
}
