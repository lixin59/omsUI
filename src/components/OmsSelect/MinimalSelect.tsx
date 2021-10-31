import React, { FC, useState } from 'react';
import { useMinimalSelectStyles } from './style';
import FormControl from '@material-ui/core/FormControl';

import OmsSelect from './index';
import OmsMenuItem from './OmsMenuItem';
import InputLabel from '@material-ui/core/InputLabel';

// Original design here: https://github.com/siriwatknp/mui-treasury/issues/540

const MinimalSelect: FC = () => {
  const [val, setVal] = useState('');

  const handleChange = (event) => {
    setVal(event.target.value);
  };

  const minimalSelectClasses = useMinimalSelectStyles();

  // moves the menu below the select input


  return (
    <FormControl>
      <InputLabel id='type-select-label'>请选择类型</InputLabel>
      <OmsSelect
        labelId='type-select-label'
        displayEmpty={true}
        value={val}
        onChange={handleChange}
      >
        <OmsMenuItem value={0}>Principle</OmsMenuItem>
        <OmsMenuItem value={1}>Sketch</OmsMenuItem>
        <OmsMenuItem value={2}>Photoshop</OmsMenuItem>
        <OmsMenuItem value={3}>Framer</OmsMenuItem>
      </OmsSelect>
    </FormControl>
  );
};


export default MinimalSelect;
