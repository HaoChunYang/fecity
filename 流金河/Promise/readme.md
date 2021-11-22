# Promise使用及原理

Promise 是异步编程的一种解决方案

Promise 的产生，初衷是为了解决回调地狱的问题吗？

Promise 的异步，可以使用`.then`的调用，减少嵌套。

- 原型上有 then catch 方法。自身的方法有 all race resolve reject