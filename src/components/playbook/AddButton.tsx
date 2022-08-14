import React from 'react';
import { AddButtonProps } from '@rjsf/core';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';

const AddButton: React.FC<AddButtonProps> = (props) => {
  return (
    <Button {...props} color="primary">
      <AddIcon /> Add Item
    </Button>
  );
};

export default AddButton;
