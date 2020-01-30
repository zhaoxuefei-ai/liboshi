<template>
    <div class="components-container">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="saveOrUpdateHtmlContent()"
                 label-width="120px">
            <el-form-item style="width: 80%;" label="新闻类别" prop="category">
                <el-select
                    v-model="dataForm.category"
                    filterable
                    default-first-option
                    style="width:100%;"
                    placeholder="请选择新闻类别">
                    <el-option
                        v-for="item in categoryOptions"
                        :key="item.value"
                        :label="item.value"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item style="width: 80%;" label="新闻标题" prop="title">
                <el-input style="width:100%;" v-model="dataForm.title" placeholder="请输入新闻标题"></el-input>
            </el-form-item>
            <el-form-item style="width: 80%;" label="新闻封面" prop="cover">
                <el-upload
                    class="cover-uploader"
                    v-bind:class="{ white: dataForm.cover }"
                    :show-file-list="false"
                    :http-request="uploadCover"
                    :on-success="handleCoverSuccess"
                    :before-upload="beforeCoverUpload">
                    <img v-if="dataForm.cover" :src="dataForm.cover" class="cover">
                    <i v-else class="el-icon-plus cover-uploader-icon"></i>
                </el-upload>
            </el-form-item>
            <el-form-item  style="width: 100%;margin-top: -70px;" >
                <el-button style="margin-left: 78%;width: 20%;"  type="primary" @click="saveOrUpdateHtmlContent">
                    <span>{{!dataForm.id ? '保存' : '修改'}}</span>
                </el-button>
            </el-form-item >
        </el-form>
        <div>
            <!--<tinymce v-if="update" v-model="dataForm.content" :height="600"/>-->
            <div ref="editor" style="text-align:left;margin: 5px 24px 5px 45px;">
            </div>
            <div ref="toolbar" class="toolbar">
            </div>
            <div ref="text" class="text"> <!--可使用 min-height 实现编辑区域自动增加高度-->
                <div  ref="content"/>
            </div>
            <div style="margin:30px 24px 5px 45px;font-size: 16px;font-weight: bold;color: #696969">新闻渲染如下：</div>
        </div>
        <div class="editor-content" style="margin:30px 24px 5px 45px;" v-html="dataForm.content"/>
    </div>
</template>

