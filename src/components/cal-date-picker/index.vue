<template>
    <div>
        <el-switch
            style="width: 38%;"
            v-model="flag"
            :active-text="name"
            active-color="#13ce66"
            @change="change"
        >
        </el-switch>
        <span>
        过期时间:
        </span>
        <el-date-picker
            style="width: 50%;"
            v-model="expire"
            type="date"
            placeholder="1970 年 01 月 01 日 00 点 00 分 00 秒"
            format="yyyy 年 MM 月 dd 日 00 点 00 分 00 秒"
            value-format="yyyy-MM-dd 00:00:00"
        >
        </el-date-picker>
    </div>
</template>

<script>
  export default {
    name: 'cal-date-picker',
    props: {
      name: {
        type: String,
        required: false,
        default: '某个计算器的名称'
      },
      expireTime: String
    },
    data () {
      return {
        expire: '',
        flag: false
      }
    },
    mounted () {
      if (this.expireTime !== '') {
        this.expire = this.$DateFormat(new Date(this.expireTime))
      }
    },
    methods: {
      change (val) {
        if (!val) {
          this.expire = ''
        }
      }
    },
    watch: {
      expire (val) {
        this.flag = new Date(val).getTime() - new Date().getTime() > 0
        this.$emit('value', val)
      },
      expireTime (val) {
        this.expire = val
      }
    }
  }
</script>

<style scoped>

</style>
