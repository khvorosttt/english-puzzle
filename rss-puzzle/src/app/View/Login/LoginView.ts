import './login.css';
import '../../css/normalize.css';
import Component from '../../utils/base-component';
import ValidationForm from '../Validation/Validation';

interface Info {
    id: string;
    minLength: number;
    text: string;
    classes: string[];
    error: string;
}
const nameInfo: Info = {
    id: 'name',
    minLength: 3,
    text: 'Name',
    classes: ['name-input'],
    error: 'error-name-msg',
};
const surnameInfo: Info = {
    id: 'surname',
    minLength: 4,
    text: 'Surname',
    classes: ['surname-input'],
    error: 'error-surname-msg',
};

const nameLabel: Pick<Info, 'text' | 'classes'> = {
    text: 'Enter Name',
    classes: ['name-info'],
};

const surnameLabel = {
    text: 'Enter Surname',
    classes: ['surname-info'],
};

export default class LoginView {
    container: HTMLElement | null;

    constructor() {
        this.container = document.createElement('div');
        this.container.classList.add('login-background');
        const form: HTMLFormElement = LoginView.createForm('', '', ['login-form']);
        this.container.append(form);
    }

    static createForm(id: string, text: string, classes: string[]) {
        const form: Component = new Component('form', id, text, classes);
        const formName: HTMLHeadElement = new Component('h1', '', 'Log in', [
            'login-name',
        ]).getContainer<HTMLHeadElement>();
        const nameBox = LoginView.createNameBox(nameInfo, nameLabel, ['nameBox']);
        const surnameBox = LoginView.createNameBox(surnameInfo, surnameLabel, ['surnameBox']);
        const button = LoginView.createButton('login-button', 'Login', ['login-button']);
        form.setChildren(formName, nameBox, surnameBox, button);
        return form.getContainer<HTMLFormElement>();
    }

    static createNameBox(name: Info, label: Pick<Info, 'text' | 'classes'>, classes: string[]) {
        const nameBox: Component = new Component('div', '', '', classes);
        const inputName: HTMLInputElement = LoginView.createInput(
            true,
            name.id,
            name.text,
            name.minLength,
            name.classes
        );
        const nameInfoLabel: HTMLLabelElement = LoginView.createLabel(label.text, label.classes, inputName);
        const errorNameBox: HTMLLabelElement = LoginView.createLabel('', [name.error]);
        ValidationForm.setInputListeners(inputName, errorNameBox);
        nameBox.setChildren(nameInfoLabel, inputName, errorNameBox);
        return nameBox.getContainer<HTMLDivElement>();
    }

    static createLabel(text: string, classes?: string[], input?: HTMLInputElement) {
        const label: Component = new Component('label', '', text, classes);
        if (typeof input !== 'undefined') {
            label.getContainer<HTMLLabelElement>().htmlFor = input.id;
        }
        return label.getContainer<HTMLLabelElement>();
    }

    static createInput(required: boolean, id: string, text: string, minLength: number, classes?: string[]) {
        const input: Component = new Component('input', id, text, classes);
        const inputContainer: HTMLInputElement = input.getContainer<HTMLInputElement>();
        inputContainer.required = required;
        inputContainer.minLength = minLength;
        inputContainer.pattern = '^[A-Z][A-Za-z]*-?[A-Za-z]*';
        return input.getContainer<HTMLInputElement>();
    }

    static createButton(id: string, text: string, classes: string[]) {
        const button: Component = new Component('button', id, text, classes);
        return button.getContainer<HTMLButtonElement>();
    }
}
