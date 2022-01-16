import { Styles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles';
import moon from '../../assets/icons/moon.png';
import sun from '../../assets/icons/sun.png';

const styles: Styles<any, {}> = (theme: Theme) => ({
  switchBox: {
    cursor: 'pointer',
    width: '48px',
    height: '24px',
    borderRadius: '12px',
    border: '1px solid #000',
    backgroundColor: theme.palette.grey.A100,
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between'
  },
  switchBox1: {
    position: 'relative',
    width: '48px',
    height: '26px',
    padding: '0px',
    margin: '0px',
    borderRadius: '12px'
  },
  switchIconLeft: {
    position: 'absolute',
    left: '0px',
    width: '50%',
    height: '100%',
    backgroundImage: `url(${moon})`,
    backgroundSize: '100%',
    backgroundRepeat: 'no-repeat',
    zIndex: 1
  },
  switchIconRight: {
    position: 'absolute',
    right: '0px',
    width: '50%',
    height: '100%',
    backgroundImage: `url(${sun})`,
    backgroundSize: '100%',
    backgroundRepeat: 'no-repeat',
    zIndex: 1
  },
  switchIconMoon: {
    width: '50%',
    height: '100%',
    backgroundImage: `url(${moon})`,
    backgroundSize: '100%'
  },
  switchIconSun: {
    width: '50%',
    height: '100%',
    backgroundImage: `url(${sun})`,
    backgroundSize: '100%'
  },
  switchChecked: {
    cursor: 'pointer',
    width: '50%',
    height: '100%',
    backgroundColor: theme.palette.grey['300'],
    border: '1px solid #000',
    '&:hover': {
      boxShadow: '0px 0px 2px 3px #119c0f'
    },
    borderRadius: '50%',
    position: 'absolute',
    top: '0px',
    left: '-2px',
    zIndex: 999,
    animation: '$toLeft 0.2s linear 1'
  },
  switchNoChecked: {
    cursor: 'pointer',
    width: '50%',
    height: '100%',
    backgroundColor: theme.palette.grey['50'],
    border: '1px solid #000',
    '&:hover': {
      boxShadow: '0px 0px 2px 3px #26e924'
    },
    borderRadius: '50%',
    position: 'absolute',
    top: '0px',
    left: '24px',
    zIndex: 999,
    animation: '$toRight 0.2s linear 1'
  },
  '@keyframes toLeft': {
    '0%': { left: '24px' },
    '100%': { left: '-2px' }
  },
  '@keyframes toRight': {
    '0%': { left: '-2px' },
    '100%': { left: '24px' }
  }
});

export default styles;
