class MyPromise {
  constructor(executor) {
    this.initValue()
    this.initBind()
    try {
      executor(this.resolve, this.reject)
      // console.log('promise over!')
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
    // console.log('p resolve', value)
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

    // console.log('then~', this.PromiseState)
    var thenPromise = new MyPromise((resolve, reject) => {
      const resolvePromise = cb => {
        setTimeout(() => {
          try {
            const x = cb(this.PromiseResult)
            if (x === thenPromise) {
              throw new Error('不能返回自身')
            }
            if (x instanceof MyPromise) {
              x.then(resolve, reject)
            } else {
              resolve(x)
            }
          } catch (e) {
            reject(e)
          }
        })
      }
      if (this.PromiseState === 'fulfilled') {
        resolvePromise(onFulfilled)
      } else if (this.PromiseState === 'rejected') {
        resolvePromise(onRejected)
      }
      else if (this.PromiseState === 'pending') {
        // 如果状态是 pending , 暂存两个回调
        this.onFulfilledCallbacks.push(resolvePromise.bind(this, onFulfilled))
        this.onRejectedCallbacks.push(resolvePromise.bind(this, onRejected))
      }
    })
    return thenPromise
  }

  // catch 方法
  catch (fn) {
    return this.then(null, fn)
  }

  // all 方法
  static all (promises) {
    const result = []
    let count = 0
    return new MyPromise((resolve, reject) => {
      if (!(promises instanceof Array)) {
        reject(new TypeError('参数需要是一个数组'))
      }

      const handlePromiseResult = (index, value) => {
        result[index] = value
        count++
        if (count === promises.length) {
          resolve(result)
        }
      }
      promises.forEach((promise, index) => {
        if (promise instanceof MyPromise) {
          promise.then(res => {
            handlePromiseResult(index, res)
          }, err => reject(err))
        } else {
          handlePromiseResult(index, promise)
        }
      });
    })
  }

  /**
   * race 方法
   * @param {Array} promises 
   * 接收一个 promise 数组，如果有非 promise 项，则此项当作成功
   * 哪个 promise 最快得到结果，就返回哪个结果，无论成功或失败
   */
  static race (promises) {
    return new MyPromise((resolve, reject) => {
      if (!(promises instanceof Array)) {
        reject(new TypeError('参数需要是一个数组'))
      }
      promises.forEach(promise => {
        if (promise instanceof MyPromise) {
          promise.then(res => resolve(res), err => reject(err))
        } else {
          resolve(promise)
        }
      })
    })
  }

  /**
   * allSettled 方法
   * 接收一个 promise 数组，返回每一个 Promise 的结果数组集合。
   * 其中非 Promise 项，作为成功项。
   * @param {*} promises 
   */
  static allSettled (promises) {
    return new MyPromise((resolve, reject) => {
      const result = []
      let count = 0
      const handlePromiseResult = (status, value, i) => {
        result[i] = {
          status,
          value
        }
        count++
        if (count === promises.length) {
          resolve(result)
        }
      }
      promises.forEach((promise, i) => {
        if (promise instanceof MyPromise) {
          promise.then(res => handlePromiseResult('fulfilled', res, i),
            err => handlePromiseResult('rejected', err, i))
        } else {
          handlePromiseResult('rejected', promise, i)
        }
      })
    })
  }

  /**
   * any 方法（当前处于 TC39 第四阶段草案（Stage 4））
   * 接收 promise 数组，如果有成功则返回成功结果，如果都失败，则报错。其中非 Promise 项，当作成功项。
   * @param {*} promises 
   */
  static any (promises) {
    let count = 0
    return new MyPromise((resolve, reject) => {
      promises.forEach((promise) => {
        if (promise instanceof MyPromise) {
          promise.then(res => {
            resolve(res)
          }, err => {
            count++
            if (count === promises.length) {
              console.log('所有的 promise 都失败了')
              reject(new AggregateError('所有的 promise 都失败了'))
            }
          })
        } else {
          resolve(promise)
        }
      })
    })
  }

  /**
   * resolve 方法
   * 返回一个以给定值解析后的 Promise 对象
   * 如果参数是 promise ，则直接返回
   * @param {*} value 
   */
  static resolve (value) {
    if (value instanceof MyPromise) {
      return value
    } else {
      return new MyPromise((resolve, reject) => {
        resolve(value)
      })
    }
  }

  /**
   * reject 方法
   * 返回一个带有拒绝原因的 Promise 对象
   * @param {*} reason 
   */
  static reject (reason) {
    return new MyPromise((resolve, reject) => {
      reject(reason)
    })
  }
}


// ------------测试、验证 代码---------------
// const test1 = new MyPromise((resolve, reject) => {
//   // throw ('eee')
//   // resolve('en')
//   setTimeout(() => {
//     console.log('1 秒了')
//     resolve('hh')
//   }, 1000)
// }).then(res => console.log(res), err => console.log('err', err))
// console.log('--', test1)

// const p = new MyPromise((resolve, reject) => {
//   resolve(100)
// }).then(res => 2 * res).then(res => console.log('3:', res))
// const p2 = new MyPromise((resolve, reject) => {
//   resolve(100)
// }).then(res => new MyPromise((resolve, reject) => resolve(3 * res)))
//   .then(res => console.log('p2:', res))
// console.log('test:', p)
/**
 * 上一段代码说明：
 * 1. then 方法本身会返回一个 promise 对象
 * 2. 如果返回值是 promise 对象，返回值为成功，新 promise 就是成功
 *    返回失败，新 promise 就是失败
 * 3. 返回非 promise 对象，结果就是一个成功的 promise 对象
 */

// const p3 = new MyPromise((resolve, reject) => {
//   resolve(1)
// }).then(res => console.log(res), err => console.log(err))
// console.log('last console')

// ------------------
// const p4 = new MyPromise((resolve, reject) => {
//   resolve(2)
// })
// const p5 = new MyPromise((resolve, reject) => {
//   reject(3)
// })

// MyPromise.race([p5, p4]).then(res => console.log('all:', res), err => console.log(err))

// const p6 = new MyPromise((resolve, reject) => {
//   reject('err n')
// }).then(res => console.log(res)).catch(err => console.log('catch:', err))

// ------------------
// MyPromise.allSettled([p4, p5]).then(res => console.log(res))

// const p6 = new MyPromise((resolve, reject) => {
//   reject(1)
// })
// const p7 = new MyPromise((resolve, reject) => {
//   reject(2)
// })
// const p8 = new MyPromise((resolve, reject) => {
//   reject(3)
// })
// MyPromise.any([p6, p7, p8]).then(res => console.log(res), err => console.log(err))

// -----------------------
MyPromise.resolve("Success").then(function (value) {
  console.log(value); // "Success"
}, function (value) {
  // 不会被调用
});

var p = MyPromise.resolve([1, 2, 3]);
p.then(function (v) {
  console.log(v[0]); // 1
});

var original = MyPromise.resolve(33);
var cast = MyPromise.resolve(original);
cast.then(function (value) {
  console.log('value: ' + value);
});
console.log('original === cast ? ' + (original === cast));

MyPromise.reject(new Error('fail')).then(function () {
  // not called
}, function (error) {
  console.error(error); // Stacktrace
});