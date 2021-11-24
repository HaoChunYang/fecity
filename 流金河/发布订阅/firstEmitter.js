let corp = {}

corp.list = []

corp.on = function (fn) {
  this.list.push(fn)
}

corp.emit = function () {
  this.list.forEach(cb => {
    cb.apply(this, arguments)
  })
}

corp.on((position, salary) => {
  console.log('职位：' + position, '薪资：' + salary)
})

corp.emit('ceo', '80')