import React, { Dispatch, SetStateAction } from 'react';
import TextField from '@material-ui/core/TextField';
import { TagInfo } from '../../../store/interface';

type tProps = {
  Info: TagInfo,
  setInfo: Dispatch<SetStateAction<TagInfo>>,
}


const GroupForm = ({ Info, setInfo }: tProps) => {
  return (
    <>
      <TextField
        autoFocus
        margin='dense'
        id='tag-name'
        label='标签名称'
        fullWidth
        value={Info.name}
        onChange={(e) => setInfo({ ...Info, name: e.target.value })}
      />
    </>);
};

export default GroupForm;
