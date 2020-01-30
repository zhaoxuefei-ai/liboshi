<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="新闻类别" prop="category">
      <el-input v-model="dataForm.category" placeholder="新闻类别"></el-input>
    </el-form-item>
    <el-form-item label="文章标题" prop="title">
      <el-input v-model="dataForm.title" placeholder="文章标题"></el-input>
    </el-form-item>
    <el-form-item label="文章内容" prop="content">
      <el-input v-model="dataForm.content" placeholder="文章内容"></el-input>
    </el-form-item>
    <el-form-item label="创建用户ID" prop="createUserId">
      <el-input v-model="dataForm.createUserId" placeholder="创建用户ID"></el-input>
    </el-form-item>
    <el-form-item label="创建时间" prop="createTime">
      <el-input v-model="dataForm.createTime" placeholder="创建时间"></el-input>
    </el-form-item>
    <el-form-item label="修改用户ID" prop="updateUserId">
      <el-input v-model="dataForm.updateUserId" placeholder="修改用户ID"></el-input>
    </el-form-item>
    <el-form-item label="修改时间" prop="updateTime">
      <el-input v-model="dataForm.updateTime" placeholder="修改时间"></el-input>
    </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          id: 0,
          category: '',
          title: '',
          content: '',
          createUserId: '',
          createTime: '',
          updateUserId: '',
          updateTime: ''
        },
        dataRule: {
          category: [
            { required: true, message: '新闻类别不能为空', trigger: 'blur' }
          ],
          title: [
            { required: true, message: '文章标题不能为空', trigger: 'blur' }
          ],
          content: [
            { required: true, message: '文章内容不能为空', trigger: 'blur' }
          ],
          createUserId: [
            { required: true, message: '创建用户ID不能为空', trigger: 'blur' }
          ],
          createTime: [
            { required: true, message: '创建时间不能为空', trigger: 'blur' }
          ],
          updateUserId: [
            { required: true, message: '修改用户ID不能为空', trigger: 'blur' }
          ],
          updateTime: [
            { required: true, message: '修改时间不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/news/news/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.category = data.news.category
                this.dataForm.title = data.news.title
                this.dataForm.content = data.news.content
                this.dataForm.createUserId = data.news.createUserId
                this.dataForm.createTime = data.news.createTime
                this.dataForm.updateUserId = data.news.updateUserId
                this.dataForm.updateTime = data.news.updateTime
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/news/news/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'category': this.dataForm.category,
                'title': this.dataForm.title,
                'content': this.dataForm.content,
                'createUserId': this.dataForm.createUserId,
                'createTime': this.dataForm.createTime,
                'updateUserId': this.dataForm.updateUserId,
                'updateTime': this.dataForm.updateTime
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      }
    }
  }
</script>
