/*
 * @Author: chenmeng
 * @Date: 2021-06-09 15:14:26
 * @LastEditTime: 2021-06-16 14:09:27
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /canvas-demo/canvas.js
 */
import CanvasHelper from "./klzz-helper.js";
import TextTool from "./klzz-text.js";
import { on, off } from "./element/dom.js";
const LINE = "line";
const ERASER = "eraser";
const ARROW = "arrow";
const TEXT = "text";
const COLOR_RED = "#f00";
class CanvasInstance {
  /**
   * @description:
   * @param {*} options {}
   * @return {*}
   */
  constructor(parent, options) {
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
    on(this.el, "mouseup", (e) => {
      if (this.tool === "text") {
        this[`${TEXT}MouseupListener`](e);
      }
    });
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
        lineWidth: this.options.lineWidth,
      });
    };
    const offmousemove = () => {
      CanvasHelper.clear(ctx);
      this.parent.trigger("line.submit", {
        el: this.el,
        points: linePoints,
        color: this.options.color,
        lineWidth: this.options.lineWidth,
      });
      off(this.el, "mousemove", ommousemove);
      off(this.el, "mouseup", offmousemove);
      off(this.el, "mouseleave", offmousemove);
    };
    on(this.el, "mousemove", ommousemove);
    on(this.el, "mouseup", offmousemove);
    on(this.el, "mouseleave", offmousemove);
  }
  [`${ERASER}MousedownListener`](e) {
    console.log(ERASER, "mousedown");
    const easePoints = [];
    easePoints.push({
      x: e.offsetX / this.ctx.canvas.width,
      y: e.offsetY / this.ctx.canvas.height,
    });
    const mousemove = (e) => {
      easePoints.push({
        x: e.offsetX / this.ctx.canvas.width,
        y: e.offsetY / this.ctx.canvas.height,
      });
      CanvasHelper.eraser(this.parent.ctx, {
        points: easePoints,
        lineWidth: 20,
      });
    };
    const mouseup = () => {
      this.parent.trigger("eraser.submit", {
        el: this.el,
        lineWidth: 20,
        points: easePoints
      });
      this.ctx.restore();
      off(this.el, "mousemove", mousemove);
      off(this.el, "mouseup", mouseup);
      off(this.el, "mouseleave", mouseup);
    };
    on(this.el, "mousemove", mousemove);
    on(this.el, "mouseup", mouseup);
    on(this.el, "mouseleave", mouseup);
  }
  [`${ARROW}MousedownListener`](event) {
    console.log(ARROW, "mousedown");
    const ctx = this.ctx;
    // store the start position of the arrow.
    const x = event.offsetX,
      y = event.offsetY;
    const arrowPoints = [];
    // get the mouse pointer position relative to the object that triggered the event
    arrowPoints.push({
      x: event.offsetX / this.el.width,
      y: event.offsetY / this.el.height,
    });
    // create temp canvas for preview arrow in real-time.
    ctx.strokeStyle = this.options.color;

    const onmousemove = (e) => {
      // clear previous arrow.
      CanvasHelper.clear(this.ctx);
      // get the current arrow end position;
      arrowPoints[1] = {
        x: e.offsetX / this.ctx.canvas.width,
        y: e.offsetY / this.ctx.canvas.height,
      };
      // draw the current arrow to temp canvas for preview.
      CanvasHelper.arrow(ctx, {
        color: this.options.color,
        points: arrowPoints,
      });
    };

    const offmousemove = () => {
      CanvasHelper.clear(this.ctx);
      this.parent.trigger("arrow.submit", {
        el: this.el,
        color: this.options.color,
        points: arrowPoints,
      });
      off(this.el, "mousemove", onmousemove);
      off(this.el, "mouseup", offmousemove);
      off(this.el, "mouseleave", offmousemove);
    };

    on(this.el, "mousemove", onmousemove);
    on(this.el, "mouseup", offmousemove);
    on(this.el, "mouseleave", offmousemove);
  }
  [`${TEXT}MouseupListener`](e) {
    console.log(TEXT, "mouseup");
    if (this.textTool) {
      this.textTool = null;
      return;
    }
    const x = e.offsetX,
      y = e.offsetY - 8;
    const textPoints = [];
    textPoints.push({ x, y });
    const textTool = this.textTool = new TextTool(this.parent, {
      x,
      y,
      size: this.options.textSize,
      lineHeight: this.options.textLineHeight,
      color: this.options.color || COLOR_RED,
    });
    console.log('color', this.options.color)
    on(textTool.el, "valuechange", (event) => {
      const text = event.detail.textValue;
      this.parent.measureEl.innerHTML = text + "  ";
      textTool.width(this.parent.measureEl.clientWidth);
      textTool.height(this.parent.measureEl.clientHeight);
    });
    on(textTool.el, "textchange", (event) => {
      const data = event.detail;
      if (!data.data) {
        return;
      }
      const textOptions = {
        el: this.el,
        position: {
          x: x / this.ctx.canvas.width,
          y: y / this.ctx.canvas.height,
        },
        color: this.color,
        text: data.data,
        size: data.size,
        lineHeight: data.lineHeight,
        width: this.parent.measureEl.clientWidth / this.ctx.canvas.width,
        height: this.parent.measureEl.clientHeight / this.ctx.canvas.height,
      };
      this.parent.trigger("text.submit", textOptions);
    });
  }
}

export default CanvasInstance;