<script>
    import Tinymce from '@/components/Tinymce'
    import E from 'wangeditor'

    export default {
      name: 'editor',
      components: {Tinymce},
      activated () {
        if (this.$route.query.id !== undefined) {
          this.dataForm.id = this.$route.query.id === undefined ? this.dataForm.id : this.$route.query.id
          this.init(this.$route.query.id)
        } else {
          this.dataForm = {
            id: 0,
            cover: '',
            category: '',
            title: '',
            content: ``,
            createUserId: '',
            createTime: '',
            updateUserId: '',
            updateTime: ''
          }
        }
        this.$nextTick(() => {
          this.update = false
          this.$nextTick(() => {
            this.update = true
          })
        })
      },
      data () {
        return {
          afterGet: true,
          update: true,
          dataForm: {
            id: 0,
            cover: '',
            category: '',
            title: '',
            content: ``,
            createUserId: '',
            createTime: '',
            updateUserId: '',
            updateTime: ''
          },
          dataRule: {
            category: [
                        {required: true, message: '新闻类别不能为空', trigger: 'blur'}
            ],
            title: [
                        {required: true, message: '文章标题不能为空', trigger: 'blur'}
            ],
            content: [
                        {required: true, message: '文章内容不能为空', trigger: 'blur'}
            ]
          },
          categoryOptions: [
                    {value: '仪器设备'},
                    {value: '四新技术'},
                    {value: '材料'},
                    {value: '其他'}
          ]
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
                  this.dataForm.cover = data.news.cover
                  this.dataForm.category = data.news.category
                  this.dataForm.title = data.news.title
                  this.dataForm.content = data.news.content
                  this.dataForm.createUserId = data.news.createUserId
                  this.dataForm.createTime = data.news.createTime
                  this.dataForm.updateUserId = data.news.updateUserId
                  this.dataForm.updateTime = data.news.updateTime
                  this.$refs.content.innerHTML = this.dataForm.content
                }
              })
            }
          })
        },
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
              this.dataForm.cover = data.data[0]
              console.log(this.dataForm.cover)
            }
          })
        },
        handleCoverSuccess (res, file) {
          this.dataForm.cover = URL.createObjectURL(file.raw)
        },
        beforeCoverUpload (file) {
          const isJPG = file.type === 'image/jpeg'
          const isLt2M = file.size / 1024 / 1024 < 2

          if (!isJPG) {
            this.$message.error('上传封面图片只能是 JPG 格式!')
          }
          if (!isLt2M) {
            this.$message.error('上传封面图片大小不能超过 2MB!')
          }
          return isJPG && isLt2M
        },
        saveOrUpdateHtmlContent () {
                // 生成ccuu信息
          let createTime = null
          let createUserId = null
          let updateTime = null
          let updateUserId = null
          if ((!this.dataForm.id ? 'save' : 'update') === 'save') {
            createTime = this.$DateFormat(new Date())
            createUserId = this.$store.state.user.id
            updateTime = this.$DateFormat(new Date())
            updateUserId = this.$store.state.user.id
          } else if ((!this.dataForm.id ? 'save' : 'update') === 'update') {
            createTime = this.dataForm.createTime
            createUserId = this.dataForm.createUserId
            updateTime = this.$DateFormat(new Date())
            updateUserId = this.$store.state.user.id
          }
          this.$refs['dataForm'].validate((valid) => {
            if (valid) {
              this.$http({
                url: this.$http.adornUrl(`/news/news/${!this.dataForm.id ? 'save' : 'update'}`),
                method: 'post',
                data: this.$http.adornData({
                  'id': this.dataForm.id || undefined,
                  'cover': this.dataForm.cover,
                  'category': this.dataForm.category,
                  'title': this.dataForm.title,
                  'content': this.dataForm.content,
                  'createTime': createTime,
                  'createUserId': createUserId,
                  'updateTime': updateTime,
                  'updateUserId': updateUserId
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
      },
      mounted () {
        var editor = new E(this.$refs.toolbar, this.$refs.text)
            // 不可修改
        editor.customConfig.uploadImgHeaders = {'token': this.$cookie.get('token')}
            // 自定义文件名，不可修改，修改后会上传失败
        editor.customConfig.uploadFileName = 'files'
        editor.customConfig.zIndex = 100
        editor.customConfig.uploadImgServer = this.$http.adornUrl(`/oss/upload/addImgs`) // 上传图片到服务器
        editor.customConfig.uploadImgHooks = {
                // 如果服务器端返回的不是 {errno:0, data: [...]} 这种格式，可使用该配置
                // （但是，服务器端返回的必须是一个 JSON 格式字符串！！！否则会报错）
          customInsert: function (insertImg, result, editor) {
                    // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
                    // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果

                    // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
            let url = result.data[0]
            insertImg(url)
                    // result 必须是一个 JSON 格式字符串！！！否则报错
          }
        }
        editor.customConfig.onchange = (html) => {
          this.dataForm.content = html
        }
        editor.create()
      }
    }
</script>

<style scoped>
    .editor-content {
        margin-top: 20px;
    }
    .white{
        background-color: white!important;
    }
    .cover-uploader{
        background-color: lightgray;
        margin-right: 82%;
    }
    .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        background-color: lightgray;
    }

    .cover-uploader .el-upload:hover {
        border-color: #409EFF;
    }

    .cover-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }

    .cover {
        display: block;
    }
    .toolbar {
        border: 1px solid #ccc;
        margin: 5px 24px 5px 45px;
        font-size: 28px;
    }
    .text {
        border: 1px solid #ccc;
        margin: 5px 24px 5px 45px;
        min-height: 400px;
    }
</style>

