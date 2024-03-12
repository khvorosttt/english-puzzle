import Component from '../../utils/base-component';
import View from '../View';

export default class GamePageView extends View {
    constructor() {
        super();
        this.createGamePage();
    }

    createGamePage() {
        this.setClasses(['game-container']);
        const gameArea: HTMLDivElement = new Component('div', '', 'Game Page', [
            'game-area',
        ]).getContainer<HTMLDivElement>();
        this.container?.append(gameArea);
    }
}
