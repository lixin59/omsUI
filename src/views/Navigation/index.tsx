import React, { useState, useEffect } from 'react';
// router
import { NavLink, Outlet, useNavigate,  useLocation } from 'react-router-dom';
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

  // 定义一个对象，将URL路径映射到对应的导航栏索引
  const pathToIndexMap = {
    [URL.home]: 0, // 首页
    [URL.group.root]: 1, // 资产组
    [URL.mode]: 2, // 运维模式
    [URL.about]: 3, // 关于
  };

  useEffect(() => {
    // 如果当前路径是根路径，则导航到首页
    if (hash.pathname === '/') {
      navigate(URL.home); // 页面初始化跳转Home页面
    }

    // 根据当前路径获取对应的导航栏索引
    const index = Object.keys(pathToIndexMap).find(key => hash.pathname.includes(key));
    // 如果索引存在，则设置导航栏的选中状态
    if (index !== undefined) {
      setValue(pathToIndexMap[index]);
    }
  }, [hash]); // 监听hash变化，更新导航栏选中状态



  return (
    <>
      <BottomNavigation
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        showLabels
        className={classes.root}>
        <BottomNavigationAction label="主机" component={NavLink} to={URL.home} className={classes.navItem} />
        <BottomNavigationAction label="资产" component={NavLink} to={URL.group.root} className={classes.navItem} />
        <BottomNavigationAction label="运维模式" component={NavLink} to={URL.mode} className={classes.navItem} />
        <BottomNavigationAction label="关于" component={NavLink} to={URL.about} className={classes.navItem} />
      </BottomNavigation>
      <div style={{ height: 'calc(100% - 56px)' }}>
        <Outlet />
      </div>
    </>
  );
}
