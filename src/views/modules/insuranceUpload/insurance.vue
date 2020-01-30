<template>
    <div>
        <el-row type="flex" class="row-bg" justify="space-between"
                style="margin-bottom: 20px; background-color: #e5e9f2">
            <el-col :span="6" style="margin-left: 40px">
                <div ><h1>上传案件</h1></div>
            </el-col>
            <el-col :span="6">
                <el-button v-if="!hasSessionStorageInsuranceData" type="primary"
                           @click="uploadGroupHandle()" style="margin-top: 20px">
                    上传案件组/批量上传
                </el-button>
                <el-button v-if="!hasSessionStorageInsuranceData"
                           @click="downloadHandle()" style="margin-top: 20px">
                    下载模板
                </el-button>
                <a :href="downloadLink" v-show="false" id="downloadLink"></a>
                <el-button v-if="hasSessionStorageInsuranceData&&dataForm.fileGroup===''" type="danger" @click="deleteHandle(dataForm.id)"
                           style="margin-top: 20px">删除
                </el-button>
            </el-col>
        </el-row>
        <!-- 弹窗, 上传案件组/批量上传 -->
        <upload-excel v-if="uploadExcelVisible" ref="uploadExcel"></upload-excel>

        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
                 label-width="230px" style="padding-right: 230px">
            <!--新增单个时档案组为空字符串-->
            <el-form-item v-if="hasSessionStorageInsuranceData&&dataForm.fileGroup!==''" label="档案组" prop="fileGroup">
            <el-input v-model="dataForm.fileGroup" placeholder="档案组"></el-input>
            </el-form-item>
            <el-form-item label="报案号" prop="reportCode">
                <el-input v-model="dataForm.reportCode" placeholder="报案号"></el-input>
            </el-form-item>
            <el-form-item label="报案时间" prop="reportTime">
                <el-date-picker v-model="dataForm.reportTime"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                format="yyyy-MM-dd HH:mm"
                                align="center"
                                type="datetime"
                                placeholder="选择报案时间"
                                style="width: 100%;"
                                :picker-options="pickerOptions"
                ></el-date-picker>
            </el-form-item>
            <el-form-item label="报案人联系电话" prop="reporterContactNumber">
                <el-input v-model="dataForm.reporterContactNumber" placeholder="报案人联系电话"></el-input>
            </el-form-item>
            <el-form-item label="地区" prop="region">
                <el-input v-model="dataForm.region" placeholder="地区"></el-input>
            </el-form-item>
            <el-form-item label="出险城市" prop="riskCity">
                <el-input v-model="dataForm.riskCity" placeholder="出险城市"></el-input>
            </el-form-item>
            <el-form-item label="出险地点" prop="riskLocation">
                <el-input v-model="dataForm.riskLocation" placeholder="出险地点"></el-input>
            </el-form-item>
            <el-form-item label="事故时间" prop="accidentTime">
                <el-date-picker v-model="dataForm.accidentTime"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                format="yyyy-MM-dd HH:mm"
                                type="datetime"
                                align="center"
                                placeholder="选择事故时间"
                                style="width: 100%;"
                                :picker-options="pickerOptions"
                ></el-date-picker>
            </el-form-item>
            <el-form-item label="报案-事故 间隔时间" prop="reportAccidentInterval">
                <el-input v-model="dataForm.reportAccidentInterval" placeholder="报案-事故 间隔时间 (可以不填写 系统自动生成)" type="number">
                    <i slot="suffix" class="el-icon-top"></i>
                </el-input>
            </el-form-item>
            <el-form-item label="出险类型" prop="riskTypes">
                <el-select
                    v-model="dataForm.riskTypes"
                    style="width: 100%;"
                    multiple
                    filterable
                    allow-create
                    default-first-option
                    placeholder="请选择出险类型 (可填写自定义类型)">
                    <el-option
                        v-for="item in riskTypeOptions"
                        :key="item.value"
                        :label="item.value"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="出险人姓名" prop="riskPersonName">
                <el-input v-model="dataForm.riskPersonName" placeholder="出险人姓名"></el-input>
            </el-form-item>
            <el-form-item label="出险人年龄" prop="riskPersonAge">
                <el-input v-model="dataForm.riskPersonAge" placeholder="出险人年龄"></el-input>
            </el-form-item>
            <el-form-item label="出险人性别" prop="riskPersonSex">
                <el-radio v-model="dataForm.riskPersonSex" label="男" border size="medium">男</el-radio>
                <el-radio v-model="dataForm.riskPersonSex" label="女" border size="medium">女</el-radio>
            </el-form-item>
            <el-form-item label="出险人身份证号" prop="riskPersonAge">
                <el-input v-model="dataForm.riskPersonIdNumber" placeholder="出险人身份证号"></el-input>
            </el-form-item>
            <el-form-item label="车种大类" prop="carType">
                <el-input v-model="dataForm.carType" placeholder="车种大类"></el-input>
            </el-form-item>
            <el-form-item label="出险原因" prop="riskCause">
                <el-input
                    type="textarea"
                    autosize
                    placeholder="请输入出险原因"
                    v-model="dataForm.riskCause">
                </el-input>
            </el-form-item>
            <el-form-item label="出险经过" prop="riskHistory">
                <el-input
                    type="textarea"
                    autosize
                    placeholder="请输入出险经过"
                    v-model="dataForm.riskHistory">
                </el-input>
            </el-form-item>
            <el-form-item label="损伤部位" prop="damageSite">
                <el-input
                    type="textarea"
                    autosize
                    placeholder="请输入损伤部位"
                    v-model="dataForm.damageSite">
                </el-input>
            </el-form-item>
            <el-form-item label="临床诊断" prop="clinicalDiagnosis">
                <el-input
                    type="textarea"
                    autosize
                    placeholder="请输入临床诊断(使用逗号分隔)"
                    v-model="dataForm.clinicalDiagnosis">
                </el-input>
            </el-form-item>
            <el-form-item label="医疗费 ( ¥ )" prop="medicalFees">
                <el-input-number v-model="dataForm.medicalFees"
                                 placeholder="医疗费" :precision="2" :min="0" :max="999999999" :controls="false"
                                 style="width: 100%;box-sizing: border-box;"
                >
                </el-input-number>
            </el-form-item>
            <el-form-item label="保单号" prop="insuranceNumber">
                <el-input v-model="dataForm.insuranceNumber" placeholder="保单号"></el-input>
            </el-form-item>
            <el-form-item label="案件处理人" prop="caseHandlerName">
                <el-input v-model="dataForm.caseHandlerName" placeholder="案件处理人"></el-input>
            </el-form-item>
            <el-form-item label="保单起始日期" prop="insuranceStartDate">
                <el-date-picker
                    v-model="dataForm.insuranceStartDate"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    format="yyyy-MM-dd HH:mm"
                    type="datetime"
                    placeholder="选择保单起始日期"
                    align="center"
                    style="width: 100%;"
                    :picker-options="pickerOptions">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="产品名称" prop="productName">
                <el-select
                    v-model="dataForm.productName"
                    style="width: 100%;"
                    filterable
                    allow-create
                    default-first-option
                    placeholder="请选择产品名称 (可填写自定义名称)">
                    <el-option
                        v-for="item in productNameOptions"
                        :key="item.value"
                        :label="item.value"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="责任类型" prop="typeOfResponsibilitys">
                <el-select
                    v-model="dataForm.typeOfResponsibilitys"
                    style="width: 100%;"
                    multiple
                    filterable
                    allow-create
                    default-first-option
                    placeholder="请选择责任类型 (可填写自定义类型)">
                    <el-option
                        v-for="item in typeOfResponsibilityOptions"
                        :key="item.value"
                        :label="item.value"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="险种名称" prop="insuranceName">
                <el-select
                    v-model="dataForm.insuranceName"
                    style="width: 100%;"
                    filterable
                    allow-create
                    default-first-option
                    placeholder="请选择险种名称  (可填写自定义名称)">
                    <el-option
                        v-for="item in insuranceNameOptions"
                        :key="item.value"
                        :label="item.value"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="整案估损金额 ( ¥ )" prop="overallCaseAmount">
                <el-input-number v-model="dataForm.overallCaseAmount"
                                 placeholder="整案估损" :precision="2" :min="0" :max="999999999" :controls="false"
                                 style="width: 100%;"
                ></el-input-number>
            </el-form-item>
            <el-form-item label="人伤估损金额 ( ¥ )" prop="humanInjuryAmount">
                <el-input-number v-model="dataForm.humanInjuryAmount"
                                 placeholder="人伤估损金额" :precision="2" :min="0" :max="999999999" :controls="false"
                                 style="width: 100%;"
                ></el-input-number>
            </el-form-item>
            <el-form-item label="被保险人" prop="insuredPersonName">
                <el-input v-model="dataForm.insuredPersonName" placeholder="被保险人"></el-input>
            </el-form-item>
            <el-form-item label="被保险人身份证号" prop="insuredPersonIdNumber">
                <el-input v-model="dataForm.insuredPersonIdNumber" placeholder="被保险人身份证号"></el-input>
            </el-form-item>
            <el-form-item label="结案时间" prop="closingTime">
                <el-date-picker v-model="dataForm.closingTime"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                format="yyyy-MM-dd HH:mm"
                                type="datetime"
                                align="center"
                                placeholder="选择结案时间"
                                style="width: 100%;"
                                :picker-options="pickerOptions"
                ></el-date-picker>
            </el-form-item>
            <el-form-item label="结案-报案 间隔时间" prop="closingReportNterval">
                <el-input v-model="dataForm.closingReportNterval" placeholder="结案-报案 间隔时间 (可以不填写 系统自动生成)" type="number">
                    <i slot="suffix" class="el-icon-top"></i>
                </el-input>
            </el-form-item>
            <el-form-item label="首次理算开始处理时间" prop="firstAdjustmentToStartProcessingTime">
                <el-date-picker
                    v-model="dataForm.firstAdjustmentToStartProcessingTime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    format="yyyy-MM-dd HH:mm"
                    type="datetime"
                    placeholder="选择首次理算开始处理时间"
                    align="center"
                    style="width: 100%;"
                    :picker-options="pickerOptions">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="首次理算提交人" prop="firstEstimateOfTheAuthor">
                <el-input v-model="dataForm.firstEstimateOfTheAuthor" placeholder="首次理算提交人"></el-input>
            </el-form-item>
            <el-form-item label="审核状态" prop="approvalStatus">
                <el-select
                    v-model="dataForm.approvalStatus"
                    style="width: 100%;"
                    filterable
                    allow-create
                    default-first-option
                    placeholder="请选择审核状态 (可填写自定义状态)">
                    <el-option
                        v-for="item in approvalStatusOptions"
                        :key="item.value"
                        :label="item.value"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="结案金额区间 ( ¥ )" prop="closingAmountInterval">
                <el-input v-model="dataForm.closingAmountInterval" placeholder="请输入结案金额区间"></el-input>
            </el-form-item>
            <el-form-item label="索赔金额 ( ¥ )" prop="claimAmount">
                <el-input-number v-model="dataForm.claimAmount"
                                 placeholder="索赔金额" :precision="2" :min="0" :max="999999999" :controls="false"
                                 style="width: 100%;"
                ></el-input-number>
            </el-form-item>
            <el-form-item label="应剔除金额 ( ¥ )" prop="theAmountShouldBeRemoved">
                <i slot="prefix" class="el-input__icon el-icon-search"></i>
                <el-input-number v-model="dataForm.theAmountShouldBeRemoved"
                                 placeholder="应剔除金额" :precision="2" :min="0" :max="999999999" :controls="false"
                                 style="width: 100%;"
                ></el-input-number>
            </el-form-item>
            <el-form-item label="备注" prop="remarks">
                <el-input
                    type="textarea"
                    autosize
                    placeholder="请输入备注"
                    v-model="dataForm.riskCause">
                </el-input>
            </el-form-item>
            <el-form-item label="结案金额 ( ¥ )" prop="closingAmount">
                <el-input-number v-model="dataForm.closingAmount"
                                 placeholder="结案金额" :precision="2" :min="0" :max="999999999" :controls="false"
                                 style="width: 100%;"
                ></el-input-number>
            </el-form-item>
            <el-form-item label="估损偏差" prop="estimatedLossDeviation">
                <el-input-number v-model="dataForm.estimatedLossDeviation"
                                 placeholder="估损偏差" :precision="2" :min="0" :max="999999999" :controls="false"
                                 style="width: 100%;"
                ></el-input-number>
            </el-form-item>
            <el-form-item label="受益人材料" prop="beneficiaryMaterial">
                <el-input
                    type="textarea"
                    autosize
                    placeholder="请输入受益人材料"
                    v-model="dataForm.beneficiaryMaterial">
                </el-input>
            </el-form-item>
            <el-form-item label="残疾等级是否合理" prop="isTheLevelOfDisabilityReasonable">
                <span>残疾等级是否合理: </span>
                <el-switch
                    style="display: block"
                    v-model="dataForm.isTheLevelOfDisabilityReasonable"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    active-text="合理"
                    inactive-text="不合理"
                    :active-value="1"
                    :inactive-value="0">
                </el-switch>
            </el-form-item>
            <el-form-item label="事故责任是否合理" prop="isTheLiabilityForTheAccidentReasonable">
                <span>事故责任是否合理: </span>
                <el-switch
                    style="display: block"
                    v-model="dataForm.isTheLiabilityForTheAccidentReasonable"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    active-text="合理"
                    inactive-text="不合理"
                    :active-value="1"
                    :inactive-value="0">
                </el-switch>
            </el-form-item>
            <el-form-item label="单证是否齐全" prop="isTheDocumentComplete">
                <span>单证是否齐全: </span>
                <el-switch
                    style="display: block"
                    v-model="dataForm.isTheDocumentComplete"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    active-text="齐全"
                    inactive-text="不齐全"
                    :active-value="1"
                    :inactive-value="0">
                </el-switch>
            </el-form-item>
            <el-form-item label="沟通说明录入时间" prop="communicationInstructionsEntryTime">
                <el-date-picker v-model="dataForm.communicationInstructionsEntryTime"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                format="yyyy-MM-dd HH:mm"
                                type="datetime"
                                align="center"
                                placeholder="选择沟通说明录入时间"
                                style="width: 100%;"
                                :picker-options="pickerOptions"
                ></el-date-picker>
            </el-form-item>
            <el-form-item label="回访内容" prop="returningContent">
                <el-input
                    type="textarea"
                    autosize
                    placeholder="请输入回访内容"
                    v-model="dataForm.returningContent">
                </el-input>
            </el-form-item>
            <el-form-item label="回访人" prop="returningPersonName">
                <el-input v-model="dataForm.returningPersonName" placeholder="回访人"></el-input>
            </el-form-item>
            <el-form-item label="其他问题" prop="otherProblems">
                <el-input
                    type="textarea"
                    autosize
                    placeholder="请输入出险原因"
                    v-model="dataForm.otherProblems">
                </el-input>
            </el-form-item>
            <el-form-item label="出险驾驶员" prop="riskDriverName">
                <el-input v-model="dataForm.riskDriverName" placeholder="出险驾驶员"></el-input>
            </el-form-item>
            <el-form-item label="出险驾驶员身份证号" prop="riskDriverIdNumber">
                <el-input v-model="dataForm.riskDriverIdNumber" placeholder="出险驾驶员身份证号"></el-input>
            </el-form-item>
            <el-form-item label="出险驾驶员户籍地" prop="riskDriverResidence">
                <el-input v-model="dataForm.riskDriverResidence" placeholder="出险驾驶员户籍地"></el-input>
            </el-form-item>
            <el-form-item label="投保人" prop="insuranceApplicantPersonName">
                <el-input v-model="dataForm.insuranceApplicantPersonName" placeholder="投保人"></el-input>
            </el-form-item>
            <el-form-item label="投保人身份证号" prop="insuranceApplicantPersonIdNumber">
                <el-input v-model="dataForm.insuranceApplicantPersonIdNumber" placeholder="投保人身份证号"></el-input>
            </el-form-item>
            <el-form-item label="投保人户籍地" prop="insuranceApplicantPersonHouseholdRegistration">
                <el-input v-model="dataForm.insuranceApplicantPersonHouseholdRegistration"
                          placeholder="投保人户籍地"></el-input>
            </el-form-item>
            <el-form-item label="行驶证车主" prop="drivingLicenseOwnerName">
                <el-input v-model="dataForm.drivingLicenseOwnerName" placeholder="行驶证车主"></el-input>
            </el-form-item>
            <el-form-item label="行驶证车主身份证号" prop="drivingLicenseOwnerIdNumber">
                <el-input v-model="dataForm.drivingLicenseOwnerIdNumber" placeholder="行驶证车主身份证号"></el-input>
            </el-form-item>
            <el-form-item label="行驶证车主户籍地" prop="drivingLicenseOwnerHouseholdRegistration">
                <el-input v-model="dataForm.drivingLicenseOwnerHouseholdRegistration" placeholder="行驶证车主户籍地"></el-input>
            </el-form-item>
            <el-form-item label="行驶证车牌号" prop="drivingLicensePlateNumber">
                <el-input v-model="dataForm.drivingLicensePlateNumber" placeholder="行驶证车牌号"></el-input>
            </el-form-item>
            <!--这四个数据系统自动生成-->
            <!--<el-form-item label="" prop="createTime">-->
            <!--<el-input v-model="dataForm.createTime" placeholder=""></el-input>-->
            <!--</el-form-item>-->
            <!--<el-form-item label="" prop="createUserId">-->
            <!--<el-input v-model="dataForm.createUserId" placeholder=""></el-input>-->
            <!--</el-form-item>-->
            <!--<el-form-item label="" prop="updateTime">-->
            <!--<el-input v-model="dataForm.updateTime" placeholder=""></el-input>-->
            <!--</el-form-item>-->
            <!--<el-form-item label="" prop="updateUserId">-->
            <!--<el-input v-model="dataForm.updateUserId" placeholder=""></el-input>-->
            <!--</el-form-item>-->
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-row type="flex" class="row-bg" justify="end">
                <el-col :span="6">
                    <el-button v-if="dataForm.fileGroup===''" @click="visible = false" style="width: 140px">取消</el-button>
                    <el-button v-if="dataForm.fileGroup===''"  type="primary" @click="dataFormSubmit()" style="width: 140px">确定</el-button>
                </el-col>
            </el-row>
        </span>
    </div>
