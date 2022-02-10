import React, { useRef, memo } from 'react';
import { cloneDeep } from 'lodash';
import ReactEcharts from 'echarts-for-react';

type tData = {
  value: string | number,
  name: string,
  borderRadius?: number
}

type tProps = {
  data : tData[],
  formatter?: string, // x轴单位
  title?: string,
  color?: string[],
  xAxisName?: string,
}


function updateOption(o: any, data: tData[], color: string[]) {
  const newOption = cloneDeep(o); // 深拷贝一份原来的数据
  const newData = cloneDeep(data); // 深拷贝一份原来的数据
  if (data.length < 0) {
    return newOption;
  }

  for (let i = 0; i < data.length; i++) {
    newData[i]['type'] = 'bar';
    newData[i]['center'] = ['50%', '80%']; // 在画布中的位置
    newData[i]['itemStyle'] = {
      borderRadius: data[i].borderRadius || 0,
      color: {
        type: 'linear',
        x: 0,
        y: 0,
        colorStops: [{
          offset: 0, color: color[0] // 0% 处的颜色
        }, {
          offset: 1, color: color[1] // 100% 处的颜色
        }],
        globalCoord: false // 缺省为 false
      }
    };
    newData[i].name = data[i].name;
    newData[i]['data'] = [data[i].value];
  }
  newOption.series = newData;

  return newOption;
}

const RowBarChart = memo((props:tProps) => {
  const { data = [{ value: 100, name: 'test' }], title = '', color = ['#13b985', '#f6c664'], xAxisName = '' } = props;

  const options = {
    title: [
      {
        top: '5%',
        left: 'center',
        text: title
      }
    ],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      // orient: 'vertical',
      top: '18%',
      left: 'center'
    },
    grid: {
      top: '30%',
      left: '0%',
      right: '6%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      name: xAxisName,
      boundaryGap: [0, 0.01],
      axisLabel: {
        show: true,
        textStyle: {
          color: '#010917', // 更改坐标轴文字颜色
          fontSize: 12 // 更改坐标轴文字大小
        }
      },
      axisLine: {
        show: true,
        symbol: ['none', 'arrow'], // 显示箭头的位置
        symbolOffset: [0, 12], // 箭头位置的偏移量
        lineStyle: {
          color: '#676769'
        }
      }
    },
    yAxis: {
      type: 'category',
      data: ['']
      // data: ['Y轴']
    },
    series: [
      {
        name: '数据异常',
        type: 'bar',
        data: [0]
      }
    ]
  };

  const option = useRef(options);
  option.current = updateOption(option.current, data, color);

  return (
    <ReactEcharts
      option={option.current}
      notMerge={true}
      lazyUpdate={true}
      style={{ width: '100%', height: '100%' }}
    />);
});

RowBarChart.displayName = 'RowBarChart';

export default RowBarChart;
