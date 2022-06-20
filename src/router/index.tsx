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
const PrivateKey = lazy(() => import('../views/Group/PrivateKey'));
const Job = lazy(() => import('../views/Mode/Job/index'));
const Tunnel = lazy(() => import('../views/Mode/Tunnel/index'));
const UploadFile = lazy(() => import('../views/Mode/UploadFile'));
const WebSSH = lazy(() => import('../views/Mode/WebSSH'));
const Command = lazy(() => import('../views/Mode/Command'));
const FileBrowser = lazy(() => import('../views/Mode/FileBrowser'));
const HostMonitor = lazy(() => import('../views/Mode/HostMonitor'));
const VNC = lazy(() => import('../views/Mode/VNC'));

const lazyLoad = (children: ReactNode): ReactNode => {
  return (
    <Suspense
      fallback={
        <>
          <OmsLoading />
        </>
      }>
      {children}
    </Suspense>
  );
};

export const URL = {
  home: '/home',
  group: '/group',
  mode: '/mode',
  about: '/about',
  groupTable: '/group/group_table',
  tagTable: '/group/tagTable',
  privateKey: '/group/private_key',
  job: '/mode/job',
  tunnel: '/mode/tunnel',
  uploadFile: '/mode/upload_file',
  webSSH: '/mode/web_ssh',
  command: '/mode/command',
  fileBrowser: '/mode/file_browser',
  hostMonitor: '/mode/host_monitor',
  vnc: '/mode/vnc'
};

const router: RouteObject[] = [
  {
    path: '/',
    element: <Navigation />,
    children: [
      {
        index: true,
        path: URL.home,
        element: lazyLoad(<Home />)
      },
      {
        path: URL.group,
        element: lazyLoad(<Group />),
        children: [
          {
            index: true,
            path: URL.groupTable,
            element: lazyLoad(<Grouping />)
          },
          {
            path: URL.tagTable,
            element: lazyLoad(<Tag />)
          },
          {
            path: URL.privateKey,
            element: lazyLoad(<PrivateKey />)
          }
        ]
      },
      {
        path: URL.mode,
        element: lazyLoad(<Mode />),
        children: [
          {
            index: true,
            path: URL.job,
            element: lazyLoad(<Job />)
          },
          {
            path: URL.tunnel,
            element: lazyLoad(<Tunnel />)
          },
          {
            path: URL.uploadFile,
            element: lazyLoad(<UploadFile />)
          },
          {
            path: `${URL.webSSH}/:id`,
            element: lazyLoad(<WebSSH />)
          },
          {
            path: URL.command,
            element: lazyLoad(<Command />)
          },
          {
            path: URL.fileBrowser,
            element: lazyLoad(<FileBrowser />)
          },
          {
            path: URL.hostMonitor,
            element: lazyLoad(<HostMonitor />)
          },
          {
            path: `${URL.vnc}/:id`,
            element: lazyLoad(<VNC />)
          }
        ]
      },
      {
        path: URL.about,
        element: lazyLoad(<About />)
      }
    ]
  }
];

export default router;
