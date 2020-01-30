<template>
    <div class="upload-container">
        <el-button :style="{background:color,borderColor:color}" icon="el-icon-upload" size="mini" type="primary"
                   @click=" dialogVisible=true">
            上传图片
        </el-button>
        <el-dialog :visible.sync="dialogVisible">
            <el-upload
                :multiple="true"
                :file-list="fileList"
                :show-file-list="true"
                :on-remove="handleRemove"
                :on-success="handleSuccess"
                :before-upload="beforeUpload"
                :http-request="uploadCover"
                class="editor-slide-upload"
                list-type="picture-card"
            >
                <!--action="https://httpbin.org/post"-->
                <el-button size="small" type="primary">
                    点击上传
                </el-button>
            </el-upload>
            <el-button @click="dialogVisible = false">
                取消
            </el-button>
            <el-button type="primary" @click="handleSubmit">
                确认
            </el-button>
        </el-dialog>
    </div>
</template>

<script>
    // import { getToken } from 'api/qiniu'

    export default {
      name: 'EditorSlideUpload',
      props: {
        color: {
          type: String,
          default: '#1890ff'
        }
      },
      data () {
        return {
          dialogVisible: false,
          listObj: {},
          fileList: []
        }
      },
      methods: {
        uploadCover (param) {
          const data = new FormData()
          data.append('files', param.file)
          this.$http({
            url: this.$http.adornUrl(`/oss/upload/addImgs`),
            method: 'post',
            data: this.$http.adornData(
                        data, false, 'file'
                    )
          }).then(({data}) => {
            if (data && data.code === 0) {
              const objKeyArr = Object.keys(this.listObj)
              const uid = param.file.uid
              for (let i = 0, len = objKeyArr.length; i < len; i++) {
                if (this.listObj[objKeyArr[i]].uid === uid) {
                  this.listObj[objKeyArr[i]].url = data.urls[0]
                  this.listObj[objKeyArr[i]].hasSuccess = true
                  return
                }
              }
                        // this.dataForm.cover = data.urls[0]
                        // console.log(this.dataForm.cover)
            }
          })
        },
        checkAllSuccess () {
          return Object.keys(this.listObj).every(item => this.listObj[item].hasSuccess)
        },
        handleSubmit () {
          const arr = Object.keys(this.listObj).map(v => this.listObj[v])
          if (!this.checkAllSuccess()) {
            this.$message('请等待所有图片上传完成. 如果有网络问题, 请刷新页面然后重试!')
            return
          }
          this.$emit('successCBK', arr)
          this.listObj = {}
          this.fileList = []
          this.dialogVisible = false
        },
        handleSuccess (response, file) {
          const uid = file.uid
          const objKeyArr = Object.keys(this.listObj)
          console.log(response)
          for (let i = 0, len = objKeyArr.length; i < len; i++) {
            if (this.listObj[objKeyArr[i]].uid === uid) {
              this.listObj[objKeyArr[i]].url = response.files.file
              this.listObj[objKeyArr[i]].hasSuccess = true
              return
            }
          }
        },
        handleRemove (file) {
          const uid = file.uid
          const objKeyArr = Object.keys(this.listObj)
          for (let i = 0, len = objKeyArr.length; i < len; i++) {
            if (this.listObj[objKeyArr[i]].uid === uid) {
              delete this.listObj[objKeyArr[i]]
              return
            }
          }
        },
        beforeUpload (file) {
          const _self = this
          const _URL = window.URL || window.webkitURL
          const fileName = file.uid
          this.listObj[fileName] = {}
          return new Promise((resolve, reject) => {
            const img = new Image()
            img.src = _URL.createObjectURL(file)
            img.onload = function () {
              _self.listObj[fileName] = {
                hasSuccess: false,
                uid: file.uid,
                width: this.width,
                height: this.height
              }
            }
            resolve(true)
          })
        }
      }
    }
</script>

<style lang="scss" scoped>
    .editor-slide-upload {
        margin-bottom: 20px;

        /deep/ .el-upload--picture-card {
            width: 100%;
        }
    }
</style>
