import React from 'react';
import Typography from '@material-ui/core/Typography';
import ErrorSvg from '../../assets/icons/Error.svg';
import networkSvg from '../../assets/icons/ErrNetwork.svg';
import serverSvg from '../../assets/icons/ErrServer.svg';
import { Variant } from '@material-ui/core/styles/createTypography';

interface Props {
  errInfo: string,
  errType?: 'default' | 'network' | 'server',
  svgImg?: string,
  variant?: Variant
  imgStyle?: React.CSSProperties,
}

const defSvg = {
  'default': ErrorSvg,
  'network': networkSvg,
  'server': serverSvg
};

const OmsError: React.FC<Props> = ({
  errInfo = '',
  svgImg,
  variant = 'subtitle2',
  errType = 'default',
  imgStyle
}) => {
  const defaultImg = defSvg[errType];
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-around'
    }}>
      <Typography variant={variant} gutterBottom >
        {errInfo}
      </Typography>
      <img style={imgStyle || { width: '80px', height: '80px' }} src={svgImg || defaultImg} alt='' />
    </div>
  );
};

export default OmsError;
