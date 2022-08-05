import React, { useReducer, useRef, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import styles from './style';
import { useSnackbar } from 'notistack';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import OmsTable from '../../../components/OmsTable';
import { GridRowParams } from '@mui/x-data-grid/models/params/gridRowParams';
import { GridActionsCellItem } from '@mui/x-data-grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Paper from '@mui/material/Paper';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@material-ui/core/Tooltip';
import InfoIcon from '@mui/icons-material/Info';
import EditIcon from '@material-ui/icons/Edit';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import TextField from '../../../components/OmsTextField/index';
import Typography from '@mui/material/Typography';
import TipDialog from '../../../components/OmsDialog/TipDialog';
import FormDialog from '../../../components/OmsDialog/FormDialog';
import Form from '@rjsf/material-ui';
import { getSchemaInfoApi, tSchemaInfo } from '../../../api/http/playbook';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import FileWidget from '../../../components/playbook/FileWidget';
import TextWidget from '../../../components/playbook/TextWidget';
import TextareaWidget from '../../../components/playbook/TextareaWidget';

// eslint-disable-next-line @typescript-eslint/ban-types
type tDP = {};

// eslint-disable-next-line @typescript-eslint/ban-types
type tOP = {};

// eslint-disable-next-line @typescript-eslint/ban-types
type tSP = tOP & {};

type tProps = tSP & tDP;

function formInit() {
  return {
    open: false,
    title: '',
    content: null,
    schemaList: [],
    steps: [],
    playerName: '',
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
    case 'content':
      return { ...state, content: action.payload };
    case 'addSchema':
      return { ...state, schemaList: [...state.schemaList, action.payload] };
    case 'addStep':
      return { ...state, steps: [...state.steps, action.payload] };
    case 'deleteSchema':
      return { ...state, schemaList: state.schemaList.filter((e, i) => i !== action.payload) };
    case 'deleteStep':
      return { ...state, steps: state.steps.filter((e, i) => i !== action.payload) };
    case 'editStep':
      state.steps.splice(action.payload.idx, 1, action.payload.step);
      return { ...state };
    case 'setPlayerName':
      return { ...state, playerName: action.payload };
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

const uiSchema = {
  'ui:submitButtonOptions': {
    props: {
      disabled: false,
      className: 'btn btn-info'
    },
    norender: false,
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
  const classes = makeStyles(styles)();
  const { enqueueSnackbar } = useSnackbar();
  const [form, formDispatch] = useReducer(formReducer, formInit(), formInit);
  const [tip, tipDispatch] = useReducer(tipReducer, tipInit(), tipInit);
  const [schema, setSchema] = useState<tSchemaInfo[]>([]);

  console.log('sssssssssssssssss', form);

  const getChangeValue = (id, data) => {
    console.log(id, data);
    // const type = Object.keys(data.formData)[0] || '';
    const params = JSON.stringify(data.formData);
    const step = {
      name: form.steps[id].name,
      type: form.steps[id].type,
      seq: id,
      params
    };
    formDispatch({ type: 'editStep', payload: { idx: id, step }});
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
                            name: e.type,
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
                <ListItemText primary={e.type} />
              </ListItem>
            ))}
          </List>
        </Paper>
        {form.schemaList.length > 0 ? (
          <Paper elevation={3} style={{ maxWidth: '700px', padding: '10px', paddingRight: '0px' }}>
            <Grid container spacing={1}>
              <Grid item xs={4}>
                <Typography variant="h6" gutterBottom component="div">
                  添加剧本名称:
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <TextField
                  id="player-name"
                  label="剧本名称"
                  variant="outlined"
                  onChange={(e) => formDispatch({ type: 'setPlayerName', payload: e.target.value })}
                  style={{ marginBottom: '40px', width: '100%' }}
                />
              </Grid>
              <Divider />
            </Grid>
            <Grid container spacing={2}>
              {form.schemaList.map((e, i) => (
                <Grid item xs={12} key={i}>
                  <Paper elevation={2} style={{ padding: '10px' }}>
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
                          variant="outlined"
                          style={{ width: '100%' }}
                          onChange={(e) => {
                            const step = {
                              name: e.target.value,
                              type: form.steps[i].type,
                              seq: form.steps[i].seq,
                              params: form.steps[i].params
                            };
                            formDispatch({ type: 'editStep', payload: { idx: i, step }});
                          }}
                        />
                      </Grid>
                      <Grid item xs={2}>
                        <Tooltip title={`删除步骤${i}`} placement="top-start">
                          <IconButton
                            aria-label="delete-schema"
                            color="secondary"
                            onClick={() => {
                              formDispatch({ type: 'deleteSchema', payload: i });
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
                      onChange={(data) => console.log(data)}
                      onSubmit={(data) => getChangeValue(i, data)}
                      widgets={{ FileWidget, TextWidget, TextareaWidget }}
                      customFormats={customFormats}
                    />
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>
        ) : null}
      </>
    );
  };

  const content = getContent();

  const openForm = async () => {
    const res = await getSchemaInfoApi();
    if (res.code !== '200') {
      enqueueSnackbar(`获取schema信息失败${res.msg}`, {
        autoHideDuration: 3000,
        variant: 'error'
      });
      return;
    }
    setSchema(res.data);
    formDispatch({ type: 'todo', payload: () => {} });
    formDispatch({ type: 'title', payload: '添加剧本' });
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
        maxWidth="md"
        open={form.open}
        content={content}
        toClose={() => formDispatch({ type: 'close' })}
        title={form.title}
        todo={form.todo}
      />
    </div>
  );
};

export default connect(mapStateToProps, mapDispatch)(Playbook);
