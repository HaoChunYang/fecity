class MyPromise {
  constructor(executor) {
    this.initValue()
    this.initBind()
    try {
      executor(this.resolve, this.reject)
      console.log('promise over!')
    } catch (e) {
      this.reject(e)
    }
  }
  initBind () {
    this.resolve = this.resolve.bind(this)
    this.reject = this.reject.bind(this)
  }
  initValue () {
    this.PromiseResult = null
    this.PromiseState = 'pending'
    this.onFulfilledCallbacks = []
    this.onRejectedCallbacks = []
  }
  resolve (value) {
    console.log('p resolve', value)
    if (this.PromiseState !== 'pending') return
    this.PromiseState = 'fulfilled'
    this.PromiseResult = value
    while (this.onFulfilledCallbacks.length) {
      this.onFulfilledCallbacks.shift()(this.PromiseResult)
    }
  }
  reject (reason) {
    if (this.PromiseState !== 'pending') return
    this.PromiseState = 'rejected'
    this.PromiseResult = reason
    while (this.onRejectedCallbacks.length) {
      this.onRejectedCallbacks.shift()(this.PromiseResult)
    }
  }
  // 实现 then
  then (onFulfilled, onRejected) {
    // then 接收两个参数，确保一定是函数
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : val => val
    onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason }

    console.log('then~', this.PromiseState)
    if (this.PromiseState === 'fulfilled') {
      onFulfilled(this.PromiseResult)
    } else if (this.PromiseState === 'rejected') {
      onRejected(this.PromiseResult)
    }
    else if (this.PromiseState === 'pending') {
      // 如果状态是 pending , 暂存两个回调
      this.onFulfilledCallbacks.push(onFulfilled.bind(this))
      this.onRejectedCallbacks.push(onRejected.bind(this))
    }
  }
}

const test1 = new MyPromise((resolve, reject) => {
  // throw ('eee')
  resolve('en')
  // setTimeout(() => {
  //   console.log('1 秒了')
  //   resolve('hh')
  // }, 1000)
}).then(res => console.log(res), err => console.log('err', err))
console.log('--', test1)