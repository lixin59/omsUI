import React, { lazy, ReactNode, Suspense } from 'react';
import { RouteObject } from 'react-router-dom';
import OmsLoading from '../components/OmsLoading';
import Navigation from '../views/Navigation';
const Home = lazy(() => import('../views/Home/index'));
const Group = lazy(() => import('../views/Group'));
const Mode = lazy(() => import('../views/Mode/index'));
const About = lazy(() => import('../views/About'));
const Grouping = lazy(() => import('../views/Group/Grouping'));
const Tag = lazy(() => import('../views/Group/Tag'));
const Job = lazy(() => import('../views/Mode/Job/index'));
const Tunnel = lazy(() => import('../views/Mode/Tunnel/index'));
const UploadFile = lazy(() => import('../views/Mode/UploadFile'));
const WebSSH = lazy(() => import('../views/Mode/WebSSH'));
const Command = lazy(() => import('../views/Mode/Command'));
const FileBrowser = lazy(() => import('../views/Mode/FileBrowser'));


const lazyLoad = (children: ReactNode): ReactNode => {
  return <Suspense fallback={<><OmsLoading/></>}>
    {children}
  </Suspense>;
};

const router:RouteObject[] = [
  {
    path: '/',
    element: <Navigation/>,
    children: [
      {
        index: true,
        path: '/home',
        element: lazyLoad(<Home />)
      },
      {
        path: '/group',
        element: lazyLoad(<Group />),
        children: [
          {
            index: true,
            path: '/group/groupTable',
            element: lazyLoad(<Grouping/>)
          },
          {
            path: '/group/tagTable',
            element: lazyLoad(<Tag/>)
          }
        ]
      },
      {
        path: '/mode',
        element: lazyLoad(<Mode />),
        children: [
          {
            index: true,
            path: '/mode/job',
            element: lazyLoad(<Job/>)
          },
          {
            path: '/mode/tunnel',
            element: lazyLoad(<Tunnel/>)
          },
          {
            path: '/mode/upload-file',
            element: lazyLoad(<UploadFile/>)
          },
          {
            path: '/mode/web-ssh/:id',
            element: lazyLoad(<WebSSH/>)
          },
          {
            path: '/mode/command',
            element: lazyLoad(<Command/>)
          },
          {
            path: '/mode/file-browser',
            element: lazyLoad(<FileBrowser/>)
          }
        ]
      },
      {
        path: '/about',
        element: lazyLoad(<About />)
      }
    ]
  }
];

export default router;
