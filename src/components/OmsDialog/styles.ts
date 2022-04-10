import { Styles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles';

// eslint-disable-next-line @typescript-eslint/ban-types
const styles: Styles<any, {}> = (theme: Theme) => ({
  dialogTitle: {
    backgroundColor: theme.palette.primary[theme.palette.type]
  },
  dialogContent: {
    boxSizing: 'border-box',
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
    paddingLeft: '20px'
  },
  scrollbars: {
    minHeight: '500px', // 添加一个最小高度解决滚动条没有高度导致内容不可见的问题
    maxHeight: '100%'
  },
  dialogActions: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  dialogActionButton: {
    backgroundColor: theme.palette.primary[theme.palette.type]
  }
});

export default styles;
