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
        const resultContainer: HTMLDivElement = new Component('div', 'result', '', [
            'result-container',
        ]).getContainer<HTMLDivElement>();
        const resourcesContainer: HTMLDivElement = new Component('div', 'resources', '', [
            'resources-container',
        ]).getContainer<HTMLDivElement>();
        const buttonContainer: Component = new Component('div', 'buttons-container', '', ['buttons-container']);
        const buttonCheck: HTMLButtonElement = new Component('button', 'check', 'Check', [
            'button-check',
        ]).getContainer<HTMLButtonElement>();
        buttonCheck.disabled = true;
        const buttonContinue: HTMLButtonElement = new Component('button', 'continue', 'Continue', [
            'button-continue',
        ]).getContainer<HTMLButtonElement>();
        buttonContinue.disabled = true;
        const logic: GameLogic = new GameLogic();
        logic.initGameElement(resultContainer, resourcesContainer, buttonCheck, buttonContinue);
        buttonContainer.setChildren(buttonCheck, buttonContinue);
        gameArea.setChildren(resultContainer, resourcesContainer, buttonContainer.getContainer<HTMLDivElement>());
        this.container?.append(gameArea.getContainer<HTMLDivElement>());
    }
}
