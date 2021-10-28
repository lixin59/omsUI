import React, { RefObject } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { SnackbarKey, SnackbarProvider } from 'notistack';
import Button from '@material-ui/core/Button';
import App from './App';

const notistackRef: RefObject<any> = React.createRef();
const onClickDismiss = (key: SnackbarKey) => () => {
  notistackRef.current.closeSnackbar(key);
};

ReactDOM.render(
    <React.StrictMode>
      <SnackbarProvider
        ref={notistackRef}
        action={(key) => (
          <Button onClick={onClickDismiss(key)}>
            ✖️
          </Button>
        )}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        maxSnack={4}
        iconVariant={{
          success: '✅',
          error: '🚫',
          warning: '⚠️',
          info: 'ℹ️',
        }}>
        <App />
      </SnackbarProvider>
    </React.StrictMode>,
    document.getElementById('root'),
);
