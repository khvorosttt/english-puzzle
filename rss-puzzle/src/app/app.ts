import View from './View/View';
import StartPageView from './View/StartPage/StartPageView';
import { isNull } from './base-methods';
import GamePageView from './View/GamePageView/GamePageView';
import { PageInfo, Router } from './Router/Router';
import LoginView from './View/Login/LoginView';

export default class App {
    container: HTMLElement;

    router: Router;

    constructor() {
        this.container = document.body;
        const pages: PageInfo[] = this.initPages();
        this.router = new Router(pages);
        this.createView();
    }

    createView() {
        const userInfo: string | null = localStorage.getItem('user');
        if (userInfo) {
            this.router.navigate('start');
        } else {
            this.router.navigate('login');
        }
    }

    initPages() {
        const pages: PageInfo[] = [
            {
                pagePath: 'login',
                callback: () => {
                    const loginView = new LoginView(this.router);
                    this.setView(loginView);
                },
            },
            {
                pagePath: 'start',
                callback: () => {
                    const startView = new StartPageView(this.router);
                    this.setView(startView);
                },
            },
            {
                pagePath: 'game',
                callback: () => {
                    const gameView = new GamePageView(this.router);
                    this.setView(gameView);
                },
            },
        ];
        return pages;
    }

    setView(view: View) {
        const viewContainer: HTMLDivElement | null = view.getContainer();
        isNull(viewContainer);
        this.container.replaceChildren();
        this.container.append(viewContainer);
    }
}
