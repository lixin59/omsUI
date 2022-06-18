import React, { CSSProperties, ReactNode } from 'react';

export interface StyledTabsProps {
  className: any;
  value: number;
  // eslint-disable-next-line @typescript-eslint/ban-types
  onChange: (event: React.ChangeEvent<{}>, newValue: number) => void;
}

export interface StyledTabProps {
  label: string;
  className?: any;
}

export interface TabPanelProps {
  children?: ReactNode;
  index: any;
  value: any;
  className?: any;
  style?: CSSProperties | undefined;
}
