import React from 'react';
import BodyBox from '../../components/Bodybox';
import Button from '@material-ui/core/Button';
import { useSnackbar } from 'notistack';
export default function Group() {
  const { enqueueSnackbar } = useSnackbar();
  const handleClick = () => {
    enqueueSnackbar('I love hooks', {
      variant: 'success',
      autoHideDuration: 3000,
    });
    enqueueSnackbar('I love hooks', {
      autoHideDuration: 1000,
      variant: 'warning',
    });
    enqueueSnackbar('I love hooks', {
      autoHideDuration: 300,
      variant: 'info',
    });
    enqueueSnackbar('I love hooks', {
      variant: 'error',
    });
  };
  return (
    <BodyBox>
      <Button onClick={handleClick}>Show snackbar</Button>
    </BodyBox>
  );
}
