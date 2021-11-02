import React from 'react';
import BodyBox from '../../components/Bodybox';
import MinimalSelect from '../../components/OmsSelect/MinimalSelect';
import Button from '@material-ui/core/Button';
import { getAllHostInfo } from '../../api/http/httpRequestApi';

export default function About() {
  const get = async() => {
    const res = await getAllHostInfo();
    console.log('get', res);
  };
  return (
    <BodyBox>
      <MinimalSelect/>
      <Button onClick={get}>获取信息</Button>
    </BodyBox>
  );
}
