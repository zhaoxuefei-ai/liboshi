<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="" prop="loginName">
      <el-input v-model="dataForm.loginName" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="" prop="name">
      <el-input v-model="dataForm.name" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="" prop="password">
      <el-input v-model="dataForm.password" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="" prop="avatar">
      <el-input v-model="dataForm.avatar" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="" prop="mailbox">
      <el-input v-model="dataForm.mailbox" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="" prop="status">
      <el-input v-model="dataForm.status" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="" prop="remark">
      <el-input v-model="dataForm.remark" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="" prop="createAt">
      <el-input v-model="dataForm.createAt" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="" prop="updateAt">
      <el-input v-model="dataForm.updateAt" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="超级用户表" prop="createUserId">
      <el-input v-model="dataForm.createUserId" placeholder="超级用户表"></el-input>
    </el-form-item>
    <el-form-item label="" prop="updateUserId">
      <el-input v-model="dataForm.updateUserId" placeholder=""></el-input>
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
          loginName: '',
          name: '',
          password: '',
          avatar: '',
          mailbox: '',
          status: '',
          remark: '',
          createAt: '',
          updateAt: '',
          createUserId: '',
          updateUserId: ''
        },
        dataRule: {
          loginName: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          avatar: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          mailbox: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          status: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          remark: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          createAt: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          updateAt: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          createUserId: [
            { required: true, message: '超级用户表不能为空', trigger: 'blur' }
          ],
          updateUserId: [
            { required: true, message: '不能为空', trigger: 'blur' }
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
              url: this.$http.adornUrl(`/sys/tuseradmin/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.loginName = data.tuseradmin.loginName
                this.dataForm.name = data.tuseradmin.name
                this.dataForm.password = data.tuseradmin.password
                this.dataForm.avatar = data.tuseradmin.avatar
                this.dataForm.mailbox = data.tuseradmin.mailbox
                this.dataForm.status = data.tuseradmin.status
                this.dataForm.remark = data.tuseradmin.remark
                this.dataForm.createAt = data.tuseradmin.createAt
                this.dataForm.updateAt = data.tuseradmin.updateAt
                this.dataForm.createUserId = data.tuseradmin.createUserId
                this.dataForm.updateUserId = data.tuseradmin.updateUserId
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
              url: this.$http.adornUrl(`/sys/tuseradmin/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'loginName': this.dataForm.loginName,
                'name': this.dataForm.name,
                'password': this.dataForm.password,
                'avatar': this.dataForm.avatar,
                'mailbox': this.dataForm.mailbox,
                'status': this.dataForm.status,
                'remark': this.dataForm.remark,
                'createAt': this.dataForm.createAt,
                'updateAt': this.dataForm.updateAt,
                'createUserId': this.dataForm.createUserId,
                'updateUserId': this.dataForm.updateUserId
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
