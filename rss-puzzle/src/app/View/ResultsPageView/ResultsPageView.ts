import LevelInfoModel from '../../Model/LevelInfoModel';
import View from '../View';
import { isNull } from '../../base-methods';
import { RoundInterface } from '../../Model/interface';
import Component from '../../utils/base-component';
import './results.css';

export default class ResultsPageView extends View {
    constructor() {
        super(['results-page-container']);
        this.createResultsContainer();
    }

    createResultsContainer() {
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
        this.container?.append(resultsContainer);
    }
}
