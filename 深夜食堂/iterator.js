function setColor(el, color) {
  el.style.color = color
}

const isIterable = obj => obj !== null
  && typeof obj[Symbol.iterator] === 'function'

function iterative(fn) {
  return function (subject, ...rest) {
    if (isIterable(subject)) {
      const ret = []
      for (const obj of subject) {
        ret.push(fn.apply(this, [obj, ...rest]))
      }
      console.log(ret)
      return ret
    }
    return fn.apply(this, [subject, ...rest])
  }
}

const setColors = iterative(setColor)

const ele = document.querySelectorAll('li:nth-child(2n+1)')
const ele2 = document.querySelectorAll('li:nth-child(3n+1)')

setColors(ele2, 'green')
setColors(ele, 'red')