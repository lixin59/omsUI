import * as React from 'react';
import TextField from '../OmsTextField/index';
import { WidgetProps } from '@rjsf/core';

function getValue(value: any, defaultValue: any): any {
  if (typeof value === 'undefined' && typeof defaultValue === 'undefined') {
    return '';
  }
  if (typeof value !== 'undefined' && typeof defaultValue === 'undefined') {
    return value;
  }
  if (typeof value === 'undefined' && typeof defaultValue !== 'undefined') {
    return defaultValue;
  }
  if (typeof value !== 'undefined' && typeof defaultValue !== 'undefined') {
    return value;
  }
  return value;
}

export default function TextWidget(props: WidgetProps) {
  const { id, options, label, placeholder, value, required, schema, disabled, autofocus, onChange, onBlur, onFocus } =
    props;
  const _onChange = ({ target: { value } }) => {
    return onChange(value === '' ? (options.emptyValue ? options.emptyValue : value) : value);
  };

  return (
    <TextField
      style={{ width: '100%' }}
      id={id}
      label={label}
      variant="outlined"
      value={getValue(value, schema.default)}
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
