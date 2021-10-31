import { green } from '@material-ui/core/colors';
export const useMinimalSelectStyles = () => ({
  select: {
    minWidth: 200,
    background: 'white',
    color: green[500],
    fontWeight: 200,
    borderStyle: 'none',
    borderWidth: 2,
    borderRadius: 12,
    paddingLeft: 24,
    paddingTop: 14,
    paddingBottom: 15,
    boxShadow: '0px 5px 8px -3px rgba(0,0,0,0.14)',
    '&:focus': {
      borderRadius: 12,
      background: 'white',
      borderColor: green['A100'],
    },
  },
  icon: {
    color: green['A100'],
    right: 12,
    position: 'absolute',
    userSelect: 'none',
    pointerEvents: 'none',
  },
  paper: {
    borderRadius: 12,
    marginTop: 8,
  },
  list: {
    paddingTop: 0,
    paddingBottom: 0,
    background: 'white',
    '& li': {
      fontWeight: 200,
      paddingTop: 12,
      paddingBottom: 12,
    },
    '& li:hover': {
      background: green[100],
    },
    '& li.Mui-selected': {
      color: 'white',
      background: green[400],
    },
    '& li.Mui-selected:hover': {
      background: green[500],
    },
  },
});
