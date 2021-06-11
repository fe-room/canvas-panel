/*
 * @Author: meng.chen
 * @Date: 2021-06-09 12:00:18
 * @LastEditTime: 2021-06-11 10:52:35
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /canvas-demo/index.js
 */
//默认的线条y颜色
const COLOR_RED = "#f00";
const LINE_DEFAULT_WIDTH = 1;
/**
 * @description: canvas 功能类
 * @param {*}
 * @return {*}
 */
class CanvasHelper {
  /**
   * @description: canvas 绘制线
   * @param {*} ctx
   * @param {*} options
   * @return {*}
   */
  static line(ctx, options) {
    const canvasWidth = ctx.canvas.width,
      canvasHeight = ctx.canvas.height;
    ctx.save();
    //https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/lineJoin
    //用来设置2个长度不为0的线段连接处的形状
    ctx.lineJoin = "round";
    //https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/lineCap
    //线段末端结束时的形状
    ctx.lineCap = "square";
    ctx.strokeStyle = options.color || COLOR_RED;
    ctx.lineWidth = options.lineWidth || LINE_DEFAULT_WIDTH;
    //https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
    ctx.globalCompositeOperation = "source-over";
    ctx.beginPath();
    ctx.moveTo(
      options.points[0].x * canvasWidth,
      options.points[0].y * canvasHeight
    );
    for (let i = 1; i < options.points.length; i++) {
      ctx.lineTo(
        options.points[i].x * canvasWidth,
        options.points[i].y * canvasHeight
      );
    }
    ctx.stroke();
    ctx.restore();
  }
  static clear(ctx) {
    const width = ctx.canvas.clientWidth;
    const height = ctx.canvas.clientHeight;
    ctx.clearRect(0, 0, width, height);
  }
}
export default CanvasHelper;
