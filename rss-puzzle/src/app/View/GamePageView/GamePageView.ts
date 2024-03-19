import Component from '../../utils/base-component';
import View from '../View';
import GameLogic from './GameLogic';
import './game.css';
import { Router } from '../../Router/Router';
import { buttonLogout } from '../StartPage/StartPageView';

export default class GamePageView extends View {
    constructor(router: Router) {
        super(['game-container']);
        this.createGamePage(router);
    }

    createGamePage(router: Router) {
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
            'show',
        ]).getContainer<HTMLDivElement>();
        const userIteractionContainer: HTMLDivElement = new Component('div', '', '', [
            'user-iteraction-container',
        ]).getContainer<HTMLDivElement>();
        const hideImgButton: HTMLButtonElement = new Component('button', '', '', [
            'hide-img-button',
        ]).getContainer<HTMLButtonElement>();
        const translateButton: HTMLButtonElement = new Component('button', 'translate', `Translate 👀`, [
            'translate-button',
            'active-button',
        ]).getContainer<HTMLButtonElement>();
        translateButton.addEventListener('click', (event: Event) =>
            GamePageView.buttonHideEvent(event, translateContainer, 'Translate')
        );
        const logoutButton: HTMLButtonElement = new Component(
            'button',
            'game-logout-button',
            'Logout',
            ['game-logout-button'],
            {
                eventName: 'click',
                callback: () => buttonLogout(router),
            }
        ).getContainer<HTMLButtonElement>();
        const audio: HTMLAudioElement = new Component('audio', '', '', [
            'audio-element',
        ]).getContainer<HTMLAudioElement>();
        const audioButton: HTMLButtonElement = new Component('button', '', `🔊`, [
            'audio-button',
            'show',
        ]).getContainer<HTMLButtonElement>();
        GamePageView.audioEvent(audio, audioButton);
        const audioHideButton: HTMLButtonElement = new Component('button', '', `Audio 👀`, [
            'audio-hide-button',
            'active-button',
        ]).getContainer<HTMLButtonElement>();
        audioHideButton.addEventListener('click', (event: Event) =>
            GamePageView.buttonHideEvent(event, audioButton, 'Audio')
        );
        userIteractionContainer.append(
            levelRoundContainer,
            hideImgButton,
            translateButton,
            logoutButton,
            audioHideButton,
            audioButton
        );
        logic.initGameElement(
            resultContainer,
            resourcesContainer,
            buttonCheck,
            userIteractionContainer,
            translateContainer,
            audio
        );
        buttonContainer.setChildren(buttonCheck);
        gameArea.setChildren(
            userIteractionContainer,
            translateContainer,
            resultContainer,
            resourcesContainer,
            buttonContainer.getContainer<HTMLDivElement>(),
            audio
        );
        this.container?.append(gameArea.getContainer<HTMLDivElement>());
        GamePageView.initHint(logic, hideImgButton, translateButton, translateContainer, audioHideButton, audioButton);
    }

    static audioEvent(audio: HTMLAudioElement, audioButton: HTMLButtonElement) {
        const copyButton: HTMLButtonElement = audioButton;
        audioButton.addEventListener('click', () => {
            audio.play();
        });
        audio.addEventListener('play', () => {
            copyButton.textContent = '🔊';
            copyButton.style.background = '#cc94c4';
            copyButton.style.boxShadow = '-5px 10px 10px yellow';
        });
        audio.addEventListener('pause', () => {
            copyButton.textContent = '🔇';
            copyButton.style.background = '#f08a9d';
            copyButton.style.boxShadow = 'none';
        });
    }

    static buttonHideEvent(event: Event, element: HTMLElement, text: string) {
        const button: HTMLButtonElement = <HTMLButtonElement>event.currentTarget;
        element.classList.toggle('show');
        button.classList.toggle('active-button');
        GamePageView.changeShowText(button, text);
    }

    static changeShowText(button: HTMLButtonElement, text: string) {
        const copyButton = button;
        if (copyButton.classList.contains('active-button')) {
            copyButton.textContent = `${text} 👀`;
            localStorage.setItem(`${text}Hint`, 'on');
        } else {
            copyButton.textContent = `${text} ❌`;
            localStorage.setItem(`${text}Hint`, 'off');
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

    static initHint(
        logic: GameLogic,
        hideImgButton: HTMLButtonElement,
        translateButton: HTMLButtonElement,
        translateContainer: HTMLDivElement,
        audioHideButton: HTMLButtonElement,
        audioButton: HTMLButtonElement
    ) {
        const hideState: string | null = localStorage.getItem('hideImg');
        const translateState: string | null = localStorage.getItem('TranslateHint');
        const audioHideState: string | null = localStorage.getItem('AudioHint');
        if (hideState === 'off') {
            hideImgButton.classList.add('active-hide-img');
            logic.initHideImgButton(hideImgButton);
        } else if (hideState === 'on') {
            hideImgButton.classList.remove('active-hide-img');
            logic.initHideImgButton(hideImgButton);
        }
        if (translateState === 'off') {
            translateButton.classList.remove('active-button');
            translateContainer.classList.remove('show');
            GamePageView.changeShowText(translateButton, 'Translate');
        } else if (translateState === 'on') {
            translateButton.classList.add('active-button');
            translateContainer.classList.add('show');
            GamePageView.changeShowText(translateButton, 'Translate');
        }
        if (audioHideState === 'off') {
            audioHideButton.classList.remove('active-button');
            audioButton.classList.remove('show');
            GamePageView.changeShowText(audioHideButton, 'Audio');
        } else if (audioHideState === 'on') {
            audioHideButton.classList.add('active-button');
            audioButton.classList.add('show');
            GamePageView.changeShowText(audioHideButton, 'Audio');
        }
    }
}
