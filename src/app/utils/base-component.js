'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const base_methods_1 = require('../base-methods');
class Component {
    constructor(tag, id, text = '', classes, callback) {
        this.container = Component.createComponent(tag);
        this.setId(id);
        this.setTextContent(text);
        this.setClasses(classes);
        this.setCallback(callback);
    }
    getContainer() {
        return this.container;
    }
    static createComponent(tag) {
        const component = document.createElement(tag);
        return component;
    }
    setId(id) {
        if (id) {
            this.container.id = id;
        }
    }
    setTextContent(text) {
        if (this.container instanceof HTMLInputElement) {
            this.container.placeholder = text;
        } else {
            this.container.textContent = text;
        }
    }
    setClasses(classes) {
        if (typeof classes !== 'undefined') {
            classes.forEach((className) => {
                this.container.classList.add(className);
            });
        }
    }
    setCallback(callbackParam) {
        (0, base_methods_1.isNull)(callbackParam);
        if (typeof callbackParam !== 'undefined') {
            if (typeof callbackParam.eventName !== 'undefined' && typeof callbackParam.callback === 'function') {
                this.container.addEventListener(callbackParam.eventName, (event) => {
                    if (typeof callbackParam.callback !== 'undefined') {
                        callbackParam.callback(event);
                    }
                });
            }
        }
    }
    setChildren(...children) {
        children.forEach((child) => {
            this.container.append(child);
        });
    }
}
exports.default = Component;
