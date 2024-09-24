'use strict';
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, '__esModule', { value: true });
require('./login.css');
require('../../css/normalize.css');
const base_component_1 = __importDefault(require('../../utils/base-component'));
const Validation_1 = __importDefault(require('../Validation/Validation'));
const nameInfo = {
    id: 'name',
    minLength: 3,
    text: 'Name',
    classes: ['name-input'],
    error: 'error-name-msg',
};
const surnameInfo = {
    id: 'surname',
    minLength: 4,
    text: 'Surname',
    classes: ['surname-input'],
    error: 'error-surname-msg',
};
const nameLabel = {
    text: 'Enter Name',
    classes: ['name-info'],
};
const surnameLabel = {
    text: 'Enter Surname',
    classes: ['surname-info'],
};
class LoginView {
    constructor() {
        this.container = document.createElement('div');
        this.container.classList.add('login-background');
        const form = LoginView.createForm('', '', ['login-form']);
        this.container.append(form);
    }
    static createForm(id, text, classes) {
        const form = new base_component_1.default('form', id, text, classes);
        const formName = new base_component_1.default('h1', '', 'Log in', ['login-name']).getContainer();
        const nameBox = LoginView.createNameBox(nameInfo, nameLabel, ['nameBox']);
        const surnameBox = LoginView.createNameBox(surnameInfo, surnameLabel, ['surnameBox']);
        const button = LoginView.createButton('login-button', 'Login', ['login-button']);
        form.setChildren(formName, nameBox, surnameBox, button);
        return form.getContainer();
    }
    static createNameBox(name, label, classes) {
        const nameBox = new base_component_1.default('div', '', '', classes);
        const inputName = LoginView.createInput(true, name.id, name.text, name.minLength, name.classes);
        const nameInfoLabel = LoginView.createLabel(label.text, label.classes, inputName);
        const errorNameBox = LoginView.createLabel('', [name.error]);
        Validation_1.default.setInputListenners(inputName, errorNameBox);
        nameBox.setChildren(nameInfoLabel, inputName, errorNameBox);
        return nameBox.getContainer();
    }
    static createLabel(text, classes, input) {
        const label = new base_component_1.default('label', '', text, classes);
        if (typeof input !== 'undefined') {
            label.getContainer().htmlFor = input.id;
        }
        return label.getContainer();
    }
    static createInput(required, id, text, minLength, classes) {
        const input = new base_component_1.default('input', id, text, classes);
        const inputContainer = input.getContainer();
        inputContainer.required = required;
        inputContainer.minLength = minLength;
        inputContainer.pattern = '';
        return input.getContainer();
    }
    static createButton(id, text, classes) {
        const button = new base_component_1.default('button', id, text, classes);
        return button.getContainer();
    }
}
exports.default = LoginView;
