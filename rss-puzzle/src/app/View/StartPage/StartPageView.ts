import { isNull } from '../../base-methods';
import Component from '../../utils/base-component';
import { UserType } from '../Validation/Validation';
import View from '../View';
import { Router } from '../../Router/Router';
import './start-page.css';
import '../../css/normalize.css';

const GAMEINFO = {
    INFO: 'Click on words, collect phrases. Words can drag and drop. Select tooltips in the menu.',
};

function buttonStart(router: Router) {
    router.navigate('game');
}

export default class StartPageView extends View {
    constructor(router: Router) {
        super(['start-page-container']);
        this.createStartContainer(router);
    }

    createStartContainer(router: Router) {
        const userString: string | null = localStorage.getItem('user');
        isNull(userString);
        const user: UserType = JSON.parse(userString);
        const wrapper: Component = StartPageView.createWrapper('', '', ['start-wrapper']);
        const gameName: HTMLHeadingElement = new Component('h1', '', 'English Puzzle', [
            'game-name',
        ]).getContainer<HTMLHeadingElement>();
        const gameInfo: HTMLDivElement = StartPageView.createWrapper('', GAMEINFO.INFO, [
            'game-info',
        ]).getContainer<HTMLDivElement>();
        const greetingContainer: HTMLDivElement = StartPageView.createWrapper(
            '',
            `Hello, ${user.nameUser} ${user.surnameUser}! Welcome to the game.`,
            ['greeting-container']
        ).getContainer<HTMLDivElement>();
        const startButton: HTMLButtonElement = new Component('button', 'start-button', 'Start', ['start-button'], {
            eventName: 'click',
            callback: () => buttonStart(router),
        }).getContainer<HTMLButtonElement>();
        startButton.type = 'button';
        wrapper.setChildren(gameName, gameInfo, greetingContainer, startButton);
        this.container?.append(wrapper.getContainer<HTMLDivElement>());
    }

    static createWrapper(id: string, text: string, classes: string[]) {
        const wrapper: Component = new Component('div', id, text, classes);
        return wrapper;
    }
}
