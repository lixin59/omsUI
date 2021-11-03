import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import GroupTable from './GroupTable';
import styles from './style';
import { ActionCreator } from 'redux';
import { GroupInfo } from '../../store/interface';
import { useSnackbar } from 'notistack';

type tDP = {
  deleteGroup: ActionCreator<any>;
  addGroup: ActionCreator<any>;
  editGroup: ActionCreator<any>;
};

type tOP = {};

type tSP = tOP & {
  groupList: GroupInfo[]
};

type tProps = tSP & tDP;

const Grouping = (props: tProps) => {
  const classes = makeStyles(styles)();
  const { enqueueSnackbar } = useSnackbar();
  const [mode, setPattern] = useState<string | number>('');
  const [rule, setRule] = useState<string>('');
  const [name, setName] = useState<string>('');
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setPattern(event.target.value as string);
  };

  const addNewGroup = () => {
    if (mode === '') {
      enqueueSnackbar(`请选择一个模式！`, {
        autoHideDuration: 3000,
        variant: 'warning'
      });
      return;
    }
    if (mode === 1 && !rule) {
      enqueueSnackbar(`选中规则模式, 匹配的规则不能为空！`, {
        autoHideDuration: 3000,
        variant: 'warning'
      });
      return;
    }
    if (!name) {
      enqueueSnackbar(`分组名称不能为空！`, {
        autoHideDuration: 3000,
        variant: 'warning'
      });
      return;
    }
    if (props.groupList.some((e) => e.name === name)) {
      enqueueSnackbar(`该分组已存在！`, {
        autoHideDuration: 3000,
        variant: 'warning'
      });
      return;
    }
    props.addGroup({ id: new Date().getTime(), name, mode, rule });
  };

  return (
    <div className={classes.itemPage}>
      <div className={classes.ControlBox}>
        <FormControl className={classes.Control}>
          <InputLabel id='pattern-select-label'>选择模式</InputLabel>
          <Select
            labelId='pattern-select-label'
            id='pattern-select'
            value={mode}
            onChange={handleChange}
          >
            <MenuItem value={0}>主机模式</MenuItem>
            <MenuItem value={1}>规则模式</MenuItem>
          </Select>
        </FormControl>
        <FormControl className={classes.Control}>
          <TextField
            size='small'
            id='Matching-rules'
            label='匹配规则'
            variant='outlined'
            value={rule}
            placeholder='主机模式不用添加规则'
            onChange={(e) => setRule(e.target.value)}
          />
        </FormControl>
        <FormControl className={classes.Control}>
          <TextField
            size='small'
            id='grouping'
            label='分组名称'
            variant='outlined'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </FormControl>
        <Button
          className={classes.addButton}
          onClick={addNewGroup}
        >
          增加分组
        </Button>
      </div>
      <div className={classes.shellBox}>
        <GroupTable {...props}/>
      </div>
    </div>
  );
};

export default Grouping;
