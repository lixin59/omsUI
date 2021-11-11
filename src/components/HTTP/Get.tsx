import React from 'react';

type tProps = {
  apiFn: ()=> any;
  data: any;
  initStore?: (e:any)=> any;
  delay?: number;
  loading: any;
  reload?: any;
  error: any;
  children: any;
}

type tState = {
  data: any[];
  component: any
}

class Get extends React.Component<tProps, tState> {
  private timer: NodeJS.Timeout| null = null;
  constructor(props:tProps) {
    super(props);
    this.state = {
      data: [],
      component: this.props.loading || ''
    };
  }

  async componentDidMount() {
    const { apiFn, delay, initStore, error } = this.props;
    try {
      const { data } = await apiFn();
      // console.log('调用获取所有主机信息的API');
      this.timer = setTimeout(() => {
        // console.log('delay', delay);
        // this.setState({
        //   // data: result.data,
        //   component: children(result.data)
        // });
        if (initStore) {
          initStore(data);
        }
      }, delay || 0);
    } catch (e) {
      this.setState({
        component: error || 'Error'
      });
      console.log(e);
      throw e;
    }
  }

  componentDidUpdate(prevProps: Readonly<tProps>) {
    const { data, children } = this.props;
    if (data !== prevProps.data) {
      // console.log('newProps', data);
      // console.log('props', prevProps.data);
      this.setState({
        // data: prevProps.data,
        component: children
      });
    }
  }

  // static getDerivedStateFromProps(props: tProps, state: tState) {
  //   if (props.data !== state.data) {
  //     console.log('更新组件');
  //     console.log('props', props.data);
  //     console.log('state', state.data);
  //     return {
  //       data: props.data,
  //       component: props.children(props.data)
  //     };
  //   }
  //   return null;
  // }

  // shouldComponentUpdate(nextProps: Readonly<tProps>, nextState: Readonly<tState>, nextContext: any): boolean {
  //   const { data, children } = this.props;
  //   if (data !== nextProps.data) {
  //     console.log('props改变');
  //     this.setState({
  //       component: children(nextProps.data)
  //     });
  //     return true;
  //   }
  //   return true;
  // }
  componentWillUnmount() {
    clearTimeout(this.timer as NodeJS.Timeout);
  }

  render() {
    return this.state.component;
  }
}

export default Get;
