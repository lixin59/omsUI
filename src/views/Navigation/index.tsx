import React, { useState, useEffect } from 'react';
// router
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import styles from './style';

export default function Navigation() {
  const classes = makeStyles(styles)();
  const [value, setValue] = useState<number>(0);
  const navigate = useNavigate();
  const hash = useLocation();

  useEffect(() => {
    if (hash.pathname === '/') {
      navigate('/home'); // 页面初始化跳转Home页面
    }
    if (hash.pathname.includes('/home')) {
      setValue(0);
    }
    if (hash.pathname.includes('/group')) {
      setValue(1);
    }
    if (hash.pathname.includes('/mode')) {
      setValue(2);
    }
    if (hash.pathname.includes('/about')) {
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
        <BottomNavigationAction label='主机' component={NavLink} to='/home' className={classes.navItem}/>
        <BottomNavigationAction label='组' component={NavLink} to='/group' className={classes.navItem} />
        <BottomNavigationAction label='运维模式' component={NavLink} to='/mode' className={classes.navItem} />
        <BottomNavigationAction label='关于' component={NavLink} to='/about' className={classes.navItem}/>
      </BottomNavigation>
      <div style={{ height: 'calc(100% - 56px)' }}>
        <Outlet />
      </div>
    </>
  );
}
