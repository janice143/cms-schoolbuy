<template>
  <div class="dashboard-container">
    <div class="section1">
      <h4 class="section_title">数据统计</h4>
      <el-row :gutter="20" style="margin-bottom: 10px" type="flex" justify="center">
        <el-col :span="4"
          ><div class="data_list today_head">
            <span class="data_num head">当日数据：</span>
          </div></el-col
        >

        <el-col :span="4"
          ><div class="data_list">
            <span class="data_num">{{ todayProductCount }}</span> 新增产品
          </div></el-col
        >
        <el-col :span="4"
          ><div class="data_list">
            <span class="data_num">{{ todayUserCount }}</span> 新增用户
          </div></el-col
        >
      </el-row>
      <el-row :gutter="20"  type="flex" justify="center">
        <el-col :span="4"
          ><div class="data_list all_head">
            <span class="data_num head">总数据：</span>
          </div></el-col
        >
        <el-col :span="4"
          ><div class="data_list">
            <span class="data_num">{{ allUserCount }}</span> 总用户
          </div></el-col
        >
        <el-col :span="4"
          ><div class="data_list">
            <span class="data_num">{{ allProductCount }}</span> 总产品
          </div></el-col
        >
      </el-row>
    </div>
    <br>
     <tendency :sevenDay="sevenDay" :sevenTendency="sevenTendency"></tendency>
  </div>

</template>

<script>
import { reqpostProductCount } from "@/api/product/product.js";
import { reqpostUserCount } from "@/api/admin/user.js";
import dtime from "time-formater";
import tendency from "./tendency.vue";


export default {
  name: "Number",
  components: { tendency },
  data() {
    return {
      todayUserCount: null,
      todayProductCount: null,
      allUserCount: null,
      allProductCount: null,
      sevenTendency: [[], []], // 七天的新增用户，新增商品数据
      sevenDay: [], // 七天的日期字符串
    };
  },
  created(){
    // 判断是不是超级管理员

  },
  computed: {
  },
  mounted() {
    this.getProductCount();
    this.getUserCount();
    for (let i = 6; i > -1; i--) {
      const date = dtime(new Date().getTime() - 86400000 * i).format(
        "YYYY-MM-DD"
      );
      this.sevenDay.push(date);
    }
    this.getSevenData();
  },
  methods: {
    // 获取今日商品数和总商品数
    async getProductCount() {
      const time = new Date();
      const dateToday = {
        year: time.getFullYear(),
        month: time.getMonth(),
        day: time.getDate(),
      };
      // console.log(date)
      const res = await reqpostProductCount(dateToday);
      if (res.code === 200) {
        this.todayProductCount = res.data.todayProductCount;
        this.allProductCount = res.data.allProductCount;
      }
    },
    // 获取总用户数和今日商品数
    async getUserCount() {
      const time = new Date();
      const dateToday = {
        year: time.getFullYear(),
        month: time.getMonth(),
        day: time.getDate(),
      };
      // console.log(dateToday)
      const res = await reqpostUserCount(dateToday);
      if (res.code === 200) {
        this.todayUserCount = res.data.todayUserCount;
        this.allUserCount = res.data.allUserCount;
      }
    },
    // 获取七天内的新增用户数和商品数
    async getSevenData() {
      const apiArr = [[], []];
      this.sevenDay.forEach((item) => {
        const dateToday = {
          year: parseInt(item.split("-")[0]),
          month: parseInt(item.split("-")[1] - 1), // 记得减去1
          day: parseInt(item.split("-")[2]),
        };
        // console.log(dateToday)
        apiArr[0].push(reqpostProductCount(dateToday));
        apiArr[1].push(reqpostUserCount(dateToday));
      });
      const promiseArr = [...apiArr[0], ...apiArr[1]];
      Promise.all(promiseArr)
        .then((res) => {
          const resArr = [[], []];
          res.forEach((item, index) => {
            // console.log(item)
            if (item.code === 200) {
              if (Math.floor(index / 7) === 0) {
                resArr[0].push(item.data.todayProductCount);
              } else {
                resArr[1].push(item.data.todayUserCount);
              }
            }
          });
          this.sevenTendency = resArr;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style lang="less">
.dashboard-container {

  .section1{
    text-align: center;
    margin-bottom: 30px;
    .section_title {
    margin-bottom: 30px;
  }
  .data_list {
    text-align: center;
    font-size: 14px;
    color: #666;
    border-radius: 6px;
    background: #e5e9f2;
    .data_num {
      color: #333;
      font-size: 26px;
    }
    .head {
      border-radius: 6px;
      font-size: 18px;
      padding: 4px 0;
      color: #fff;
      display: inline-block;
    }
  }
  .today_head {
    background: #ff9800;
  }
  .all_head {
    background: #20a0ff;
  }
  }
  
}
</style>
