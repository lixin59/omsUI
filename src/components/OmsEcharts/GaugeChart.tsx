import React, { useRef, memo } from 'react';
import { cloneDeep } from 'lodash';
import ReactEcharts from 'echarts-for-react';

type tProps = {
  data :any,
  title?: string
}


function updateOption(o: any, value: any) {
  const newOption = cloneDeep(o); // 深拷贝一份原来的数据
  newOption.series[0].data[0].value = value;

  return newOption;
}

const GaugeChart = memo((props:tProps) => {
  const { data = 0, title = '' } = props;

  const options = {
    title: [
      {
        top: '5%',
        left: 'center',
        text: title
      }
    ],
    series: [
      {
        type: 'gauge',
        radius: '90%',
        startAngle: 180,
        center: ['50%', '70%'], // 调整图表在画布的位置
        endAngle: 0,
        min: 0,
        max: 100,
        splitNumber: 10,
        itemStyle: {
          color: '#58D9F9',
          shadowColor: 'rgba(0,138,255,0.45)',
          shadowBlur: 10,
          shadowOffsetX: 2,
          shadowOffsetY: 2
        },
        progress: {
          show: true,
          roundCap: true,
          width: 12 // 蓝色圈宽度
        },
        pointer: {
          icon: 'path://M2090.36389,615.30999 L2090.36389,615.30999 C2091.48372,615.30999 2092.40383,' +
            '616.194028 2092.44859,617.312956 L2096.90698,728.755929 C2097.05155,732.369577 2094.2393,735.416212 2090.62566,' +
            '735.56078 C2090.53845,735.564269 2090.45117,735.566014 2090.36389,' +
            '735.566014 L2090.36389,735.566014 C2086.74736,735.566014 2083.81557,732.63423 2083.81557,' +
            '729.017692 C2083.81557,728.930412 2083.81732,728.84314 2083.82081,' +
            '728.755929 L2088.2792,617.312956 C2088.32396,616.194028 2089.24407,615.30999 2090.36389,615.30999 Z',
          length: '65%', // 指针长度
          width: 8,
          offsetCenter: [0, '5%']
        },
        axisLine: {
          roundCap: true,
          lineStyle: {
            width: 12 // 底部圈宽度
          }
        },
        axisTick: {
          splitNumber: 2,
          lineStyle: {
            width: 1,
            color: '#999'
          }
        },
        splitLine: {
          length: 3,
          lineStyle: {
            width: 2,
            color: '#999'
          }
        },
        axisLabel: {
          distance: 16, // 刻度文字与外圈的距离
          color: '#999',
          fontSize: 10
        },
        title: {
          show: false
        },
        detail: {
          backgroundColor: '#fff',
          borderColor: '#999',
          borderWidth: 2,
          width: '50%',
          lineHeight: 20,
          height: 20,
          borderRadius: 8,
          offsetCenter: [0, '30%'],
          valueAnimation: true,
          formatter: function(value) {
            return '{value|' + value.toFixed(0) + '}{unit|%}';
          },
          rich: {
            value: {
              fontSize: 16,
              fontWeight: 'bolder',
              color: '#777'
            },
            unit: {
              fontSize: 10,
              color: '#999',
              padding: [0, 0, 0, 5]
            }
          }
        },
        data: [
          {
            value: 10
          }
        ]
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

GaugeChart.displayName = 'GaugeChart';

export default GaugeChart;
