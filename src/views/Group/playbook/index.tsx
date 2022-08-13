import React, { useReducer, useRef, useEffect, useState, useCallback } from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import styles from './style';
import { useSnackbar } from 'notistack';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import OmsTable from '../../../components/OmsTable';
import { GridRowParams } from '@mui/x-data-grid/models/params/gridRowParams';
import { GridActionsCellItem } from '@mui/x-data-grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Paper from '@mui/material/Paper';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@material-ui/core/Tooltip';
import InfoIcon from '@mui/icons-material/Info';
import EditIcon from '@mui/icons-material/Edit';
import Grid from '@mui/material/Grid';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import TextField from '../../../components/OmsTextField/index';
import Typography from '@mui/material/Typography';
import TipDialog from '../../../components/OmsDialog/TipDialog';
import FormDialog from '../../../components/OmsDialog/FormDialog';
import Form from '@rjsf/core';
import {
  addPlayerApi,
  deletePlayerApi,
  editPlayerApi,
  getSchemaInfoApi,
  tSchemaInfo
} from '../../../api/http/playbook';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import FileWidget from '../../../components/playbook/FileWidget';
import TextWidget from '../../../components/playbook/TextWidget';
import TextareaWidget from '../../../components/playbook/TextareaWidget';
import { debounce } from '../../../utils/debounce';
import actions from '../../../store/action';
import { ActionCreator } from 'redux';
import { PlayerInfo } from '../../../store/interface';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import { DragStep } from './DragStep';

// eslint-disable-next-line @typescript-eslint/ban-types
type tDP = {
  initPlayerAction: ActionCreator<any>;
};

// eslint-disable-next-line @typescript-eslint/ban-types
type tOP = {};

// eslint-disable-next-line @typescript-eslint/ban-types
type tSP = tOP & {
  playerList: PlayerInfo[];
};

type tProps = tSP & tDP;

type tStep = { name: string; type: string; seq: number; params: any };

function formInit() {
  return {
    open: false,
    title: '',
    schemaList: [],
    steps: [],
    playerName: '',
    playerId: 0,
    isAdd: false
  };
}

function formReducer(state, action: any) {
  switch (action.type) {
    case 'open':
      return { ...state, open: true };
    case 'close':
      return { ...state, open: false };
    case 'isAdd':
      return { ...state, isAdd: action.payload };
    case 'title':
      return { ...state, title: action.payload };
    case 'setSchemaList':
      return { ...state, schemaList: action.payload };
    case 'addSchema':
      return { ...state, schemaList: [...state.schemaList, action.payload] };
    case 'setSteps':
      return { ...state, steps: action.payload };
    case 'addStep':
      return { ...state, steps: [...state.steps, action.payload] };
    case 'deleteSchema':
      return { ...state, schemaList: state.schemaList.filter((e, i) => i !== action.payload) };
    case 'deleteStep':
      return { ...state, steps: state.steps.filter((e, i) => i !== action.payload) };
    case 'deleteSchema-step':
      return {
        ...state,
        schemaList: state.schemaList.filter((e, i) => i !== action.payload),
        steps: state.steps.filter((e, i) => i !== action.payload)
      };
    case 'editStep':
      state.steps.splice(action.payload.idx, 1, action.payload.step);
      return { ...state };
    case 'setPlayerName':
      return { ...state, playerName: action.payload };
    case 'setPlayerId':
      return { ...state, playerId: action.payload };
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
  playerList: state.playerList
});
const mapDispatch: tDP = {
  initPlayerAction: actions.initPlayerInfo
};

const uiSchema = {
  'ui:submitButtonOptions': {
    props: {
      disabled: false,
      className: 'btn btn-info'
    },
    norender: true,
    submitText: '保存'
  },
  shell: {
    'ui:widget': 'textarea'
  }
};
const customFormats = {
  'data-url': '.*'
};

