import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import styles from './style';

type tProps = {
  checked: boolean;
  onChange?: () => any;
}

export default function ThemeSwitch({ checked = false, onChange, ...props }: tProps) {
  const classes = makeStyles(styles)();
  const [isChecked, setIsChecked] = useState(checked);

  const changeChecked = () => {
    if (onChange) {
      onChange();
    }
    setIsChecked(!isChecked);
  };

  return (
    <div className={classes.switchBox}>
      <div className={classes.switchIconMoon}></div>
      <div className={classes.switchIconSun}></div>
      <div className={isChecked ? classes.switchChecked : classes.switchNoChecked} onClick={changeChecked}></div>
    </div>
  );
}
