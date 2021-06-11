/*
 * @Author: your name
 * @Date: 2021-06-10 16:26:57
 * @LastEditTime: 2021-06-10 16:26:58
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /canvas-demo/src/element/types.js
 */
export function isString(obj) {
    return Object.prototype.toString.call(obj) === '[object String]';
  }
  
  export function isObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
  }
  
  export function isHtmlElement(node) {
    return node && node.nodeType === Node.ELEMENT_NODE;
  }
  
  export const isFunction = (functionToCheck) => {
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
  };
  
  export const isUndefined = (val)=> {
    return val === void 0;
  };
  
  export const isDefined = (val) => {
    return val !== undefined && val !== null;
  };