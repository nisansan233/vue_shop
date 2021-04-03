<template>
  <div>
    <Breadcrumb></Breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 提示 -->
      <el-alert
        title="添加商品信息"
        type="info"
        center
        :show-icon="true"
        :closable="false"
      >
      </el-alert>

      <!-- 步骤条 -->
      <el-steps
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
        :align-center="true"
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- Tab栏区域 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          :tab-position="'left'"
          v-model="activeIndex"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane
            label="基本信息"
            name="0"
          >
            <el-form-item
              label="商品名称"
              prop="goods_name"
            >
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item
              label="商品价格"
              prop="goods_price"
            >
              <el-input
                v-model="addForm.goods_price"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="商品重量"
              prop="goods_weight"
            >
              <el-input
                v-model="addForm.goods_weight"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="商品数量"
              prop="goods_number"
            >
              <el-input
                v-model="addForm.goods_number"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="商品分类"
              prop="goods_cat"
            >
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="cateProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane
            label="商品参数"
            name="1"
          >
            <!-- 渲染表单的item项 -->
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyTableData"
              :key="item.attr_id"
            >
              <!-- 复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="cb"
                  v-for="(cb,i) in item.attr_vals"
                  :key="i"
                  :border="true"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane
            label="商品属性"
            name="2"
          >
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyTableData"
              :key="item.attr_id"
            >
              <el-input
                v-model="item.attr_vals"
                placeholder=""
              ></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane
            label="商品图片"
            name="3"
          >
            <!-- action图片上传到的api地址 -->
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :headers="headerObj"
              list-type="picture"
              :on-success="handleSuccess"
            >
              <el-button
                size="small"
                type="primary"
              >点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane
            label="商品内容"
            name="4"
          >
            <!-- 富文本编辑器 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <!-- 添加商品的按钮 -->
            <el-button
              type="primary"
              class="btnAdd"
              @click="add"
            >添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览 -->
    <el-dialog
      title="图片预览"
      :visible.sync="previewVisible"
      width="50%"
    >
      <img
        :src="previewPath"
        alt=""
        class="previewImg"
      >
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
import Breadcrumb from 'components/goods/Add/Breadcrumb/breadcrumb'
export default {
  components: {
    Breadcrumb,
  },
  data() {
    return {
      activeIndex: '0',
      // 添加商品的表单数据对象
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品所属的分类数组
        goods_cat: [],
        pics: [],
        // 商品的详情描述
        goods_introduce: '',
        attrs: [],
      },
      addFormRules: {
        goods_name: [
          {
            required: true,
            message: '请输入商品名称',
            trigger: 'blur',
          },
        ],
        goods_price: [
          {
            required: true,
            message: '请输入商品价格',
            trigger: 'blur',
          },
        ],
        goods_weight: [
          {
            required: true,
            message: '请输入商品重量',
            trigger: 'blur',
          },
        ],
        goods_number: [
          {
            required: true,
            message: '请输入商品数量',
            trigger: 'blur',
          },
        ],
        goods_cat: [
          {
            required: true,
            message: '请选择商品分类',
            trigger: 'blur',
          },
        ],
      },
      cateList: [],
      cateProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
      },
      // 动态参数列表数据
      manyTableData: [],
      // 静态属性列表数据
      onlyTableData: [],
      // 上传图片的URL地址
      uploadURL: `http://127.0.0.1:8888/api/private/v1/upload`,
      // 图片上传请求头对象
      headerObj: {
        Authorization: window.sessionStorage.getItem('token'),
      },
      previewPath: '',
      previewVisible: false,
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    getCateList() {
      this.$axios.get('categories').then((res) => {
        if (res.data.meta.status != 200) {
          return this.$message.error('获取商品分类数据失败!')
        }
        this.cateList = res.data.data
        // console.log(this.cateList)
        // console.log(this.total)
      })
    },
    // 级联选择器,选中项发生变化
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
      // console.log(this.addForm.goods_cat)
    },
    beforeTabLeave(activeName, oldActiveName) {
      // console.log('即将离开的标签页'+oldActiveName);
      // console.log('即将进入的标签页'+activeName);
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择三级商品分类!')
        return false
      }
    },
    tabClicked() {
      //  访问动态参数面板
      if (this.activeIndex === '1') {
        this.$axios
          .get(`categories/${this.cateId}/attributes`, {
            params: {
              sel: 'many',
            },
          })
          .then((res) => {
            if (res.data.meta.status != 200) {
              return this.$message.error('获取动态参数列表失败!')
            }
            this.$message.success('获取动态参数列表成功!')
            console.log(res.data.data)
            res.data.data.forEach((item) => {
              item.attr_vals =
                item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
              // console.log(item.attr_vals)
            })

            this.manyTableData = res.data.data
          })
      } else if (this.activeIndex === '2') {
        this.$axios
          .get(`categories/${this.cateId}/attributes`, {
            params: {
              sel: 'only',
            },
          })
          .then((res) => {
            if (res.data.meta.status != 200) {
              return this.$message.error('获取静态属性列表失败!')
            }
            this.$message.success('获取静态属性列表成功!')
            console.log(res.data.data)
            this.onlyTableData = res.data.data
          })
      }
    },
    // 处理图片预览效果
    handlePreview(file) {
      console.log(file)
      this.previewPath = file.response.data.url
      this.previewVisible = true
    },
    // 处理移除图片的操作
    handleRemove(file) {
      // console.log(file)
      // 1.获取要删除的图片的临时路径
      const filePath = file.response.data.tmp_path
      // 2.从对应的pics数组中,找到这个图片对应的索引值
      const i = this.addForm.pics.findIndex((x) => {
        x.pic === filePath
      })
      // 3.调用数组的 splice 方法,把图片信息对象,从pics数组中移除
      this.addForm.pics.splice(i, 1)
      console.log(this.addForm)
    },
    // 监听图片上传成功的事件
    handleSuccess(response) {
      console.log(response)
      // 1.拼接得到一个图片信息对象
      const picInfo = {
        pic: response.data.tmp_path,
      }
      // 2.将图片push到pics数组中
      this.addForm.pics.push(picInfo)
      console.log(this.addForm)
    },
    // 添加商品
    add() {
      this.$refs.addFormRef.validate((valid) => {
        if (!valid) {
          return this.$message.error('请填写必要的表单项!')
        }
        // 商品信息已填写,执行添加
        // loadsh  clongDeep(obj)
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        // 处理动态参数和静态属性
        this.manyTableData.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' '),
          }
          this.addForm.attrs.push(newInfo)
        })
        this.onlyTableData.forEach(item=>{
          const newInfo={
            attr_id: item.attr_id,
            attr_value: item.attr_vals,
          }
          this.addForm.attrs.push(newInfo)
        })
        form.attrs=this.addForm.attrs
        console.log(form)
        this.$axios.post('goods',form).then(res=>{
          if(res.data.meta.status!=201){
            console.log(res.data);
            return this.$message.error('添加商品失败!')
          }
          this.$message.success('添加商品成功!')
          this.$router.push('/goods')
        })
        
      })
    },
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    },
  },
}
</script>

<style lang="less" scoped>
.el-checkbox {
  margin: 0 15px 0 0 !important;
}

.previewImg {
  width: 100%;
}

.btnAdd {
  margin-top: 20px;
}
</style>