const Playbook = (props: tProps) => {
  const { initPlayerAction, playerList } = props;
  const classes = makeStyles(styles)();
  const { enqueueSnackbar } = useSnackbar();
  const [form, formDispatch] = useReducer(formReducer, formInit(), formInit);
  const [tip, tipDispatch] = useReducer(tipReducer, tipInit(), tipInit);
  const [schema, setSchema] = useState<tSchemaInfo[]>([]);

  useEffect(() => {
    getSchemaInfoApi().then((res) => {
      if (res.code !== '200') {
        enqueueSnackbar(`获取schema信息失败${res.msg}`, {
          autoHideDuration: 3000,
          variant: 'error'
        });
        return;
      }
      setSchema(res.data);
    });
    initPlayerAction();
  }, [initPlayerAction]);

  const moveStep = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      formDispatch({
        type: 'setSteps',
        payload: update(form.steps, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, form.steps[dragIndex] as tStep]
          ]
        })
      });
      formDispatch({
        type: 'setSchemaList',
        payload: update(form.schemaList, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, form.schemaList[dragIndex]]
          ]
        })
      });
    },
    [form.steps, form.schemaList]
  );

  const getChangeValue = (id, data) => {
    const step = {
      name: form.steps[id]?.name,
      type: form.steps[id]?.type,
      seq: id,
      params: data.formData
    };
    formDispatch({ type: 'editStep', payload: { idx: id, step }});
  };

  const setPlayer = useCallback(async () => {
    try {
      if (form.steps.length < 0) {
        enqueueSnackbar('请添加剧本执行的步骤！', {
          autoHideDuration: 5000,
          variant: 'warning'
        });
        return;
      }
      if (form.steps.some((e) => !e.params)) {
        enqueueSnackbar('请将步骤信息填写完整 或 等待文件上传完成！', {
          autoHideDuration: 5000,
          variant: 'warning'
        });
        return;
      }
      if (!form.playerName || form.steps.some((e) => !e.name)) {
        enqueueSnackbar('剧本名称和步骤名称不能为空', {
          autoHideDuration: 5000,
          variant: 'warning'
        });
        return;
      }
      const reqData = {
        name: form.playerName,
        steps: JSON.stringify(
          form.steps.map((step, i) => ({
            name: step.name,
            seq: i,
            type: step.type,
            params: JSON.stringify(step.params)
          }))
        )
      };
      if (form.isAdd) {
        const res = await addPlayerApi(reqData);
        if (res.code === '200') {
          enqueueSnackbar(`'剧本${reqData.name}添加成功！`, {
            autoHideDuration: 5000,
            variant: 'success'
          });
          formDispatch({ type: 'reset' });
          initPlayerAction();
        } else {
          enqueueSnackbar(`'剧本${reqData.name}添加失败！${res.msg}`, {
            autoHideDuration: 5000,
            variant: 'error'
          });
        }
      } else {
        const res = await editPlayerApi({ id: form.playerId, ...reqData });
        if (res.code === '200') {
          enqueueSnackbar(`'剧本${reqData.name}修改成功！`, {
            autoHideDuration: 5000,
            variant: 'success'
          });
          formDispatch({ type: 'reset' });
          initPlayerAction();
        } else {
          enqueueSnackbar(`'剧本${reqData.name}修改失败！${res.msg}`, {
            autoHideDuration: 5000,
            variant: 'error'
          });
          formDispatch({ type: 'reset' });
        }
      }
    } catch (e) {
      enqueueSnackbar(`'剧本操作ERR: ${JSON.stringify(e)}`, {
        autoHideDuration: 5000,
        variant: 'error'
      });
    }
    return true;
  }, [form.playerName, form.steps]);

  const openForm = async (isAdd: boolean) => {
    const res = await getSchemaInfoApi();
    if (res.code !== '200') {
      enqueueSnackbar(`获取schema信息失败${res.msg}`, {
        autoHideDuration: 3000,
        variant: 'error'
      });
      return;
    }
    setSchema(res.data);
    formDispatch({ type: 'isAdd', payload: isAdd });
    formDispatch({ type: 'title', payload: isAdd ? '添加剧本' : '编辑剧本' });
    formDispatch({ type: 'open' });
  };

  const getContent = () => {
    return (
      <>
        <Paper elevation={3} style={{ minWidth: '600px', marginBottom: '20px' }}>
          <List>
            {schema?.map((e, index) => (
              <ListItem
                key={index}
                secondaryAction={
                  <Tooltip title={`添加${e.type}`} placement="top-start">
                    <IconButton
                      aria-label="add-schema"
                      color="secondary"
                      onClick={() => {
                        formDispatch({ type: 'addSchema', payload: e.schema });
                        formDispatch({
                          type: 'addStep',
                          payload: {
                            name: '',
                            type: e.type,
                            seq: 0,
                            params: ''
                          }
                        });
                      }}>
                      <AddIcon />
                    </IconButton>
                  </Tooltip>
                }>
                <ListItemText primary={`${e.type}: ${e?.desc || ''}`} />
              </ListItem>
            ))}
          </List>
        </Paper>
        {form.schemaList.length > 0 ? (
          <Paper elevation={3} style={{ maxWidth: '700px', padding: '10px' }}>
            <Grid container spacing={1}>
              <Grid item xs={4}>
                <Typography variant="h6" gutterBottom component="div">
                  剧本名称:
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <TextField
                  required
                  id="player-name"
                  label="剧本名称"
                  variant="outlined"
                  defaultValue={form.playerName}
                  onChange={debounce((e) => formDispatch({ type: 'setPlayerName', payload: e.target.value }), 500)}
                  style={{ marginBottom: '40px', width: '100%' }}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <DndProvider backend={HTML5Backend}>
                {form.schemaList.map((e, i) => (
                  <Grid key={i} item xs={12}>
                    <DragStep index={i} moveStep={moveStep}>
                      <Grid container spacing={1}>
                        <Grid item xs={2}>
                          <Typography variant="h6" gutterBottom component="div">
                            {`步骤${i}`}
                          </Typography>
                        </Grid>
                        <Grid item xs={8}>
                          <TextField
                            id={`step-name${i}`}
                            label="步骤名称"
                            required
                            variant="outlined"
                            value={form.steps[i]?.name || ''}
                            style={{ width: '100%' }}
                            onChange={(e) => {
                              const step = {
                                name: e.target.value,
                                type: form.steps[i]?.type,
                                seq: form.steps[i]?.seq,
                                params: form.steps[i]?.params
                              };
                              formDispatch({ type: 'editStep', payload: { idx: i, step } });
                            }}
                          />
                        </Grid>
                        <Grid item xs={2}>
                          <Tooltip title={`删除步骤${i}`} placement="top-start">
                            <IconButton
                              aria-label="delete-schema"
                              color="secondary"
                              onClick={() => {
                                formDispatch({ type: 'deleteSchema-step', payload: i });
                              }}>
                              <RemoveIcon />
                            </IconButton>
                          </Tooltip>
                        </Grid>
                      </Grid>
                      <Form
                        key={i}
                        schema={e}
                        uiSchema={uiSchema}
                        formData={form.steps[i]?.params}
                        onChange={debounce((data) => getChangeValue(i, data), 500)}
                        widgets={{ FileWidget, TextWidget, TextareaWidget }}
                        idPrefix={`rjsf_prefix${i}`}
                        customFormats={customFormats}
                      />
                    </DragStep>
                  </Grid>
                ))}
              </DndProvider>
            </Grid>
          </Paper>
        ) : null}
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
      headerName: '剧本名称',
      minWidth: 240
    },
    {
      field: 'action',
      headerName: '操作',
      minWidth: 240,
      type: 'actions',
      getActions: (params: GridRowParams) => {
        const { id, name, steps } = params.row;
        return [
          <GridActionsCellItem
            key={id + 'playbook_info'}
            icon={
              <Tooltip title="详情信息" placement="top-start">
                <InfoIcon color="primary" fontSize="medium" />
              </Tooltip>
            }
            label="详情信息"
          />,
          <GridActionsCellItem
            key={id + 'playbook_Edit'}
            icon={
              <Tooltip title="编辑" placement="top-start">
                <EditIcon
                  color="secondary"
                  fontSize="medium"
                  onClick={() => {
                    formDispatch({ type: 'setPlayerId', payload: id });
                    formDispatch({
                      type: 'setSteps',
                      payload: steps.map((step) => ({ ...step, params: JSON.parse(step.params) }))
                    });
                    formDispatch({
                      type: 'setSchemaList',
                      payload: steps.map((step) => schema.find((s) => s.type === step.type)?.schema || schema[0].schema)
                    });
                    formDispatch({ type: 'setPlayerName', payload: name });
                    openForm(false);
                  }}
                />
              </Tooltip>
            }
            label="编辑"
          />,
          <GridActionsCellItem
            key={id + 'playbook-Delete'}
            icon={
              <Tooltip title="删除" placement="top-start">
                <DeleteForeverIcon
                  color="error"
                  fontSize="medium"
                  onClick={() => {
                    tipDispatch({ type: 'title', payload: `删除剧本` });
                    tipDispatch({ type: 'text', payload: `确认要删除${name}吗? id: ${id}` });
                    tipDispatch({
                      type: 'todo',
                      payload: async () => {
                        const res = await deletePlayerApi(id);
                        if (res.code === '200') {
                          enqueueSnackbar(`'剧本${name}删除成功！`, {
                            autoHideDuration: 5000,
                            variant: 'success'
                          });
                          initPlayerAction();
                        } else {
                          enqueueSnackbar(`'剧本${name}删除失败！ ${res.msg}`, {
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
        <Button variant="contained" className={classes.addButton} onClick={() => openForm(true)}>
          添加剧本
        </Button>
      </div>
      <div className={classes.shellBox}>
        <Card style={{ width: '100%', height: '100%', margin: '0 auto', marginTop: '20px' }}>
          <OmsTable columns={columns} rows={playerList}></OmsTable>
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
          if (!form.isAdd) {
            formDispatch({ type: 'reset' });
          }
        }}
        title={form.title}
        todo={setPlayer}
      />
    </div>
  );
};

export default connect(mapStateToProps, mapDispatch)(Playbook);
