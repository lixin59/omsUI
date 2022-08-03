import React, { useReducer, useState } from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import styles from './style';
import { useSnackbar } from 'notistack';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import OmsTable from '../../../components/OmsTable';
import { GridRowParams } from '@mui/x-data-grid/models/params/gridRowParams';
import { GridActionsCellItem } from '@mui/x-data-grid';
import Tooltip from '@material-ui/core/Tooltip';
import InfoIcon from '@mui/icons-material/Info';
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import TipDialog from '../../../components/OmsDialog/TipDialog';
import FormDialog from '../../../components/OmsDialog/FormDialog';

type tDP = {};

type tOP = {};

type tSP = tOP & {};

type tProps = tSP & tDP;

function formInit() {
  return {
    open: false,
    title: '',
    todo: () => {
      console.log('test');
    }
  };
}

function formReducer(state, action: any) {
  switch (action.type) {
    case 'open':
      return { ...state, open: true };
    case 'close':
      return { ...state, open: false };
    case 'todo':
      return { ...state, todo: action.payload };
    case 'title':
      return { ...state, title: action.payload };
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
  ...props
});
const mapDispatch: tDP = {};

const Playbook = (props: tProps) => {
  const classes = makeStyles(styles)();
  const { enqueueSnackbar } = useSnackbar();
  const [form, formDispatch] = useReducer(formReducer, formInit(), formInit);
  const [tip, tipDispatch] = useReducer(tipReducer, tipInit(), tipInit);

  const formContent = <div>test</div>;

  const openForm = () => {
    formDispatch({ type: 'title', payload: '添加任务' });
    formDispatch({
      type: 'todo',
      payload: () => {
        console.log('playbook');
      }
    });
    formDispatch({ type: 'open' });
  };

  const columns = [
    {
      field: 'id',
      headerName: 'id',
      minWidth: 80
    },
    {
      field: 'name',
      headerName: '剧本名称',
      minWidth: 240
    },
    {
      field: 'action',
      headerName: '操作',
      minWidth: 240,
      type: 'actions',
      getActions: (params: GridRowParams) => {
        const { id, name } = params.row;
        return [
          <GridActionsCellItem
            key={id + 'playbook_info'}
            icon={
              <Tooltip title="详情信息" placement="top-start">
                <InfoIcon color="primary" fontSize="medium" onClick={() => {}} />
              </Tooltip>
            }
            label="详情信息"
          />,
          <GridActionsCellItem
            key={id + 'playbook_Edit'}
            icon={
              <Tooltip title="编辑" placement="top-start">
                <EditIcon color="secondary" fontSize="medium" onClick={() => {}} />
              </Tooltip>
            }
            label="编辑"
          />,
          <GridActionsCellItem
            key={id + 'playbook-Delete'}
            icon={
              <Tooltip title="删除" placement="top-start">
                <DeleteForeverIcon color="error" fontSize="medium" onClick={() => {}} />
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
        <Button className={classes.addButton} onClick={openForm}>
          添加剧本
        </Button>
      </div>
      <div className={classes.shellBox}>
        <Card style={{ width: '100%', height: '100%', margin: '0 auto', marginTop: '20px' }}>
          <OmsTable columns={columns} rows={[{ id: 1, name: '测试' }]}></OmsTable>
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
        open={form.open}
        content={formContent}
        toClose={() => formDispatch({ type: 'close' })}
        title={form.title}
        todo={form.todo}
      />
    </div>
  );
};

export default connect(mapStateToProps, mapDispatch)(Playbook);
