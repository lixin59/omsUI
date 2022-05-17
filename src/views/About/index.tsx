import React from 'react';
import BodyBox from '../../components/Bodybox';

export default function About() {
  return (
    <BodyBox>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', marginTop: '40px' }}>
        <div style={{ fontSize: '40px' }}>😉开源不易,如果喜欢我们的项目💗，请到GitHub上点个⭐</div>
      </div>
    </BodyBox>
  );
}
