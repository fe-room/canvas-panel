/*
 * @Author: chenmeng
 * @Date: 2021-06-09 15:14:26
 * @LastEditTime: 2021-06-11 16:48:20
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /canvas-demo/canvas.js
 */
import CanvasHelper from "./klzz-helper.js";
import { on, off } from "./element/dom.js";
const LINE = "line";
class CanvasInstance {
  /**
   * @description:
   * @param {*} options {}
   * @return {*}
   */
  constructor(parent,options) {
    this.options = options;
    this.parent = parent;
    this.el = this.createElement({
      width: this.options.width,
      height: this.options.height,
      style: "display: block;",
      class: "sketch_canvas-draw",
    });
    this.initEvent();
  }
  /**
   * @description:  创建一个canvas
   * @param {*}
   * @return {*}
   */
  createElement(config) {
    const el = document.createElement("canvas");
    //设置canvas的属性
    if (config) {
      Object.keys(config).forEach((key) => {
        el.setAttribute(key, config[key]);
      });
    }
    this.ctx = el.getContext("2d");
    return el;
  }
  initEvent() {
    on(this.el, "mousedown", (e) => {
      this[`${this.tool}MousedownListener`] &&
        this[`${this.tool}MousedownListener`](e);
    });
    on(this.el, 'mouseup', (e) => {
      console.log(e)
     
    })
  }
  [`${LINE}MousedownListener`](e) {
    const ctx = this.ctx;
    console.log(LINE, "mousedown", this.color);
    const linePoints = [];
    linePoints.push({
      x: e.offsetX / this.el.width,
      y: e.offsetY / this.el.height,
    });
    const ommousemove = (event) => {  
      CanvasHelper.clear(this.ctx);
      linePoints.push({
        x: event.offsetX / this.el.width,
        y: event.offsetY / this.el.height,
      });
      CanvasHelper.line(ctx, {
        color: this.options.color,
        points: linePoints,
        lineWidth: this.options.lineWidth
      });
    };
    const offmousemove = () => {
      CanvasHelper.clear(ctx);
      this.parent.trigger('line.submit', {
        el: this.el,
        points: linePoints,
        color: this.options.color,
        lineWidth: this.options.lineWidth
      });
      off(this.el, "mousemove",ommousemove);
      off(this.el, "mouseup", offmousemove);
      off(this.el, "mouseleave", offmousemove);
    };
    on(this.el, "mousemove", ommousemove);
    on(this.el, "mouseup", offmousemove);
    on(this.el, "mouseleave", offmousemove);
  }
}

export default CanvasInstance;
