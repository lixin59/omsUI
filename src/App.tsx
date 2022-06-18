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
import { ThemeProvider, makeStyles, createStyles } from '@material-ui/core/styles'; // 4.x.x 版本
// import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'; // 5.x.x 版本
import { themeLight, themeDark } from './theming';

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
