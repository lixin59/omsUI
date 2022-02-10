import React, { useRef, memo } from 'react';
import { cloneDeep } from 'lodash';
import ReactEcharts from 'echarts-for-react';

type tData = {
  value: number,
  name: string
}

type tProps = {
  data : tData[],
  title?: string
}


function updateOption(o: any, data: tData[]) {
  const newOption = cloneDeep(o); // 深拷贝一份原来的数据
  newOption.series[0].data = data;

  return newOption;
}

const PieChart = memo((props:tProps) => {
  const { data = [{ value: 100, name: 'test' }], title = '' } = props;

  const options = {
    title: [
      {
        top: '5%',
        left: 'center',
        text: title
      }
    ],
    tooltip: {
      trigger: 'item'
    },
    // legend: {
    //   orient: 'vertical',
    //   right: '0%'
    // },
    series: [
      {
        // name: 'Access From',
        type: 'pie',
        radius: '70%',
        center: ['50%', '55%'], // 调整图表在画布的位置
        data: [
          { value: 1048, name: 'Search Engine' },
          { value: 735, name: 'Direct' },
          { value: 580, name: 'Email' },
          { value: 484, name: 'Union Ads' },
          { value: 300, name: 'Video Ads' }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };

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

PieChart.displayName = 'PieChart';

export default PieChart;
