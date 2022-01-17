import React, { useRef, memo } from 'react';
import { cloneDeep } from 'lodash';
import ReactEcharts from 'echarts-for-react';

type tProps = {
  data :any
}

const options = {
  series: [
    {
      // title: {
      //   show: true,
      //   text: 'cpu使用率',
      //   x: 'center'
      // },
      type: 'gauge',
      axisLine: {
        lineStyle: {
          width: 15,
          color: [
            [0.3, '#67e0e3'],
            [0.7, '#37a2da'],
            [1, '#fd666d']
          ]
        }
      },
      pointer: {
        itemStyle: {
          color: 'auto'
        }
      },
      axisTick: {
        distance: -15,
        length: 4,
        lineStyle: {
          color: '#fff',
          width: 1
        }
      },
      splitLine: {
        distance: -15,
        length: 15,
        lineStyle: {
          color: '#fff',
          width: 2
        }
      },
      axisLabel: {
        color: 'auto',
        distance: 20,
        fontSize: 10
      },
      detail: {
        valueAnimation: true,
        formatter: '{value} %',
        color: 'auto'
      },
      data: [
        {
          value: 0
        }
      ]
    }
  ]
};

function updateOption(o: any, value: any) {
  const newOption = cloneDeep(o); // 深拷贝一份原来的数据
  newOption.series[0].data[0].value = value;

  return newOption;
}

const GaugeChart = memo((props:tProps) => {
  const { data = 0 } = props;
  const option = useRef(options);
  option.current = updateOption(option.current, data);

  return (
    <ReactEcharts
      option={option.current}
      notMerge={true}
      lazyUpdate={true}
      style={{ width: '100%', height: '100%' }}
    />);
});

export default GaugeChart;
