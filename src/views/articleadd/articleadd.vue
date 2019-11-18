<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>发布文章</span>
    </div>
    <div class="text item">
      <el-form ref="addFormRef" :model="addForm" label-width="120px" :rules="addFormRules">
        <el-form-item label="标题:" prop="title">
          <el-input v-model="addForm.title" placeholder="文章名称" style="width: 500px"></el-input>
        </el-form-item>
        <el-form-item label="内容:" prop="content">
          <quill-editor v-model="addForm.content"></quill-editor>
        </el-form-item>
        <el-form-item label="封面:">
          <el-radio-group v-model="addForm.cover.type">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
          <ul>
            <li class="uploadbox" @click="showDialog" v-for="item in covernum" :key="item">
              <span>点击图标选择图片</span>
              <img v-if="addForm.cover.images[item-1]" :src="addForm.cover.images[item-1]" alt />
              <div v-else class="el-icon-picture-outline"></div>
            </li>
          </ul>
        </el-form-item>
        <el-form-item label="频道:" prop="channel_id">
          <channel-com @slt="selectHandler"></channel-com>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addarticle(false)">发布</el-button>
          <el-button @click="addarticle(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog title="素材展示" :visible.sync="dialogVisible" width="60%">
      <!--匿名插槽体现-->
      <ul class="clearfix">
        <li class="image-box" v-for="item in imageList" :key="item.id">
          <img :src="item.url" alt="没有图片" @click="clkImage" />
        </li>
      </ul>
      <!--命名插槽体现-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'

import ChannelCom from '@/components/channel.vue'

export default {
  name: 'ArticleAdd',
  components: {
    quillEditor,
    ChannelCom
  },
  computed: {
    covernum () {
      if (this.addForm.cover.type > 0) {
        return this.addForm.cover.type
      }
      return 0
    }
  },
  data () {
    return {
      imageList: [],
      querycdt: {
        collect: false,
        page: 1,
        per_page: 20
      },
      dialogVisible: false,
      addFormRules: {
        title: [
          { required: true, message: '标题必填' },
          { min: 5, max: 30, message: '标题长度介于5-30个字符' }
        ],
        content: [{ required: true, message: '内容必填' }],
        channel_id: [{ required: true, message: '频道必填' }]
      },
      addForm: {
        title: '',
        content: '',
        channel_id: '',
        cover: {
          type: 0,
          images: []
        }
      }
    }
  },
  created () {
    this.getImageList()
  },
  methods: {
    clkImage (evt) {
      let lis = document.querySelectorAll('.image-box')
      for (let i = 0; i < lis.length; i++) {
        lis[i].style.border = ''
      }
      evt.target.parentNode.style.border = '4px solid blue'
    },
    getImageList () {
      let pro = this.$http.get('/user/images', { params: this.querycdt })
      pro
        .then(result => {
          if (result.data.message === 'OK') {
            this.imageList = result.data.data.results
          }
        })
        .catch(err => {
          return this.$message.error('获取素材图片失败' + err)
        })
    },
    showDialog () {
      this.dialogVisible = true
    },
    selectHandler (val) {
      this.addForm.channel_id = val
    },
    addarticle (flag) {
      this.$refs.addFormRef.validate(valid => {
        if (valid) {
          var pro = this.$http.post('/articles', this.addForm, {
            params: { draft: flag }
          })
          pro
            .then(result => {
              this.$message.success('文章发布成功')
              this.$router.push({ name: 'article' })
            })
            .catch(err => {
              return this.$message.error('发布文章失败' + err)
            })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-form /deep/ .ql-editor {
  height: 200px;
}
.uploadbox {
  list-style: none;
  width: 200px;
  height: 200px;
  margin: 10px;
  float: left;
  cursor: pointer;
  border: 1px solid #eee;
  span {
    width: 200px;
    height: 50px;
    line-height: 50px;
    display: block;
    text-align: center;
  }
  div {
    width: 200px;
    height: 150px;
    font-size: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
  }
  img {
    width: 200px;
    height: 150px;
  }
}
// 对话框素材图片列表相关css样式
.image-box {
  list-style: none;
  width: 200px;
  height: 140px;
  background-color: #fff;
  margin: 10px;
  float: left;
  border: 1px solid #eee;
  cursor: pointer;
  box-sizing: border-box;
  img {
    width: 100%;
    height: 100%;
  }
}
.clearfix{
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
