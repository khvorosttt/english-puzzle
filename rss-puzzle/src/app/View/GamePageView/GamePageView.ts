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
        const logic: GameLogic = new GameLogic();
        logic.createResourceBlocks(resourcesContainer.getContainer<HTMLDivElement>());
        logic.createResultBlocks(resultContainer.getContainer<HTMLDivElement>());
        gameArea.setChildren(
            resultContainer.getContainer<HTMLDivElement>(),
            resourcesContainer.getContainer<HTMLDivElement>()
        );
        this.container?.append(gameArea.getContainer<HTMLDivElement>());
    }
}
