import React, { useRef, memo } from 'react';
import { cloneDeep } from 'lodash';
import ReactEcharts from 'echarts-for-react';
import 'echarts-liquidfill';

type tProps = {
  data :any,
  title?: string
}

function updateOption(o: any, value: any) {
  const newOption = cloneDeep(o); // 深拷贝一份原来的数据
  newOption.series[0].data[0] = value;

  return newOption;
}

const LiquidfillChart = memo((props:tProps) => {
  const { data = 0, title = '' } = props;

  const options = {
    title: [
      {
        top: '5%',
        left: 'center',
        text: title
      }
    ],
    series: [{
      type: 'liquidFill',
      data: [0],
      // color: ['#294D99', '#156ACF', '#1598ED', '#45BDFF'], // 默认波浪颜色
      color: ['#1598ED'], // 默认波浪颜色
      center: ['50%', '60%'], // 在画布中的位置
      radius: '70%', // 大小  可以为50% 也可以用50px表示
      amplitude: '8%', // 波浪幅度
      waveLength: '80%', // 波长
      phase: 'auto', // 相位
      period: 'auto', // 周期
      direction: 'right', // 波动方向
      shape: 'circle', // 形状

      waveAnimation: true,
      animationEasing: 'linear',
      animationEasingUpdate: 'linear',
      animationDuration: 2000,
      animationDurationUpdate: 1000,

      outline: {
        show: true, // 是否显示外圈线
        borderDistance: 8, // 与外圈距离
        itemStyle: {
          color: 'none',
          borderColor: '#294D99', // 线的颜色，粗细，模糊程度，模糊颜色
          borderWidth: 4,
          shadowBlur: 20,
          shadowColor: 'rgba(0, 0, 0, 0.25)'
        }
      },

      backgroundStyle: {
        color: '#E3F7FF' // 背景
      },

      itemStyle: {
        opacity: 0.95, // 透明度
        shadowBlur: 50,
        shadowColor: 'rgba(0, 0, 0, 0.4)'
      },

      label: { // 内部字符标签的属性
        show: true,
        color: '#294D99',
        insideColor: '#fff',
        fontSize: 24,
        fontWeight: 'bold',

        align: 'center',
        baseline: 'middle',
        position: 'inside'
      },

      emphasis: {
        itemStyle: {
          opacity: 0.8
        }
      }
    }]
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

export default LiquidfillChart;
