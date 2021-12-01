import React, { useState, useEffect } from 'react';
// router
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import styles from './style';
import { URL } from '../../router';

export default function Navigation() {
  const classes = makeStyles(styles)();
  const [value, setValue] = useState<number>(0);
  const navigate = useNavigate();
  const hash = useLocation();

  useEffect(() => {
    if (hash.pathname === '/') {
      navigate(URL.home); // 页面初始化跳转Home页面
    }
    if (hash.pathname.includes(URL.home)) {
      setValue(0);
    }
    if (hash.pathname.includes(URL.group)) {
      setValue(1);
    }
    if (hash.pathname.includes(URL.mode)) {
      setValue(2);
    }
    if (hash.pathname.includes(URL.about)) {
      setValue(3);
    }
  }, [hash]);

  return (
    <>
      <BottomNavigation
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        showLabels
        className={classes.root}
      >
        <BottomNavigationAction label='主机' component={NavLink} to={URL.home} className={classes.navItem}/>
        <BottomNavigationAction label='组' component={NavLink} to={URL.group} className={classes.navItem} />
        <BottomNavigationAction label='运维模式' component={NavLink} to={URL.mode} className={classes.navItem} />
        <BottomNavigationAction label='关于' component={NavLink} to={URL.about} className={classes.navItem}/>
      </BottomNavigation>
      <div style={{ height: 'calc(100% - 56px)' }}>
        <Outlet />
      </div>
    </>
  );
}
