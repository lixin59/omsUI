import React from 'react';

type tProps = {
    children?: any
}

export default function BodyBox(props: tProps) {
  const { children } = props;
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        overflowY: 'scroll',
        backgroundColor: '#f2f1f1',
      }}>
      {children}
    </div>
  );
}