</template>

<script>
    import {isMobileEl} from '@/utils/validate'
    import PickerOptions from '@/components/el-date-picker-quick'
    import UploadExcel from './upload-excel'

    export default {
      created () {
            // 里面有东西 就显示
        if (sessionStorage.getItem('insurance_data') !== null) {
          this.hasSessionStorageInsuranceData = true
          this.dataForm = JSON.parse(sessionStorage.getItem('insurance_data'))
        }
      },
      beforeRouteEnter (to, from, next) {
            // 如果里面有东西 就删除
        if (sessionStorage.getItem('insurance_data') !== null) {
          next(vm => {
            vm.hasSessionStorageInsuranceData = true
            vm.dataForm = JSON.parse(sessionStorage.getItem('insurance_data'))
          })
        } else {
          next()
        }
      },
      beforeRouteLeave (to, from, next) {
            // 如果里面有东西 就删除
        if (sessionStorage.getItem('insurance_data') !== null) {
          sessionStorage.removeItem('insurance_data')
        }
        next()
      },
      components: {
        UploadExcel
      },
      data () {
        return {
          hasSessionStorageInsuranceData: false,
          riskTypeOptions: [
                    {value: '人身伤害'},
                    {value: '第三方人伤'},
                    {value: '第三方物损'}
          ],
          productNameOptions: [
                    {value: '饿了么骑手意外（新众包）'},
                    {value: '国泰乐享生活意外险'},
                    {value: '饿了么加盟商配送人员意外险'}
          ],
          typeOfResponsibilityOptions: [
                    {value: '附加意外医疗'},
                    {value: '意外身故/残疾'},
                    {value: '死亡、伤残'},
                    {value: '意外医疗'},
                    {value: '误工费用'},
                    {value: '营养费'},
                    {value: '护理费'},
                    {value: '个人责任'},
                    {value: '附加个人责任'},
                    {value: '个人责任'}
          ],
          insuranceNameOptions: [
                    {value: '附加意外医疗保险条款（B）'},
                    {value: '个人意外伤害保险'},
                    {value: '个人意外伤害保险条款'},
                    {value: '附加意外医疗保险条款附加营养费'},
                    {value: '护理费及误工费用保险条款附加营养费'},
                    {value: '护理费及误工费用保险条款'},
                    {value: '附加个人责任保险条款'}
          ],
          approvalStatusOptions: [
                    {value: '审批通过'},
                    {value: '审批中'},
                    {value: '未提交'},
                    {value: '已退回'},
                    {value: '已保存'}
          ],
          uploadExcelVisible: false,
          dataForm: {
            id: 0,
            fileGroup: '',
            reportCode: '',
            reportTime: '',
            reporterContactNumber: '',
            region: '',
            riskCity: '',
            riskLocation: '',
            accidentTime: '',
            reportAccidentInterval: '',
            riskTypes: [],
            riskPersonName: '',
            riskPersonAge: '',
            riskPersonSex: '',
            riskPersonIdNumber: '',
            carType: '',
            riskCause: '',
            riskHistory: '',
            damageSite: '',
            clinicalDiagnosis: '',
            medicalFees: '',
            insuranceNumber: '',
            caseHandlerName: '',
            insuranceStartDate: '',
            productName: '',
            typeOfResponsibilitys: [],
            insuranceName: '',
            humanInjuryAmount: '',
            overallCaseAmount: '',
            insuredPersonName: '',
            insuredPersonIdNumber: '',
            closingTime: '',
            closingReportNterval: '',
            firstAdjustmentToStartProcessingTime: '',
            firstEstimateOfTheAuthor: '',
            approvalStatus: '',
            closingAmountInterval: '',
            claimAmount: '',
            theAmountShouldBeRemoved: '',
            remarks: '',
            closingAmount: '',
            estimatedLossDeviation: '',
            beneficiaryMaterial: '',
            isTheLevelOfDisabilityReasonable: '',
            isTheLiabilityForTheAccidentReasonable: '',
            isTheDocumentComplete: '',
            communicationInstructionsEntryTime: '',
            returningContent: '',
            returningPersonName: '',
            otherProblems: '',
            riskDriverName: '',
            riskDriverIdNumber: '',
            riskDriverResidence: '',
            insuranceApplicantPersonName: '',
            insuranceApplicantPersonIdNumber: '',
            insuranceApplicantPersonHouseholdRegistration: '',
            drivingLicenseOwnerName: '',
            drivingLicenseOwnerIdNumber: '',
            drivingLicenseOwnerHouseholdRegistration: '',
            drivingLicensePlateNumber: '',
            createTime: '',
            createUserId: '',
            updateTime: '',
            updateUserId: ''
          },
          dataRule: {
            fileGroup: [
                        {required: false, message: '档案组不能为空', trigger: 'blur'}
            ],
            reportCode: [
                        {required: true, message: '报案号不能为空', trigger: 'blur'}
            ],
            reportTime: [
                        {required: false, message: '报案时间不能为空', trigger: 'blur'}
            ],
            reporterContactNumber: [
                        {validator: isMobileEl, trigger: 'blur'}
            ],
            region: [
                        {required: false, message: '地区不能为空', trigger: 'blur'}
            ],
            riskCity: [
                        {required: false, message: '出险城市不能为空', trigger: 'blur'}
            ],
            riskLocation: [
                        {required: false, message: '出险地点不能为空', trigger: 'blur'}
            ],
            accidentTime: [
                        {required: false, message: '事故时间不能为空', trigger: 'blur'}
            ],
            reportAccidentInterval: [
                        {required: false, message: '报案-事故 间隔时间不能为空', trigger: 'blur'}
            ],
            riskTypes: [
                        {required: false, message: '出险类型不能为空', trigger: 'blur'}
            ],
            riskPersonName: [
                        {required: false, message: '出险人姓名不能为空', trigger: 'blur'}
            ],
            riskPersonAge: [
                        {required: false, message: '出险人年龄不能为空', trigger: 'blur'}
            ],
            riskPersonSex: [
                        {required: false, message: '出险人性别不能为空', trigger: 'blur'}
            ],
            carType: [
                        {required: false, message: '车种大类不能为空', trigger: 'blur'}
            ],
            riskCause: [
                        {required: false, message: '出险原因不能为空', trigger: 'blur'}
            ],
            riskHistory: [
                        {required: false, message: '出险经过不能为空', trigger: 'blur'}
            ],
            damageSite: [
                        {required: false, message: '损伤部位不能为空', trigger: 'blur'}
            ],
            clinicalDiagnosis: [
                        {required: false, message: '临床诊断不能为空', trigger: 'blur'}
            ],
            medicalFees: [
                        {required: false, message: '医疗费不能为空', trigger: 'blur'}
            ],
            insuranceNumber: [
                        {required: false, message: '保单号不能为空', trigger: 'blur'}
            ],
            caseHandlerName: [
                        {required: false, message: '案件处理人不能为空', trigger: 'blur'}
            ],
            insuranceStartDate: [
                        {required: false, message: '保单起始日期不能为空', trigger: 'blur'}
            ],
            productName: [
                        {required: false, message: '产品名称不能为空', trigger: 'blur'}
            ],
            typeOfResponsibilitys: [
                        {required: false, message: '责任类型不能为空', trigger: 'blur'}
            ],
            insuranceName: [
                        {required: false, message: '险种名称不能为空', trigger: 'blur'}
            ],
            humanInjuryAmount: [
                        {required: false, message: '人伤估损金额不能为空', trigger: 'blur'}
            ],
            overallCaseAmount: [
                        {required: false, message: '整案估损不能为空', trigger: 'blur'}
            ],
            insuredPersonName: [
                        {required: false, message: '被保险人不能为空', trigger: 'blur'}
            ],
            insuredPersonIdNumber: [
                        {required: false, message: '被保险人身份证号不能为空', trigger: 'blur'}
            ],
            closingTime: [
                        {required: false, message: '结案时间不能为空', trigger: 'blur'}
            ],
            closingReportNterval: [
                        {required: false, message: '结案-报案 间隔时间不能为空', trigger: 'blur'}
            ],
            firstAdjustmentToStartProcessingTime: [
                        {required: false, message: '首次理算开始处理时间不能为空', trigger: 'blur'}
            ],
            firstEstimateOfTheAuthor: [
                        {required: false, message: '首次理算提交人不能为空', trigger: 'blur'}
            ],
            approvalStatus: [
                        {required: false, message: '审核状态不能为空', trigger: 'blur'}
            ],
            closingAmountInterval: [
                        {required: false, message: '结案金额区间不能为空', trigger: 'blur'}
            ],
            claimAmount: [
                        {required: false, message: '索赔金额不能为空', trigger: 'blur'}
            ],
            theAmountShouldBeRemoved: [
                        {required: false, message: '应剔除金额不能为空', trigger: 'blur'}
            ],
            remarks: [
                        {required: false, message: '备注不能为空', trigger: 'blur'}
            ],
            closingAmount: [
                        {required: false, message: '结案金额不能为空', trigger: 'blur'}
            ],
            estimatedLossDeviation: [
                        {required: false, message: '估损偏差不能为空', trigger: 'blur'}
            ],
            beneficiaryMaterial: [
                        {required: false, message: '受益人材料不能为空', trigger: 'blur'}
            ],
            isTheLevelOfDisabilityReasonable: [
                        {required: false, message: '残疾等级是否合理不能为空', trigger: 'blur'}
            ],
            isTheLiabilityForTheAccidentReasonable: [
                        {required: false, message: '事故责任是否合理不能为空', trigger: 'blur'}
            ],
            isTheDocumentComplete: [
                        {required: false, message: '单证是否齐全不能为空', trigger: 'blur'}
            ],
            communicationInstructionsEntryTime: [
                        {required: false, message: '沟通说明录入时间不能为空', trigger: 'blur'}
            ],
            returningContent: [
                        {required: false, message: '回访内容不能为空', trigger: 'blur'}
            ],
            returningPersonName: [
                        {required: false, message: '回访人不能为空', trigger: 'blur'}
            ],
            otherProblems: [
                        {required: false, message: '其他问题不能为空', trigger: 'blur'}
            ],
            riskDriverName: [
                        {required: false, message: '出险驾驶员不能为空', trigger: 'blur'}
            ],
            riskDriverIdNumber: [
                        {required: false, message: '出险驾驶员身份证号不能为空', trigger: 'blur'}
            ],
            riskDriverResidence: [
                        {required: false, message: '出险驾驶员户籍地不能为空', trigger: 'blur'}
            ],
            insuranceApplicantPersonName: [
                        {required: false, message: '投保人不能为空', trigger: 'blur'}
            ],
            insuranceApplicantPersonIdNumber: [
                        {required: false, message: '投保人身份证号不能为空', trigger: 'blur'}
            ],
            insuranceApplicantPersonHouseholdRegistration: [
                        {required: false, message: '投保人户籍地不能为空', trigger: 'blur'}
            ],
            drivingLicenseOwnerName: [
                        {required: false, message: '行驶证车主不能为空', trigger: 'blur'}
            ],
            drivingLicenseOwnerIdNumber: [
                        {required: false, message: '行驶证车主身份证号不能为空', trigger: 'blur'}
            ],
            drivingLicenseOwnerHouseholdRegistration: [
                        {required: false, message: '行驶证车主户籍地不能为空', trigger: 'blur'}
            ],
            drivingLicensePlateNumber: [
                        {required: false, message: '行驶证车牌号不能为空', trigger: 'blur'}
            ]
                    // ],
                    // createTime: [
                    //   { required: true, message: 'createTime不能为空', trigger: 'blur' }
                    // ],
                    // createUserId: [
                    //   { required: true, message: 'createUserId不能为空', trigger: 'blur' }
                    // ],
                    // updateTime: [
                    //   { required: true, message: 'updateTime不能为空', trigger: 'blur' }
                    // ],
                    // updateUserId: [
                    //   { required: true, message: 'updateUserId不能为空', trigger: 'blur' }
                    // ],
          },
          pickerOptions: PickerOptions.pickerOptions()
        }
      },
      methods: {
        uploadGroupHandle () {
          this.uploadExcelVisible = true
          this.$nextTick(() => {
            this.$refs.uploadExcel.init()
          })
        },
        downloadHandle () {
          document.getElementById('downloadLink').click()
        },
        init (id) {
          this.dataForm.id = id || 0
          this.visible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
            if (this.dataForm.id) {
              this.$http({
                url: this.$http.adornUrl(`/insuranceList/insurance/info/${this.dataForm.id}`),
                method: 'get',
                params: this.$http.adornParams()
              }).then(({data}) => {
                if (data && data.code === 0) {
                  this.dataForm.fileGroup = data.insurance.fileGroup
                  this.dataForm.reportCode = data.insurance.reportCode
                  this.dataForm.reportTime = data.insurance.reportTime
                  this.dataForm.reporterContactNumber = data.insurance.reporterContactNumber
                  this.dataForm.region = data.insurance.region
                  this.dataForm.riskCity = data.insurance.riskCity
                  this.dataForm.riskLocation = data.insurance.riskLocation
                  this.dataForm.accidentTime = data.insurance.accidentTime
                  this.dataForm.reportAccidentInterval = data.insurance.reportAccidentInterval
                  this.dataForm.riskTypes = data.insurance.riskTypes
                  this.dataForm.riskPersonName = data.insurance.riskPersonName
                  this.dataForm.riskPersonAge = data.insurance.riskPersonAge
                  this.dataForm.riskPersonSex = data.insurance.riskPersonSex
                  this.dataForm.riskPersonIdNumber = data.insurance.riskPersonIdNumber
                  this.dataForm.carType = data.insurance.carType
                  this.dataForm.riskCause = data.insurance.riskCause
                  this.dataForm.riskHistory = data.insurance.riskHistory
                  this.dataForm.damageSite = data.insurance.damageSite
                  this.dataForm.clinicalDiagnosis = data.insurance.clinicalDiagnosis
                  this.dataForm.medicalFees = data.insurance.medicalFees
                  this.dataForm.insuranceNumber = data.insurance.insuranceNumber
                  this.dataForm.caseHandlerName = data.insurance.caseHandlerName
                  this.dataForm.insuranceStartDate = data.insurance.insuranceStartDate
                  this.dataForm.productName = data.insurance.productName
                  this.dataForm.typeOfResponsibilitys = data.insurance.typeOfResponsibilitys
                  this.dataForm.insuranceName = data.insurance.insuranceName
                  this.dataForm.humanInjuryAmount = data.insurance.humanInjuryAmount
                  this.dataForm.overallCaseAmount = data.insurance.overallCaseAmount
                  this.dataForm.insuredPersonName = data.insurance.insuredPersonName
                  this.dataForm.insuredPersonIdNumber = data.insurance.insuredPersonIdNumber
                  this.dataForm.closingTime = data.insurance.closingTime
                  this.dataForm.closingReportNterval = data.insurance.closingReportNterval
                  this.dataForm.firstAdjustmentToStartProcessingTime = data.insurance.firstAdjustmentToStartProcessingTime
                  this.dataForm.firstEstimateOfTheAuthor = data.insurance.firstEstimateOfTheAuthor
                  this.dataForm.approvalStatus = data.insurance.approvalStatus
                  this.dataForm.closingAmountInterval = data.insurance.closingAmountInterval
                  this.dataForm.claimAmount = data.insurance.claimAmount
                  this.dataForm.theAmountShouldBeRemoved = data.insurance.theAmountShouldBeRemoved
                  this.dataForm.remarks = data.insurance.remarks
                  this.dataForm.closingAmount = data.insurance.closingAmount
                  this.dataForm.estimatedLossDeviation = data.insurance.estimatedLossDeviation
                  this.dataForm.beneficiaryMaterial = data.insurance.beneficiaryMaterial
                  this.dataForm.isTheLevelOfDisabilityReasonable = data.insurance.isTheLevelOfDisabilityReasonable
                  this.dataForm.isTheLiabilityForTheAccidentReasonable = data.insurance.isTheLiabilityForTheAccidentReasonable
                  this.dataForm.isTheDocumentComplete = data.insurance.isTheDocumentComplete
                  this.dataForm.communicationInstructionsEntryTime = data.insurance.communicationInstructionsEntryTime
                  this.dataForm.returningContent = data.insurance.returningContent
                  this.dataForm.returningPersonName = data.insurance.returningPersonName
                  this.dataForm.otherProblems = data.insurance.otherProblems
                  this.dataForm.riskDriverName = data.insurance.riskDriverName
                  this.dataForm.riskDriverIdNumber = data.insurance.riskDriverIdNumber
                  this.dataForm.riskDriverResidence = data.insurance.riskDriverResidence
                  this.dataForm.insuranceApplicantPersonName = data.insurance.insuranceApplicantPersonName
                  this.dataForm.insuranceApplicantPersonIdNumber = data.insurance.insuranceApplicantPersonIdNumber
                  this.dataForm.insuranceApplicantPersonHouseholdRegistration = data.insurance.insuranceApplicantPersonHouseholdRegistration
                  this.dataForm.drivingLicenseOwnerName = data.insurance.drivingLicenseOwnerName
                  this.dataForm.drivingLicenseOwnerIdNumber = data.insurance.drivingLicenseOwnerIdNumber
                  this.dataForm.drivingLicenseOwnerHouseholdRegistration = data.insurance.drivingLicenseOwnerHouseholdRegistration
                  this.dataForm.drivingLicensePlateNumber = data.insurance.drivingLicensePlateNumber
                  this.dataForm.createTime = data.insurance.createTime
                  this.dataForm.createUserId = data.insurance.createUserId
                  this.dataForm.updateTime = data.insurance.updateTime
                  this.dataForm.updateUserId = data.insurance.updateUserId
                }
              })
            }
          })
        },
            // 表单提交
        dataFormSubmit () {
          this.$refs['dataForm'].validate((valid) => {
            if (valid) {
                        // 档案组置空 后端自动生成
              let fileGroup = ''
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
              this.$http({
                url: this.$http.adornUrl(`/insuranceList/insurance/${!this.dataForm.id ? 'save' : 'update'}`),
                method: 'post',
                data: this.$http.adornData({
                  'id': this.dataForm.id || undefined,
                  'fileGroup': fileGroup,
                  'reportCode': this.dataForm.reportCode,
                  'reportTime': this.dataForm.reportTime,
                  'reporterContactNumber': this.dataForm.reporterContactNumber,
                  'region': this.dataForm.region,
                  'riskCity': this.dataForm.riskCity,
                  'riskLocation': this.dataForm.riskLocation,
                  'accidentTime': this.dataForm.accidentTime,
                  'reportAccidentInterval': this.dataForm.reportAccidentInterval,
                  'riskTypes': this.dataForm.riskTypes,
                  'riskPersonName': this.dataForm.riskPersonName,
                  'riskPersonAge': this.dataForm.riskPersonAge,
                  'riskPersonSex': this.dataForm.riskPersonSex,
                  'riskPersonIdNumber': this.dataForm.riskPersonIdNumber,
                  'carType': this.dataForm.carType,
                  'riskCause': this.dataForm.riskCause,
                  'riskHistory': this.dataForm.riskHistory,
                  'damageSite': this.dataForm.damageSite,
                  'clinicalDiagnosis': this.dataForm.clinicalDiagnosis,
                  'medicalFees': this.dataForm.medicalFees,
                  'insuranceNumber': this.dataForm.insuranceNumber,
                  'caseHandlerName': this.dataForm.caseHandlerName,
                  'insuranceStartDate': this.dataForm.insuranceStartDate,
                  'productName': this.dataForm.productName,
                  'typeOfResponsibilitys': this.dataForm.typeOfResponsibilitys,
                  'insuranceName': this.dataForm.insuranceName,
                  'humanInjuryAmount': this.dataForm.humanInjuryAmount,
                  'overallCaseAmount': this.dataForm.overallCaseAmount,
                  'insuredPersonName': this.dataForm.insuredPersonName,
                  'insuredPersonIdNumber': this.dataForm.insuredPersonIdNumber,
                  'closingTime': this.dataForm.closingTime,
                  'closingReportNterval': this.dataForm.closingReportNterval,
                  'firstAdjustmentToStartProcessingTime': this.dataForm.firstAdjustmentToStartProcessingTime,
                  'firstEstimateOfTheAuthor': this.dataForm.firstEstimateOfTheAuthor,
                  'approvalStatus': this.dataForm.approvalStatus,
                  'closingAmountInterval': this.dataForm.closingAmountInterval,
                  'claimAmount': this.dataForm.claimAmount,
                  'theAmountShouldBeRemoved': this.dataForm.theAmountShouldBeRemoved,
                  'remarks': this.dataForm.remarks,
                  'closingAmount': this.dataForm.closingAmount,
                  'estimatedLossDeviation': this.dataForm.estimatedLossDeviation,
                  'beneficiaryMaterial': this.dataForm.beneficiaryMaterial,
                  'isTheLevelOfDisabilityReasonable': this.dataForm.isTheLevelOfDisabilityReasonable,
                  'isTheLiabilityForTheAccidentReasonable': this.dataForm.isTheLiabilityForTheAccidentReasonable,
                  'isTheDocumentComplete': this.dataForm.isTheDocumentComplete,
                  'communicationInstructionsEntryTime': this.dataForm.communicationInstructionsEntryTime,
                  'returningContent': this.dataForm.returningContent,
                  'returningPersonName': this.dataForm.returningPersonName,
                  'otherProblems': this.dataForm.otherProblems,
                  'riskDriverName': this.dataForm.riskDriverName,
                  'riskDriverIdNumber': this.dataForm.riskDriverIdNumber,
                  'riskDriverResidence': this.dataForm.riskDriverResidence,
                  'insuranceApplicantPersonName': this.dataForm.insuranceApplicantPersonName,
                  'insuranceApplicantPersonIdNumber': this.dataForm.insuranceApplicantPersonIdNumber,
                  'insuranceApplicantPersonHouseholdRegistration': this.dataForm.insuranceApplicantPersonHouseholdRegistration,
                  'drivingLicenseOwnerName': this.dataForm.drivingLicenseOwnerName,
                  'drivingLicenseOwnerIdNumber': this.dataForm.drivingLicenseOwnerIdNumber,
                  'drivingLicenseOwnerHouseholdRegistration': this.dataForm.drivingLicenseOwnerHouseholdRegistration,
                  'drivingLicensePlateNumber': this.dataForm.drivingLicensePlateNumber,
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
                  if (data.id !== undefined) {
                    this.$router.push({ name: 'insuranceList-insurance', query: { id: data.id } })
                  }
                } else {
                  this.$message.error(data.msg)
                }
              })
            }
          })
        },
            // 删除
        deleteHandle (id) {
          let ids = []
          ids.push(id)
          this.$confirm(`确定对[id=${ids.join(',')}]进行删除操作?`, '提示', {
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
                    this.$router.push({name: 'insuranceList-insurance'})
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
          })
        }
      },
      computed: {
        downloadLink () {
          return window.location.origin + '/%E8%BD%A6%E9%99%A9%E4%BA%BA%E4%BC%A4-%E6%A8%A1%E7%89%88.xlsx'
        }
      }
    }
</script>
