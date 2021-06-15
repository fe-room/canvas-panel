/*
 * @Author: chenmeng
 * @Date: 2021-06-09 15:45:41
 * @LastEditTime: 2021-06-15 14:12:50
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /canvas-demo/sketch.js
 */
import CanvasInstance from "./klzz-canvas.js";
import CanvasHelper from "./klzz-helper.js";
import {
  on,
  hasClass,
  removeClass,
  addClass,
  coustomEventRegister,
} from "./element/dom.js";
const TEXT_SIZE = 14;
const TEXT_HEIGHT = 18;
const tools = ["line", "rect", "text", "eraser", "ellipse", "arrow", "sline"];
const coustomEvents = ["toolchange"];
class KlzzSketch {
  constructor(options) {
    options.textSize || (options.textSize = TEXT_SIZE);
    options.textLineHeight || (options.textLineHeight = TEXT_HEIGHT);
    options.width || (options.width = options.container.clientWidth);
    options.height || (options.height = options.container.clientHeight);
    options.toolType || (options.toolType = "line");
    options.background || (options.background = "");
    this.options = options;
    this.el = this.initElement();
    this.ctx = this.canvas.getContext("2d");
    this.initBackground();
    this.initDrawCanvas();
    this.appendComponent(this.drawCanvas);
    this.container = this.options.container;
    this.container.appendChild(this.el);
    this.initCoustomEvent();
    // 根据工具类型的切换 修改鼠标的样式
    on(this.el, "toolchange", (ev) => {
      if (Object.keys(ev.detail).length) {
        Object.assign(this.options, ev.detail);
      }
      tools.forEach((item) => {
        hasClass(this.el, item) ? removeClass(this.el, item) : null;
      });
      addClass(this.el, this.toolType);
    });

    //禁止鼠标菜单事件
    on(this.el, "contextmenu", (e) => {
      e.stopPropagation();
      e.preventDefault();
    });
  }
  //初始化注册自定义事件
  initCoustomEvent() {
    coustomEvents.forEach((type) => {
      this[type] = coustomEventRegister(type);
    });
    tools.forEach((type) => {
      this[`${type}.submit`] = coustomEventRegister(`${type}.submit`);
    });
  }
  trigger(type, payload) {
    console.log(type, payload);
    //修改修改自定义事件的传参
    if (payload) {
      console.log(this[type]);
      Object.assign(this[type].detail, payload);
    }
    if (payload && payload.el) {
      payload.el.dispatchEvent(this[type]);
    } else {
      this.el.dispatchEvent(this[type]);
    }
  }
  initElement() {
    const divAttrs = {
      style: `display: block; width: 100%; height: 100%;`,
      class: `sketch-contaniner ${this.options.toolType}`,
    };
    const canvasAttrs = {
      width: this.options.width,
      height: this.options.height,
      style: "display: block;",
      class: "sketch_canvas",
    };
    const el = this.createElement("div", divAttrs);
    this.canvas = this.createElement("canvas", canvasAttrs);
    el.appendChild(this.canvas);
    return el;
  }
  /**
   * @description: 创建dom
   * @param {*} elType
   * @param {*} attrs
   * @return {*}
   */
  createElement(elType = "div", attrs = {}) {
    let el = document.createElement(elType);
    Object.keys(attrs).forEach((key) => {
      el.setAttribute(key, attrs[key]);
    });
    return el;
  }
  initDrawCanvas() {
    this.drawCanvas = new CanvasInstance(this, this.options);
    on(this.el, "toolchange", () => {
      this.drawCanvas.tool = this.toolType;
    });
    tools.forEach((type) => {
      on(this.drawCanvas.el, `${type}.submit`, (event) => {
        const data = event.detail;
        CanvasHelper[type](this.ctx, data);
      });
    });
  }
  initBackground() {
    if (this.options.background) {
      const img = new Image();
      img.src = this.options.background;
      img.onload = () => {
        const canvas = this.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        const heightRate = this.options.height / img.height;
        const widthRate = this.options.width / img.width;
        context.drawImage(
          img,
          0,
          0,
          img.width,
          img.height,
          0,
          0,
          img.width * widthRate,
          img.height * heightRate
        );
        this.el.appendChild(canvas);
      };
    }
  }
  appendComponent(component) {
    this.el.appendChild(component.el);
  }
  setTool(toolName, config = {}) {
    this.toolType = toolName;
    this.trigger("toolchange", config);
  }
}

export default KlzzSketch;
