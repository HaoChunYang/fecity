# 手写发布订阅

发布订阅，多处订阅，一经发布，多处订阅的地方都可以响应。
订阅者把把想订阅的事件，注册到事件中心。事件中心一旦发布相关事件，就会执行订阅者注册的事件。

好处：
1. 对象之前代码耦合度代。
2. 应用于异步编程，代替回调函数。