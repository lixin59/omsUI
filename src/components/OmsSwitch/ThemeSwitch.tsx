import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import styles from './style';

type tProps = {
  checked: boolean;
  onChange?: () => any;
}

export default function ThemeSwitch({ checked = false, onChange, ...props }: tProps) {
  const classes = makeStyles(styles)();

  const changeChecked = () => {
    if (onChange) {
      onChange();
    }
  };

  return (
    <div className={classes.switchBox}>
      <div className={classes.switchIconMoon}></div>
      <div className={classes.switchIconSun}></div>
      <div className={checked ? classes.switchChecked : classes.switchNoChecked} onClick={changeChecked}></div>
    </div>
  );
}
