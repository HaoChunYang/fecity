# 指令式绘图系统：如何用 Canvas 绘制层次关系图

[canvas 官方 API](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API)

canvas 属性上的宽高属性（画布宽高，决定 canvas 的坐标系），不同于其 css 上的宽高属性（样式宽高：决定其在页面上展现的大小）。

好处：能更方便地适应不同的显示设备。

如果不设置其画布宽高，它的画布宽高等于 css 样式宽高。

- canvas 坐标系
  左上角为(0, 0)原点，x 轴向右，y 轴向下。

  区别于 `笛卡尔坐标系`.

  canvas 三维坐标系，属于“左手系”，区别于“右手系”。

## 使用 canvas 绘制几何图形

1. 获取 canvas 上下文

```js
const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
```

2. 用 canvas 上下文绘制图形

- context 对象上 API 分类：

  1. 设置状态的 API；

     设置或改变当前的绘图状态，如：改变颜色、线宽、坐标变换等等

  2. 绘制指定 API；

     绘制不同的几何图形。

```js
const rectSize = [100, 100]; // 矩形大小
context.fillStyle = "red"; // 0. 设置填充色
context.beginPath(); // 1. 先告诉 canvas 开始绘制的路径
context.rect(0.5 * canvas.width, 0.5 * canvas.height, ...rectSize); // 2. 然后才调用 rect 指令进行绘制
context.fill(); // 3. 最后调用 fill 指令
```

- 正方形不在正中心的调整思路

方法一：
调整绘制正方形的起始点。

```js
context.rect(
  0.5 * (canvas.width - rectSize[0]),
  0.5 * (canvas.height - rectSize[1]),
  ...rectSize
);
```

方法二：
绘制前，先将画布进行一个**平移转换（Translate）**，再进行绘制。绘制完成以后，再将画布恢复原来的位置。而且给制完成的图形不会被移动，移动的只是画布。

```js
// 先将画布平移，移动负的半个正方形的位置
context.translate(-0.5 * rectSize[0], -0.5 * rectSize[1])
// ...
// 绘制完成后，再将画布移动回原来的位置
// 画布恢复方法一： 反向平移
context.translate(0.5 * rectSize[0], 0.5 * rectSize[1])
// -------------
// 画布恢复方法二： 使用 canvas 上下文提供的 save 和 restore 方法。可以暂存和恢复画布某个时刻的状态。
// save 可以保存当前的 translate 状态，和其他状态，如 fillStyle 等的颜色信息
// restore 则可以将状态恢复到 save 指令前的状态。
context.save() // 暂存状态
context.translate(-0.5 * rectSize[0], -0.5 * rectSize[1])
:TODO 执行绘制
context.restore() // 恢复状态
```

## 总结 canvas 绘制矩形的 5 个步骤：

1. 获取 canvas 对象，通过 `getContext('2d')` 得到 2D 上下文；
2. 设置绘图状态，颜色、平移变换等信息；
3. 调用 `beginPath()`指令，开始绘图；
4. 调用 绘图指令 `rect()`;
5. 调用 `fill()` 指令将图形绘制在画布上；

## 例子：绘制层次关系图

层次结构数据（Hierarchy Data） 如：城市与省与国家的关系。

d3 转换数据工具库 [d3-hierarchy](https://github.com/d3/d3-hierarchy)

## canvas 优缺点

- 优点：

1. 可以通过简单的绘图指令绘制出复杂的几何图形
2. 渲染高效。因为其更偏向于渲染层

- 缺点：
  难以抽取图形中的对象进行操作。因为对于浏览器来说，绘制出的图形就只是 canvas 中的一个个像素点；

当然也是有其它方法可以和 canvas 中的图形交互的

---

尬记：
`textAlign` 这个词写错了，文字怎么也对不齐。找了好久。🥵
