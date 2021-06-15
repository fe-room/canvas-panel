/*
 * @Author: your name
 * @Date: 2021-06-15 16:51:23
 * @LastEditTime: 2021-06-15 18:32:35
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /canvas-demo/src/klzz-text.js
 */
class TextTool {
  constructor(parent, options) {
    this.parent = parent;
    this.options = options;
    this.el = this.createEl();
    this.container = parent.el;
    this.container.appendChild(this.el);
    this.inputEl.focus();
  }

  createEl() {
    const el = this.parent.createElement("div", {
      class: "text-component",
      style: `left: ${this.options.x}px; top: ${this.options.y}px;`,
    });

    const inputEl = (this.inputEl = this.parent.createElement("textarea", {
      class: "tc-input",
      style: `width: 100%; height: 100%; color: ${this.options.color}; font-size: ${this.options.size}px; line-height: ${this.options.lineHeight}px;`,
      placeholder: "请点击输入",
    }));
    inputEl.setAttribute("autofocus", true);
    inputEl.onblur = () => {
      inputEl.removeAttribute("autofocus");
      this.parent.trigger("textchange", {
        el: this.el,
        data: this.text(),
        size: this.options.size,
        lineHeight: this.options.lineHeight,
      });
      this.dispose();
    };
    inputEl.addEventListener("input", (e) => {
      this.parent.trigger("valuechange", { textValue: inputEl.value, el: this.el });
    });
    el.appendChild(inputEl);
    return el;
  }

  clear() {
    this.inputEl.innerHTML = "";
  }

  text() {
    return this.inputEl.value;
  }

  dispose() {
    this.container.removeChild(this.el);
  }

  width(value) {
    if (value) {
      this.el.style.width = value + "px";
    }
  }

  height(value) {
    if (value) {
      this.el.style.height = value + "px";
    }
  }
}

export default TextTool;
