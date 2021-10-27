import React from 'react';

export interface StyledTabsProps {
  className: any,
  value: number;
  onChange: (event: React.ChangeEvent<{}>, newValue: number) => void;
}

export interface StyledTabProps {
  label: string;
  className?: any,
}
