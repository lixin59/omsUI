import React, { useState, forwardRef, useCallback, useEffect } from 'react';
import classnames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import { useSnackbar, SnackbarContent } from 'notistack';
import Collapse from '@material-ui/core/Collapse';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import LinearProgressWithLabel from '../UploadFileProgress/Linear';
import { HTTPResult, uploadFileApi } from '../../api/http/httpRequestApi';

const useStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.up('sm')]: {
      minWidth: '344px !important'
    }
  },
  card: {
    background: '#edffed',
    width: '100%'
  },
  typography: {
    fontWeight: 'bold'
  },
  actionRoot: {
    padding: '8px 8px 8px 16px',
    justifyContent: 'space-between'
  },
  icons: {
    marginLeft: 'auto'
  },
  expand: {
    padding: '8px 8px',
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: 'rotate(180deg)'
  },
  collapse: {
    padding: 16
  },
  checkIcon: {
    fontSize: 20,
    color: '#b3b3b3',
    paddingRight: 4
  },
  button: {
    padding: 0,
    textTransform: 'none'
  }
}));

const SnackMessage = forwardRef<
  HTMLDivElement,
  { id: string | number; message: string | React.ReactNode; total: any[]; data?: any; cb?: any }
>((props, ref) => {
  const { id, message, total, data, cb } = props;

  const classes = useStyles();
  const { closeSnackbar } = useSnackbar();
  const [expanded, setExpanded] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleExpandClick = useCallback(() => {
    setExpanded((oldExpanded) => !oldExpanded);
  }, []);

  const handleDismiss = useCallback(() => {
    closeSnackbar(id);
  }, [id, closeSnackbar]);

  function onUploadProgress(progressEvent) {
    const progressdata = ((progressEvent.loaded / progressEvent.total) * 100) | 0;
    setProgress(progressdata);
    // console.log(progressEvent);
  }

  async function todo() {
    // console.log('上传文件');
    const res = (await uploadFileApi(data, { onUploadProgress })) as HTTPResult;
    console.log(res);
    if (cb) {
      cb();
    }
  }

  useEffect(() => {
    // console.log('useEffect');
    if (data) {
      todo();
    }
  }, [data]);

  return (
    <SnackbarContent ref={ref} className={classes.root}>
      <Card className={classes.card}>
        <CardActions classes={{ root: classes.actionRoot }}>
          <Typography variant="subtitle2" className={classes.typography}>
            {progress === 100 ? `${message}上传成功` : `${message}正在上传`}
          </Typography>
          <div className={classes.icons}>
            <IconButton
              aria-label="Show more"
              className={classnames(classes.expand, { [classes.expandOpen]: expanded })}
              onClick={handleExpandClick}>
              <ExpandMoreIcon />
            </IconButton>
            <IconButton className={classes.expand} onClick={handleDismiss}>
              <CloseIcon />
            </IconButton>
          </div>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Paper className={classes.collapse}>
            <LinearProgressWithLabel value={progress} total={String(total)} />
          </Paper>
        </Collapse>
      </Card>
    </SnackbarContent>
  );
});

SnackMessage.displayName = 'SnackMessage';

export default SnackMessage;
