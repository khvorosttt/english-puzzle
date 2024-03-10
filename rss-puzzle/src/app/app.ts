import LoginView from './View/Login/LoginView';
import { isNull } from './base-methods';

export default class App {
    container: HTMLElement;

    constructor() {
        this.container = document.body;
        this.createView();
    }

    createView() {
        const login = new LoginView();
        isNull(login.container);
        this.container.append(login.container);
    }
}
