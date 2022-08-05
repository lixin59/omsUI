import * as React from 'react';
import TextField from '@mui/material/TextField';
import { TextFieldProps } from '@mui/material/TextField/TextField';

export default function OmsTextField(props: TextFieldProps) {
  return <TextField variant="outlined" size="small" {...props} />;
}
