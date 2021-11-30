import React from 'react';
import BodyBox from '../../components/Bodybox';
import { useNavigate } from 'react-router-dom';

export default function About() {
  const navigate = useNavigate();
  return (
    <BodyBox>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', marginTop: '40px' }}>
        <div style={{ fontSize: '40px' }}>😉开源不易,如果喜欢我们的项目💗，请到GitHub上点个⭐</div>
      </div>
      <div onClick={() => navigate('/group/groupTable')}>跳转</div>
      <div onClick={() => { navigate('/group/tagTable'); }}>跳转2</div>
      <div onClick={() => navigate('/home')}>跳转主页</div>
      <div onClick={() => { navigate('/mode/web-ssh'); }}>跳转运维</div>
      <div onClick={() => { navigate('/mode/file-browser'); }}>跳转运维文件浏览</div>
    </BodyBox>
  );
}
