<template>
  <el-select v-model="chid" clearable placeholder="请选择">
    <el-option v-for="item in channelList" :key="item.id" :label="item.name" :value="item.id"></el-option>
  </el-select>
</template>

<script>
export default {
  name: 'ChannelCom',
  props: {
    cid: {
      default: 0
    }
  },
  data () {
    return {
      channelList: [],
      chid: ''
    }
  },
  watch: {
    cid: function (newV, oldV) {
      this.chid = newV
    },
    chid: function (newV, oldV) {
      this.$emit('slt', this.chid)
    }
  },
  methods: {
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
</style>
