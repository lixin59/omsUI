import * as React from 'react';
import TextField from '@mui/material/TextField';
import { WidgetProps } from '@rjsf/core';

export default function TextareaWidget(props: WidgetProps) {
  const { id, options, label, placeholder, value, required, disabled, autofocus, onChange, onBlur, onFocus } = props;
  const _onChange = ({ target: { value }}) => {
    return onChange(value === '' ? options.emptyValue : value);
  };
  return (
    <TextField
      style={{ width: '100%' }}
      id={id}
      label={label}
      multiline
      variant="outlined"
      value={value ? value : ''}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      autoFocus={autofocus}
      rows={4}
      onBlur={onBlur && ((event) => onBlur(id, event.target.value))}
      onFocus={onFocus && ((event) => onFocus(id, event.target.value))}
      onChange={_onChange}
    />
  );
}
