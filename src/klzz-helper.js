/*
 * @Author: meng.chen
 * @Date: 2021-06-09 12:00:18
 * @LastEditTime: 2021-06-16 13:46:20
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /canvas-demo/index.js
 */
/**
 * @description:  获取升阶箭头的点坐标
 * @param {*} beginPoint
 * @param {*} endPoint
 * @param {*} par
 * @return {*}
 */
const getArrowPoint = (beginPoint, endPoint, par) => {
  // 360° = 2π弧度
  //返回从起点到终点的线段与x轴正方向之间的平面弧度
  const slopyAngle = Math.atan2(endPoint.y - beginPoint.y, endPoint.x - beginPoint.x); 
  //根号/ 次幂   l= √x^2 + y^2
  const arrowLength = Math.sqrt(Math.pow(endPoint.y - beginPoint.y, 2) + Math.pow(endPoint.x - beginPoint.x, 2));
  const angle = 0.6;
  const innerAngle = 0.3;
  const innerPar = par / 3 * 2;
  const point1 = {
    x: endPoint.x - Math.round(par * Math.cos(slopyAngle + angle)),
    y: endPoint.y - Math.round(par * Math.sin(slopyAngle + angle)),
  };
  const point2 = {
    x: endPoint.x - Math.round(par * Math.cos(slopyAngle - angle)),
    y: endPoint.y - Math.round(par * Math.sin(slopyAngle - angle)),
  };
  const point3 = {
    x: endPoint.x - Math.round(innerPar * Math.cos(slopyAngle + innerAngle)),
    y: endPoint.y - Math.round(innerPar * Math.sin(slopyAngle + innerAngle)),
  };
  const point4 = {
    x: endPoint.x - Math.round(innerPar * Math.cos(slopyAngle - innerAngle)),
    y: endPoint.y - Math.round(innerPar * Math.sin(slopyAngle - innerAngle)),
  };
  return [beginPoint, point4, point2, endPoint, point1, point3];
}


//默认的线条y颜色
const COLOR_RED = "#f00";
const LINE_DEFAULT_WIDTH = 1;
const EASE_DEFAULT_WIDTH = 20;
const ARROW_DEFAULT_SIZE = 20;
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
  static eraser(ctx, options) {
    const canvasWidth = ctx.canvas.width,
    canvasHeight = ctx.canvas.height;
    ctx.save();
    ctx.lineWidth = options.lineWidth || EASE_DEFAULT_WIDTH;
    if (options.thick) {
      ctx.lineWidth = options.thick * Math.min(canvasHeight, canvasWidth);
    }
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.moveTo(options.points[0].x * canvasWidth,
      options.points[0].y * canvasHeight);
    for (let i = 1; i < options.points.length; i++) {
      ctx.lineTo(options.points[i].x * canvasWidth,
        options.points[i].y * canvasHeight);
    }
    ctx.stroke();
    ctx.restore();
  }
  static arrow(ctx, options) {
    const canvasWidth = ctx.canvas.width,
      canvasHeight = ctx.canvas.height;
    const arrowSize = options.arrowSize || ARROW_DEFAULT_SIZE;
    ctx.save();
    ctx.strokeStyle = options.color || COLOR_RED;
    ctx.fillStyle = options.color || COLOR_RED
    ctx.lineWidth = options.lineWidth || LINE_DEFAULT_WIDTH;
    if (options.thick) {
      ctx.lineWidth = options.thick * Math.min(canvasHeight, canvasWidth);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.beginPath();
    ctx.moveTo(options.points[0].x * canvasWidth,
      options.points[0].y * canvasHeight);

    const paintArrar = (ctx, polygonVertex) => {
      ctx.beginPath();
      ctx.moveTo(polygonVertex[0].x, polygonVertex[0].y);
      for (let i = 1; i < polygonVertex.length; i++) {
        ctx.lineTo(polygonVertex[i].x, polygonVertex[i].y);
      }
      ctx.closePath();
      ctx.fill();
    }
    const drawArrow = (ctx, stopPoint, beginPoint, arrowSize) => {
      const polygonVertex = getArrowPoint(beginPoint, stopPoint, arrowSize);
      paintArrar(ctx, polygonVertex);
    }
    for (let i = 1; i < options.points.length; i++) {
      drawArrow(ctx, {
        x: options.points[i].x * canvasWidth,
        y: options.points[i].y * canvasHeight,
      }, {
          x: options.points[i - 1].x * canvasWidth,
          y: options.points[i - 1].y * canvasHeight,
        }, arrowSize);
    }
    ctx.restore();
  }
  static text(ctx, options) {
    options.size = options.size || 14;
    options.lineHeight = options.lineHeight || 18;
    options.font = options.font || '"PingFang SC","Microsoft YaHei","微软雅黑"';
    let string = options.text;
    ctx.save();
    ctx.textBaseline = 'middle';
    ctx.font = `${options.size}px/${options.lineHeight}px ${options.font}`;
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = options.color || COLOR_RED;
    if (typeof maxWidth !== 'undefined') {
      string = string.replace(/<br>/g, '\n').split(/\n/).map(p => transformText(ctx, p, maxWidth)).join('\n');
    }
    string.replace(/<br>/g, '\n').split(/\n/).map((value, index) => {
      ctx.fillText(value,
        options.position.x * ctx.canvas.width + 2,
        options.position.y * ctx.canvas.height + index * options.lineHeight + options.lineHeight / 2 + 2);
      return null;
    });
    ctx.restore();
  }
  
}
export default CanvasHelper;
