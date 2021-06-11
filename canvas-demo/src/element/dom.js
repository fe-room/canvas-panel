/*
 * @Author: by element and chenmeng
 * @Date: 2021-06-10 16:01:24
 * @LastEditTime: 2021-06-11 16:01:58
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /canvas-demo/src/element/dom.js
 */

/**
 * @description: 判断是否包含类型
 * @param {*} el  元素
 * @param {*} cls 类名
 * @return {*}
 */
export function hasClass(el, cls) {
  if (!el || !cls) return false;
  if (cls.indexOf(" ") !== -1)
    throw new Error("className should not contain space.");
  if (el.classList) {
    return el.classList.contains(cls);
  } else {
    return (" " + el.className + " ").indexOf(" " + cls + " ") > -1;
  }
}

/**
 * @description: 给元素添加类名
 * @param {*} el
 * @param {*} cls
 * @return {*}
 */
export function addClass(el, cls) {
  if (!el) return;
  var curClass = el.className;
  var classes = (cls || "").split(" ");

  for (var i = 0, j = classes.length; i < j; i++) {
    var clsName = classes[i];
    if (!clsName) continue;

    if (el.classList) {
      el.classList.add(clsName);
    } else if (!hasClass(el, clsName)) {
      curClass += " " + clsName;
    }
  }
  if (!el.classList) {
    el.className = curClass;
  }
}

/**
 * @description: 移除类名
 * @param {*} el
 * @param {*} cls
 * @return {*}
 */
export function removeClass(el, cls) {
  if (!el || !cls) return;
  var classes = cls.split(" ");
  var curClass = " " + el.className + " ";

  for (var i = 0, j = classes.length; i < j; i++) {
    var clsName = classes[i];
    if (!clsName) continue;

    if (el.classList) {
      el.classList.remove(clsName);
    } else if (hasClass(el, clsName)) {
      curClass = curClass.replace(" " + clsName + " ", " ");
    }
  }
  if (!el.classList) {
    el.className = trim(curClass);
  }
}

/**
 * @description: 绑定事件
 * @param {*}
 * @return {*}
 */
export const on = (function () {
  if (document.addEventListener) {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false);
      }
    };
  } else {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.attachEvent("on" + event, handler);
      }
    };
  }
})();

/**
 * @description:  解除绑定
 * @param {*}
 * @return {*}
 */
export const off = (function () {
  if (document.removeEventListener) {
    return function (element, event, handler) {
      if (element && event) {
        element.removeEventListener(event, handler, false);
      }
    };
  } else {
    return function (element, event, handler) {
      if (element && event) {
        element.detachEvent("on" + event, handler);
      }
    };
  }
})();
/**
 * @description:
 * @param {*} el
 * @param {*} event
 * @param {*} fn
 * @return {*}
 */
export const once = function (el, event, fn) {
  var listener = function () {
    if (fn) {
      fn.apply(this, arguments);
    }
    off(el, event, listener);
  };
  on(el, event, listener);
};

/**
 * @description: 注册自定义事件
 * @param {*} el  事件作用元素
 * @param {*} type 事件名称
 * @param {*} payload 参数
 * @return {*}
 */
export const coustomEventRegister = function (type, payload = {}) {
  const selfEvent = new CustomEvent(type, { detail: payload });
  return selfEvent
};
