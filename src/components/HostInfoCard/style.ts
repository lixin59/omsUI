import { Styles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles';
const styles: Styles<any, {}> = (theme: Theme) => ({
  HostInfoCard: {
    width: '400px',
    minWidth: 275
  },
  listItem: {
    padding: 0,
    paddingLeft: '40px'
  },
  listItemText: {
    width: '4%'
  },
  title: {
    height: '40px',
    lineHeight: '30px',
    fontSize: 14,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  vncButton: {
    width: '40px',
    height: '26px',
    backgroundColor: theme.palette.primary[theme.palette.type],
    '&:hover': {
      backgroundColor: theme.palette.primary.main
    }
  },
  commandButton: {
    width: '40px',
    height: '26px',
    backgroundColor: theme.palette.warning[theme.palette.type],
    '&:hover': {
      backgroundColor: theme.palette.warning.main
    }
  },
  editButton: {
    width: '40px',
    height: '26px',
    backgroundColor: theme.palette.info[theme.palette.type],
    '&:hover': {
      backgroundColor: theme.palette.info.main
    }
  },
  deleteButton: {
    width: '40px',
    height: '26px',
    backgroundColor: theme.palette.error[theme.palette.type],
    '&:hover': {
      backgroundColor: theme.palette.error.main
    }
  },
  Select: {
    width: '100%'
  },
  tag: {
    marginRight: '4px',
    backgroundColor: theme.palette.tag.main
  }
});

export default styles;
