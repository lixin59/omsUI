import React, { FC, useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import UploadButtons from '../../components/Button/UploadButton';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      height: '100%',
    },
    ControlBox: {
      marginBottom: '20px',
      width: '100%',
      display: 'flex',
      alignContent: 'space-evenly',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    Control: {
      width: '25%',
    },
    shellBox: {
      width: '100%',
      height: '60%',
      backgroundColor: '#2f2f2f',
    },
  }),
);

const UploadFile: FC = () => {
  const classes = useStyles();
  const [age, setAge] = useState('');
  const [filePath, setFilePath] = useState<string>('');
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setAge(event.target.value as string);
    console.log(filePath);
  };
  return (
    <div className={classes.root}>
      <div className={classes.ControlBox}>
        <FormControl className={classes.Control}>
          <InputLabel id="type-select-label">请选择类型</InputLabel>
          <Select
            labelId="type-select-label"
            id="type-select"
            value={age}
            onChange={handleChange}
          >
            <MenuItem value={10}>主机</MenuItem>
            <MenuItem value={20}>组</MenuItem>
            <MenuItem value={30}>标签</MenuItem>
          </Select>
        </FormControl>
        <FormControl className={classes.Control}>
          <InputLabel id="typeItem-select-label">请选择子选项</InputLabel>
          <Select
            labelId="typeItem-select-label"
            id="demo-customized-select"
            value={age}
            onChange={handleChange}
          >
            <MenuItem value={10}>主机</MenuItem>
            <MenuItem value={20}>组</MenuItem>
            <MenuItem value={30}>标签</MenuItem>
          </Select>
        </FormControl>
      </div>
      <div className={classes.ControlBox}>
        <TextField
          className={classes.Control}
          size="small"
          id="outlined-disabled"
          label="请输入远程端文件存储的路径"
          variant="outlined"
          value={filePath}
          onChange={(e)=> setFilePath(e.target.value)}
        />
        <UploadButtons filePath={filePath}/>
      </div>
      <div className={classes.shellBox}></div>
    </div>
  );
};

export default UploadFile;
