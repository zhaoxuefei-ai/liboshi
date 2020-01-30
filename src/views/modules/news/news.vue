<template>
    <div class="mod-config">
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
            <el-form-item>
                <el-input v-model="dataForm.key" placeholder="请输入标题,类别" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="getDataList()">查询</el-button>
                <el-button v-if="isAuth('news:news:save')" type="primary" @click="addHandle()">新增</el-button>
                <el-button v-if="isAuth('news:news:delete')" type="danger" @click="deleteHandle()"
                           :disabled="dataListSelections.length <= 0">批量删除
                </el-button>
            </el-form-item>
        </el-form>
        <el-table
            :data="dataList"
            border
            v-loading="dataListLoading"
            @selection-change="selectionChangeHandle"
            style="width: 100%;">
            <el-table-column
                type="selection"
                header-align="center"
                align="center"
                width="50">
            </el-table-column>
            <el-table-column
                type="index"
                width="50"
                header-align="center"
                align="center"
                label="序号"
            ></el-table-column>
            <el-table-column
                prop="cover"
                header-align="center"
                align="center"
                width="120px"
                label="封面">
                <template slot-scope="scope">
                    <img
                        style="width: 100px; height: 100px"
                        :src="scope.row.cover"
                        ></img>
                </template>
            </el-table-column>
            <el-table-column
                prop="category"
                header-align="center"
                align="center"
                width="120px"
                label="新闻类别">
            </el-table-column>
            <el-table-column
                prop="title"
                header-align="center"
                align="center"
                width="200px"
                label="文章标题">
            </el-table-column>
            <el-table-column
                prop="content"
                header-align="center"
                align="center"
                label="文章内容">
                <template slot-scope="scope">
                    <div class="editor-content" style=" zoom: 0.25; max-height: 300px" v-html="scope.row.content"/>
                </template>
            </el-table-column>
            <el-table-column
                prop="createTime"
                header-align="center"
                align="center"
                width="100px"
                label="创建时间">
            </el-table-column>
            <el-table-column
                fixed="right"
                header-align="center"
                align="center"
                width="100"
                label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="updateHandle(scope.row.id)">详情</el-button>
                    <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            :current-page="pageIndex"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            :total="totalPage"
            layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
    </div>
</template>

<script>
    export default {
      data () {
        return {
          dataForm: {
            key: ''
          },
          dataList: [],
          pageIndex: 1,
          pageSize: 20,
          totalPage: 0,
          dataListLoading: false,
          dataListSelections: [],
          addOrUpdateVisible: false
        }
      },
      activated () {
        this.getDataList()
      },
      methods: {
            // 获取数据列表
        getDataList () {
          this.dataListLoading = true
          this.$http({
            url: this.$http.adornUrl('/news/news/list'),
            method: 'get',
            params: this.$http.adornParams({
              'page': this.pageIndex,
              'limit': this.pageSize,
              'category': this.dataForm.key,
              'title': this.dataForm.key
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.dataList = data.page.list
              this.totalPage = data.page.totalCount
            } else {
              this.dataList = []
              this.totalPage = 0
            }
            this.dataListLoading = false
          })
        },
            // 每页数
        sizeChangeHandle (val) {
          this.pageSize = val
          this.pageIndex = 1
          this.getDataList()
        },
            // 当前页
        currentChangeHandle (val) {
          this.pageIndex = val
          this.getDataList()
        },
            // 多选
        selectionChangeHandle (val) {
          this.dataListSelections = val
        },
            // 新增
        addHandle () {
          this.$router.push({name: 'news-editor'})
        },
            // / 修改
        updateHandle (id) {
          this.$router.push({name: 'news-view', query: {id: id}})
        },
            // 删除
        deleteHandle (id) {
          var ids = id ? [id] : this.dataListSelections.map(item => {
            return item.id
          })
          this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$http({
              url: this.$http.adornUrl('/news/news/delete'),
              method: 'post',
              data: this.$http.adornData(ids, false)
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.getDataList()
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
          })
        }
      }
    }
</script>
