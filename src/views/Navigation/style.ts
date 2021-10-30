import { Styles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles';

const styles: Styles<any, {}> = (theme: Theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.grey.A200,
  },
  navItem: {
    color: theme.palette.text.secondary,
  },
});

export default styles;
