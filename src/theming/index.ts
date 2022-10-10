import { createTheme } from '@material-ui/core/styles'; // 4.x.x 版本
import { createTheme as createThemeV5 } from '@mui/material/styles'; // 5.x.x 版本
declare module '@mui/material/styles' {
  interface Theme {
    status: {
      danger: string;
    };
  }
  // 允许配置文件使用 `createTheme`
  interface ThemeOptions {
    status?: {
      danger?: string;
    };
  }
  interface Palette {
    loading: Palette['primary'];
    snacbar: Palette['primary'];
    tag: Palette['primary'];
    tab: Palette['primary'];
    type: 'light' | 'dark';
    boxShadowInset: Palette['primary'];
  }
  interface PaletteOptions {
    loading: PaletteOptions['primary'];
    snacbar: PaletteOptions['primary'];
    tag: PaletteOptions['primary'];
    tab: PaletteOptions['primary'];
    type: 'light' | 'dark';
    boxShadowInset: PaletteOptions['primary'];
  }
}

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

export const themeLight = createTheme({
  palette: {
    background: {
      paper: '#fdfdfd'
    },
    boxShadowInset: {
      main: '#ccc'
    },
    type: 'light',
    grey: {
      50: '#fefefe',
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
    secondary: {
      main: '#0ba8a8'
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

export const themeDark = createTheme({
  palette: {
    boxShadowInset: {
      main: '#040404'
    },
    type: 'dark',
    grey: {
      50: '#373738',
      200: '#212121',
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
    secondary: {
      main: '#74ffff'
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

export const themeLightV5 = createThemeV5(themeLight);
export const themeDarkV5 = createThemeV5(themeDark);
