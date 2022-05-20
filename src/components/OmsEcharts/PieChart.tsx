import React, { useRef, memo } from 'react';
import { cloneDeep } from 'lodash';
import ReactEcharts from 'echarts-for-react';

type tData = {
  value: number;
  name: string;
};

type tProps = {
  dataList: tData[];
  title?: string;
};

function getData(dataList: tData[]) {
  const arr1 = dataList.map((e) => e.name);
  const arr2 = dataList.map((e) => e.value);
  return [arr1, arr2];
}
function updateOption(o: any, data: tData[], titleValue: string) {
  const newOption = cloneDeep(o); // 深拷贝一份原来的数据
  newOption.series[0].data = data;
  newOption.title[0].text = titleValue;

  return newOption;
}

const PieChart = memo((props: tProps) => {
  const {
    dataList = [
      { value: 10, name: 'test' },
      { value: 90, name: 'test2' }
    ],
    title = ''
  } = props;

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
    //   top: '5%',
    //   left: 'center'
    // },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '60%'], // 调整图表在画布的位置
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '20',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 1048, name: 'Search Engine' },
          { value: 735, name: 'Direct' },
          { value: 580, name: 'Email' },
          { value: 484, name: 'Union Ads' },
          { value: 300, name: 'Video Ads' }
        ]
      }
    ]
  };

  const option = useRef(options);
  option.current = updateOption(option.current, dataList, title);

  return (
    <ReactEcharts option={option.current} notMerge={true} lazyUpdate={true} style={{ width: '100%', height: '100%' }} />
  );
});

PieChart.displayName = 'PieChart';

export default PieChart;
