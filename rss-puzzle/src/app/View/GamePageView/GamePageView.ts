import Component from '../../utils/base-component';
import View from '../View';
import GameLogic from './GameLogic';
import './game.css';

export default class GamePageView extends View {
    constructor() {
        super(['game-container']);
        this.createGamePage();
    }

    createGamePage() {
        const gameArea: Component = new Component('div', '', '', ['game-area']);
        const resultContainer: Component = new Component('div', 'result', '', ['result-container']);
        const resourcesContainer: Component = new Component('div', 'resources', '', ['resources-container']);
        const buttonContainer: Component = new Component('div', 'buttons-container', '', ['buttons-container']);
        const buttonCheck: HTMLButtonElement = new Component('button', 'check', 'Check', [
            'button-check',
        ]).getContainer<HTMLButtonElement>();
        buttonCheck.disabled = true;
        const logic: GameLogic = new GameLogic();
        logic.setCheckLogic(buttonCheck);
        logic.createResourceBlocks(resourcesContainer.getContainer<HTMLDivElement>());
        logic.createResultBlocks(resultContainer.getContainer<HTMLDivElement>());
        buttonContainer.setChildren(buttonCheck);
        gameArea.setChildren(
            resultContainer.getContainer<HTMLDivElement>(),
            resourcesContainer.getContainer<HTMLDivElement>(),
            buttonContainer.getContainer<HTMLDivElement>()
        );
        this.container?.append(gameArea.getContainer<HTMLDivElement>());
    }
}
