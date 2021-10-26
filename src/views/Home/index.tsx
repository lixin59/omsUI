import React from 'react';
import BodyBox from '../../components/Bodybox';
import { hostInfo } from './typings';
import HostInfoCard from '../../components/HostInfoCard';

const data: hostInfo[] = [
  {
    id: 1,
    hostName: '127',
    status: false,
    user: 'xm',
    host: '127.0.0.1',
    port: '22',
    group: '组1',
    tag: '',
  },
  {
    id: 2,
    hostName: '127',
    status: true,
    user: 'xm',
    host: '127.0.0.1',
    port: '22',
    group: '组2',
    tag: '',
  },
  {
    id: 3,
    hostName: '127',
    status: false,
    user: 'xm',
    host: '127.0.0.1',
    port: '22',
    group: '组1',
    tag: '',
  },
  {
    id: 4,
    hostName: '127',
    status: false,
    user: 'xm',
    host: '127.0.0.1',
    port: '22',
    group: '组1',
    tag: '',
  },
  {
    id: 5,
    hostName: '127',
    status: false,
    user: 'xm',
    host: '127.0.0.1',
    port: '22',
    group: '组1',
    tag: '',
  },
  {
    id: 6,
    hostName: '127',
    status: false,
    user: 'xm',
    host: '127.0.0.1',
    port: '22',
    group: '组1',
    tag: '',
  },
  {
    id: 7,
    hostName: '127',
    status: false,
    user: 'xm',
    host: '127.0.0.1',
    port: '22',
    group: '组1',
    tag: '',
  },
  {
    id: 8,
    hostName: '127',
    status: false,
    user: 'xm',
    host: '127.0.0.1',
    port: '22',
    group: '组1',
    tag: '',
  },
  {
    id: 9,
    hostName: '127',
    status: false,
    user: 'xm',
    host: '127.0.0.1',
    port: '22',
    group: '组1',
    tag: '',
  },
  {
    id: 10,
    hostName: '127',
    status: false,
    user: 'xm',
    host: '127.0.0.1',
    port: '22',
    group: '组1',
    tag: '',
  },
  {
    id: 11,
    hostName: '127',
    status: false,
    user: 'xm',
    host: '127.0.0.1',
    port: '22',
    group: '组1',
    tag: '',
  },
  {
    id: 12,
    hostName: '127',
    status: false,
    user: 'xm',
    host: '127.0.0.1',
    port: '22',
    group: '组1',
    tag: '',
  },
  {
    id: 13,
    hostName: '127',
    status: false,
    user: 'xm',
    host: '127.0.0.1',
    port: '22',
    group: '组1',
    tag: '',
  },

];

export default function Home() {
  return (
    <BodyBox>
      {/* <div style={{ fontSize: '30px', width: '200px', height: '200px', margin: '0 auto' }}>*/}
      {/*  Home*/}
      {/* </div>*/}
      <div style={{
        width: '90%',
        margin: '0 auto',
        paddingTop: '20px',
        paddingBottom: '20px',
        // height: '100%',
        // overflow: 'scroll',
        // display: 'flex',
        display: 'grid',
        // flexFlow: 'row wrap',
        alignContent: 'space-evenly',
        alignItems: 'center',
        justifyContent: 'space-between',
        justifyItems: 'center',
        gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
        gridGap: '20px 20px',
      }}>
        {data.map((i: hostInfo) => {
          return (
            <HostInfoCard hostInfo={i} key={i.id}/>
          );
        })}
      </div>
    </BodyBox>
  );
}
