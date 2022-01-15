import React, { useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import './switch.css';
import styles from './style';

type tProps = {
  checked: boolean;
  onChange?: () => any;
}

export default function ThemeSwitchInput({ checked = false, onChange }: tProps) {
  const classes = makeStyles(styles)();
  const [isChecked, setIsChecked] = useState(checked);

  const inputRef = useRef<any>(null);


  const changeChecked = () => {
    if (onChange) {
      onChange();
    }
    setIsChecked(!isChecked);
  };

  const handleClick = () => {
    if (inputRef?.current as HTMLInputElement) {
      inputRef.current.checked = !inputRef?.current?.checked;
      if (onChange) {
        onChange();
      }
      setIsChecked(!isChecked);
    }
  };


  return (
    <div className={classes.switchBox1}>
      <div className={classes.switchIconLeft} onClick={handleClick}></div>
      <div className={classes.switchIconRight} onClick={handleClick}></div>
      <input type='checkbox' className='switch' ref={inputRef} onClick={changeChecked}/>
    </div>
  );
}
