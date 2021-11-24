class EventEmitter {
  constructor() {
    this.events = {}
  }

  on (key, fn) {
    if (this.events[key]) {
      this.events[key].push(fn)
    } else {
      this.events[key] = [fn]
    }
  }

  emit (key, ...args) {
    if (this.events[key]) {
      this.events[key].forEach(event => {
        console.log(...args)
        event.call(this, ...args)
      });
    }
  }

  remove (key, fn) {
    if (this.events[key]) {
      if (!fn) {
        this.events[key] = []
      } else {
        this.events[key] = this.events[key].filter(event => event !== fn)
      }
      console.log('remove:', this.events)
    }
  }

  once (key, fn) {
    // 把只订阅一次的事件，包装一下
    function onceFn (...args) {
      fn.call(this, ...args)
      // 在包装的新函数执行中，完成函数调用，把该订阅事件删除
      this.remove(key, onceFn)
    }
    // 用包装的新的事件，进行订阅
    this.on(key, onceFn)
  }
}

/**
 * test
 */
const eventEmitter = new EventEmitter()
const subFn = (...args) => {
  console.log('掘金', ...args)
}
eventEmitter.on('pet', subFn)
eventEmitter.remove('pet', subFn)
eventEmitter.once('pet', subFn)

eventEmitter.emit('pet', '沙鱼', '三心')
eventEmitter.emit('pet', '沙鱼', '三心')
eventEmitter.emit('pet', '沙鱼', '三心')
eventEmitter.emit('pet', '沙鱼', '三心')