import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { IState } from '../store/interface';
import actions from '../store/action';
import Typography from '@mui/material/Typography';
import { ActionCreator } from 'redux';

const Version = ({
  appVersion,
  initAppVersion,
  variant,
  text
}: {
  appVersion: string;
  initAppVersion: ActionCreator<any>;
  variant?:
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'subtitle1'
    | 'subtitle2'
    | 'body1'
    | 'body2'
    | 'caption'
    | 'button'
    | 'overline';
  text?: string;
}) => {
  useEffect(() => {
    initAppVersion();
  }, []);
  return <Typography variant={variant}>{`${text || ''}${appVersion}`}</Typography>;
};

export default connect(
  (state: IState, props) => ({
    ...props,
    appVersion: state.appVersion
  }),
  {
    initAppVersion: actions.initAppVersion
  }
)(Version);
