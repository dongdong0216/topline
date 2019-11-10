<template>
  <div class="login-container">
    <div class="login-box">
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules">
        <img src="./logo_index.png" alt style="width:60%" />
        <el-form-item prop="mobile">
          <el-input v-model="loginForm.mobile" placeholder="请输入手机号码"></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input v-model="loginForm.code" placeholder="请输入验证码"></el-input>
        </el-form-item>
        <el-form-item style="text-align:left" prop="xieyi">
          <el-checkbox v-model="loginForm.xieyi" style="margin-right:10px"></el-checkbox>
          <span>我已阅读并同意用户协议和隐私条款</span>
        </el-form-item>
        <el-form-item>
          <el-button style="width:100%;" type="primary" @click="login()">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    var xieyiTest = function (rule, value, callback) {
      value ? callback() : callback(new Error('请无条件遵守规矩'))
    }
    return {
      loginForm: {
        mobile: '18513163183',
        code: '246810',
        xieyi: true
      },
      loginFormRules: {
        mobile: [
          { required: true, message: '手机号必填' },
          { pattern: /^1[35789]\d{9}$/, message: '手机号码格式不对' }
        ],
        code: [{ required: true, message: '验证码必填' }],
        xieyi: [{ validator: xieyiTest }]
      }
    }
  },
  methods: {
    login () {
      this.$refs.loginFormRef.validate(valid => {
        if (!valid) {
          return false
        }

        var pro = this.$http.post('/authorizations', this.loginForm)
        pro
          .then((result) => {
            if (result.data.message === 'OK') {
              window.sessionStorage.setItem('token', JSON.stringify(result.data.data))
              this.$router.push({ name: 'home' })
            }
          }).catch((err) => {
            this.$message.error('手机号或密码错误 ' + err)
          })
      })
    }
  },
  created () {
    document.onkeypress = e => {
      var keycode = document.all ? event.keyCode : e.which
      if (keycode === 13) {
        this.login()
        return false
      }
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  background: url("./login_bg.jpg") no-repeat;
  background-size: cover;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  .login-box {
    width: 410px;
    height: 345px;
    background-color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    .el-form {
      width: 75%;
    }
  }
}
</style>
