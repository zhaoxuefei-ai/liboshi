let pickerOptions = {
  disabledDate (time) {
    return time.getTime() > Date.now()
  },
  shortcuts: [{
    text: '今天',
    onClick (picker) {
      picker.$emit('pick', new Date())
    }
  }, {
    text: '昨天',
    onClick (picker) {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24)
      picker.$emit('pick', date)
    }
  }, {
    text: '前天',
    onClick (picker) {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24 * 2)
      picker.$emit('pick', date)
    }
  }, {
    text: '大前天',
    onClick (picker) {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24 * 3)
      picker.$emit('pick', date)
    }
  }, {
    text: '一周天',
    onClick (picker) {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
      picker.$emit('pick', date)
    }
  }, {
    text: '两周前',
    onClick (picker) {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24 * 7 * 2)
      picker.$emit('pick', date)
    }
  }]
}

let pickerOptionsInt = {
  shortcuts: [{
    text: '最近一天',
    onClick (picker) {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 1)
      picker.$emit('pick', [start, end])
    }
  }, {
    text: '最近一周',
    onClick (picker) {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      picker.$emit('pick', [start, end])
    }
  }, {
    text: '最近一个月',
    onClick (picker) {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      picker.$emit('pick', [start, end])
    }
  }, {
    text: '最近三个月',
    onClick (picker) {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      picker.$emit('pick', [start, end])
    }
  }, {
    text: '最近一年',
    onClick (picker) {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 365)
      picker.$emit('pick', [start, end])
    }
  }]
}
export default {
  pickerOptions: function () {
    return pickerOptions
  },
  pickerOptionsInt: function () {
    return pickerOptionsInt
  }
}
