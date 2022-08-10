import React from 'react';
import Button from '@mui/material/Button';
import ReplayIcon from '@mui/icons-material/Replay';

import {
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector
} from '@mui/x-data-grid';

type tProps = {
  onReLoad: any;
};

export default function TableToolbar({ onReLoad }: tProps) {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <Button startIcon={<ReplayIcon />} onClick={onReLoad}>
        刷新
      </Button>
    </GridToolbarContainer>
  );
}
