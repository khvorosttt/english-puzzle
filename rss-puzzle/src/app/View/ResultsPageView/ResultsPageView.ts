import LevelInfoModel from '../../Model/LevelInfoModel';
import View from '../View';
import { isNull } from '../../base-methods';
import { RoundInterface } from '../../Model/interface';
import Component from '../../utils/base-component';
import './results.css';
import { Router } from '../../Router/Router';

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
        const buttonContinue: HTMLButtonElement = new Component('button', 'continue', 'Continue', [
            'button-continue',
        ]).getContainer<HTMLButtonElement>();
        buttonContinue.addEventListener('click', () => ResultsPageView.continueButtonClick(router));
        tempRoundInfo.words.forEach((word) => {
            const sentenceContainer: HTMLDivElement = new Component('div', '', '', [
                'sentence-container',
            ]).getContainer<HTMLDivElement>();
            const textContainer: HTMLDivElement = new Component('div', '', '', [
                'text-container',
            ]).getContainer<HTMLDivElement>();
            textContainer.textContent = word.textExample;
            sentenceContainer.append(textContainer);
            resultsContainer.append(sentenceContainer);
        });
        resultsContainer.append(buttonContinue);
        this.container?.append(resultsContainer);
    }

    static continueButtonClick(router: Router) {
        router.navigate('game');
    }
}
