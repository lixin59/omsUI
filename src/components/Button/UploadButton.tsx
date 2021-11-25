import React, { ChangeEvent, useState } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { useSnackbar } from 'notistack';
import { HTTPResult, uploadFileApi } from '../../api/http/httpRequestApi';

type tProps = {
  filePath?: string,
  typeId?: number,
  type?: 'host' | 'group' | 'tag',
  todo?: any,
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      'display': 'flex',
      'alignContent': 'space-evenly',
      'alignItems': 'center',
      'justifyContent': 'space-around',
      '& > *': {
        margin: theme.spacing(1)
      }
    },
    input: {
      display: 'none'
    }
  })
);

export default function UploadButtons(props: tProps) {
  const { filePath = '', typeId, type, todo } = props;
  const classes = useStyles();
  const [fileList, setFileList] = useState<null | FileList>(null);
  const [fileName, setFileName] = useState<string>('未选择任何文件');
  const { enqueueSnackbar } = useSnackbar();

  const changeFile = (e: ChangeEvent<HTMLInputElement>) => {
    // @ts-ignore
    if (!e.target!.files[0]!.name) {
      return;
    }
    // @ts-ignore
    if (e.target?.files.length < 2) {
      // @ts-ignore
      setFileName(e.target?.files[0]?.name);
    } else {
      // @ts-ignore
      setFileName(`${e.target?.files.length}个文件`);
    }
    // @ts-ignore
    setFileList(e.target?.files);
  };
  const uploadFile = async() => {
    // console.log(typeId);
    // console.log(type);
    // console.log(filePath);
    // console.log(fileInfo);
    // if (!filePath) {
    //   enqueueSnackbar('远程文件路径地址不能为空！！！', {
    //     autoHideDuration: 3000,
    //     variant: 'warning'
    //   });
    //   return;
    // }
    if (!(fileList as FileList)[0]) {
      enqueueSnackbar('请选择需要上传的文件！！！', {
        autoHideDuration: 3000,
        variant: 'warning'
      });
      return;
    }
    if (!type) {
      enqueueSnackbar('请选择类型！！！', {
        autoHideDuration: 3000,
        variant: 'warning'
      });
      return;
    }
    if (!typeId) {
      enqueueSnackbar('请选择子选项！！！', {
        autoHideDuration: 3000,
        variant: 'warning'
      });
      return;
    }
    const res = (await uploadFileApi({
      id: typeId,
      type,
      remote: filePath,
      files: fileList
    })) as HTTPResult;
    console.log(res);
    if (todo) {
      todo();
    }
  };
  return (
    <div className={classes.root}>
      <TextField
        size='small'
        disabled
        id='select-file'
        variant='outlined'
        value={fileName}
      />
      <input
        className={classes.input}
        id='contained-button-file'
        multiple
        type='file'
        onChange={(e) => changeFile(e)}
      />
      <label htmlFor='contained-button-file'>
        <Button variant='contained' color='primary' component='span'>
          选择文件
        </Button>
      </label>
      <Button
        variant='contained'
        startIcon={<CloudUploadIcon />}
        onClick={() => uploadFile()}
      >
        上传
      </Button>
    </div>
  );
}
