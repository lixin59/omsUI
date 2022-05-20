import React, { ChangeEvent, useState } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { useSnackbar } from 'notistack';
import SnackMessage from '../Snackbars/SnackMessageUpLoadFileProgress';
import { HTTPResult, uploadFileApi } from '../../api/http/httpRequestApi';

type tProps = {
  filePath?: string;
  typeId?: number;
  type?: 'host' | 'group' | 'tag';
  onBeforeUpload?: () => void; // 开始上传之前需要处理的回调
  onUploadComplete?: () => void; // 上传完成后需要处理的回调
  // onUploadProgress?: (progressEvent: any) => void;
  showUploadProgress: boolean;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      alignContent: 'space-evenly',
      alignItems: 'center',
      justifyContent: 'space-around',
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
  const { filePath = '', typeId, type, onBeforeUpload, onUploadComplete, showUploadProgress } = props;
  const classes = useStyles();
  const [fileList, setFileList] = useState<null | FileList>(null);
  const [fileName, setFileName] = useState<string>('未选择任何文件');
  const [fileNameList, setFileNameList] = useState<any[]>([]);
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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setFileList(e.target?.files);
  };
  const uploadFile = async () => {
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
    if (onBeforeUpload) {
      onBeforeUpload();
    }
    if (showUploadProgress) {
      const data = {
        id: typeId,
        type,
        remote: filePath,
        files: fileList
      };
      const id = new Date().getTime();
      enqueueSnackbar(`文件`, {
        autoHideDuration: 10000,
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right'
        },
        key: id,
        persist: true,
        variant: 'warning',
        content: <SnackMessage id={id} total={fileNameList} message={fileName} data={data} cb={onUploadComplete} />
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
    if (onUploadComplete) {
      onUploadComplete();
    }
  };
  return (
    <div className={classes.root}>
      <TextField size="small" disabled id="select-file" variant="outlined" value={fileName} />
      <input
        className={classes.input}
        id="contained-button-file"
        multiple
        type="file"
        onChange={(e) => changeFile(e)}
      />
      <label htmlFor="contained-button-file">
        <Button variant="contained" color="primary" component="span">
          选择文件
        </Button>
      </label>
      <Button variant="contained" startIcon={<CloudUploadIcon />} onClick={() => uploadFile()}>
        上传
      </Button>
    </div>
  );
}
