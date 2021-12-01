import React, { Dispatch, SetStateAction } from 'react';
import TextField from '@material-ui/core/TextField';
import { PrivateKeyInfo } from '../../../store/interface';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import styles from '../style';

type tProps = {
  Info: PrivateKeyInfo,
  fileName: string,
  setInfo: Dispatch<SetStateAction<PrivateKeyInfo>>,
  setFileName: Dispatch<SetStateAction<string>>
}


const KeyFileForm = ({ Info, setInfo, fileName, setFileName }: tProps) => {
  const classes = makeStyles(styles)();

  return (
    <>
      <TextField
        autoFocus
        margin='dense'
        id='tag-name'
        label='密钥名称'
        fullWidth
        value={Info.name}
        onChange={(e) => setInfo({ ...Info, name: e.target.value })}
      />
      <TextField
        autoFocus
        margin='dense'
        id='tag-name'
        label='密钥的密码'
        fullWidth
        value={Info.passphrase}
        onChange={(e) => setInfo({ ...Info, passphrase: e.target.value })}
      />
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
          id='contained-button-file'
          multiple
          type='file'
          onChange={(e) => {
            // @ts-ignore
            if (!e.target!.files[0]!.name) {
              return;
            }
            // @ts-ignore
            setInfo({ ...Info, key_file: e.target?.files[0] });
            // @ts-ignore
            setFileName(e.target?.files[0]?.name);
          }}
        />
        <label htmlFor='contained-button-file'>
          <Button variant='contained' color='primary' component='span'>
            选择秘钥文件
          </Button>
        </label>
      </div>
    </>);
};

export default KeyFileForm;
