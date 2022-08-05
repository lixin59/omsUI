import * as React from 'react';
import TextField from '../OmsTextField/index';
import { WidgetProps } from '@rjsf/core';

export default function TextWidget(props: WidgetProps) {
  const { id, options, label, placeholder, value, required, disabled, autofocus, onChange, onBlur, onFocus } = props;
  const _onChange = ({ target: { value } }) => {
    return onChange(value === '' ? options.emptyValue : value);
  };
  return (
    <TextField
      id={id}
      label={label}
      variant="outlined"
      value={value ? value : ''}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      autoFocus={autofocus}
      onBlur={onBlur && ((event) => onBlur(id, event.target.value))}
      onFocus={onFocus && ((event) => onFocus(id, event.target.value))}
      onChange={_onChange}
    />
  );
}
