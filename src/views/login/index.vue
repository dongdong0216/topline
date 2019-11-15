<template>
  <div class="login-container">
    <div class="login-box">
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules">
        <img src="./logo_index.png" alt style="width: 60%" />
        <el-form-item prop="mobile">
          <el-input v-model="loginForm.mobile" placeholder="请输入手机号码"></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input v-model="loginForm.code" placeholder="请输入验证码"></el-input>
        </el-form-item>
        <el-form-item style="text-align: left" prop="xieyi">
          <el-checkbox style="margin-right: 10px" v-model="loginForm.xieyi"></el-checkbox>
          <span>我已阅读并同意用户协议和隐私条款</span>
        </el-form-item>
        <el-form-item>
          <el-button
          type="primary"
          style="width: 100%"
          @click="login()"
          :loading="isActive"
          :disabled="isActive"
          >登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import '@/assets/js/gt.js'
export default {
  data () {
    var xieyitest = function (rule, value, callback) {
      value ? callback() : callback(new Error('请无条件遵守协议'))
    }
    return {
      ctaObj: null,
      isActive: false,
      loginForm: {
        mobile: '18513163183',
        code: '246810',
        xieyi: true
      },
      loginFormRules: {
        mobile: [
          { required: true, message: '手机号码必须写' },
          {
            pattern: /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/,
            message: '手机号码格式不正确'
          }
        ],
        code: [{ required: true, message: '验证码必须写' }],
        xieyi: [{ validator: xieyitest }]
      }
    }
  },
  methods: {
    login () {
      this.$refs.loginFormRef.validate(valid => {
        if (valid) {
          if (this.ctaObj !== null) {
            return this.ctaObj.verify()
          }
          this.isActive = true
          var pro = this.$http.get(`/captchas/${this.loginForm.mobile}`)
          pro
            .then(result => {
              console.log(result)

              var { data } = result.data
              console.log(data)

              window.initGeetest(
                {
                  // 以下配置参数来自服务端 SDK
                  gt: data.gt,
                  challenge: data.challenge,
                  offline: !data.success,
                  new_captcha: true,
                  product: 'bind'
                },
                captchaObj => {
                  captchaObj
                    .onReady(() => {
                      // 验证码ready之后才能调用verify方法显示验证码
                      this.isActive = false
                      captchaObj.verify()
                      this.ctaObj = captchaObj
                    })
                    .onSuccess(() => {
                      this.loginAct()
                    })
                    .onError(() => {

                    })
                }
              )
            })
            .catch(err => {
              console.log(err)
            })
        }
      })
    },
    loginAct () {
      var pro = this.$http.post('/authorizations', this.loginForm)
      pro
        .then(result => {
          if (result.data.message === 'OK') {
            window.sessionStorage.setItem(
              'userinfo',
              JSON.stringify(result.data.data)
            )
            this.$router.push('/home')
          }
        })
        .catch(err => {
          this.$message.error('手机号码或验证码错误' + err)
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
  background: url("./login_bg.jpg");
  background-size: cover;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .login-box {
    width: 410px;
    height: 350px;
    background: white;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    .el-form {
      width: 75%;
    }
  }
}
</style>
