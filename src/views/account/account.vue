<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>账号信息</span>
    </div>
    <div class="text item cardbody">
      <div class="lf">
        <el-form
          ref="accountFormRef"
          :model="accountForm"
          label-width="100px"
          :rules="accountFormRules"
        >
          <el-form-item label="用户名:" prop="name">
            <el-input v-model="accountForm.name"></el-input>
          </el-form-item>
          <el-form-item label="手机号码:">
            <el-input v-model="accountForm.mobile" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱:" prop="email">
            <el-input v-model="accountForm.email"></el-input>
          </el-form-item>
          <el-form-item label="简介:">
            <el-input v-model="accountForm.intro"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="editAccount">更新账户</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="rt">
        <el-upload action :show-file-list="false" :http-request="httpRequest">
          <img
            v-if="accountForm.photo"
            :src="accountForm.photo"
            class="avatar"
            width="200"
            height="200"
          />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'Account',
  methods: {
    httpRequest (resource) {
      let fd = new FormData()
      fd.append('photo', resource.file)
      let pro = this.$http.patch('/user/photo', fd)
      pro
        .then(result => {
          if (result.data.message === 'OK') {
            this.accountForm.photo = result.data.data.photo
            let userinfo = JSON.parse(
              window.sessionStorage.getItem('userinfo')
            )
            userinfo.photo = result.data.data.photo
            window.sessionStorage.setItem('userinfo', JSON.stringify(userinfo))
            this.$message.success('更新用户头像成功')
          }
        })
        .catch(err => {
          this.$message.error('更新用户头像失败' + err)
        })
    },
    editAccount () {
      this.$refs.accountFormRef.validate(valid => {
        if (valid) {
          let pro = this.$http.patch('/user/profile', this.accountForm)
          pro
            .then(result => {
              if (result.data.message === 'OK') {
                this.$message.success('更新账户信息成功!')
              }
            })
            .catch(err => {
              this.$message.error('更新账户信息失败!' + err)
            })
        }
      })
    },
    getAccountInfo () {
      let pro = this.$http.get('/user/profile')
      pro
        .then(result => {
          if (result.data.message === 'OK') {
            this.accountForm = result.data.data
          }
        })
        .catch(err => {
          this.$message.error('获取账户信息错误' + err)
        })
    }
  },
  created () {
    this.getAccountInfo()
  },
  data () {
    return {
      accountFormRules: {
        name: [
          { required: true, message: '用户名必填' },
          { min: 1, max: 7, message: '用户名长度介于1-7个字符之间' }
        ],
        email: [
          { required: true, message: '邮箱必填' },
          { type: 'email', message: '邮箱格式不正确' }
        ]
      },
      accountForm: {
        name: '',
        mobile: '',
        email: '',
        intro: ''
      }
    }
  }
}
</script>

<style lang="less" scoped>
.cardbody {
  display: flex;
  justify-content: space-between;
  .lf {
    width: 40%;
  }
  .rt {
    width: 30%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
