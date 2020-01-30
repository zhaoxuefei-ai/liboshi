<template>
    <div class="app-container">
        <el-dialog
            width="80vw"
            :destroy-on-close="true"
            :visible.sync="visible">
            <upload-excel-component v-if="!afterDropVisible" :on-success="handleSuccess" :before-upload="beforeUpload"/>
            <div v-if="afterDropVisible">
                <el-card class="box-card" style="text-align: center;margin-bottom: 20px" v-if="afterDropVisible">
                    <div style="font-size: 32px;line-height: 32px;padding-bottom: 20px">以下内容为预览内容，是否确认<span
                        v-if="hasSameGroup">覆盖</span>上传服务器？
                    </div>
                    <el-button @click="redrop" type="primary" plain>重新选择</el-button>
                    <el-button @click="notdrop" plain>取消上传</el-button>

                    <el-button v-if="!hasSameGroup" @click="handleUploadGroup" type="primary" style="width: 80px">上传
                    </el-button>
                    <el-button v-if="hasSameGroup" @click="handleOverride" type="danger" style="width: 100px">覆盖上传
                    </el-button>
                </el-card>
                <el-form label-width="100px" style="width: 100%;">
                    <el-form-item label="档案组名称: ">
                        <el-input v-model="tableFileName" placeholder="档案组" readonly></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;">
                <el-table-column v-if="afterDropVisible" type="index" header-align="center" align="center">
                </el-table-column>
                <el-table-column v-for="item of tableHeader" :key="item" :prop="item" :label="item" width="200px"
                                 header-align="center"
                                 :show-overflow-tooltip="true"
                />
            </el-table>
        </el-dialog>
        <el-dialog style="text-align: center" v-if="hasSameGroup">
            <div style="font-size: 32px">检测到数据库有相同的档案组，是否进行覆盖？</div>
            <el-button @click="handleOverride" primary type="danger">覆盖上传</el-button>
            <el-button @click="notdrop" plain>取消上传</el-button>
        </el-dialog>
    </div>
</template>

<script>
    import UploadExcelComponent from '@/components/UploadExcel/index.vue'

    export default {
      name: 'UploadExcel',
      components: {UploadExcelComponent},
      data () {
        return {
          hasSameGroup: false,
          afterDropVisible: false,
          visible: false,
          tableData: [],
          tableHeader: [],
          tableFileName: ''
        }
      },
      methods: {
        init (id) {
          this.visible = true
        },
        handleOverride () {
          this.$confirm('此操作将覆盖数据库中同名档案组, 是否继续?', '提示', {
            confirmButtonText: '确定',
            confirmButtonClass: 'red',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$http({
              url: this.$http.adornUrl('/insuranceUpload/insurance/overrideGroup'),
              method: 'post',
              data: this.$http.adornData({
                'tableFileName': this.tableFileName,
                'tableHeader': this.tableHeader,
                'tableData': this.tableData
              }, false)
            }).then(({data}) => {
              if (data && data.code === 0) {
                let message = '总上传' + data.total + '条, 上传成功' + data.success + '条, 覆盖' + data.old + '条'
                this.$notify({
                  title: '上传成功提示',
                  message: message,
                  duration: 5000,
                  type: 'success'
                })
                this.closeDialog()
                this.visible = false
                console.log({ groupName: this.tableFileName })
                this.$router.push({ name: 'insuranceList-insurance', query: { groupName: this.tableFileName } })
              } else {
                this.$message.error(data.msg)
              }
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消上传'
            })
          })
        },
        closeDialog () {
          this.tableData = []
          this.tableHeader = []
          this.afterDropVisible = false
          this.visible = false
          this.hasSameGroup = false
        },
        notdrop () {
          this.tableData = []
          this.tableHeader = []
          this.afterDropVisible = false
          this.visible = false
        },
        redrop () {
          this.afterDropVisible = false
          this.tableData = []
          this.tableHeader = []
        },
        beforeUpload (file) {
          const isLt128M = file.size / 1024 / 1024 < 128

          if (isLt128M) {
            return true
          }

          this.$message({
            message: 'Please do not upload files larger than 128M in size.',
            type: 'warning'
          })
          return false
        },
        handleSuccess ({results, header, fileName}) {
            // 处理时间数据
          // 事故时间 结案时间 沟通说明录入时间 报案时间
          //   对于这四个时间处理
          let dateFormat = /^(\d{4})-(\d{2})-(\d{2})$/
          let transFormDate = function (str) {
            if (dateFormat.test(str)) {
              return str + ' 12:00'
            } else {
              return str
            }
          }
          results.forEach(e => {
            e['报案时间'] = transFormDate(e['报案时间'])
            e['事故时间'] = transFormDate(e['事故时间'])
            e['结案时间'] = transFormDate(e['结案时间'])
            e['沟通说明录入时间'] = transFormDate(e['沟通说明录入时间'])
          })
          console.log(results)
          console.log(header)
                // 检查名称是否相同
          this.$http({
            url: this.$http.adornUrl('/insuranceUpload/insurance/hasSameGroupName'),
            method: 'post',
            params: this.$http.adornParams({
              'GroupName': fileName
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.tableData = results
              this.tableHeader = header
              this.tableFileName = fileName
              this.afterDropVisible = true
              if (data.hasSameGroupName) {
                this.hasSameGroup = true
                this.$alert('检测到数据库有相同的档案组', '警告', {
                  confirmButtonText: '确定'
                })
              }
            } else {
              this.$message.error(data.msg)
            }
          })
        },
        handleUploadGroup () {
                // 上传tableData: [],
                //        tableHeader: [],
                //  tableFileName: ''
          this.$http({
            url: this.$http.adornUrl('/insuranceUpload/insurance/saveGroup'),
            method: 'post',
            data: this.$http.adornData({
              'tableFileName': this.tableFileName,
              'tableHeader': this.tableHeader,
              'tableData': this.tableData
            }, false)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.closeDialog()
              this.visible = false
              let message = '总上传' + data.total + '条, 上传成功' + data.success + '条'
              this.$notify({
                title: '上传成功提示',
                message: message,
                duration: 5000,
                type: 'success'
              })
              this.$router.push({ name: 'insuranceList-insurance', query: { groupName: this.tableFileName } })
            } else {
              this.$message.error(data.msg)
            }
          })
        }
      }
    }
</script>
<style scoped>
    .red {
        background-color: #f56c6c !important;
        border-color: #f56c6c !important;
    }
</style>
