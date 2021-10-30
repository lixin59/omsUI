import React, { useState } from 'react';
// router
import { NavLink, Switch, Route, Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import Home from '../Home';
import About from '../About';
import Group from '../Group';
import Mode from '../Mode';
import styles from './style';

export default function Navigation() {
  const classes = makeStyles(styles)();
  const [value, setValue] = useState<number>(0);

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
        <Switch>
          <Route path='/home' component={Home}/>
          <Route path='/group' component={Group}/>
          <Route path='/mode' component={Mode}/>
          <Route path='/about'component={About}/>
          <Redirect from='/*' to='/home' />
        </Switch>
      </div>
    </>
  );
}
