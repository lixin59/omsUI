import React, { useState, useCallback, useEffect, memo, useReducer } from 'react';
import { connect } from 'react-redux';
import { HostInfo, IState } from '../../../store/interface';
import {
  fileBrowserApi,
  deleteFileApi,
  createFileApi,
  previewFileApi,
  HTTPResult,
  editFileApi
} from '../../../api/http/httpRequestApi';
import { Base64 } from 'js-base64';
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
import qs from 'qs';
import { baseUrl, urlType } from '../../../api/http/requestUrl';
import { a11yProps, downloadFile } from '../../../utils';
import { useSnackbar } from 'notistack';
import { getFileType } from '../../../utils';
import OmsViewMarkdown from '../../../components/OmsViewMarkdown';
import OmsSyntaxHighlight from '../../../components/OmsSyntaxHighligh';
import { FileData } from 'chonky/src/types/file.types';
import actions from '../../../store/action';
import { ActionCreator } from 'redux';
import ChromeTab from '../../../components/OmsTabs/ChromeTab';
import ChromeTabs from '../../../components/OmsTabs/ChromeTabs';
import ChromeTabPanel from '../../../components/OmsTabs/ChromeTabPanel';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import Tooltip from '@material-ui/core/Tooltip';
import CloseIcon from '@mui/icons-material/Close';
import FullScreenEditorDialog from '../../../components/OmsDialog/FullScreenEditorDialog';
import { fileLanguageType } from '../../../constants';

function getImgBase64Byte(imgType) {
  if (imgType === 'svg') {
    return 'svg+xml';
  }
  return 'bmp';
}

const imgType = {
  jpeg: 'jpeg',
  jpg: 'jpg',
  tiff: 'tiff',
  png: 'png',
  gif: 'gif',
  svg: 'svg'
};

const codeType = {
  ...fileLanguageType,
  ...imgType
};

type tDP = {
  updateHostList: ActionCreator<any>;
};

// eslint-disable-next-line @typescript-eslint/ban-types
type tOP = {};

type tSP = tOP & {
  hostList: HostInfo[];
};

const mapStateToProps = (state: IState, props: tOP): tSP => ({
  ...props,
  hostList: state.hostList
});
const mapDispatch: tDP = {
  updateHostList: actions.getHostList
};

type tProps = tSP & tDP;

setChonkyDefaults({ iconComponent: FileIcon });

