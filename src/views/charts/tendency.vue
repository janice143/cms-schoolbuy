<template>
  <div class="line1">
    <div id="line1" class="" style="width: 90%; height: 450px"></div>
  </div>
</template>

<script>
import echarts from "@/utils/echarts";

export default {
  mounted() {
    this.myChart = echarts.init(document.getElementById("line1"));
    this.initData();
  },
  props: ["sevenDay", "sevenTendency"],
  methods: {
    initData() {
      const colors = ["#91cc75", "#fac858"];
      const option = {
        color: colors,
        title: {
          left: 'center',
          text: "七日走势图",
          subtext: "",
          textStyle:{
            fontSize:18,
          }
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: ["新增商品", "新注册用户"],
          left: 'center',
          top: '5%'

        },
        toolbox: {
          show: true,
          feature: {
            dataZoom: {
              yAxisIndex: "none",
            },
            dataView: { readOnly: false },
            magicType: { type: ["bar", "line"] },
            // restore: {show: true,},
          },
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.sevenDay,
        },
        yAxis: [
          {
            type: "value",
            name: "商品数量",
            min: 0,
            max: Math.max(...this.sevenTendency[0]) + 10,
            position: "left",
            axisLine: {
              lineStyle: {
                color: "#999",
              },
            },
            axisLabel: {
              formatter: "{value}",
            },
          },
          {
            type: "value",
            name: "用户",
            min: 0,
            max: Math.max(...this.sevenTendency[0]) + 10,
            position: "right",
            axisLine: {
              lineStyle: {
                color: "#999",
              },
            },
            axisLabel: {
              formatter: "{value}",
            },
          },
        ],
        series: [
          {
            name: "新增商品",
            type: "line",
            data: this.sevenTendency[0],
            yAxisIndex: 1,
            markPoint: {
              data: [
                { type: "max", name: "最大值" },
                { type: "min", name: "最小值" },
              ],
            },
          },
          {
            name: "新注册用户",
            type: "line",
            data: this.sevenTendency[1],
            yAxisIndex: 1,
            markPoint: {
              data: [
                { type: "max", name: "最大值" },
                { type: "min", name: "最小值" },
              ],
            },
          },
        ],
      };
      this.myChart.setOption(option);
    },
  },
  watch: {
    sevenDay: function () {
        // console.log('11')
      this.initData();
    },
    sevenTendency: function () {
      this.initData();
    },
  },
};
</script>

<style lang="less">
.line1 {
  display: flex;
  justify-content: center;
}
</style>
