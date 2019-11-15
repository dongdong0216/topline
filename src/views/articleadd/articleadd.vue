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
        </el-form-item>
        <el-form-item label="频道:" prop="channel_id">
          <el-select v-model="addForm.channel_id" clearable placeholder="请选择">
            <el-option
              v-for="item in channelList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="addarticle(false)">发布</el-button>
            <el-button @click="addarticle(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'

export default {
  components: {
    quillEditor
  },
  name: 'ArticleAdd',
  data () {
    return {
      addFormRules: {
        title: [
          { required: true, message: '标题必填' },
          { min: 5, max: 30, message: '标题长度介于5-30个字符' }
        ],
        content: [{ required: true, message: '内容必填' }],
        channel_id: [{ required: true, message: '频道必填' }]

      },
      channelList: [],
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
  methods: {
    addarticle (flag) {
      this.$refs.addFormRef.validate(valid => {
        if (valid) {
          var pro = this.$http.post('/articles', this.addForm, { params: { draft: flag } })
          pro
            .then((result) => {
              this.$message.success('文章发布成功')
              this.$router.push({ name: 'article' })
            }).catch((err) => {
              return this.$message.error('发布文章失败' + err)
            })
        }
      })
    },
    getChannelList () {
      let pro = this.$http.get('/channels')
      pro
        .then(result => {
          if (result.data.message === 'OK') {
            this.channelList = result.data.data.channels
          }
        })
        .catch(err => {
          return this.$message.error('获取文章频道错误' + err)
        })
    }
  },
  created () {
    this.getChannelList()
  }
}
</script>

<style lang="less" scoped>
.el-form /deep/ .ql-editor{
    height: 200px;
}
</style>
