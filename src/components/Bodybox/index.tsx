import React, { ReactNode } from 'react';
import { makeStyles } from '@material-ui/core/styles';

type tProps = {
    children?: ReactNode
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: '100%',
    overflowY: 'scroll',
    backgroundColor: theme.palette.grey.A100,
  },
}));

export default function BodyBox(props: tProps) {
  const { children } = props;
  const classes = useStyles();
  return (
    <div className={classes.root}>
      {children}
    </div>
  );
}
