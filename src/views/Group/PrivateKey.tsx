import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import KeyFileTable from './KeyFileTable';
import styles from './style';
import { ActionCreator } from 'redux';
import { IState, PrivateKeyInfo } from '../../store/interface';
import { useSnackbar } from 'notistack';
import { addPrivateKeyApi, getPrivateKeysApi, HTTPResult } from '../../api/http/httpRequestApi';
import actions from '../../store/action';
import { connect } from 'react-redux';

type tDP = {
  deletePrivateKey: ActionCreator<any>;
  addPrivateKey: ActionCreator<any>;
  editPrivateKey: ActionCreator<any>;
  toInit: ActionCreator<any>;
};

type tOP = {};

type tSP = tOP & {
  privateKeyList: PrivateKeyInfo[]
};

type tProps = tSP & tDP;

const mapStateToProps = (state: IState, props: tOP): tSP => ({
  ...props,
  privateKeyList: state.privateKeyList
});
const mapDispatch: tDP = {
  toInit: actions.initPrivateKeyInfo,
  deletePrivateKey: actions.deletePrivateKeyInfo,
  addPrivateKey: actions.addPrivateKeyInfo,
  editPrivateKey: actions.editPrivateKeyInfo
};

const PrivateKey = (props: tProps) => {
  const classes = makeStyles(styles)();
  const { enqueueSnackbar } = useSnackbar();
  const [name, setName] = useState<string>('');
  const [passphrase, setPassphrase] = useState<string>('');
  const [fileName, setFileName] = useState<string>('未选择文件');
  const [key_file, setKeyFile] = useState<string>('');

  useEffect(() => {
    (async() => {
      const res = (await getPrivateKeysApi()) as HTTPResult;
      if (res.code !== '200') {
        return;
      }
      props.toInit(res.data);
    })();
  }, []);

  const addNewTag = async() => {
    if (props.privateKeyList.some((e) => e.name === passphrase)) {
      enqueueSnackbar(`密钥已存在！`, {
        autoHideDuration: 3000,
        variant: 'warning'
      });
      return;
    }
    const res = (await addPrivateKeyApi({ name, passphrase, key_file })) as HTTPResult;
    if (res.code !== '200') {
      enqueueSnackbar(`密钥添加失败${res.msg}`, {
        autoHideDuration: 3000,
        variant: 'error'
      });
      return;
    }
    props.addPrivateKey(res.data);
    enqueueSnackbar(`密钥: ${res.data.name}添加成功！`, {
      autoHideDuration: 3000,
      variant: 'success'
    });
  };

  return (
    <div className={classes.itemPage}>
      <div className={classes.ControlBox}>
        <FormControl className={classes.Control}>
          <TextField
            size='small'
            id='private-key-name'
            label='密钥名称'
            variant='outlined'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </FormControl>
        <FormControl className={classes.Control}>
          <TextField
            size='small'
            id='private-key-name'
            label='秘钥的密码(非必填)'
            variant='outlined'
            placeholder='秘钥的密码可以为空'
            value={passphrase}
            onChange={(e) => setPassphrase(e.target.value)}
          />
        </FormControl>
        <div className={classes.keyFile}>
          <TextField
            size='small'
            disabled
            id='select-file'
            variant='outlined'
            value={fileName}
          />
          <input
            className={classes.input}
            id='contained-key-file'
            multiple
            type='file'
            onChange={(e) => {
              // @ts-ignore
              if (!e.target!.files[0]!.name) {
                return;
              }
              // @ts-ignore
              setKeyFile(e.target?.files[0]);
              // @ts-ignore
              setFileName(e.target?.files[0]?.name);
            }}
          />
          <label htmlFor='contained-key-file'>
            <Button variant='contained' color='primary' component='span'>
              选择秘钥文件
            </Button>
          </label>
        </div>
        <Button
          className={classes.addButton}
          onClick={addNewTag}
        >
          添加密钥
        </Button>
      </div>
      <div className={classes.shellBox}>
        <KeyFileTable {...props}/>
      </div>
    </div>
  );
};

export default connect(
  mapStateToProps,
  mapDispatch
)(PrivateKey);
