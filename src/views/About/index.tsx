import React, { useEffect } from 'react';
import BodyBox from '../../components/Bodybox';
import Button from '@material-ui/core/Button';
import { useSnackbar } from 'notistack';
import SnackMessage from "../../components/Snackbars/SnackMessage";

export default function About() {
  useEffect(() => {}, []);
  const { enqueueSnackbar } = useSnackbar();
  const test = () => {
    enqueueSnackbar(`success`, {
      autoHideDuration: 3000,
      variant: 'success',
      content: <SnackMessage />
    });
    enqueueSnackbar(`error`, {
      autoHideDuration: 3000,
      variant: 'error'
    });
    enqueueSnackbar(`warning`, {
      autoHideDuration: 3000,
      variant: 'warning'
    });
    enqueueSnackbar(`info`, {
      autoHideDuration: 3000,
      variant: 'info'
    });
  };

  return (
    <BodyBox>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', marginTop: '40px' }}>
        <div style={{ fontSize: '40px' }}>😉开源不易,如果喜欢我们的项目💗，请到GitHub上点个⭐</div>
        <Button onClick={test}>test</Button>
      </div>
    </BodyBox>
  );
}
