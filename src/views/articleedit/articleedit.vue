<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>修改文章</span>
    </div>
    <div class="text item">
      <el-form ref="editFormRef" :model="editForm" label-width="120px" :rules="editFormRules">
        <el-form-item label="标题:" prop="title">
          <el-input v-model="editForm.title" placeholder="文章名称" style="width: 500px"></el-input>
        </el-form-item>
        <el-form-item label="内容:" prop="content">
          <quill-editor v-model="editForm.content"></quill-editor>
        </el-form-item>
        <el-form-item label="封面:">
          <el-radio-group v-model="editForm.cover.type">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道:" prop="channel_id">
          <channel-com @slt="selectHandler" :cid="editForm.channel_id"></channel-com>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="editarticle(false)">修改</el-button>
          <el-button @click="editarticle(true)">存入草稿</el-button>
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
import ChannelCom from '@/components/channel.vue'

export default {
  components: {
    quillEditor,
    ChannelCom
  },
  name: 'ArticleEdit',
  data () {
    return {
      editFormRules: {
        title: [
          { required: true, message: '标题必填' },
          { min: 5, max: 30, message: '标题长度介于5-30个字符' }
        ],
        content: [{ required: true, message: '内容必填' }],
        channel_id: [{ required: true, message: '频道必填' }]
      },
      editForm: {
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
  computed: {
    aid () {
      return this.$route.params.aid
    }
  },
  methods: {
    selectHandler (val) {
      this.editForm.channel_id = val
    },
    getArticleAid () {
      let pro = this.$http.get(`articles/${this.aid}`)
      pro
        .then(result => {
          if (result.data.message === 'OK') {
            this.editForm = result.data.data
          }
        })
        .catch(err => {
          return this.$message.error('获取文章失败!' + err)
        })
    },
    editarticle (flag) {
      this.$refs.editFormRef.validate(valid => {
        if (valid) {
          var pro = this.$http.put(`/articles/${this.aid}`, this.editForm, {
            params: { draft: flag }
          })
          pro
            .then(result => {
              this.$message.success('文章修改成功')
              this.$router.push({ name: 'article' })
            })
            .catch(err => {
              return this.$message.error('修改文章失败' + err)
            })
        }
      })
    }
  },
  created () {
    this.getArticleAid()
  }
}
</script>

<style lang="less" scoped>
.el-form /deep/ .ql-editor {
  height: 200px;
}
</style>
