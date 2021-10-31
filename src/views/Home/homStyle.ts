import { Styles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles';

const homeStyle: Styles<any, {}> = (theme: Theme) => ({
  home: {
    width: '90%',
    margin: '0 auto',
    paddingTop: '20px',
    paddingBottom: '20px',
    // height: '100%',
    // overflow: 'scroll',
    // display: 'flex',
    display: 'grid',
    // flexFlow: 'row wrap',
    alignContent: 'space-evenly',
    alignItems: 'center',
    justifyContent: 'space-between',
    justifyItems: 'center',
    gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
    gridGap: '20px 20px',
  },
  FabButton: {
    position: 'fixed',
    bottom: '10vh',
    right: '1vw',
    zIndex: 999,
    margin: theme.spacing(1),
  },
  Select: {
    width: '100%',
  },
});

export default homeStyle;
