import React, { ReactNode } from 'react';

export interface StyledTabsProps {
  className: any,
  value: number;
  onChange: (event: React.ChangeEvent<{}>, newValue: number) => void;
}

export interface StyledTabProps {
  label: string;
  className?: any,
}

export interface TabPanelProps {
  children?: ReactNode;
  index: any;
  value: any;
  className?: any;
}
