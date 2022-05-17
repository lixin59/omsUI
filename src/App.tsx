import React, { useState } from 'react';
import { useRoutes } from 'react-router-dom';
import router from './router/index';
import './App.css';
import GitHubIcon from '@material-ui/icons/GitHub';
// import IconButton from '@material-ui/core/IconButton';
// import CloseIcon from '@material-ui/icons/Close';
// import Button from '@material-ui/core/Button';
// import SnackMessage from './components/Snackbars/SnackMessage';
// import { SnackbarKey, SnackbarProvider } from 'notistack';
import OmsSnackbar from './components/Snackbars';
import CssBaseline from '@material-ui/core/CssBaseline';
import ThemeSwitch from './components/OmsSwitch/ThemeSwitchInput';
import { ThemeProvider, createTheme, makeStyles, createStyles } from '@material-ui/core/styles'; // 4.x.x 版本
// import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'; // 5.x.x 版本

declare module '@material-ui/core/styles/createPalette' {
  interface Palette {
    loading: Palette['primary'];
    snacbar: Palette['primary'];
    tag: Palette['primary'];
    tab: Palette['primary'];
    boxShadowInset: Palette['primary'];
  }
  interface PaletteOptions {
    loading: PaletteOptions['primary'];
    snacbar: PaletteOptions['primary'];
    tag: PaletteOptions['primary'];
    tab: PaletteOptions['primary'];
    boxShadowInset: PaletteOptions['primary'];
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
      }
    }
  })
);

const themeLight = createTheme({
  palette: {
    background: {
      paper: '#fdfdfd'
    },
    boxShadowInset: {
      main: '#ccc'
    },
    type: 'light',
    grey: {
      A100: '#f5f5f5', // BodyBox
      A200: '#d5d5d5', // Navigation
      A700: '#ffffff' // omsSelect
    },
    loading: {
      main: '#0ba8a8'
    },
    primary: {
      main: '#4caf50'
    },
    snacbar: {
      light: '#b5f3b5',
      dark: 'rgba(181, 243, 181, 0.1)',
      main: 'rgba(172, 241, 241, 0.25)'
      // main: '#acf1f1'
    },
    tab: {
      main: '#F5F5F5'
    },
    tag: {
      light: '#99CC99',
      main: '#66CCCC'
    }
  }
});

const themeDark = createTheme({
  palette: {
    boxShadowInset: {
      main: '#040404'
    },
    type: 'dark',
    grey: {
      A100: '#2b2b2b',
      A200: '#3c3f41',
      A700: '#31343d' // omsSelect
    },
    loading: {
      main: '#74ffff'
    },
    primary: {
      main: '#5fb878'
    },
    snacbar: {
      light: '#659d4d',
      dark: 'rgba(101,157,77,0.25)',
      main: 'rgba(0,153,153,0.25)'
      // main: '#009999',
    },
    tab: {
      main: '#2a2a2a'
    },
    tag: {
      light: '#74b95c',
      main: '#009999'
    },
    text: {
      primary: '#ffffff'
    }
  }
});

const OmsRouter = () => {
  return <>{useRoutes(router)}</>;
};

function App() {
  const classes = useStyles();

  const [light, setLight] = useState(true);

  const openGithub = () => {
    window.open('https://github.com/lixin59/omsUI');
  };

  return (
    <div className="App">
      <ThemeProvider theme={light ? themeLight : themeDark}>
        <CssBaseline />
        <OmsSnackbar>
          <OmsRouter />
        </OmsSnackbar>
        <div className={classes.githubIconBox}>
          <GitHubIcon onClick={openGithub} />
          <ThemeSwitch checked={light} onChange={() => setLight((prev) => !prev)} />
        </div>
      </ThemeProvider>
    </div>
  );
}

export default App;
