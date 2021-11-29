# 03 | 声明式图形系统：如何用 SVG 图形元素绘制可视化图表？

SVG (scalable vertor graphies 可缩放矢量图) 基于 XML

可以用 JS 操作，还可以作为一种图片格式。

```html
<svg xmlns="http://www.w3.org/2000/svg" version="1.1">
  <circle
    cx="100"
    cy="50"
    r="40"
    stroke="black"
    stroke-width="2"
    fill="orange"
  />
</svg>
```

以上代码：`xmlns`是 xml 的命名空间，其属性值为 `http://www.w3.org/2000/svg`,浏览器判断这一段是 svg 内容。

`circle`表示绘圆。cx cy 是圆心坐标，r 表示半径。

svg 元素，可以设置 viewBox 属性来设定 svg 内部的宽高，即坐标轴的大小。绘图时会相对于对内部的大小了。

**svg 坐标系也是左手坐标系，同 canvas 一样。**

## 利用 svg 绘制层次关系图

- svg 与 canvas 的不同点

1. 写法上的不同；
2. 用户交互实现上的不同。

性能问题：一般情况下，当 svg 节点超过一千个的时候，就能明显感觉到性能问题。
解决方案：可以尝试使用虚拟 dom 方案来尽可能减少重绘，优化 svg 的渲染。在一定程度上进行优化。

另外 svg 作为一种图像格式，也可以用在 canvas 和 WebGL 中作为一些局部图形使用。
