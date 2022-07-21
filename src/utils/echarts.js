// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from 'echarts/core';
// 引入饼图
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
} from 'echarts/components';
import { PieChart } from 'echarts/charts';
import { LabelLayout } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

// 引入柱状图
import {
  DatasetComponent,
  GridComponent,
  ToolboxComponent,
} from 'echarts/components';
import { BarChart } from 'echarts/charts';
import { LineChart } from 'echarts/charts';

// 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  PieChart,
  CanvasRenderer,
  LabelLayout,
  DatasetComponent,
  GridComponent,
  BarChart,
  DataZoomComponent,
  ToolboxComponent,
  LineChart
])

export default echarts