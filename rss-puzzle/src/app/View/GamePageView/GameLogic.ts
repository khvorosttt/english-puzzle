import Component from '../../utils/base-component';
import { isNull } from '../../base-methods';
import Coordinates from '../../Coordinates/Coordinates';
import LevelInfoModel from '../../Model/LevelInfoModel';
import { RoundInterface } from '../../Model/interface';

export default class GameLogic {
    private level: number = 1;

    private levelInfo: LevelInfoModel;

    private roundInfo: RoundInterface;

    private round: number = 0;

    private resoucesSentence: string[];

    private currentFindSentence: HTMLDivElement[];

    private countSentence = 0;

    private wordBlocks: HTMLDivElement[];

    private resultBlocks: HTMLDivElement[];

    private checkButton: HTMLButtonElement | null;

    constructor() {
        this.wordBlocks = [];
        this.resultBlocks = [];
        this.currentFindSentence = [];
        this.levelInfo = new LevelInfoModel(this.level);
        this.roundInfo = this.levelInfo.getRound(this.round);
        this.resoucesSentence = this.roundInfo.words[this.countSentence].textExample.split(' ');
        this.checkButton = null;
        GameLogic.mixWords(this.resoucesSentence);
    }

    createResourceBlocks(resourcesContainer: HTMLDivElement) {
        this.resoucesSentence.forEach((word) => {
            const wordBlock: HTMLDivElement = new Component('div', '', word, ['word-block', 'full-resource'], {
                eventName: 'click',
                callback: (event) => this.wordResourceClick(event),
            }).getContainer<HTMLDivElement>();
            this.wordBlocks.push(wordBlock);
            resourcesContainer.append(wordBlock);
        });
    }

    createResultBlocks(resultContainer: HTMLDivElement) {
        const sentenceBlock: Component = new Component('div', '', '', ['sentence-block']);
        for (let i = 0; i < this.resoucesSentence.length; i += 1) {
            const wordAnswerBlock: HTMLDivElement = new Component(
                'div',
                '',
                '',
                ['word-answer-block', 'empty-answer'],
                {
                    eventName: 'click',
                    callback: (event) => this.wordResultClick(event),
                }
            ).getContainer<HTMLDivElement>();
            this.resultBlocks.push(wordAnswerBlock);
            sentenceBlock.setChildren(wordAnswerBlock);
        }
        resultContainer.append(sentenceBlock.getContainer<HTMLDivElement>());
        this.currentFindSentence.push(sentenceBlock.getContainer<HTMLDivElement>());
    }

    wordResourceClick(event: Event | undefined) {
        isNull(event);
        const currentElem: HTMLDivElement = <HTMLDivElement>event.currentTarget;
        const pathTo: HTMLDivElement[] | undefined = this.resultBlocks.filter((block) =>
            block.classList.contains('empty-answer')
        );
        if (pathTo) {
            Coordinates.animateBlock(pathTo[0], currentElem, 3000);
            pathTo[0].classList.remove('empty-answer');
            const checkDisabled: boolean = pathTo.length === 1;
            setTimeout(this.setContentToResultBlock.bind(this), 3000, pathTo[0], currentElem, checkDisabled);
        }
    }

    wordResultClick(event: Event | undefined) {
        isNull(event);
        const currentElem: HTMLDivElement = <HTMLDivElement>event.currentTarget;
        currentElem.classList.remove('true-result', 'false-result');
        const pathTo: HTMLDivElement | undefined = this.wordBlocks.find((block) =>
            block.classList.contains('empty-resource')
        );
        if (pathTo) {
            Coordinates.animateBlock(pathTo, currentElem, 3000);
            pathTo.classList.remove('empty-resource');
            setTimeout(GameLogic.setContentToResorceBlock, 3000, pathTo, currentElem);
        }
        isNull(this.checkButton);
        this.checkButton.disabled = true;
    }

    setContentToResultBlock(blockTo: HTMLDivElement, blockFrom: HTMLDivElement, checkDisabled: boolean) {
        const to: HTMLDivElement = blockTo;
        const from: HTMLDivElement = blockFrom;
        to.classList.add('full-answer');
        to.textContent = from.textContent;
        from.textContent = '';
        from.classList.remove('full-resource');
        from.classList.add('empty-resource', 'hide-resource');
        if (checkDisabled) {
            isNull(this.checkButton);
            this.checkButton.disabled = false;
        }
    }

    static setContentToResorceBlock(blockTo: HTMLDivElement, blockFrom: HTMLDivElement) {
        const to: HTMLDivElement = blockTo;
        const from: HTMLDivElement = blockFrom;
        to.classList.add('full-resource');
        to.textContent = from.textContent;
        from.textContent = '';
        from.classList.remove('full-answer');
        to.classList.remove('hide-resource');
        from.classList.add('empty-answer');
    }

    static mixWords(array: string[]) {
        const mixArray: string[] = array;
        return mixArray.sort(() => Math.random() - 0.5);
    }

    setCheckLogic(checkButton: HTMLButtonElement) {
        this.checkButton = checkButton;
        this.checkButton.addEventListener('click', this.checkSentence.bind(this));
    }

    checkSentence() {
        let falseValues: number = 0;
        const trueResult: string[] = this.roundInfo.words[this.countSentence].textExample.split(' ');
        this.resultBlocks.forEach((block: HTMLDivElement, index: number) => {
            if (block.textContent !== trueResult[index]) {
                block.classList.add('false-result');
                falseValues += 1;
            } else {
                block.classList.add('true-result');
            }
        });
        console.log(falseValues);
    }
}
