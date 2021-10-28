import { Styles } from '@material-ui/styles';

const homeStyle: Styles<any, {}> = {
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
};

export default homeStyle;
