import React, { useState } from 'react';
import { useRoutes } from 'react-router-dom';
import router from './router/index';
import './App.css';
import GitHubIcon from '@material-ui/icons/GitHub';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider, createTheme, makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import ThemeSwitch from './components/OmsSwitch/ThemeSwitch'; // 4.x.x 版本
// import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'; // 5.x.x 版本

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    githubIconBox: {
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
    type: 'light',
    grey: {
      A100: '#f5f5f5', // BodyBox
      A200: '#d7d7d7', // Navigation
      A700: '#ffffff' // Select
    }
  }
});

const themeDark = createTheme({
  palette: {
    type: 'dark',
    grey: {
      A100: '#757575',
      A200: '#393d49'
    },
    text: {
      primary: '#ffffff'
    }
  }
});


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
        {useRoutes(router)}
        <div
          className={classes.githubIconBox}
        >
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
