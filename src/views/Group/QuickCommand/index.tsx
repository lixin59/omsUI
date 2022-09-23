import React, { useReducer, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import styles from './style';
import { useSnackbar } from 'notistack';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import OmsTable from '../../../components/OmsTable';
import { GridRowParams } from '@mui/x-data-grid/models/params/gridRowParams';
import { GridActionsCellItem } from '@mui/x-data-grid';
import Tooltip from '@material-ui/core/Tooltip';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '../../../components/OmsTextField/index';
import TipDialog from '../../../components/OmsDialog/TipDialog';
import FormDialog from '../../../components/OmsDialog/FormDialog';
import actions from '../../../store/action';
import { ActionCreator } from 'redux';
import { deleteQuickCommand, editQuickCommand, addQuickCommand, tQuickCommandReq } from '../../../api/http/command';
import { HostInfo, QuickCommandInfo } from '../../../store/interface';
import { GridValueGetterParams } from '@mui/x-data-grid/models/params/gridCellParams';
import { MaterialUISwitch, Android12Switch, IOSSwitch } from '../../../components/OmsSwitch/MUISwitch';

type tDP = {
  initQuickCommandAction: ActionCreator<any>;
};

// eslint-disable-next-line @typescript-eslint/ban-types
type tOP = {};

// eslint-disable-next-line @typescript-eslint/ban-types
type tSP = tOP & {
  quickCommandList: QuickCommandInfo[];
};

type tProps = tSP & tDP;

function formInit() {
  return {
    open: false,
    title: '',
    isAdd: false,
    quickCommand_id: 0,
    quickCommand_name: '',
    quickCommand_cmd: '',
    quickCommand_append_cr: false
  };
}

function formReducer(state, action: any) {
  switch (action.type) {
    case 'open':
      return { ...state, open: true };
    case 'close':
      return { ...state, open: false };
    case 'title':
      return { ...state, title: action.payload };
    case 'isAdd':
      return { ...state, isAdd: action.payload };
    case 'setQuickCommand_id':
      return { ...state, quickCommand_id: action.payload };
    case 'setQuickCommand_name':
      return { ...state, quickCommand_name: action.payload };
    case 'setQuickCommand_cmd':
      return { ...state, quickCommand_cmd: action.payload };
    case 'setQuickCommand_append_cr':
      return { ...state, quickCommand_append_cr: action.payload };
    case 'reset':
      return formInit();
    default:
      throw new Error();
  }
}

function tipInit() {
  return {
    open: false,
    text: '',
    title: '',
    todo: true
  };
}

function tipReducer(state, action: any) {
  switch (action.type) {
    case 'open':
      return { ...state, open: true };
    case 'close':
      return { ...state, open: false };
    case 'text':
      return { ...state, text: action.payload };
    case 'title':
      return { ...state, title: action.payload };
    case 'todo':
      return { ...state, todo: action.payload };
    case 'reset':
      return tipInit();
    default:
      throw new Error();
  }
}

const mapStateToProps = (state, props: tOP): tSP => ({
  ...props,
  quickCommandList: state.quickCommandList
});
const mapDispatch: tDP = {
  initQuickCommandAction: actions.initQuickCommandList
};

const QuickCommand = (props: tProps) => {
  const { initQuickCommandAction, quickCommandList } = props;
  const classes = makeStyles(styles)();
  const { enqueueSnackbar } = useSnackbar();
  const [form, formDispatch] = useReducer(formReducer, formInit(), formInit);
  const [tip, tipDispatch] = useReducer(tipReducer, tipInit(), tipInit);

  useEffect(() => {
    initQuickCommandAction();
  }, [initQuickCommandAction]);

  const openForm = async (isAdd: boolean) => {
    formDispatch({ type: 'isAdd', payload: isAdd });
    formDispatch({ type: 'title', payload: isAdd ? '添加快捷命令' : '编辑快捷命令' });
    formDispatch({ type: 'open' });
  };

  const setQuickCommand = useCallback(async () => {
    try {
      if (!form.quickCommand_name || !form.quickCommand_cmd) {
        enqueueSnackbar('快捷命令名称和步骤名称不能为空', {
          autoHideDuration: 5000,
          variant: 'warning'
        });
        return;
      }
      const reqData: tQuickCommandReq = {
        name: form.quickCommand_name,
        cmd: form.quickCommand_cmd,
        append_cr: form.quickCommand_append_cr
      };
      if (form.isAdd) {
        const res = await addQuickCommand(reqData);
        if (res.code === '200') {
          enqueueSnackbar(`快捷命令 ${reqData.name}添加成功！`, {
            autoHideDuration: 5000,
            variant: 'success'
          });
          formDispatch({ type: 'reset' });
          initQuickCommandAction();
        } else {
          enqueueSnackbar(`快捷命令 ${reqData.name}添加失败！${res.msg}`, {
            autoHideDuration: 5000,
            variant: 'error'
          });
        }
      } else {
        const res = await editQuickCommand({ id: form.quickCommand_id, ...reqData });
        if (res.code === '200') {
          enqueueSnackbar(`快捷命令 ${reqData.name}修改成功！`, {
            autoHideDuration: 5000,
            variant: 'success'
          });
          formDispatch({ type: 'reset' });
          initQuickCommandAction();
        } else {
          enqueueSnackbar(`快捷命令 ${reqData.name}修改失败！${res.msg}`, {
            autoHideDuration: 5000,
            variant: 'error'
          });
          formDispatch({ type: 'reset' });
        }
      }
    } catch (e) {
      enqueueSnackbar(`'快捷命令操作ERR: ${JSON.stringify(e)}`, {
        autoHideDuration: 5000,
        variant: 'error'
      });
    }
    return true;
  }, [form.quickCommand_name, form.quickCommand_cmd, form.quickCommand_append_cr, form.quickCommand_id]);

  const getContent = () => {
    return (
      <>
        <TextField
          margin="dense"
          id="quickCommand_name"
          label="快捷命令名称"
          fullWidth
          value={form.quickCommand_name}
          onChange={(e) => formDispatch({ type: 'setQuickCommand_name', payload: e.target.value })}
        />
        <TextField
          margin="dense"
          id="quickCommand_cmd"
          label="cmd"
          fullWidth
          value={form.quickCommand_cmd}
          onChange={(e) => formDispatch({ type: 'setQuickCommand_cmd', payload: e.target.value })}
        />
        <Stack style={{ marginTop: '4px' }} direction="row" spacing={1} alignItems="center">
          <Typography>是否追加CR:</Typography>
          <IOSSwitch
            checked={form.quickCommand_append_cr}
            onChange={(e) => formDispatch({ type: 'setQuickCommand_append_cr', payload: e.target.checked })}
          />
        </Stack>
      </>
    );
  };

  const content = getContent();

  const columns = [
    {
      field: 'id',
      headerName: 'id',
      minWidth: 80
    },
    {
      field: 'name',
      headerName: '命令名称',
      minWidth: 240
    },
    {
      field: 'cmd',
      headerName: '命令内容',
      minWidth: 240
    },
    {
      field: 'append_cr',
      headerName: '是否追加CR',
      minWidth: 240,
      valueGetter: (params: GridValueGetterParams<HostInfo>) => {
        return params.row.append_cr ? '是' : '否';
      }
    },
    {
      field: 'action',
      headerName: '操作',
      minWidth: 240,
      type: 'actions',
      getActions: (params: GridRowParams) => {
        const { id, name, cmd, append_cr } = params.row;
        return [
          <GridActionsCellItem
            key={id + 'playbook_Edit'}
            icon={
              <Tooltip title="编辑" placement="top-start">
                <EditIcon
                  color="secondary"
                  fontSize="medium"
                  onClick={() => {
                    formDispatch({ type: 'setQuickCommand_id', payload: id });
                    formDispatch({ type: 'setQuickCommand_name', payload: name });
                    formDispatch({ type: 'setQuickCommand_cmd', payload: cmd });
                    formDispatch({ type: 'setQuickCommand_append_cr', payload: append_cr });
                    openForm(false);
                  }}
                />
              </Tooltip>
            }
            label="编辑"
          />,
          <GridActionsCellItem
            key={id + 'QuickCommand-Delete'}
            icon={
              <Tooltip title="删除" placement="top-start">
                <DeleteForeverIcon
                  color="error"
                  fontSize="medium"
                  onClick={() => {
                    tipDispatch({ type: 'title', payload: `删除快捷命令` });
                    tipDispatch({ type: 'text', payload: `确认要删除${name}吗? id: ${id}` });
                    tipDispatch({
                      type: 'todo',
                      payload: async () => {
                        const res = await deleteQuickCommand(id);
                        if (res.code === '200') {
                          enqueueSnackbar(`'快捷命令: ${name}删除成功！`, {
                            autoHideDuration: 5000,
                            variant: 'success'
                          });
                          initQuickCommandAction();
                        } else {
                          enqueueSnackbar(`'快捷命令: ${name}删除失败！ ${res.msg}`, {
                            autoHideDuration: 5000,
                            variant: 'error'
                          });
                        }
                      }
                    });
                    tipDispatch({ type: 'open' });
                  }}
                />
              </Tooltip>
            }
            label="删除"
          />
        ];
      }
    }
  ];

  return (
    <div className={classes.itemPage}>
      <div className={classes.ControlBox}>
        <Button variant="contained" style={{ marginRight: '20px' }} onClick={() => openForm(true)}>
          添加快捷命令
        </Button>
      </div>
      <div className={classes.shellBox}>
        <Card style={{ width: '100%', height: '100%', margin: '0 auto', marginTop: '20px' }}>
          <OmsTable columns={columns} rows={quickCommandList}></OmsTable>
        </Card>
      </div>
      <TipDialog
        open={tip.open}
        text={tip.text}
        title={tip.title}
        toClose={() => tipDispatch({ type: 'close' })}
        todo={tip.todo}
      />
      <FormDialog
        maxWidth="md"
        open={form.open}
        content={content}
        toClose={() => {
          formDispatch({ type: 'close' });
          formDispatch({ type: 'reset' });
        }}
        title={form.title}
        todo={setQuickCommand}
      />
    </div>
  );
};

export default connect(mapStateToProps, mapDispatch)(QuickCommand);
