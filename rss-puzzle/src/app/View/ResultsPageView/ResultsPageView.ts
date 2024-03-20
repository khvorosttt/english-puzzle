import LevelInfoModel from '../../Model/LevelInfoModel';
import View from '../View';
import { isNull } from '../../base-methods';
import { RoundInterface, WordInterface } from '../../Model/interface';
import Component from '../../utils/base-component';
import './results.css';
import { Router } from '../../Router/Router';
import { AUDIO_PATH, IMG_PATH } from '../GamePageView/GameLogic';

export default class ResultsPageView extends View {
    constructor(router: Router) {
        super(['results-page-container']);
        this.createResultsContainer(router);
    }

    createResultsContainer(router: Router) {
        const levelRound: string | null = localStorage.getItem('level_round');
        isNull(levelRound);
        const temp: string[] = levelRound.split('_');
        const level: number = Number(temp[0]);
        const round: number = Number(temp[1]);
        const tempLevelInfo: LevelInfoModel = new LevelInfoModel(level);
        const tempRoundInfo: RoundInterface = tempLevelInfo.getRound(round);
        const resultsContainer: HTMLDivElement = new Component('div', '', '', [
            'results-container',
        ]).getContainer<HTMLDivElement>();
        resultsContainer.append(ResultsPageView.createCutImgContainer(tempRoundInfo));
        const buttonContinue: HTMLButtonElement = new Component('button', 'continue', 'Continue', [
            'button-continue',
        ]).getContainer<HTMLButtonElement>();
        const sentencesInfoContainer: HTMLDivElement = new Component('div', '', '', [
            'sentences-info-container',
        ]).getContainer<HTMLDivElement>();
        buttonContinue.addEventListener('click', () => ResultsPageView.continueButtonClick(router));
        const audio: HTMLAudioElement = new Component('audio', '', '', [
            'audio-element',
        ]).getContainer<HTMLAudioElement>();
        tempRoundInfo.words.forEach((word) => {
            const sentenceContainer: HTMLDivElement = new Component('div', '', '', [
                'sentence-container',
            ]).getContainer<HTMLDivElement>();
            const audioButton: HTMLButtonElement = new Component('button', '', `🔊`, [
                'audio-button',
                'show',
            ]).getContainer<HTMLButtonElement>();
            const textContainer: HTMLDivElement = new Component('div', '', '', [
                'text-container',
            ]).getContainer<HTMLDivElement>();
            ResultsPageView.audioEvent(audio, audioButton, word);
            textContainer.textContent = word.textExample;
            sentenceContainer.append(audioButton, textContainer);
            sentencesInfoContainer.append(sentenceContainer);
        });
        resultsContainer.append(sentencesInfoContainer, buttonContinue);
        this.container?.append(resultsContainer);
    }

    static audioEvent(audio: HTMLAudioElement, audioButton: HTMLButtonElement, word: WordInterface) {
        const copyAudio: HTMLAudioElement = audio;
        const copyButton: HTMLButtonElement = audioButton;
        audioButton.addEventListener('click', () => {
            copyButton.textContent = '🔊';
            copyButton.textContent = '🔊';
            copyButton.style.background = '#cc94c4';
            copyButton.style.boxShadow = '-5px 10px 10px yellow';
            copyAudio.currentTime = 0;
            copyAudio.src = `${AUDIO_PATH}${word.audioExample}`;
            audio.play();
        });
        audio.addEventListener('pause', () => {
            copyButton.textContent = '🔇';
            copyButton.style.background = '#f08a9d';
            copyButton.style.boxShadow = 'none';
        });
    }

    static continueButtonClick(router: Router) {
        router.navigate('game');
    }

    static createCutImgContainer(roundInfo: RoundInterface) {
        const fullImgContainer: HTMLDivElement = new Component('div', '', '', [
            'cut-img-container',
        ]).getContainer<HTMLDivElement>();
        const imgContainer: HTMLDivElement = new Component('div', '', '', ['img-cut']).getContainer<HTMLDivElement>();
        imgContainer.style.backgroundImage = `url(${IMG_PATH}${roundInfo.levelData.cutSrc})`;
        const infoContainer: HTMLDivElement = new Component('div', '', '', [
            'info-container',
        ]).getContainer<HTMLDivElement>();
        const author: HTMLDivElement = new Component('div', '', '', ['author']).getContainer<HTMLDivElement>();
        author.textContent = roundInfo.levelData.author;
        const nameYear: HTMLDivElement = new Component('div', '', '', ['name-year']).getContainer<HTMLDivElement>();
        nameYear.textContent = `${roundInfo.levelData.name} (${roundInfo.levelData.year})`;
        infoContainer.append(author, nameYear);
        fullImgContainer.append(imgContainer, infoContainer);
        return fullImgContainer;
    }
}
