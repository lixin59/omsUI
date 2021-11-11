import React from 'react';
import axios from 'axios';
import qs from 'qs';

type tProps = {
  url: string;
  delay: number;
  data: any;
  loading: any;
  error: any;
  children: (e:any[])=>any[];
  dataOperator: any
}

type tState = {
  data: any[];
  component: any
}

class Post extends React.Component<tProps, tState> {
  constructor(props:tProps) {
    super(props);
    this.state = {
      data: [],
      component: this.props.loading || ''
    };
  }

  async componentDidMount() {
    const { url, data, delay, children, error, dataOperator } = this.props;

    try {
      const result = await axios.post(url, qs.stringify(data));

      this.setState({
        data: dataOperator(result.data)
      }, () => {
        setTimeout(() => {
          this.setState({
            component: children(this.state.data)
          });
        }, delay || 0);
      });
    } catch (e) {
      this.setState({
        component: error || 'Error'
      });

      throw e;
    }
  }

  render() {
    return this.state.component;
  }
}

export default Post;
