import React from 'react';
import BodyBox from '../../components/Bodybox';
import Version from '../Version';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

export default function About() {
  return (
    <BodyBox>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', marginTop: '40px' }}>
        <Link
          href="#"
          underline="none"
          onClick={() => {
            window.open('https://wang918562230.gitbook.io/ssbeattyoms-wen-dang/');
          }}>
          <Typography variant="h5">文档</Typography>
        </Link>
      </div>
      <div
        style={{
          marginTop: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around'
        }}>
        <Version variant="h5" text="版本：" />
      </div>
    </BodyBox>
  );
}
