<template>
    <div class="mod-config">
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
            <el-form-item style="width: 25%">
                <el-input v-model="dataForm.key" placeholder="参数:档案组,报案号,出险城市" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="getDataList()">查询</el-button>
                <el-button v-if="false" type="danger" @click="deleteHandle()"
                           :disabled="dataListSelections.length <= 0">批量删除
                </el-button>
            </el-form-item>
            <el-collapse>
                <el-collapse-item title="高级搜索" name="1">
                    <div style="margin-top: 10px"></div>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item style="width: 24%;" label-width="1px">
                                <el-input v-model="dataAvaForm.fileGroup" placeholder="档案组" clearable
                                ></el-input>
                            </el-form-item>
                            <el-form-item style="width: 24%;">
                                <el-input v-model="dataAvaForm.reportCode" placeholder="报案号"
                                          clearable></el-input>
                            </el-form-item>
                            <el-form-item style="width: 24%;">
                                <el-select
                                    style="width:100%;"
                                    v-model="dataAvaForm.riskCity"
                                    multiple
                                    filterable
                                    allow-create
                                    default-first-option
                                    placeholder="请选择出险城市">
                                    <el-option
                                        v-for="item in cityOptions"
                                        :key="item.value"
                                        :label="item.value"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item style="width: 22%;">
                                <el-input v-model="dataAvaForm.insuredPersonName" placeholder="被保险人"
                                          clearable></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item style="width: 24%;">
                                <el-select
                                    style="width:100%;"
                                    v-model="dataAvaForm.insuranceName"
                                    multiple
                                    filterable
                                    allow-create
                                    default-first-option
                                    placeholder="请选择保险险种">
                                    <el-option
                                        v-for="item in insuranceNameOptions"
                                        :key="item.value"
                                        :label="item.value"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item style="width: 24%;">
                                <el-date-picker
                                    v-model="dataAvaForm.reportTime"
                                    style="width:100%;"
                                    type="datetimerange"
                                    start-placeholder="报案开始日期"
                                    end-placeholder="报案结束日期"
                                    format="yyyy-MM-dd HH:mm"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    :picker-options="pickerOptionsInt">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item style="width: 24%;">
                                <el-date-picker
                                    style="width:100%;"
                                    v-model="dataAvaForm.accidentTime"
                                    type="datetimerange"
                                    start-placeholder="事故开始日期"
                                    end-placeholder="事故结束日期"
                                    format="yyyy-MM-dd HH:mm"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    :picker-options="pickerOptionsInt">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item style="width: 11%;">
                                <el-button style="width:100%;" @click="reset('dataAvaForm')">重置</el-button>
                            </el-form-item>
                            <el-form-item style="width: 10%;">
                                <el-button style="width:100%;" @click="getDataListByAvaForm()">搜索</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-collapse-item>
            </el-collapse>
        </el-form>
        <br>
        <el-table
            :data="dataList"
            border
            v-loading="dataListLoading"
            @selection-change="selectionChangeHandle"
            style="width: 100%;">
            <!--<el-table-column-->
            <!--type="selection"-->
            <!--header-align="center"-->
            <!--align="center"-->
            <!--width="50">-->
            <!--</el-table-column>-->
            <el-table-column
                type="index"
                width="50"
                header-align="center"
                align="center"
                label="序号"
            ></el-table-column>
            <el-table-column
                prop="fileGroup"
                header-align="center"
                align="center"
                width="200px"
                label="档案组">
            </el-table-column>
            <el-table-column
                prop="reportCode"
                header-align="center"
                align="center"
                width="200px"
                label="报案号">
            </el-table-column>
            <el-table-column
                prop="reportTime"
                header-align="center"
                align="center"
                width="120px"
                label="报案时间">
                <template slot-scope="scope">
                    <i class="el-icon-time"/>
                    <span>{{ scope.row.reportTime }}</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="riskCity"
                header-align="center"
                align="center"
                width="100px"
                label="出险城市">
            </el-table-column>
            <el-table-column
                prop="accidentTime"
                header-align="center"
                align="center"
                width="120px"
                label="事故时间">
                <template slot-scope="scope">
                    <i class="el-icon-time"/>
                    <span>{{ scope.row.accidentTime }}</span>
                </template>
            </el-table-column>
            <!-- 以下列为规则计算标签 -->
            <el-table-column
                prop="accidentTime"
                header-align="center"
                align="center"
                width="165px"
                label="重大人伤案件风险">
                <template slot-scope="scope">
                    <div v-for="tag in scope.row.fraudCategoryList.majorHumanInjuryCaseRisk">
                        <div v-if="scope.row.fraudCategoryList.majorHumanInjuryCaseRisk.length>1"
                             style="height: 3px;"></div>
                        <el-tag effect="dark">{{tag}}</el-tag>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                prop="accidentTime"
                header-align="center"
                align="center"
                width="165px"
                label="高风险伤情">
                <template slot-scope="scope">
                    <div v-for="tag in scope.row.fraudCategoryList.highRiskInjury">
                        <div v-if="scope.row.fraudCategoryList.highRiskInjury.length>1" style="height: 3px;"></div>
                        <el-tag effect="dark">{{tag}}</el-tag>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                prop="accidentTime"
                header-align="center"
                align="center"
                width="120px"
                label="风险地点">
                <template slot-scope="scope">
                    <div v-for="tag in scope.row.fraudCategoryList.riskLocation">
                        <div v-if="scope.row.fraudCategoryList.riskLocation.length>1" style="height: 3px;"></div>
                        <el-tag effect="dark">{{tag}}</el-tag>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                prop="accidentTime"
                header-align="center"
                align="center"
                width="165px"
                label="风险关系">
                <template slot-scope="scope">
                    <div v-for="tag in scope.row.fraudCategoryList.riskRelationship">
                        <div v-if="scope.row.fraudCategoryList.riskRelationship.length>1" style="height: 3px;"></div>
                        <el-tag effect="dark">{{tag}}</el-tag>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                prop="accidentTime"
                header-align="center"
                align="center"
                width="120px"
                label="非交通事故损伤">
                <template slot-scope="scope">
                    <div v-for="tag in scope.row.fraudCategoryList.nonTrafficAccidentDamage">
                        <div v-if="scope.row.fraudCategoryList.nonTrafficAccidentDamage.length>1"
                             style="height: 3px;"></div>
                        <el-tag effect="dark">{{tag}}</el-tag>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                prop="accidentTime"
                header-align="center"
                align="center"
                width="120px"
                label="人伤损失不符">
                <template slot-scope="scope">
                    <div v-for="tag in scope.row.fraudCategoryList.humanInjuryDoesNotMatch">
                        <div v-if="scope.row.fraudCategoryList.humanInjuryDoesNotMatch.length>1"
                             style="height: 3px;"></div>
                        <el-tag effect="dark">{{tag}}</el-tag>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                prop="accidentTime"
                header-align="center"
                align="center"
                width="165px"
                label="高风险伤情">
                <template slot-scope="scope">
                    <div v-for="tag in scope.row.fraudCategoryList.highRiskInjury">
                        <div v-if="scope.row.fraudCategoryList.highRiskInjury.length>1" style="height: 3px;"></div>
                        <el-tag effect="dark">{{tag}}</el-tag>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                prop="accidentTime"
                header-align="center"
                align="center"
                width="165px"
                label="故意出险">
                <template slot-scope="scope">
                    <div v-for="tag in scope.row.fraudCategoryList.intentionalRisk">
                        <div v-if="scope.row.fraudCategoryList.intentionalRisk.length>1" style="height: 3px;"></div>
                        <el-tag effect="dark">{{tag}}</el-tag>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                fixed="right"
                header-align="center"
                align="center"
                width="150"
                label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="toUpdatePage(scope.row)">查看详情</el-button>
                    <!--<el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>-->
                    <!--<el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>-->
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            :current-page="pageIndex"
            :page-sizes="[6,10, 20, 50, 100]"
            :page-size="pageSize"
            :total="totalPage"
            layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
    </div>
