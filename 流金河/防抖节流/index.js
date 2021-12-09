// 防抖 - 定时器写法 - 延迟后再第一次触发
function debounce (fn, delay) {
  let timer
  return function () {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn.call(this, ...arguments)
    }, delay);
  }
}

const debounceButtonClick = debounce2((h) => {
  console.log('debounce button click at:', h)
}, 1000)

// 防抖 - 时间戳写法 - 第一次立即触发后延迟下一次
function debounce2 (fn, delay) {
  let pre = 0
  return function () {
    if (new Date() - pre > delay) {
      fn.call(this, ...arguments)
    }
    pre = new Date()
  }
}

// 节流 - 时间戳写法 - 第一次立即触发
function throttle (fn, delay) {
  let pre = 0
  return function () {
    if (new Date() - pre > delay) {
      fn.call(this, ...arguments)
      pre = new Date()
    }
  }
}

// 节流 - 定时器写法 - 第一次延迟触发
function throttle2 (fn, delay) {
  let timer
  return function () {
    if (!timer) {
      timer = setTimeout(() => {
        fn.call(this, ...arguments)
        clearTimeout(timer)
        timer = null
      }, delay);
    }
  }
}

const throttleButtonClick = throttle2((h) => {
  console.log('throttle button click at:', h)
}, 1000)
