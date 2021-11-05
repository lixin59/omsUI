import React from 'react';
import BodyBox from '../../components/Bodybox';
import Button from '@material-ui/core/Button';
import Loading from '../../components/OmsSkeleton/Loading';
import OmsError from '../../components/OmsError';

import { getAllHostInfo, getHostInfoById, addHost, editHost, deleteHost } from '../../api/http/httpRequestApi';

const newHost = {
  hostname: 'centos001',
  user: 'root',
  addr: '127.0.0.1',
  port: 22,
  group: 1,
  password: 'password',
  keyFile: '',
  tags: ['1', '2']
};

export default function About() {
  const get = async() => {
    // const res = await getAllHostInfo();
    // const res1 = await getHostInfoById(1);
    // const res1 = await addHost(newHost);
    const res1 = await editHost({ id: 1 });
    // const res1 = await deleteHost(1);
    console.log('get', res1);
  };
  return (
    <BodyBox>
      {/* <Button onClick={get}>获取信息</Button>*/}
      {/* <Loading/>*/}
      <OmsError errInfo='失败了' errType='server' imgStyle={{ width: '400px', height: '400px' }}/>
    </BodyBox>
  );
}
