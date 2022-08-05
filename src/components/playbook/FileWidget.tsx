import React, { ChangeEvent, useState } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Button from '@mui/material/Button';
import TextField from '../OmsTextField/index';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useSnackbar } from 'notistack';
import { uploadStepFileApi } from '../../api/http/playbook';
import LinearProgressWithLabel from '../UploadFileProgress/Linear';
import { WidgetProps } from '@rjsf/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      alignContent: 'space-evenly',
      alignItems: 'center',
      justifyContent: 'space-between',
      '& > *': {
        margin: theme.spacing(1)
      }
    },
    input: {
      display: 'none'
    }
  })
);

export default function FileWidget(props: WidgetProps) {
  const { id, multiple, autofocus, onChange } = props;
  console.log('id', id)
  const classes = useStyles();
  const [fileList, setFileList] = useState<null | FileList>(null);
  const [fileName, setFileName] = useState<string>('未选择任何文件');
  const [fileNameList, setFileNameList] = useState<any[]>([]);
  const [progress, setProgress] = useState(0);

  const { enqueueSnackbar } = useSnackbar();

  const changeFile = (e: ChangeEvent<HTMLInputElement>) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (!e.target!.files[0]!.name) {
      return;
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (e.target?.files.length < 2) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      setFileName(e.target?.files[0]?.name);
      const arr: any[] = [];
      for (let i = 0; i < e!.target!.files!.length; i++) {
        arr.push(e!.target!.files![i]!.name);
      }
      setFileNameList(arr);
    } else {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      setFileName(`${e.target?.files.length}个文件`);
      console.log(e.target?.files);
      const arr: any[] = [];
      for (let i = 0; i < e!.target!.files!.length; i++) {
        arr.push(e!.target!.files![i]!.name);
      }
      setFileNameList(arr);
    }
    setFileList(e.target?.files);
  };

  function onUploadProgress(progressEvent) {
    const progressdata = ((progressEvent.loaded / progressEvent.total) * 100) | 0;
    setProgress(progressdata);
    // console.log(progressEvent);
  }
  const uploadFile = async () => {
    try {
      if (!(fileList as FileList)[0]) {
        enqueueSnackbar('请选择需要上传的文件！！！', {
          autoHideDuration: 3000,
          variant: 'warning'
        });
        return;
      }
      const res = await uploadStepFileApi({ files: fileList }, { onUploadProgress });
      if (res.code !== '200') {
        enqueueSnackbar(`上传文件失败：${res.msg}`, {
          autoHideDuration: 5000,
          variant: 'error'
        });
        setProgress(0);
        return;
      }
      if (multiple) {
        console.log('多个文件', res.data)
        onChange(res.data.files.map((f) => f.cache_path));
      } else {
        console.log('1个文件', res.data)
        onChange(res.data.files[0].cache_path);
      }
    } catch (e) {
      enqueueSnackbar(`上传文件失败：${e}`, {
        autoHideDuration: 5000,
        variant: 'error'
      });
      setProgress(0);
    }
  };
  return (
    <>
      <div className={classes.root}>
        <TextField size="small" style={{minWidth: '400px'}} disabled id="select-file" variant="outlined" value={fileName} />
        <input
          className={classes.input}
          id={id}
          type="file"
          onChange={(e) => changeFile(e)}
          autoFocus={autofocus}
          multiple={multiple}
        />
        <label htmlFor={id}>
          <Button variant="contained" component="span">
            选择文件
          </Button>
        </label>
        <Button variant="contained" startIcon={<CloudUploadIcon />} onClick={() => uploadFile()}>
          上传文件
        </Button>
      </div>
      {progress ? <LinearProgressWithLabel value={progress} total={String(fileNameList)} /> : null}
    </>
  );
}
