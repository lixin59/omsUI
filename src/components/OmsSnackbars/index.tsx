import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import { makeStyles, Theme } from '@material-ui/core/styles';

type tProps = {
  open: boolean;
  setOpen: any;
  type: 'error' | 'warning' | 'info' | 'success';
  message: string;
  autoHideDuration?: number;
};

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    'width': '100%',
    'maxWidth': 600,
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function OmsSnackbars(props: tProps) {
  const { open, setOpen, type = 'info', message = '', autoHideDuration = 3000 } = props;
  const classes = useStyles();

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }} open={open} autoHideDuration={autoHideDuration} onClose={handleClose}>
        <Alert onClose={handleClose} severity={type}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}
