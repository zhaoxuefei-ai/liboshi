<template>
    <el-dialog
        :title="!dataForm.userId ? '新增' : '修改'"
        :close-on-click-modal="false"
        :destroy-on-close="true"
        :visible.sync="visible"
        @closed="handleClosed"
    ref="dia">
        <el-form :model="dataForm" :rules="dataRule"
                 ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="180px">
            <el-form-item label="用户名" prop="username">
                <el-input v-model="dataForm.username" placeholder="用户名"></el-input>
            </el-form-item>
            <el-form-item label="所属公司" prop="company">
                <el-input v-model="dataForm.company" placeholder="所属公司"></el-input>
            </el-form-item>
            <el-form-item v-if="!dataForm.userId" label="密码" prop="password">
                <el-input v-model="dataForm.password" placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item v-if="dataForm.userId" label="原密码" prop="oldPassword">
                <el-input v-model="dataForm.oldPassword" placeholder="请输入原密码"
                    @blur="checkPass"
                ></el-input>
            </el-form-item>
            <el-form-item v-if="dataForm.userId" label="新密码" prop="newPassword">
                <el-input v-model="dataForm.newPassword" placeholder="请输入新密码"></el-input>
            </el-form-item>
            <el-form-item label="过期时间" prop="expireTime">
                <el-date-picker
                    style="width: 50%;"
                    v-model="dataForm.expireTime"
                    type="date"
                    placeholder="1970 年 01 月 01 日 00 点 00 分 00 秒"
                    format="yyyy 年 MM 月 dd 日 00 点 00 分 00 秒"
                    value-format="yyyy-MM-dd 00:00:00"
                ></el-date-picker>
            </el-form-item>
            <el-form-item label="允许计算器范围" prop="calExpireTimeList">
                <cal-date-picker v-for="map in dataForm.calExpireTimeList"
                                 :name="map.name"
                                 :expireTime="map.expire"
                                 @value="(data)=>{map.expire = data}"
                ></cal-date-picker>
            </el-form-item>
            <el-form-item label="允许地址范围" prop="ipRangeList">
                <el-input type="textarea" v-model="dataForm.ipRangeList"
                          placeholder="0.0.0.0-255.255.255.255"></el-input>
                <div>
                    <span>&NonBreakingSpace;&NonBreakingSpace;地址范围(例): 192.168.1.1-192.168.1.255</span>
                    <span>单个地址(例): 10.168.1.100</span>
                    <span>请使用分号(;)分隔地址</span>
                </div>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
                <el-input type="textarea" v-model="dataForm.remark" placeholder="请输入备注"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
    </el-dialog>
</template>

<script>
  import CalDatePicker from '@/components/cal-date-picker'

  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          userId: 0,
          username: '',
          company: '',
          password: '',
          oldPassword: '',
          newPassword: '',
          createTime: '',
          expireTime: this.$DateFormat(new Date(new Date().getTime() + 365 * 86400000)),
          calExpireTimeList: [],
          // [{name:'中文名',expire:'yyyy-MM-dd 00:00:00'}]
          ipRangeList: '',
          remark: ''
        },
        dataRule: {
          username: [
            {required: true, message: '用户名不能为空', trigger: 'blur'}
          ],
          expireTime: [
            {required: true, message: '过期时间不能为空', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '密码不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    components: {
      CalDatePicker
    },
    methods: {
      handleClosed () {
      },
      checkPass () {
      },
      init (id) {
        this.dataForm.userId = id || 0
        this.visible = true
        this.$nextTick(() => {
          if (!this.dataForm.userId) { this.$refs['dataForm'].resetFields() }
          this.$http({
            url: this.$http.adornUrl(`/sys/config/info/2`),
            method: 'get'
          }).then(({data}) => {
            if (data && data.code === 0) {
              // 获取计算器中文名
              if (!this.dataForm.userId) {
                JSON.parse(data.config.paramValue).forEach((el) => {
                  this.dataForm.calExpireTimeList.push({name: el, expire: ''})
                })
              }
              if (this.dataForm.userId) {
                this.$http({
                  url: this.$http.adornUrl(`/app/user/info/${this.dataForm.userId}`),
                  method: 'get',
                  params: this.$http.adornParams()
                }).then(({data}) => {
                  if (data && data.code === 0) {
                    // console.log(data.user.calExpireTimeList)
                    this.dataForm.username = data.user.username
                    this.dataForm.company = data.user.company
                    this.dataForm.password = data.user.password
                    this.dataForm.createTime = data.user.createTime
                    this.dataForm.expireTime = data.user.expireTime
                    this.dataForm.calExpireTimeList = JSON.parse(data.user.calExpireTimeList)
                    this.dataForm.ipRangeList = data.user.ipRangeList
                    this.dataForm.remark = data.user.remark
                  } else {
                    this.$message.error(data.msg)
                  }
                })
              }
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/app/user/${!this.dataForm.userId ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'userId': this.dataForm.userId || undefined,
                'username': this.dataForm.username,
                'company': this.dataForm.company,
                'password': this.dataForm.password,
                'createTime': this.$DateFormat(new Date()),
                'expireTime': this.dataForm.expireTime,
                'calExpireTimeList': JSON.stringify(this.dataForm.calExpireTimeList),
                'ipRangeList': this.dataForm.ipRangeList === '' ? '0.0.0.0-255.255.255.255' : this.dataForm.ipRangeList,
                'remark': this.dataForm.remark === '' ? '无' : this.dataForm.remark
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
