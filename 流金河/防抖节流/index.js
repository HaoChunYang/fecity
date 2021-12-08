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

const debounceButtonClick = debounce((h) => {
  console.log('debounce button click at:', h)
}, 1000)

