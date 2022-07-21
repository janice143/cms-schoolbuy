<template>
  <div class="visitorpie">
    <div id="visitorpie" class="" style="width: 90%; height: 450px"></div>
  </div>
</template>

<script>
import echarts from "@/utils/echarts";
import { reqgetUserPlace } from "@/api/charts.js";
export default {
  name:'Place',
  data() {
    return {
      pieData: "",
    };
  },
  created(){
    this.getPieData()
  },
  mounted() {
    this.myChart = echarts.init(document.getElementById("visitorpie"));
    this.initData();
  },
  methods: {
    initData() {
      const option = {
        title: {
          text: "用户分布",
          subtext: "",
          x: "center",
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        legend: {
          orient: "vertical",
          left: "left",
          data: [
            "桃源公寓",
            "杏园公寓",
            "初阳公寓",
            "桂苑公寓",
            "启明公寓",
            "留学生公寓",
          ],
        },
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: [
              { value: this.pieData.taoyuan, name: "桃源公寓" },
              { value: this.pieData.xingyuan, name: "杏园公寓" },
              { value: this.pieData.chuyang, name: "初阳公寓" },
              { value: this.pieData.guiyuan, name: "桂苑公寓" },
              { value: this.pieData.qiming, name: "启明公寓" },
              { value: this.pieData.liuxuesheng, name: "留学生公寓" },
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };

      this.myChart.setOption(option);
    },
    async getPieData() {
      try {
        const res = await reqgetUserPlace();
        // console.log(res)
        if (res.code === 200) {
          this.pieData = res.data;
        } else {
          throw new Error(res);
        }
      } catch (err) {
        console.log("获取用户分布信息失败", err);
      }
    },
  },
  watch: {
    pieData: function () {
      this.initData();
    },
  },
};
</script>

<style scoped>
/* @import '../style/mixin'; */
.visitorpie {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
