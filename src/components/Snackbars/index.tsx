import React, { ReactElement, RefObject } from 'react';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { SnackbarKey, SnackbarProvider, SnackbarProviderProps } from 'notistack';

const notistackRef: RefObject<any> = React.createRef();
const onClickDismiss = (key: SnackbarKey) => () => {
  notistackRef.current.closeSnackbar(key);
};

type tProps = SnackbarProviderProps;

function OmsSnackbar({ children }: tProps) {
  return (
    <SnackbarProvider
      ref={notistackRef}
      action={(key) => (
        <IconButton size="small" onClick={onClickDismiss(key)}>
          ️<CloseIcon fontSize="small" />
        </IconButton>
      )}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
      maxSnack={4}
      iconVariant={{
        success: '✅',
        error: '🚫',
        warning: '⚠️',
        info: 'ℹ️'
      }}>
      {children}
    </SnackbarProvider>
  );
}

export default OmsSnackbar;