</template>

<script>
    import pickerOptionsInt from '@/components/el-date-picker-quick'

    export default {
      data () {
        return {
          dataForm: {
            key: ''
          },
          dataAvaForm: {
            id: 0,
            accidentTime: '',
            reportTime: '',
            insuranceName: '',
            insuredPersonName: '',
            riskCity: '',
            reportCode: '',
            fileGroup: ''
          },
          insuranceNameOptions: [
                    {value: '附加意外医疗保险条款（B）'},
                    {value: '个人意外伤害保险'},
                    {value: '个人意外伤害保险条款'},
                    {value: '附加意外医疗保险条款附加营养费'},
                    {value: '护理费及误工费用保险条款附加营养费'},
                    {value: '护理费及误工费用保险条款'},
                    {value: '附加个人责任保险条款'}
          ],
          cityOptions: [
                    {value: '北京市'},
                    {value: '天津市'},
                    {value: '上海市'},
                    {value: '深圳市'},
                    {value: '重庆市'}
          ],
          dataList: [],
          pageIndex: 1,
          pageSize: 6,
          totalPage: 0,
          dataListLoading: false,
          dataListSelections: [],
          addOrUpdateVisible: false,
          pickerOptionsInt: pickerOptionsInt.pickerOptionsInt()
        }
      },
      activated () {
        if (this.$route.query.id !== undefined) {
          this.dataAvaForm.id = this.$route.query.id === undefined ? this.dataAvaForm.id : this.$route.query.id
          this.getDataListByAvaForm()
        } else {
          this.dataForm.key = this.$route.query.groupName === undefined ? this.dataForm.key : this.$route.query.groupName
          this.getDataList()
        }
      },
      methods: {
            // 获取数据列表
        getDataList () {
          this.dataListLoading = true
          this.$http({
            url: this.$http.adornUrl('/insuranceList/insurance/list'),
            method: 'get',
            params: this.$http.adornParams({
              'page': this.pageIndex,
              'limit': this.pageSize,
              'key': this.dataForm.key
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.dataList = data.page.list
              this.totalPage = data.page.totalCount
            } else {
              this.dataList = []
              this.totalPage = 0
              this.$message.error(data.msg)
            }
            this.dataListLoading = false
          })
        },
            // 获取数据列表 高级搜索
        getDataListByAvaForm () {
          this.dataListLoading = true
          this.$http({
            url: this.$http.adornUrl('/insuranceList/insurance/list/adv'),
            method: 'post',
            data: this.$http.adornData({
              'page': this.pageIndex + '',
              'limit': this.pageSize + '',
              id: this.dataAvaForm.id,
              accidentTime: this.dataAvaForm.accidentTime,
              reportTime: this.dataAvaForm.reportTime,
              insuranceName: this.dataAvaForm.insuranceName,
              insuredPersonName: this.dataAvaForm.insuredPersonName,
              riskCity: this.dataAvaForm.riskCity,
              reportCode: this.dataAvaForm.reportCode,
              fileGroup: this.dataAvaForm.fileGroup
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.dataList = data.page.list
              this.totalPage = data.page.totalCount
            } else {
              this.dataList = []
              this.totalPage = 0
              this.$message.error(data.msg)
            }
            this.dataListLoading = false
          })
        },
        reset (formName) {
          if (formName === 'dataAvaForm') {
            this.dataAvaForm = {
              accidentTime: '',
              reportTime: '',
              insuranceName: '',
              insuredPersonName: '',
              riskCity: '',
              reportCode: '',
              fileGroup: ''
            }
          }
        },
        toUpdatePage (element) {
          sessionStorage.setItem('insurance_data', JSON.stringify(element))
          this.$router.push({name: 'insuranceList-insurance-update'})
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
            // 新增 / 修改
        addOrUpdateHandle (id) {
          this.addOrUpdateVisible = true
          this.$nextTick(() => {
            this.$refs.addOrUpdate.init(id)
          })
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
              url: this.$http.adornUrl('/insuranceList/insurance/delete'),
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
<style scoped>
    .el-tag {
        background-color: #409eff;
        color: #ffffff;
    }

    .el-form-item >>> .el-form-item__content {
        width: 100%;
    }

</style>
