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

    private resultContainer: HTMLDivElement | null;

    private resourcesContainer: HTMLDivElement | null;

    private continueState: boolean;

    constructor() {
        this.wordBlocks = [];
        this.resultBlocks = [];
        this.currentFindSentence = [];
        this.levelInfo = new LevelInfoModel(this.level);
        this.roundInfo = this.levelInfo.getRound(this.round);
        this.resoucesSentence = this.roundInfo.words[this.countSentence].textExample.split(' ');
        this.resultContainer = null;
        this.resourcesContainer = null;
        this.checkButton = null;
        this.continueState = false;
        GameLogic.mixWords(this.resoucesSentence);
    }

    initGameElement(
        resultContainer: HTMLDivElement,
        resourcesContainer: HTMLDivElement,
        checkButton: HTMLButtonElement
    ) {
        this.resultContainer = resultContainer;
        this.resourcesContainer = resourcesContainer;
        this.checkButton = checkButton;
        this.createResourceBlocks();
        this.createResultBlocks();
        this.setCheckLogic();
    }

    createResourceBlocks() {
        isNull(this.resourcesContainer);
        this.resourcesContainer.replaceChildren();
        this.wordBlocks.length = 0;
        this.resoucesSentence.forEach((word) => {
            const wordBlock: HTMLDivElement = new Component('div', '', word, ['word-block', 'full-resource'], {
                eventName: 'click',
                callback: (event) => this.wordResourceClick(event),
            }).getContainer<HTMLDivElement>();
            this.wordBlocks.push(wordBlock);
            isNull(this.resourcesContainer);
            this.resourcesContainer.append(wordBlock);
        });
    }

    createResultBlocks() {
        const sentenceBlock: Component = new Component('div', '', '', ['sentence-block']);
        this.resultBlocks.length = 0;
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
        isNull(this.resultContainer);
        this.resultContainer.append(sentenceBlock.getContainer<HTMLDivElement>());
        this.currentFindSentence.push(sentenceBlock.getContainer<HTMLDivElement>());
    }

    wordResourceClick(event: Event | undefined) {
        isNull(event);
        const currentElem: HTMLDivElement = <HTMLDivElement>event.currentTarget;
        const pathTo: HTMLDivElement[] | undefined = this.resultBlocks.filter((block) =>
            block.classList.contains('empty-answer')
        );
        if (pathTo && !currentElem.classList.contains('empty-resource')) {
            Coordinates.animateBlock(pathTo[0], currentElem, 3000);
            pathTo[0].classList.remove('empty-answer');
            const checkDisabled: boolean = pathTo.length === 1;
            setTimeout(this.setContentToResultBlock.bind(this), 3000, pathTo[0], currentElem, checkDisabled);
        }
    }

    wordResultClick(event: Event | undefined) {
        isNull(event);
        const currentElem: HTMLDivElement = <HTMLDivElement>event.currentTarget;
        if (currentElem.classList.contains('non-active')) return;
        currentElem.classList.remove('true-result', 'false-result');
        const pathTo: HTMLDivElement | undefined = this.wordBlocks.find((block) =>
            block.classList.contains('empty-resource')
        );
        if (pathTo && currentElem.classList.contains('full-answer')) {
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

    setCheckLogic() {
        isNull(this.checkButton);
        this.checkButton.addEventListener('click', this.checkSentence.bind(this));
    }

    checkSentence() {
        let trueValues: number = 0;
        isNull(this.checkButton);
        const trueResult: string[] = this.roundInfo.words[this.countSentence].textExample.split(' ');
        this.resultBlocks.forEach((block: HTMLDivElement, index: number) => {
            if (block.textContent !== trueResult[index]) {
                block.classList.add('false-result');
            } else {
                block.classList.add('true-result');
                trueValues += 1;
            }
        });
        if (this.continueState) {
            this.nextSentence();
            trueValues = 0;
        }
        if (trueValues === this.resultBlocks.length && !this.continueState) {
            this.resultBlocks.forEach((block: HTMLDivElement) => {
                block.classList.add('non-active');
            });
            this.continueState = true;
            this.checkButton.textContent = 'Continue';
        }
    }

    nextSentence() {
        this.countSentence += 1;
        if (this.countSentence < 10) {
            this.goToNextSentence();
        } else if (this.countSentence === 10) {
            this.goToNextRound();
        }
        this.continueState = false;
        isNull(this.checkButton);
        this.checkButton.textContent = 'Check';
    }

    goToNextSentence() {
        this.resoucesSentence = this.roundInfo.words[this.countSentence].textExample.split(' ');
        GameLogic.mixWords(this.resoucesSentence);
        this.createResourceBlocks();
        this.createResultBlocks();
        isNull(this.checkButton);
        this.checkButton.disabled = true;
    }

    goToNextRound() {
        this.resourcesContainer?.replaceChildren();
        this.resultContainer?.replaceChildren();
        if (this.round < this.levelInfo.rounds.length) {
            this.round += 1;
        }
        this.roundInfo = this.levelInfo.rounds[this.round];
        this.countSentence = 0;
        this.goToNextSentence();
    }
}
