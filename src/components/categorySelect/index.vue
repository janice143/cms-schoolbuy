<template>
  <div>
    <!-- 三级联动 全局组件 -->
    <!-- model 收集表单的数据 -->
    <el-form :inline="true" class="demo-form-inline" :model="cForm">
      <el-form-item label="分类">
        <el-select
          placeholder="请选择"
          v-model="cForm.categoryName"
          @change="handler1"
          :disabled="show"
        >
          <el-option
            :label="c1.categoryName"
            :value="c1.categoryName"
            v-for="(c1) in list1"
            :key="c1.categoryId"
          ></el-option>
        </el-select>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
export default {
  name: "categorySelect",
  props:['show'],
  data() {
    return {
      //一级分类的数据
      list1: [],
     
      //收集分类的id
      cForm: {
        categoryName: "",
      },
    };
  },

  mounted() {
    //获取一级分类的数据的方法
    this.getCategory1List();
  },

  methods: {
    //获取一级分类数据的方法
    async getCategory1List() {
      //获取一级分类的请求：不需要携带参数
      const result = await this.$API.product.reqgetCategory();
      // console.log(result)
      if (result.code === 200) {
        // 分类的第一个元素为全部商品，要去掉，所以这里做一下数组处理 .slice(1)
        this.list1 = result.data;
      }
    },
    Onsubmit() {
      console.log(11);
    },
    async handler1() {
      
      // 解构出一级分类的id
      const { categoryName } = this.cForm;
      // console.log(this.cForm)
      this.$emit("getCategoryId", { categoryName: categoryName, level: 1 });
    },

    },
}

</script>

<style lang="scss" scoped>
</style>