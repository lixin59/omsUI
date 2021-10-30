import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import TagTable from './TagTable';
import styles from './style';
import { ActionCreator } from 'redux';
import { TagInfo } from '../../store/interface';
import { useSnackbar } from 'notistack';

type tDP = {
  deleteTag: ActionCreator<any>;
  addTag: ActionCreator<any>;
  editTag: ActionCreator<any>;
};

type tOP = {};

type tSP = tOP & {
  tagList: TagInfo[]
};

type tProps = tSP & tDP;

const Tag = (props: tProps) => {
  const classes = makeStyles(styles)();
  const { enqueueSnackbar } = useSnackbar();
  const [tag, setTag] = useState<string>('');

  const addNewTag = () => {
    if (!tag) {
      enqueueSnackbar(`标签名称不能为空`, {
        autoHideDuration: 3000,
        variant: 'warning',
      });
      return;
    }
    if (props.tagList.some((e) => e.name === tag)) {
      enqueueSnackbar(`该标签已存在！`, {
        autoHideDuration: 3000,
        variant: 'warning',
      });
      return;
    }
    props.addTag({ name: tag });
  };

  return (
    <div className={classes.itemPaage}>
      <div className={classes.ControlBox}>
        <FormControl className={classes.Control}>
          <TextField
            size='small'
            id='tag-name'
            label='标签名称'
            variant='outlined'
            value={tag}
            onChange={(e) => setTag(e.target.value)}
          />
        </FormControl>
        <Button
          className={classes.addButton}
          onClick={addNewTag}
        >
          添加标签
        </Button>
      </div>
      <div className={classes.shellBox}>
        <TagTable {...props}/>
      </div>
    </div>
  );
};

export default Tag;
