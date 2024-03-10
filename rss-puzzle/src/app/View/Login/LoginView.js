'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const base_methods_1 = require('../../base-methods');
const nameInfo = {
    id: 'name',
    error: 'error-name-msg',
};
const surnameInfo = {
    id: 'name',
    error: 'error-surname-msg',
};
class LoginView {
    constructor() {
        this.container = null;
        this.createForm();
    }
    createForm() {
        this.container = document.createElement('form');
        this.container.classList.add('login-form');
        const errorNameBox = LoginView.createLabel('', [nameInfo.error]);
        const inputName = LoginView.createInput(nameInfo.id, []);
        const errorSurnameBox = LoginView.createLabel('', [surnameInfo.error]);
        const inputSurname = LoginView.createInput(surnameInfo.id, []);
        this.container.append(errorNameBox, inputName, errorSurnameBox, inputSurname);
    }
    static createLabel(text, classes) {
        const label = document.createElement('label');
        (0, base_methods_1.isNull)(classes);
        LoginView.addClasses(label, classes);
        return label;
    }
    static addClasses(element, classes) {
        (0, base_methods_1.isNull)(classes);
        classes.forEach((className) => {
            element.classList.add(className);
        });
    }
    static createInput(id, classes) {
        const input = document.createElement('input');
        input.id = id;
        (0, base_methods_1.isNull)(classes);
        LoginView.addClasses(input, classes);
        input.required = true;
        return input;
    }
}
exports.default = LoginView;
