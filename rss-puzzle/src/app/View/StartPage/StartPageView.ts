import Component from '../../utils/base-component';
import './start-page.css';

const GAMEINFO = {
    INFO: 'Click on words, collect phrases. Words can drag and drop. Select tooltips in the menu.',
};

export default class StartPageView {
    container: HTMLElement;

    constructor() {
        this.container = StartPageView.createContainer();
    }

    static createContainer() {
        const component: Component = new Component('div', '', '', ['start-page-container']);
        const wrapper: Component = StartPageView.createWrapper('', '', ['start-wrapper']);
        const gameName: HTMLHeadingElement = new Component('h1', '', 'English Puzzle', [
            'game-name',
        ]).getContainer<HTMLHeadingElement>();
        const gameInfo: HTMLDivElement = StartPageView.createWrapper('', GAMEINFO.INFO, [
            'game-info',
        ]).getContainer<HTMLDivElement>();
        wrapper.setChildren(gameName, gameInfo);
        component.setChildren(wrapper.getContainer<HTMLDivElement>());
        return component.getContainer<HTMLDivElement>();
    }

    static createWrapper(id: string, text: string, classes: string[]) {
        const wrapper: Component = new Component('div', id, text, classes);
        return wrapper;
    }
}
