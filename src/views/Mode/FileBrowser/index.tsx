import React, { useState, useCallback } from 'react';
import { connect } from 'react-redux';
import { GroupInfo, HostInfo, IState, TagInfo } from '../../../store/interface';
import { fileBrowserApi, deleteFileApi, createFileApi, HTTPResult } from '../../../api/http/httpRequestApi';
import {
  FullFileBrowser,
  setChonkyDefaults,
  ChonkyActions,
  FileArray,
  defineFileAction,
  FileActionHandler,
  ChonkyIconName
} from 'chonky';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import OmsLabel from '../../../components/OmsLabel';
import OmsSelect from '../../../components/OmsSelect';
import OmsMenuItem from '../../../components/OmsSelect/OmsMenuItem';
import Button from '@material-ui/core/Button';
import LinkIcon from '@material-ui/icons/Link';
import { FileSelectionTransform } from 'chonky/src/types/action.types';
import { FileHelper } from 'chonky/src/util/file-helper';
import UploadButtons from '../../../components/Button/UploadButton';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import FileIcon from './FileIcon';

type tDP = {
  // deleteGroup: ActionCreator<any>;
  // addGroup: ActionCreator<any>;
  // editGroup: ActionCreator<any>;
  // deleteTag: ActionCreator<any>;
  // addTag: ActionCreator<any>;
  // editTag: ActionCreator<any>;
};

type tOP = {};

type tSP = tOP & {
  hostList: HostInfo[],
  groupList: GroupInfo[],
  tagList: TagInfo[]
};

const mapStateToProps = (state: IState, props: tOP): tSP => ({
  ...props,
  hostList: state.hostList,
  groupList: state.groupList,
  tagList: state.tagList
});
const mapDispatch: tDP = {
  // deleteGroup: actions.deleteGroupInfo,
  // addGroup: actions.addGroupInfo,
  // editGroup: actions.editGroupInfo,
  // deleteTag: actions.deleteTagInfo,
  // addTag: actions.addTagInfo,
  // editTag: actions.editTagInfo,
};

type tProps = tSP & tDP;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '98%',
      height: '100%'
    },
    ControlBox: {
      marginBottom: '20px',
      width: '100%',
      display: 'flex',
      alignContent: 'space-evenly',
      alignItems: 'center',
      justifyContent: 'flex-start'
    },
    Control: {
      width: '25%'
    },
    mkdir: {
      width: '100%'
    },
    LinkButton: {
      marginTop: '12px',
      marginLeft: '40px',
      height: '45px',
      width: '90px',
      backgroundColor: theme.palette.info[theme.palette.type],
      '&:hover': {
        backgroundColor: theme.palette.info.main
      }
    },
    FileBrowser: {
      height: '85%'
    }
  })
);

setChonkyDefaults({ iconComponent: FileIcon });

