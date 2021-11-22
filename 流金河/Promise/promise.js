class Promise {
  constructor(executor) {
    // 状态
    this.state = 'pending'
    // 成功的值
    this.value = undefined
    //失败的值
    this.reason = undefined
    // 成功存放的方法数组
    this.onResolvedCallbacks = []
    // 失败存放的方法数组
    this.onRejectedCallbacks = []
    // 因为 resolve/reject 可执行，所以都是函数。用let声明
    let resolve = (value) => {
      // 只有state状态为pending时，才可以调用成功。因为state一经改变，不可转变为其他状态
      if (this.state === 'pending') {
        this.state = 'fulfilled'
        this.value = value
        // 一旦resolve执行，调用成功数组的函数
        this.onResolvedCallbacks.forEach(fn => fn())
      }
    }
    let reject = (reason) => {
      if (this.state === 'pending') {
        this.state = 'rejected'
        this.reason = reason
        // 一旦reject执行，请成失败数组的函数
        this.onRejectedCallbacks.forEach(fn => fn())
      }
    }
    // 如果executor执行报错，直接执行reject
    try {
      executor(resolve, reject)
    } catch (error) {
      reject(error)
    }
  }
  then (onFulfilled, onRejected) {
    // 声明返回的 promise2
    let promise2 = new Promise((resolve, reject) => {
      if (this.state === 'fulfilled') {
        let x = onFulfilled(this.value)
        // resolvePromise 函数，处理自己 returen 的 promise 和默认的 promise2 的关系
        resolvePromise(promise2, x, resolve, reject)
      }
      if (this.state === 'rejected') {
        let x = onRejected(this.reason)
        resolvePromise(promise2, x, resolve, reject)
      }
      // 当状态为 pending 时
      if (this.state === 'pending') {
        // onFulfilled 传入到成功数组
        this.onResolvedCallbacks.push(() => {
          let x = onFulfilled(this.value)
          resolvePromise(promise2, x, resolve, reject)
        })
        // onRejected 传入到失败数组
        this.onRejectedCallbacks.push(() => {
          let x = onRejected(this.reason)
          resolvePromise(promise2, x, resolve, reject)
        })
      }
      // 返回 promise ，完成链式
      return promise2
    })
    function resolvePromise (promise2, x, resolve, reject) {
      // 循环引用报错
      if (x === promise2) {
        // reject 报错
        return reject(new TypeError('chaining cycle detected for promise'))
      }
      // 防止多次调用
      let called
      // x 不是 null 且 x 是对象或者函数
      if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
        try {
          // A+ 规定， 声明 then = x 的 then 方法
          let then = x.then
          // 如果 then 是函数，就默认是 promise 了
          if (typeof then === 'function') {
            then.call(x, y => {
              if (called) {
                return
              }
              called = true
              resolvePromise(promise2, y, resolve, reject)
            }, err => {
              if (called) return
              called = true
              reject(err)
            })
          } else {
            resolve(x)
          }
        } catch (error) {
          if (called) return
          called = true
          reject(error)
        }
      } else {
        resolve(x)
      }
    }
  }
}

// 创建一个Promise，它的参数是的一个函数 executor ,该函数的参数，resolve/reject 也是两个函数。
new Promise((resolve, reject) => { })

// 三个状态state: pending/fulfilled/rejected
// pending,可以转为成功fulfilled/失败rejected，一经转变，不可转为其它状态。且必须有一个不可改变的值/原因