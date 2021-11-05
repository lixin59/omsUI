import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Skeleton from '@mui/material/Skeleton';
import { makeStyles } from '@material-ui/core/styles';
import homeStyle from '../../views/Home/homStyle';

function Media() {

  return (
    <Card sx={{ minWidth: 400, m: 2 }}>
      <CardHeader
        title={
          <Skeleton
            animation='wave'
            height={10}
            width='80%'
            style={{ marginBottom: 6 }}
          />
        }
        subheader={<Skeleton animation='wave' height={10} width='40%' />}
      />
      <Skeleton sx={{ bgcolor: '#b7b7b7', height: 220 }} animation='wave' variant='rectangular' />
    </Card>
  );
}

export default function homeLoading() {
  const classes = makeStyles(homeStyle)();
  return (
    <div className={classes.home}>
      <Media/>
      <Media/>
      <Media/>
      <Media/>
      <Media/>
      <Media/>
    </div>
  );
}
