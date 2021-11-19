class Promise {
  constructor(executor) {
    // 状态
    this.state = 'pending'
    // 成功的值
    this.value = undefined
    //失败的值
    this.reason = undefined
    // 因为 resolve/reject 可执行，所以都是函数。用let声明
    let resolve = (value) => {
      // 只有state状态为pending时，才可以调用成功。因为state一经改变，不可转变为其他状态
      if (this.state === 'pending') {
        this.state = 'fulfilled'
        this.value = value
      }
    }
    let reject = (reason) => {
      if (this.state === 'pending') {
        this.state = 'rejected'
        this.reason = reason
      }
    }
    // 如果executor执行报错，直接执行reject
    try {
      executor(resolve, reject)
    } catch (error) {
      reject(error)
    }
  }
}

// 创建一个Promise，它的参数是的一个函数 executor ,该函数的参数，resolve/reject 也是两个函数。
new Promise((resolve, reject) => { })

// 三个状态state: pending/fulfilled/rejected
// pending,可以转为成功fulfilled/失败rejected，一经转变，不可转为其它状态。且必须有一个不可改变的值/原因