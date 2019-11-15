<template>
  <div>
    <el-card class="box-card" style="margin-bottom:15px">
      <div slot="header" class="clearfix">
        <span>全部图文</span>
      </div>
      <div class="text item">
        <el-form ref="searchFormRef" :model="searchForm" label-width="100px">
          <el-form-item label="文章状态:">
            <el-radio v-model="searchForm.status" label>全部</el-radio>
            <el-radio v-model="searchForm.status" label="0">草稿</el-radio>
            <el-radio v-model="searchForm.status" label="1">待审核</el-radio>
            <el-radio v-model="searchForm.status" label="2">审核通过</el-radio>
            <el-radio v-model="searchForm.status" label="3">审核失败</el-radio>
          </el-form-item>
          <el-form-item label="频道列表:">
            <channel-com @slt="selectHandler"></channel-com>
          </el-form-item>
          <el-form-item label="时间选择:">
            <el-date-picker
              v-model="timetotime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>共找到{{ tot }}条符合条件的内容</span>
      </div>
      <div class="text item">
        <el-table :data="articleList" style="width: 100%">
          <el-table-column label="图标">
            <img
              :src="stData.row.cover.images[0]"
              slot-scope="stData"
              alt="没有图标"
              width="150"
              height="100"
            />
          </el-table-column>
          <el-table-column prop="title" label="标题" width="300"></el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template slot-scope="stData">
              <el-tag v-if="stData.row.status===0">草稿</el-tag>
              <el-tag v-else-if="stData.row.status===1" type="success">待审核</el-tag>
              <el-tag v-else-if="stData.row.status===2" type="info">审核通过</el-tag>
              <el-tag v-else-if="stData.row.status===3" type="warning">审核失败</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="pubdate" label="发布时间"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="stData">
              <el-button
                type="primary"
                size="mini"
                @click="$router.push(`/articleedit/${stData.row.id}`)"
              >修改</el-button>
              <el-button type="danger" size="mini" @click="del(stData.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="text item">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="searchForm.page"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="searchForm.per_page"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tot"
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import ChannelCom from '@/components/channel.vue'
export default {
  components: {
    // 注册频道独立组件
    ChannelCom
  },
  name: 'articleList',
  data () {
    return {
      articleList: [],
      timetotime: [],
      tot: 0,
      searchForm: {
        status: '',
        begin_pubdate: '', // 文章发布开始时间
        end_pubdate: '', // 文章发布结束时间
        channel_id: '',
        page: 1,
        per_page: 10
      }
    }
  },
  watch: {
    timetotime (newv, oldv) {
      if (newv) {
        this.searchForm.begin_pubdate = newv[0]
        this.searchForm.end_pubdate = newv[1]
      } else {
        this.searchForm.begin_pubdate = ''
        this.searchForm.end_pubdate = ''
      }
    },
    searchForm: {
      handler: function (newv, oldv) {
        this.getArticleList()
      },
      deep: true
    }
  },
  methods: {
    selectHandler (val) {
      this.searchForm.channel_id = val
    },
    del (id) {
      this.$confirm('确定删除该文章么?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          var pro = this.$http.delete(`/articles/${id}`)
          pro
            .then(result => {
              this.$message.success('文章删除成功')
              this.getArticleList()
            })
            .catch(err => {
              this.$message.error('文章删除错误' + err)
            })
        })
        .catch(() => {})
    },
    handleSizeChange (val) {
      this.searchForm.per_page = val
    },
    handleCurrentChange (val) {
      this.searchForm.page = val
    },
    getArticleList () {
      let searchData = {}
      for (var i in this.searchForm) {
        if (this.searchForm[i]) {
          searchData[i] = this.searchForm[i]
        }
      }
      let pro = this.$http.get('/articles', { params: searchData })
      pro
        .then(result => {
          if (result.data.message === 'OK') {
            this.articleList = result.data.data.results
            this.tot = result.data.data.total_count
          }
        })
        .catch(err => {
          return this.$message.error('获取文章列表失败' + err)
        })
    }
  },
  created () {
    this.getArticleList()
  }
}
</script>

<style lang="less" scoped>
</style>
