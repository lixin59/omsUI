import React, { RefObject, useState } from 'react';
import { useRoutes } from 'react-router-dom';
import router from './router/index';
import './App.css';
import GitHubIcon from '@material-ui/icons/GitHub';
import Button from '@material-ui/core/Button';
import { SnackbarKey, SnackbarProvider } from 'notistack';
import CssBaseline from '@material-ui/core/CssBaseline';
import ThemeSwitch from './components/OmsSwitch/ThemeSwitchInput';
import { ThemeProvider, createTheme, makeStyles, createStyles } from '@material-ui/core/styles'; // 4.x.x 版本
// import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'; // 5.x.x 版本

declare module '@material-ui/core/styles/createPalette' {
  interface Palette {
    tag: Palette['primary'];
  }
  interface PaletteOptions {
    tag: PaletteOptions['primary'];
  }
}

const useStyles = makeStyles(() =>
  createStyles({
    githubIconBox: {
      cursor: 'pointer',
      position: 'absolute',
      top: '15px',
      right: '10vw',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      width: '100px',
      '@media (max-width:940px)': {
        display: 'none'
      }}
  })
);

const themeLight = createTheme({
  palette: {
    background: {
      paper: '#fdfdfd'
    },
    type: 'light',
    grey: {
      A100: '#f5f5f5', // BodyBox
      A200: '#d5d5d5', // Navigation
      A700: '#ffffff' // omsSelect
    },
    primary: {
      main: '#4caf50'
    },
    tag: {
      light: '#99CC99',
      main: '#66CCCC'
    }
  }
});

const themeDark = createTheme({
  palette: {
    type: 'dark',
    grey: {
      A100: '#2b2b2b',
      A200: '#3c3f41',
      A700: '#31343d' // omsSelect
    },
    primary: {
      main: '#5fb878'
    },
    tag: {
      main: '#009999'
    },
    text: {
      primary: '#ffffff'
    }
  }
});

const notistackRef: RefObject<any> = React.createRef();
const onClickDismiss = (key: SnackbarKey) => () => {
  notistackRef.current.closeSnackbar(key);
};

const OmsRouter = () => {
  return <>
    {useRoutes(router)}
  </>;
};

function App() {
  const classes = useStyles();

  const [light, setLight] = useState(true);

  const openGithub = () => {
    window.open('https://github.com/lixin59/omsUI');
  };

  return (
    <div className='App'>
      <ThemeProvider theme={light ? themeLight : themeDark}>
        <CssBaseline />
        <SnackbarProvider
          ref={notistackRef}
          action={(key) => (
            <Button onClick={onClickDismiss(key)}>
              ✖️
            </Button>
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
          <OmsRouter/>
        </SnackbarProvider>
        <div className={classes.githubIconBox}>
          <GitHubIcon onClick={openGithub}/>
          <ThemeSwitch
            checked={light}
            onChange={() => setLight((prev) => !prev)}
          />
        </div>
      </ThemeProvider>
    </div>
  );
}

export default App;