const FileBrowserPage = ({ hostList }: tProps) => {
  const classes = useStyles();
  const [hostId, setHost] = useState<number>(0);
  const [filePath, setFilePath] = useState<string>('');
  const [dir, setDir] = useState<string>('');
  const [parentDir, setParentDir] = useState<string>('');
  const [isMkdir, setIsMkdir] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [files, setFiles] = useState<FileArray>([null, null]);
  const [folderChain, setFolderChain] = useState<FileArray>([]);

  const deleteAction = defineFileAction({
    id: 'omsDelete',
    requiresSelection: true,
    button: {
      name: '删除',
      contextMenu: true,
      icon: ChonkyIconName.trash,
      group: 'Actions'
    }
  }, async(data) => {
    // @ts-ignore
    const { id, parentId } = data.state.contextMenuTriggerFile;
    if (!id) {
      return;
    }
    const rest = (await deleteFileApi({ host_id: hostId, id })) as HTTPResult;
    if (rest.code !== '200') {
      return;
    }
    const res = (await fileBrowserApi({ host_id: hostId, id: parentId })) as HTTPResult;
    if (res.code !== '200') {
      return;
    }
    setFiles(res.data.files);
    setFolderChain(res.data.folderChains);
  });

  const createAction = defineFileAction({
    id: 'omsCreate',
    button: {
      name: '创建文件夹',
      contextMenu: true,
      toolbar: true,
      icon: ChonkyIconName.folderCreate,
      group: 'Actions'
    }
  }, (data) => {
    const { folderChain } = data.getReduxState();
    const currentFolder = folderChain[folderChain.length - 1];
    if (currentFolder) {
      // console.log('调用api添加文件', currentFolder);
      setIsMkdir(true);
      setOpen(true);
      setParentDir(currentFolder.id);
    }
  });

  const downloadAction = defineFileAction({
    id: 'omsDownload',
    requiresSelection: true,
    button: {
      name: '下载文件',
      contextMenu: true,
      icon: ChonkyIconName.download
    }
  }, (data) => {
    console.log('下载', data.state.contextMenuTriggerFile);
  });

  const selectAllFileAction = defineFileAction({
    id: 'select_all_files',
    hotkeys: ['ctrl+a'],
    button: {
      name: '全选文件',
      toolbar: true,
      contextMenu: true,
      group: 'Actions',
      icon: ChonkyIconName.selectAllFiles
    },
    selectionTransform: (({ fileIds, hiddenFileIds }) => {
      const newSelection = new Set<string>();
      fileIds.map((fileId) => {
        if (!hiddenFileIds.has(fileId)) newSelection.add(fileId);
      });
      return newSelection;
    }) as FileSelectionTransform
  } as const);

  const clearSelectAction = defineFileAction({
    id: 'clear_selection',
    hotkeys: ['escape'],
    button: {
      name: '取消全选',
      toolbar: true,
      contextMenu: true,
      group: 'Actions',
      icon: ChonkyIconName.clearSelection
    },
    selectionTransform: (({ prevSelection }) => {
      if (prevSelection.size === 0) return null;
      return new Set<string>();
    }) as FileSelectionTransform
  } as const);

  const openSelectAction = defineFileAction(
    {
      id: 'open_selection',
      hotkeys: ['enter'],
      requiresSelection: true,
      fileFilter: FileHelper.isOpenable,
      button: {
        name: '打开文件夹',
        toolbar: true,
        contextMenu: true,
        group: 'Actions',
        icon: ChonkyIconName.openFiles
      }
    } as const
  );

  const uploadFilesAction = defineFileAction(
    {
      id: 'upload_files',
      fileFilter: FileHelper.isOpenable,
      button: {
        name: '上传文件',
        toolbar: true,
        contextMenu: true,
        group: 'Actions',
        icon: ChonkyIconName.upload
      }
    } as const,
    ({ getReduxState }) => {
      const { folderChain } = getReduxState();
      const currentFolder = folderChain[folderChain.length - 1];
      if (currentFolder) {
        // console.log('调用api上传文件', currentFolder);
        setIsMkdir(false);
        setFilePath(currentFolder.id);
        setOpen(true);
      }
    }
  );

  const myFileActions = [
    deleteAction,
    createAction,
    downloadAction,
    selectAllFileAction,
    clearSelectAction,
    openSelectAction,
    uploadFilesAction
  ];

  const handleAction = React.useCallback<FileActionHandler>(async(data) => {
    // console.log(data);
    if (data.id === ChonkyActions.OpenSelection.id && data.state?.contextMenuTriggerFile?.isDir) { // 右键菜单打开文件夹
      if (!hostId) {
        return;
      }
      const res = (await fileBrowserApi({ host_id: hostId, id: data.state.contextMenuTriggerFile.id })) as HTTPResult;
      if (res.code !== '200') {
        return;
      }
      setFiles(res.data.files);
      setFolderChain(res.data.folderChains);
    }
    if (data.id === ChonkyActions.OpenFiles.id && data.payload.targetFile?.isDir) { // 单击文件树进入文件夹
      if (!hostId) {
        return;
      }
      const res = (await fileBrowserApi({ host_id: hostId, id: data.payload.targetFile.id })) as HTTPResult;
      if (res.code !== '200') {
        return;
      }
      setFiles(res.data.files);
      setFolderChain(res.data.folderChains);
    }
    if (data.id === ChonkyActions.MouseClickFile.id && data.payload.clickType === 'double') { // 双击文件夹列表进入文件夹
      if (data.payload.file.isDir) {
        if (!hostId) {
          return;
        }
        const res = (await fileBrowserApi({ host_id: hostId, id: data.payload.file.id })) as HTTPResult;
        if (res.code !== '200') {
          return;
        }
        setFiles(res.data.files);
        setFolderChain(res.data.folderChains);
      }
    }
  }, [hostId]);

  const viewFiles = async() => {
    const res = (await fileBrowserApi({ host_id: hostId, id: '.' })) as HTTPResult;
    if (res.code !== '200') {
      return;
    }
    // console.log('res', res);
    setFiles(res.data.files);
    setFolderChain(res.data.folderChains);
  };

  const todo = useCallback(async() => {
    setOpen(false);
    let datas = {} as HTTPResult;
    if (isMkdir) {
      const res = (await createFileApi({ host_id: hostId, id: parentDir, dir })) as HTTPResult;
      if (res.code !== '200') {
        return;
      }
      datas = (await fileBrowserApi({ host_id: hostId, id: parentDir })) as HTTPResult;
      // console.log('创建文件完成之后');
    } else {
      datas = (await fileBrowserApi({ host_id: hostId, id: filePath })) as HTTPResult;
      // console.log('上传文件完成之后');
    }
    // console.log('data', datas);
    if (datas.code !== '200') {
      return;
    }
    setFiles(datas.data.files);
    setFolderChain(datas.data.folderChains);
  }, [hostId, parentDir, dir, filePath]);

  return (
    <div className={classes.root}>
      <div className={classes.ControlBox}>
        <FormControl className={classes.Control}>
          <OmsLabel>请选择主机</OmsLabel>
          <OmsSelect
            labelId='typeItem-select-label'
            id='typeItem-select-label'
            value={hostId || ''}
            onChange={(e) => setHost(e?.target?.value as number)}
          >
            {hostList.map((e) => {
              return (<OmsMenuItem key={e.name} value={e.id}>{e.name}</OmsMenuItem>);
            })}
          </OmsSelect>
        </FormControl>
        <Button
          disabled={!hostId}
          className={classes.LinkButton}
          startIcon={<LinkIcon />}
          onClick={viewFiles}
        >
          查看
        </Button>
      </div>
      <div className={classes.FileBrowser}>
        <FullFileBrowser
          files={filesss}
          folderChain={folderChain}
          fileActions={myFileActions}
          onFileAction={handleAction}
        />
      </div>
      <Dialog open={open} onClose={() => setOpen(false)} aria-labelledby='upload_files'>
        <DialogContent dividers>
          <DialogContentText>
            {isMkdir ? <TextField
              className={classes.mkdir}
              size='small'
              id='outlined-mkdir'
              label='请输入文件夹名称'
              variant='outlined'
              value={dir}
              onChange={(e) => setDir(e.target.value)}
            /> : <UploadButtons type='host' filePath={filePath} typeId={hostId} todo={todo}/>
            }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color='primary'>
            取消
          </Button>
          {isMkdir ? <Button onClick={todo} color='primary'>
            确定
          </Button> : null}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default connect(
  mapStateToProps,
  mapDispatch
)(FileBrowserPage);

