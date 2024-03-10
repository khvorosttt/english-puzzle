import LoginView from './View/Login/LoginView';
import StartPageView from './View/StartPage/StartPageView';

export default class App {
    container: HTMLElement;

    constructor() {
        this.container = document.body;
        this.createView();
    }

    createView() {
        const userInfo: string | null = localStorage.getItem('user');
        if (userInfo) {
            const startPage: StartPageView = new StartPageView();
            this.container.append(startPage.container);
        } else {
            const login = new LoginView();
            this.container.append(login.container);
        }
    }
}
