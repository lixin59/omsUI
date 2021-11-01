import React from 'react';
import './OmsLabel.css';
import { createStyles, Theme, withStyles } from '@material-ui/core/styles';
import { InputLabel } from '@material-ui/core';
import { InputLabelProps } from '@material-ui/core/InputLabel/InputLabel';


const OmsLabel = withStyles((theme: Theme) =>
  createStyles({
    root: {
      top: '15%',
      left: '10px',
      color: theme.palette.success.main,
      zIndex: 9999999999999
    },
    focused: {
      color: theme.palette.success.main
    },
    formControl: {
      color: theme.palette.success.main
    }
  })
)((props: InputLabelProps) => <InputLabel id='oms-select-label' {...props} />);

export default OmsLabel;
