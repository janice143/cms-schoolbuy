<template>
  <div>
    <el-form
      ref="form"
      label-width="100px"
      :model="spu"
      :rules="rules"
      status-icon
      class="demo-ruleForm"
    >
      <el-form-item label="商品名称" prop="spuName">
        <el-input placeholder="请输入商品名称" v-model="spu.spuName" maxlength="10"></el-input>
      </el-form-item>

      <el-form-item label="商品描述" prop="description">
        <MyEditor @getDescription="getDescription" :sendDescription="spu.description"></MyEditor>
      </el-form-item>

      <el-form-item label="商品价格" prop="price" maxlength="4">
        <el-input placeholder="请输入商品价格" v-model="spu.price"></el-input>
      </el-form-item>

      <el-form-item label="商品图片" prop="spuImageList">
        <!-- 上传图片：action图片上传的地址  list-type: 文件列表的类型 on-preview:图片预览的时候会出发  on-remove:当删除图片的时候会出发 
         file-list：照片墙需要展示的数据【数组：数组里面的元素务必要有name、url属性】
         on-preview：图片预览功能
         on-remove:删除图片的时候会触发
         data 额外传过去的参数
        -->
        <el-upload
          action="/api/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handlerSuccess"
          :file-list="spuImageList"
          :limit="7"
          :on-exceed="handleOnExceed"
          :data="{ folder: folder, count: count, isEdit: isEdit }"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>

      <!-- 添加关键字 -->
      <el-form-item label="商品关键字" prop="keywordList">
        <el-button
          type="success"
          icon="el-icon-plus"
          size="mini"
          @click="addKeyword"
        ></el-button>
        <el-table style="width: 100%" border :data="spu.keywordList">
          <el-table-column align="center" type="index" label="序号" width="80">
          </el-table-column>

          <el-table-column width="width" prop="prop" label="关键字">
            <template slot-scope="{ row, $index }">
              <!-- 这里结构需要用到span与input进行来回的切换 -->
              <el-input
                v-model="row.valueName"
                placeholder="请输入商品的关键字，方便我们准确地搜索它"
                size="mini"
                v-if="row.flag"
                @blur="toLook(row)"
                @keyup.native.enter="toLook(row)"
                :ref="$index"
              ></el-input>

              <span
                v-else
                @click="toEdit(row, $index)"
                style="display: block"
                >{{ row.valueName }}</span
              >
            </template>
          </el-table-column>
          <el-table-column width="width" prop="prop" label="操作">
            <template slot-scope="{ row, $index }">
              <!-- 气泡确认框 -->
              <el-popconfirm
                :title="`确定删除${row.valueName}?`"
                @onConfirm="deleteAttrValue($index)"
              >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  slot="reference"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "",
  props: ["getCategoryName"],
  data() {
    const validateSpuName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("商品名称不能为空"));
      }else{
        callback();
      }
    };
    const validateSpuDescription = (rule, value, callback) => {
      if(value.length === 0){
         return callback(new Error("商品描述不能为空"));
      }else{
        if (value === "<p><br></p>") {
          return callback(new Error("商品描述不能为空"));
        }else{
          callback();
        }
      }
      
    };
    const validateSpuPrice = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("商品价格不能为空"));
      }else{
        callback();
      }
    };
    const validateSpuKeywordList = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("商品关键字不能为空"));
      } else {
        setTimeout(() => {
          if (value.length < 3) {
            callback(new Error("关键字至少有3个"));
          } else {
            callback();
          }
        }, 1000);
      }
    };
    const validateSpuImageList = (rule, value, callback) => {
      if (value.length<1) {
        return callback(new Error("商品图片至少上传一张"));
      }else{
        callback();
      }
    };
    return {
      rules: {
        spuName: [
          { required: true, validator: validateSpuName, trigger: "blur" },
        ],
        description: [
          {
            required: true,
            validator: validateSpuDescription,
            trigger: "blur",
          },
        ],
        price: [
          { required: true, validator: validateSpuPrice, trigger: "blur" },
        ],
        keywordList: [
          {
            required: true,
            validator: validateSpuKeywordList,
            trigger: "blur",
          },
        ],
        spuImageList: [
          {
            required: true,
            validator: validateSpuImageList,
            trigger: "blur",
          },
        ],
      },
      dialogImageUrl: "",
      dialogVisible: false,

      //spu属性初始化的时候是一个空的对象,在修改SPU的时候，会想服务器发请求，返回SPU信息（对象），在修改的时候可以利用服务器返回的这个对象收集最新的数据提交给服务器
      //添加SPU，如果是添加SPU的时候并没有向服务器发请求，数据收集到哪里呀[SPU]，收集数据的时候有哪些字段呀，看文档
      spu: {
        // 分类
        categoryName: "",
        //描述
        description: "",
        //spu名称
        spuName: "",
        // 商品名称
        price: undefined,

        //商品关键字收集
        keywordList: [],
        spuImageList: [], //存储SPU图片的数据
        owner: "", // 把发布商品的主人信息传给服务器,
        id: "", // 商品的id
      },
      spuImageList: [],
      folder: "",
      count: 0, // 已经上传的图片数量
      isEdit: false, // 是否是编辑状态
    };
  },

  methods: {
    //  接受编辑器传过来的值
    getDescription(val) {
      // console.log(val)
      this.spu.description = val;
    },
    // 文件上传数量超出限制
    handleOnExceed() {
      this.$message({ type: "warning", message: "最多只能上传7张图片！" });
    },
    //照片墙删除某一个图片的时候会触发
    handleRemove(file, fileList) {
      //file参数:代表的是删除的那个张图片
      //fileList:照片墙删除某一张图片以后，剩余的其他的图片
      // console.log(file, fileList,22222);
      //收集照片墙图片的数据
      //对于已有的图片【照片钱中显示的图片：有name、url字段的】，因为照片墙显示数据务必要有这两个属性
      //对于服务器而言，不需要name、url字段，将来对于有的图片的数据在提交给服务器的时候，需要处理的
      this.spuImageList = fileList;
      // upload里额外传的参数
      this.folder =
        this.spuImageList.length === 0
          ? ""
          : this.spuImageList[0].name.split("_")[0];
      // 如果已经有3张图片，0 1 2 那么命名就应该从3开始
      this.count = this.spuImageList.length;

      // console.log("filelist", fileList);
    },
    //照片墙图片预览的回调
    handlePictureCardPreview(file) {
      //将图片地址赋值给这个属性
      this.dialogImageUrl = file.url;
      // console.log("url", file.url);
      //对话框显示
      this.dialogVisible = true;
    },
    //照片墙图片上传成功的回调
    handlerSuccess(response, file, fileList) {
      //收集图片的信息
      this.spuImageList = fileList;
      // upload里额外传的参数
      this.folder =
        this.spuImageList.length === 0
          ? ""
          : this.spuImageList[0].name.split("_")[0];
      // 如果已经有3张图片，0 1 2 那么命名就应该从3开始
      this.count = this.spuImageList.length;
      // console.log("handlesuccess", fileList);
      // console.log('success',this.spuImageList,fileList)

      // 把照片墙的图片的url放到spu.spuImageList数组里，最后把spu传给服务器
      this.spu.spuImageList = this.spuImageList.map((item) => {
        // return item.response.data
        return {
          imageName: item.name,
          imageUrl: (item.response && item.response.data) || item.url,
        };
      });
    },

    addKeyword() {
      //向属性值的数组里面添加元素
      //attrId：是你相应的属性的id，目前而言我们是添加属性的操作，还没有相应的属性的id，目前而言带给服务器的id为undefined
      //valueName:相应的属性值的名称
      this.spu.keywordList.push({
        valueName: "",
        flag: true,
      });
      //flag属性：给每一个属性值添加一个标记flag，用户切换查看模式与编辑模式，好处，每一个属性值可以控制自己的模式切换
      //当前flag属性，响应式数据（数据变化视图跟着变化）
      this.$nextTick(() => {
        this.$refs[this.spu.keywordList.length - 1].focus();
      });
    },
    // 删除关键字
    deleteAttrValue(index) {
      //当前删除属性值的操作是不需要发请求的
      this.spu.keywordList.splice(index, 1);
    },
    // 保存按钮
    async addOrUpdateSpu() {
      // 把照片墙的图片的url放到spu.spuImageList数组里，最后把spu传给服务器
      this.spu.spuImageList = this.spuImageList.map((item) => {
        // return item.response.data
        return {
          imageName: item.name,
          imageUrl: (item.response && item.response.data) || item.url,
        };
      });
      // 把发布商品信息的主人信息传过去
      this.spu.owner = this.$store.getters.username;
      // 把商品分类名信息传过去
      this.spu.categoryName = this.getCategoryName;
      // console.log(this.spu.categoryName)
      // console.log(this.spu.id)
      //发请求
      const result =  await this.$API.product.reqAddOrUpdateSpu(this.spu)
      if (result.code === 200) {
        //提示
        this.$message({ type: "success", message: "保存成功" });
        //通知父组件回到场景0
        this.$emit("changeScene", {
          scene: 0,
          flag: this.spu.id ? "修改" : "添加",
        })
          //清除数据
        Object.assign(this._data, this.$options.data());
      }else{
        this.$message({ message: 'failed', type: "error" })
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // console.log('submit')
          // // 发请求
          this.addOrUpdateSpu()
        }else {
          // console.log('error submit!!');
          this.$message({ message: "请填完整信息！", type: "error" });
          return false;
        }
      });
    },

    toLook(row) {
      // 如果属性值为空不能作为新的属性值，需要给用户提示，让他输入一个其他的属性值
      if (row.valueName.trim() == "") {
        this.$message("请你输入一个正常的属性值");
        return;
      }
      //新增的属性值不能与已有的属性值重复
      let isRepat = this.spu.keywordList.some((item) => {
        //需要将row从数组里面判断的时候去除
        //row最新新增的属性值【数组的最后一项元素】
        //判断的时候，需要把已有的数组当中新增的这个属性值去除
        if (row !== item) {
          return row.valueName == item.valueName;
        }
      });

      if (isRepat) return;
      // row：形参是当前用户添加的最新的属性值
      // 当前编辑模式变为查看模式【让input消失，显示span】
      row.flag = false;
    },
    //点击span的回调，变为编辑模式
    toEdit(row, index) {
      row.flag = true;
      //获取input节点，实现自动聚焦
      //需要注意：点击span的时候，切换为input变为编辑模式，但是需要注意，对于浏览器而言，页面重绘与重拍耗时间的
      //点击span的时候，重绘重拍一个input它是需要耗费事件，因此我们不可能一点击span立马获取到input
      //$nextTick,当节点渲染完毕了，会执行一次
      this.$nextTick(() => {
        //获取相应的input表单元素实现聚焦
        this.$refs[index].focus();
      });
    },
    //取消按钮
    cancel() {
      //取消按钮的回调，通知父亲切换场景为0
      this.$emit("changeScene", { scene: 0, flag: "" });
      //清理数据
      //Object.assign:es6中新增的方法可以合并对象
      //组件实例this._data,可以操作data当中响应式数据
      //this.$options可以获取配置对象，配置对象的data函数执行，返回的响应式数据为空的
      Object.assign(this._data, this.$options.data());
    },

    // 对于修改商品模式
    // 初始化该商品的已有数据
    initSpuData(spu) {
      // spu就是商品的所有信息
      // console.log(spu)
      this.spu.id = spu._id;
      this.spu.description = spu.description;
      this.spu.categoryName = spu.categoryName;
      this.spu.spuName = spu.title;
      this.spu.price = spu.price;
      // this.spu.keywordList = spu.keyword;
      spu.keyword.forEach(word=>{
        this.spu.keywordList.push({
        valueName: word,
        flag: false,
      });
      })
      
      this.spu.spuImageList = spu.gallery;
      this.spu.owner = spu.owner;
      const tempArray = [];
      //由于照片墙显示图片的数据需要数组，数组里面的元素需要有name与url字段
      spu.gallery.forEach((item, index) => {
        // console.log(index)
        tempArray[index] = {};
        tempArray[index].name = item.split("/")[item.split("/").length - 1];
        tempArray[index].url = item;
      });
      this.spuImageList = tempArray;
      // upload里额外传的参数
      this.folder =
        this.spuImageList.length === 0
          ? ""
          : this.spuImageList[0].name.split("_")[0];
      // 如果已经有3张图片，0 1 2 那么命名就应该从3开始
      this.count = this.spuImageList.length;
      this.isEdit = true;

      // this.spu.spuImageList = this.spuImageList
      // console.log(this.spuImageList)
      //把整理好的数据赋值给
      // this.spuImageList = listArr;
    },
  },
  computed: {},
};
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
