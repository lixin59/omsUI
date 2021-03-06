import React from 'react';
import { makeStyles, createStyles, withStyles, Theme } from '@material-ui/core/styles';
import LinearProgress, { LinearProgressProps } from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

const BorderLinearProgress = withStyles((theme: Theme) =>
  createStyles({
    root: {
      height: 10,
      borderRadius: 5
    },
    colorPrimary: {
      backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700]
    },
    bar: {
      borderRadius: 5,
      // backgroundColor: '#1a90ff'
      backgroundImage: 'linear-gradient(90deg,#0fbcf9,#34e7e4)'
    }
  })
)(LinearProgress);

type tProps = {
  value: number;
  dest?: string;
  total?: string;
  file?: string;
  speed?: string;
  status?: 'running' | 'done' | 'failed' | string;
};

const useStyles = makeStyles({
  root: {
    width: '100%',
    maxWidth: '1200px',
    marginTop: '20px',
    marginBottom: '20px',
    padding: '10px',
    // border: '1px solid #000'
  }
});

function LinearProgressWithLabel(props: LinearProgressProps & tProps) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div>
        <Box display="flex" justifyContent="space-around" alignItems="center">
          {props.dest && (
            <Box minWidth={35}>
              <Typography variant="body2" color="textSecondary">
                {props.dest}
              </Typography>
            </Box>
          )}
          {props.file && (
            <Box minWidth={35}>
              <Typography variant="body2" color="textSecondary">
                {props.file}
              </Typography>
            </Box>
          )}
          {props.total && (
            <Box minWidth={35}>
              <Typography variant="body2" color="textSecondary">
                {props.total}
              </Typography>
            </Box>
          )}
          {props.speed && (
            <Box minWidth={35}>
              <Typography variant="body2" color="textSecondary">
                {props.speed}
              </Typography>
            </Box>
          )}
          {props.status && (
            <Box minWidth={35}>
              <Typography variant="body2" color="textSecondary">
                {props.status}
              </Typography>
            </Box>
          )}
        </Box>
      </div>
      <Box display="flex" alignItems="center">
        <Box width="100%" mr={1}>
          <BorderLinearProgress variant="determinate" {...props} />
        </Box>
        <Box minWidth={35}>
          <Typography variant="body2" color="textSecondary">{`${Math.round(props.value)}%`}</Typography>
        </Box>
      </Box>
    </div>
  );
}

export default LinearProgressWithLabel;