const FileBrowserComponent = ({ hostList }: { hostList: HostInfo[] }) => {
  let darkMode = false;
  const useStyles = makeStyles((theme: Theme) => {
    if (theme.palette.type === 'dark') {
      darkMode = true;
    }
    return createStyles({
      root: {
        width: '100%',
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
        width: '400px'
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
    });
  });

  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const [hostId, setHost] = useState<number>(0);
  const [filePath, setFilePath] = useState<string>('');
  const [dir, setDir] = useState<string>('');
  const [parentDir, setParentDir] = useState<string>('');
  const [isMkdir, setIsMkdir] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [editFile, setEditFile] = useState<string>('');
  const [dialogType, setDialogType] = useState<string>('');
  const [language, setLanguage] = useState<string>(codeType.txt);
  const [code, setCode] = useState<string>('');
  const [files, setFiles] = useState<FileArray>([]);
  const [folderChain, setFolderChain] = useState<FileArray>([]);

  const deleteAction = defineFileAction(
    {
      id: 'omsDelete',
      requiresSelection: true,
      button: {
        name: '删除',
        contextMenu: true,
        icon: ChonkyIconName.trash,
        group: 'Actions'
      }
    },
    async (data) => {
      const { id, parentId } = data!.state!.contextMenuTriggerFile as FileData;
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
    }
  );

  const createAction = defineFileAction(
    {
      id: 'omsCreate',
      button: {
        name: '创建文件夹',
        contextMenu: true,
        toolbar: true,
        icon: ChonkyIconName.folderCreate,
        group: 'Actions'
      }
    },
    (data) => {
      const { folderChain } = data.getReduxState();
      const currentFolder = folderChain[folderChain.length - 1];
      if (currentFolder) {
        // console.log('调用api添加文件', currentFolder);
        setIsMkdir(true);
        setDialogType('mkdir');
        setOpen(true);
        setParentDir(currentFolder.id);
      }
    }
  );

  const downloadAction = defineFileAction(
    {
      id: 'omsDownload',
      requiresSelection: true,
      button: {
        name: '下载文件',
        contextMenu: true,
        icon: ChonkyIconName.download
      }
    },
    (data) => {
      // console.log('下载', data.state.contextMenuTriggerFile);
      const { id, name } = data?.state?.contextMenuTriggerFile as FileData;
      if (hostId && id) {
        const url = `${baseUrl}${urlType.download_file}?${qs.stringify({ host_id: hostId, id })}`;
        // console.log('下载大文件', url);
        downloadFile(url, name);
      }
    }
  );

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

  const openSelectAction = defineFileAction({
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
  } as const);

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
        setDialogType('uploadFiles');
        setFilePath(currentFolder.id);
        setOpen(true);
      }
    }
  );

  const editFilesAction = defineFileAction(
    {
      id: 'edit_files',
      requiresSelection: true,
      button: {
        name: '编辑文件',
        toolbar: true,
        contextMenu: true,
        group: 'Actions',
        icon: ChonkyIconName.code
      }
    } as const,
    async ({ state }) => {
      // console.log(state);
      const { contextMenuTriggerFile } = state;
      const fileType = getFileType(contextMenuTriggerFile?.name);
      // console.log(fileType);
      setEditFile(contextMenuTriggerFile?.id || '');
      if (contextMenuTriggerFile?.isDir) {
        // 文件夹不能预览
        return;
      }
      // 调用api 获取文件内容 然后setCode
      const res = (await previewFileApi({ host_id: hostId, id: contextMenuTriggerFile?.id })) as HTTPResult;
      // console.log(res);
      if (res.code !== '200') {
        enqueueSnackbar(res.msg, {
          autoHideDuration: 3000,
          variant: 'error'
        });
        return;
      }
      setIsMkdir(false);
      setLanguage(codeType[fileType] || codeType.txt);
      setCode(res.data);
      setOpenEdit(true);
    }
  );

  const viewFilesAction = defineFileAction(
    {
      id: 'view_files',
      requiresSelection: true,
      button: {
        name: '预览文件',
        toolbar: true,
        contextMenu: true,
        group: 'Actions',
        icon: ChonkyIconName.loading
      }
    } as const,
    async ({ state }) => {
      // console.log(state);
      const { contextMenuTriggerFile } = state;
      const fileType = getFileType(contextMenuTriggerFile?.name);
      // console.log(fileType);
      if (contextMenuTriggerFile?.isDir) {
        // 文件夹不能预览
        return;
      }
      // 调用api 获取文件内容 然后setCode
      const res = (await previewFileApi({ host_id: hostId, id: contextMenuTriggerFile?.id })) as HTTPResult;
      // console.log(res);
      if (res.code !== '200') {
        enqueueSnackbar(res.msg, {
          autoHideDuration: 3000,
          variant: 'error'
        });
        return;
      }
      setIsMkdir(false);
      setDialogType('viewFile');
      setLanguage(codeType[fileType] || codeType.txt);
      setCode(res.data);
      setOpen(true);
    }
  );

  const myFileActions = [
    deleteAction,
    createAction,
    downloadAction,
    selectAllFileAction,
    clearSelectAction,
    openSelectAction,
    uploadFilesAction,
    viewFilesAction,
    editFilesAction
  ];

  const onSave = async (data: string) => {
    const res = await editFileApi({ host_id: hostId, id: editFile, modify_content: Base64.encode(data) });
    if (res.code !== '200') {
      enqueueSnackbar(res.msg, {
        autoHideDuration: 3000,
        variant: 'error'
      });
      return;
    }
    enqueueSnackbar(`文件${editFile}保存成功`, {
      autoHideDuration: 3000,
      variant: 'success'
    });
    return;
  };

  const handleAction = useCallback<FileActionHandler>(
    async (data) => {
      // console.log(data);
      if (data.id === ChonkyActions.OpenSelection.id && data.state?.contextMenuTriggerFile?.isDir) {
        // 右键菜单打开文件夹
        if (!hostId) {
          return;
        }
        const res = (await fileBrowserApi({ host_id: hostId, id: data.state.contextMenuTriggerFile.id })) as HTTPResult;
        if (res.code !== '200') {
          enqueueSnackbar(res.msg, {
            autoHideDuration: 3000,
            variant: 'error'
          });
          return;
        }
        setFiles(res.data.files);
        setFolderChain(res.data.folderChains);
      }
      if (data.id === ChonkyActions.OpenFiles.id && data.payload.targetFile?.isDir) {
        // 单击文件树进入文件夹
        if (!hostId) {
          return;
        }
        const res = (await fileBrowserApi({ host_id: hostId, id: data.payload.targetFile.id })) as HTTPResult;
        if (res.code !== '200') {
          enqueueSnackbar(res.msg, {
            autoHideDuration: 3000,
            variant: 'error'
          });
          return;
        }
        setFiles(res.data.files);
        setFolderChain(res.data.folderChains);
      }
      if (data.id === ChonkyActions.MouseClickFile.id && data.payload.clickType === 'double') {
        // 双击文件夹列表进入文件夹
        if (data.payload.file.isDir) {
          if (!hostId) {
            return;
          }
          const res = (await fileBrowserApi({ host_id: hostId, id: data.payload.file.id })) as HTTPResult;
          if (res.code !== '200') {
            enqueueSnackbar(res.msg, {
              autoHideDuration: 3000,
              variant: 'error'
            });
            return;
          }
          setFiles(res.data.files);
          setFolderChain(res.data.folderChains);
        }
      }
    },
    [hostId]
  );

  const browseFiles = async () => {
    const res = (await fileBrowserApi({ host_id: hostId, id: '.' })) as HTTPResult;
    if (res.code !== '200') {
      enqueueSnackbar(res.msg, {
        autoHideDuration: 3000,
        variant: 'error'
      });
      return;
    }
    // console.log('res', res);
    setFiles(res.data.files);
    setFolderChain(res.data.folderChains);
  };

  const updateFileList = useCallback(async () => {
    const datas = (await fileBrowserApi({ host_id: hostId, id: filePath })) as HTTPResult;
    // console.log('data', datas);
    if (datas.code !== '200') {
      return;
    }
    setFiles(datas.data.files);
    setFolderChain(datas.data.folderChains);
  }, [hostId, parentDir, dir, filePath]);

  const todo = useCallback(async () => {
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

  const showDialogType = {
    mkdir: (
      <TextField
        className={classes.mkdir}
        size="small"
        id="outlined-mkdir"
        label="请输入文件夹名称"
        variant="outlined"
        value={dir}
        onChange={(e) => setDir(e.target.value)}
      />
    ),
    uploadFiles: (
      <UploadButtons
        type="host"
        filePath={filePath}
        typeId={hostId}
        onBeforeUpload={() => {
          setOpen(false);
        }}
        onUploadComplete={updateFileList}
        // onUploadProgress={onUploadProgress}
        showUploadProgress={true}
      />
    ),
    viewFile: (
      <div style={{ maxHeight: '80vh', display: 'flex', justifyContent: 'space-evenly' }}>
        {language === codeType.md ? (
          <OmsViewMarkdown textContent={Base64.decode(code)} darkMode={darkMode} />
        ) : imgType[language] ? (
          <img
            src={`data:image/${getImgBase64Byte(language)};base64,${code}`}
            style={{ maxHeight: '74vh' }}
            alt="图片预览"
          />
        ) : (
          <OmsSyntaxHighlight textContent={Base64.decode(code)} language={language} darkMode={darkMode} />
        )}
      </div>
    )
  };

  return (
    <div className={classes.root}>
      <div className={classes.ControlBox}>
        <FormControl className={classes.Control}>
          <OmsLabel>请选择主机</OmsLabel>
          <OmsSelect
            labelId="typeItem-select-label"
            id="typeItem-select-label"
            value={hostId || ''}
            onChange={(e) => setHost(e?.target?.value as number)}>
            {hostList.map((e) => {
              return (
                <OmsMenuItem key={e.name} value={e.id}>
                  {`${e.name}: ${e.addr}`}
                </OmsMenuItem>
              );
            })}
          </OmsSelect>
        </FormControl>
        <Button disabled={!hostId} className={classes.LinkButton} startIcon={<LinkIcon />} onClick={browseFiles}>
          查看
        </Button>
      </div>
      <div className={classes.FileBrowser}>
        <FullFileBrowser
          files={files}
          folderChain={folderChain}
          fileActions={myFileActions}
          onFileAction={handleAction}
          darkMode={darkMode}
          i18n={{
            formatters: { formatFileModDate: (i, files) => files?.modDate as string }
          }}
        />
      </div>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="file-browser"
        fullWidth
        maxWidth={dialogType === 'viewFile' ? 'xl' : 'sm'}>
        <DialogContent
          style={{ minHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center ' }}
          dividers>
          <DialogContentText>{showDialogType[dialogType]}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            关闭
          </Button>
          {isMkdir ? (
            <Button onClick={todo} color="primary">
              确定
            </Button>
          ) : null}
        </DialogActions>
      </Dialog>
      <FullScreenEditorDialog
        open={openEdit}
        fileName={editFile}
        darkMode={darkMode}
        language={language}
        defaultValue={Base64.decode(code)}
        onSave={onSave}
        onClose={() => setOpenEdit(false)}
      />
    </div>
  );
};

const FileBrowser = memo(FileBrowserComponent, (prevProps, nextProps) => {
  return prevProps.hostList === nextProps.hostList;
});

function stateInit() {
  return [
    {
      label: '窗口',
      index: 0
    }
  ];
}

function stateReducer(state, action: any) {
  switch (action.type) {
    case 'update':
      return state.map((e) => {
        if (e.index === action.index) {
          return { ...e, [action.key]: action.payload };
        } else {
          return e;
        }
      });
    case 'add':
      return [
        ...state,
        {
          label: '窗口',
          index: new Date().getTime()
        }
      ];
    case 'remove':
      return state.filter((e) => e.index !== action.index);
    case 'reset':
      return stateInit();
    default:
      throw new Error();
  }
}

const FileBrowserPage = ({ hostList, updateHostList }: tProps) => {
  const [value, setValue] = useState(0);
  const [pageList, pageDispatch] = useReducer(stateReducer, stateInit(), stateInit);

  useEffect(() => {
    updateHostList();
  }, []);

  const handleChange = (event: React.ChangeEvent<any>, newValue: number) => {
    setValue(newValue);
  };
  const addTab = () => {
    pageDispatch({ type: 'add' });
  };
  const removeTab = (index) => {
    pageDispatch({ type: 'remove', index });
  };
  return (
    <div style={{ width: '100%' }}>
      <ChromeTabs
        variant="scrollable"
        scrollButtons="auto"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example">
        {pageList.map((p, i) => (
          <ChromeTab
            key={p.index}
            label={
              <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
                {p.label + (i + 1)}
                <Tooltip title="关闭窗口" placement="top-start">
                  <CloseIcon fontSize="small" color="error" onClick={() => removeTab(p.index)} />
                </Tooltip>
              </div>
            }
            {...a11yProps(p.index)}
          />
        ))}
        <Tooltip title="新窗口" placement="top-start">
          <IconButton color="primary" onClick={addTab}>
            <AddIcon />
          </IconButton>
        </Tooltip>
      </ChromeTabs>
      {pageList.map((p, index) => (
        <ChromeTabPanel key={p.index} value={value} index={index} style={{ height: '85vh' }}>
          <FileBrowser hostList={hostList} />
        </ChromeTabPanel>
      ))}
    </div>
  );
};

export default connect(mapStateToProps, mapDispatch)(FileBrowserPage);
