<template>
  <div>
    <el-card shadow="always" :body-style="{ padding: '20px' }">
      <categorySelect
        @getCategoryId="getCategoryId"
        :show="!isShowTable"
      ></categorySelect>
    </el-card>

    <el-card shadow="always" :body-style="{ padding: '20px' }">
      <!-- 底部这里将来是有三部分进行切换 -->
      <div v-show="scene === 0">
        <!-- 展示SPU列表的结构 -->
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!conditions.categoryName.length || conditions.categoryName == '全部商品'"
          @click="addSpu"
          >添加商品</el-button
        >
        <el-table style="width: 100%" border :data="productlist">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="imgUrl" label="商品图片" width="width">
            <template slot-scope="{ row }">
              <img :src="row.imgUrl" alt="" style="width: 100px; height: 100px" />
            </template>
          </el-table-column>
          <el-table-column prop="title" label="商品名称" width="width">
          </el-table-column>

           <el-table-column prop="username" label="商品发布人" width="width" v-if="username === 'admin'">
          </el-table-column>

          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row }">
              <!-- 这里按钮将来用hintButton替换 -->

              <hint-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改商品"
                @click="updateSpu(row)"
              ></hint-button>
              
              <el-popconfirm title="这是一段内容确定删除吗？" @onConfirm="deleteSpu(row)">
                <hint-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除商品"
                  slot="reference"
                ></hint-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          style="text-align: center"
          :current-page="conditions.pageNo"
          :page-sizes="[3, 5, 10]"
          :page-size="conditions.pageSize"
          layout="prev, pager, next, jumper,->, sizes,total"
          @current-change="getSpuList"
          @size-change="handleSizeChange"
          :total="totalCount"
        >
        </el-pagination>
      </div>

      <div v-show="scene === 1">
        <SpuForm ref="spu" @changeScene="changeScene" :getCategoryName="conditions.categoryName"></SpuForm>
      </div>

 
    </el-card>

  </div>
</template>

<script>
import SpuForm from "./SpuForm/index.vue";
import { mapGetters } from 'vuex'

export default {
  name: "Spu",
  components: {
    SpuForm,
  },
  data() {
    return {
      // 带给服务器传入的参数
      conditions: {
        //产品相应的级次
        category1Id: '',
        //分类的名字
        categoryName: "",

        //排序:初始状态应该是综合且降序
        order: "1:desc",
        //第几页
        pageNo: 1,
        //每一页展示条数
        pageSize: 3,
      },
     
      isShowTable: true, //控制下拉列表是否禁用，false为禁用
      

      productlist: [], //商品的数据
      totalCount: 0, //分页器一共需要展示数据的条数
      scene: 0, //0代表展示SPU列表数据   1 添加SPU|修改SPU   2 添加SKU

      //控制对话框的显示与隐藏
      dialogTableVisible: false,
      spu: {},
      loading: true,

      
    };
  },

  mounted() {},

  methods: {
    // 自定义事件回调
    getCategoryId({ categoryName, level }) {
      //区分三级分类相应的id，以及父组件进行存储
      if (level === 1) {
        this.conditions.categoryName = categoryName;

        // 获取该分类下的商品列表数据，进行展示
        this.getSpuList();
      }
    },
    //获取商品列表数据的方法
    async getSpuList(pageNo = 1) {
      this.conditions.pageNo = pageNo;
      // this.conditions.pageSize = pageSize;
    // console.log(1111,this.conditions.pageNo,this.conditions.pageSize)
      //携带三个参数:page 第几页  limit 每一页需要展示多少条数据  三级分类id
      const result = await this.$API.product.reqgetProductList(this.conditions);
      // console.log(result)
      if (result.code == 200) {
        this.totalCount = result.data.totalCount;
        this.productlist = result.data.productlist;
      }
    },
    //当分页器的某一个展示数据条数发生变化的回调
    handleSizeChange(pageSize) {
      //修改参数
      this.conditions.pageSize = pageSize;
      //再发请求
      this.getSpuList();
    },
    //添加商品按钮的回调
    addSpu() {
      //切换为场景为1
      this.scene = 1;
      this.isShowTable= false
    },
    //自定义事件回调（SpuForm）
    changeScene({ scene, flag }) {
      //flag这个形参为了区分保存按钮是添加还是修改
      //切换结构（场景）
      this.scene = scene;
      this.isShowTable= true
      //子组件通知父组件切换场景，需要再次获取商品列表的数据进行展示
      // console.log(flag)
      if (flag == "修改") {
        this.getSpuList(this.conditions.pageNo);
      } else {
        this.getSpuList();
      }
    },

    //删除商品
    async deleteSpu(row) {
      const result = await this.$API.product.reqDeleteSpu({id:row._id,imgUrl:row.imgUrl})
      // console.log(result)
      if (result.code === 200) {
        this.$message({ type: "success", message: "删除成功" });
        //代表SPU个数大于1删除的时候停留在当前页，如果SPU个数小于1 回到上一页
        this.getSpuList(this.productlist.length > 1 ? this.conditions.pageNo : this.conditions.pageNo - 1);
      }
    },
    
    //修改某一个商品
    updateSpu(row) {
      this.scene = 1;
      this.isShowTable= false
      // 父组件通过refs获取子组件的数据和方法
      this.$refs.spu.initSpuData(row);
    },

  },
  computed: {
    ...mapGetters([
      'username'
    ])
  }
};
</script>

<style lang="scss" scoped>
</style>