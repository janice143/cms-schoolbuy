<template>
  <div class="dashboard">
    <h4>{{username}}，欢迎使用【师大Buy校园二手闲置信息后台管理系统】</h4>
    <img src="../../assets/home.gif" alt="">
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: "Dashboard",
  data() {
    return {
     
    };
  },
  created(){
    // 判断是不是超级管理员

  },
  computed: {
    ...mapGetters(['username'])
  },
  mounted() {
    
  },
  
};
</script>

<style lang="less">
.dashboard{
  padding-top:40px;
  text-align: center;
  img{
    height: 100px;
  }
}
</style>
