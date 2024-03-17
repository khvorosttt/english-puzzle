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
        const logic: GameLogic = new GameLogic();
        const levelRoundContainer: HTMLDivElement = GamePageView.createLevelRoundContainer(logic);
        const translateContainer: HTMLDivElement = new Component('div', '', '', [
            'translate-container',
        ]).getContainer<HTMLDivElement>();
        const userIteractionContainer: HTMLDivElement = new Component('div', '', '', [
            'user-iteraction-container',
        ]).getContainer<HTMLDivElement>();
        const translateButton: HTMLButtonElement = new Component('button', 'translate', `Translate ❌`, [
            'translate-button',
        ]).getContainer<HTMLButtonElement>();
        translateButton.addEventListener('click', (event: Event) =>
            GamePageView.translateEvent(event, translateContainer)
        );
        userIteractionContainer.append(levelRoundContainer, translateButton);
        logic.initGameElement(
            resultContainer,
            resourcesContainer,
            buttonCheck,
            levelRoundContainer,
            translateContainer
        );
        buttonContainer.setChildren(buttonCheck);
        gameArea.setChildren(
            userIteractionContainer,
            translateContainer,
            resultContainer,
            resourcesContainer,
            buttonContainer.getContainer<HTMLDivElement>()
        );
        this.container?.append(gameArea.getContainer<HTMLDivElement>());
    }

    static translateEvent(event: Event, translateContainer: HTMLDivElement) {
        const translateButton: HTMLButtonElement = <HTMLButtonElement>event.currentTarget;
        translateContainer.classList.toggle('show');
        if (translateContainer.classList.contains('show')) {
            translateButton.textContent = 'Translate 👀';
        } else {
            translateButton.textContent = 'Translate ❌';
        }
    }

    static createLevelRoundContainer(logic: GameLogic) {
        const levelRoundContainer: HTMLDivElement = new Component('div', '', '', [
            'level-round-container',
        ]).getContainer<HTMLDivElement>();
        const levelContainer: HTMLDivElement = new Component('div', '', '', [
            'level-container',
        ]).getContainer<HTMLDivElement>();
        const roundContainer: HTMLDivElement = new Component('div', '', '', [
            'round-container',
        ]).getContainer<HTMLDivElement>();
        const levelButton: HTMLButtonElement = new Component('button', 'level-button', 'Level 1', [
            'level-button',
        ]).getContainer<HTMLButtonElement>();
        const levelList: HTMLDivElement = new Component('div', '', '', ['level-list']).getContainer<HTMLDivElement>();
        for (let i = 1; i <= 6; i += 1) {
            const levelItem: HTMLLIElement = new Component('div', `level_${i}`, `Level ${i}`, [
                'level-item',
            ]).getContainer<HTMLLIElement>();
            if (i === 1) {
                levelItem.classList.add('level-selected');
            }
            levelItem.addEventListener('click', (event) => logic.levelClick(event));
            levelList.append(levelItem);
        }
        levelContainer.append(levelButton, levelList);
        levelButton.addEventListener('click', () => levelList.classList.toggle('showed'));
        const roundButton: HTMLButtonElement = new Component('button', 'round-button', 'Round 1', [
            'round-button',
        ]).getContainer<HTMLButtonElement>();
        const roundList: HTMLDivElement = new Component('div', '', '', ['round-list']).getContainer<HTMLDivElement>();
        roundButton.addEventListener('click', () => roundList.classList.toggle('showed'));
        roundContainer.append(roundButton, roundList);
        levelRoundContainer.append(levelContainer, roundContainer);
        return levelRoundContainer;
    }
}
