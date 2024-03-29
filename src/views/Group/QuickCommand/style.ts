import { Styles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles';

const styles: Styles<any, {}> = (theme: Theme) => ({
  root: {
    flexGrow: 1,
    // backgroundColor: theme.palette.background.paper,
    display: 'flex',
    height: '100%',
    width: '100%',
    indicator: {
      '& > span': {
        maxWidth: 40,
        width: '100%',
        backgroundColor: '#4bce21'
      }
    }
  },
  itemPage: {
    width: '100%',
    height: '100%'
  },
  ControlBox: {
    marginBottom: '20px',
    width: '100%'
    // display: 'flex',
    // alignContent: 'space-evenly',
    // alignItems: 'center',
    // justifyContent: 'space-between'
  },
  Button: {
    marginRight: '20px'
  },
  Control: {
    width: '15%'
  },
  shellBox: {
    width: '100%',
    height: '90%'
  },
  TabPanel: {
    height: '100%',
    width: '100%'
  },
  tabs: {
    width: '240px',
    borderRight: `1px solid ${theme.palette.divider}`
  },
  rootTable: {
    width: '100%',
    height: '100%'
  },
  container: {
    // maxHeight: 440,
    height: '92%'
  },
  deleteButton: {
    marginRight: '14px',
    backgroundColor: theme.palette.error[theme.palette.type],
    '&:hover': {
      backgroundColor: theme.palette.error.main
    }
  },
  editBtn: {
    marginRight: '14px',
    backgroundColor: theme.palette.warning[theme.palette.type],
    '&:hover': {
      backgroundColor: theme.palette.warning.main
    }
  },
  starBtn: {
    marginRight: '14px',
    backgroundColor: theme.palette.primary[theme.palette.type],
    '&:hover': {
      backgroundColor: theme.palette.primary.main
    }
  },
  reStarBtn: {
    marginRight: '14px',
    backgroundColor: theme.palette.info[theme.palette.type],
    '&:hover': {
      backgroundColor: theme.palette.info.main
    }
  },
  stopBtn: {
    marginRight: '14px',
    backgroundColor: theme.palette.secondary[theme.palette.type],
    '&:hover': {
      backgroundColor: theme.palette.secondary.main
    }
  },
  addButton: {
    backgroundColor: theme.palette.success[theme.palette.type],
    '&:hover': {
      backgroundColor: theme.palette.success.main
    }
  }
});

export default styles;
