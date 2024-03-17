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
        this.resourcesContainer.addEventListener('dragover', (event) => {
            event.preventDefault();
        });
        this.resourcesContainer.addEventListener('drop', (event) => {
            this.dropResourceEvent.bind(this)(event);
        });
    }

    createResourceBlocks() {
        isNull(this.resourcesContainer);
        this.resourcesContainer.replaceChildren();
        this.wordBlocks.length = 0;
        let wordsInSentence = 0;
        this.resoucesSentence.forEach((word) => {
            const wordBlock: HTMLDivElement = new Component(
                'div',
                `${this.countSentence}_${wordsInSentence}`,
                word,
                ['word-block', 'full-resource'],
                { eventName: 'click', callback: (event) => this.wordClick(event) }
            ).getContainer<HTMLDivElement>();
            wordBlock.draggable = true;
            wordBlock.addEventListener('dragstart', (event) => GameLogic.dragStart(event));
            wordBlock.addEventListener('dragend', (event) => this.dragEnd.bind(this)(event));
            this.wordBlocks.push(wordBlock);
            wordsInSentence += 1;
        });
        isNull(this.resourcesContainer);
        GameLogic.mixWords(this.wordBlocks);
        this.wordBlocks.forEach((block) => this.resourcesContainer?.append(block));
    }

    static dragStart(event: Event) {
        isNull(event.currentTarget);
        const currentElem: HTMLDivElement = <HTMLDivElement>event.currentTarget;
        currentElem.classList.add('relocatable');
    }

    dragEnd(event: Event) {
        isNull(event.currentTarget);
        const currentElem: HTMLDivElement = <HTMLDivElement>event.currentTarget;
        currentElem.classList.remove('relocatable');
        const checkState = this.resultBlocks.find((block) => block.classList.contains('empty-answer'));
        if (!checkState) {
            isNull(this.checkButton);
            this.checkButton.disabled = false;
        }
    }

    static searchIndexByClass(container: HTMLDivElement[], className: string) {
        let findIndex: number = -1;
        container.forEach((item, index) => {
            if (item.classList.contains(className)) {
                findIndex = index;
            }
        });
        return findIndex;
    }

    dropResourceEvent(event: Event) {
        const currentElem: HTMLDivElement = <HTMLDivElement>event.target;
        if (currentElem.classList.contains('resources-container')) return;
        const findFromIndex: number = GameLogic.searchIndexByClass(this.resultBlocks, 'relocatable');
        if (findFromIndex === -1) return;
        const movedBlock: HTMLDivElement = this.resultBlocks[findFromIndex];
        const emptyAnswer = new Component('div', '', '', ['word-block', 'empty-answer']).getContainer<HTMLDivElement>();
        isNull(this.resultContainer);
        isNull(this.resourcesContainer);
        const sentenceContainer: NodeListOf<HTMLDivElement> = this.resultContainer.querySelectorAll('.sentence-block');
        if (movedBlock.classList.contains('full-answer') && !currentElem.classList.contains('full-resource')) {
            currentElem.classList.add('toElem');
            const findToIndex: number = GameLogic.searchIndexByClass(this.wordBlocks, 'toElem');
            movedBlock.after(emptyAnswer);
            this.resultBlocks.splice(findFromIndex, 1, emptyAnswer);
            sentenceContainer[this.countSentence].removeChild(movedBlock);
            this.wordBlocks.splice(findToIndex, 1, movedBlock);
            currentElem.after(movedBlock);
            this.resourcesContainer.removeChild(currentElem);
            movedBlock.classList.add('full-resource');
            movedBlock.classList.remove('full-answer', 'toElem');
        }
        if (movedBlock.classList.contains('full-resource') && currentElem.classList.contains('full-answer')) {
            currentElem.before(movedBlock);
            const indexEmpty: number = GameLogic.searchIndexByClass(this.wordBlocks, 'empty-resource');
            const emptyBlock: HTMLDivElement = this.wordBlocks[indexEmpty];
            this.wordBlocks.splice(indexEmpty, 1, movedBlock);
            this.resourcesContainer.removeChild(emptyBlock);
            sentenceContainer[this.countSentence].removeChild(movedBlock);
        }
    }

    dropResultEvent(event: Event) {
        const currentElem: HTMLDivElement = <HTMLDivElement>event.target;
        if (currentElem.classList.contains('sentence-block')) return;
        if (currentElem.classList.contains('non-active')) return;
        let findFromIndex: number = GameLogic.searchIndexByClass(this.wordBlocks, 'relocatable');
        isNull(this.resultContainer);
        const sentenceContainer: NodeListOf<HTMLDivElement> = this.resultContainer.querySelectorAll('.sentence-block');
        if (findFromIndex !== -1) {
            const movedBlock: HTMLDivElement = this.wordBlocks[findFromIndex];
            const emptyResource = new Component('div', '', '', [
                'word-block',
                'empty-resource',
                'hide-resource',
            ]).getContainer<HTMLDivElement>();
            if (movedBlock.classList.contains('full-resource') && !currentElem.classList.contains('full-answer')) {
                currentElem.classList.add('toElem');
                const findToIndex: number = GameLogic.searchIndexByClass(this.resultBlocks, 'toElem');
                movedBlock.after(emptyResource);
                this.wordBlocks.splice(findFromIndex, 1, emptyResource);
                this.resourcesContainer?.removeChild(movedBlock!);
                this.resultBlocks.splice(findToIndex, 1, movedBlock!);
                currentElem.after(movedBlock);
                sentenceContainer[this.countSentence].removeChild(currentElem);
                movedBlock.classList.add('full-answer');
                movedBlock.classList.remove('full-resource', 'toElem');
            } else if (
                movedBlock.classList.contains('full-resource') &&
                currentElem.classList.contains('full-answer')
            ) {
                movedBlock.after(emptyResource);
                currentElem.before(movedBlock);
                const indexEmpty: number = GameLogic.searchIndexByClass(this.resultBlocks, 'empty-answer');
                const emptyBlock: HTMLDivElement = this.resultBlocks[indexEmpty];
                this.resultBlocks.splice(indexEmpty, 1, movedBlock);
                sentenceContainer[this.countSentence].removeChild(emptyBlock);
                movedBlock.classList.add('full-answer');
                movedBlock.classList.remove('full-resource');
            }
        } else {
            findFromIndex = GameLogic.searchIndexByClass(this.resultBlocks, 'relocatable');
            const movedBlock: HTMLDivElement = this.resultBlocks[findFromIndex];
            movedBlock.after(currentElem);
            currentElem.before(movedBlock);
        }
    }

    createResultBlocks() {
        const sentenceBlock: HTMLDivElement = new Component('div', '', '', [
            'sentence-block',
        ]).getContainer<HTMLDivElement>();
        this.resultBlocks.length = 0;
        for (let i = 0; i < this.resoucesSentence.length; i += 1) {
            const wordAnswerBlock: HTMLDivElement = new Component('div', '', '', ['word-block', 'empty-answer'], {
                eventName: 'click',
                callback: (event) => this.wordClick(event),
            }).getContainer<HTMLDivElement>();
            this.resultBlocks.push(wordAnswerBlock);
            sentenceBlock.append(wordAnswerBlock);
        }
        isNull(this.resultContainer);
        this.resultContainer.append(sentenceBlock);
        this.currentFindSentence.push(sentenceBlock);
        this.currentFindSentence[this.countSentence].addEventListener('dragover', (event) => {
            event.preventDefault();
        });
        this.currentFindSentence[this.countSentence].addEventListener('drop', (event) => {
            this.dropResultEvent(event);
        });
    }

    wordClick(event: Event | undefined) {
        isNull(event);
        const currentElem: HTMLDivElement = <HTMLDivElement>event.currentTarget;
        if (currentElem.classList.contains('full-resource')) {
            this.wordResourceClick(currentElem);
        }
        if (currentElem.classList.contains('full-answer')) {
            this.wordResultClick(currentElem);
        }
    }

    wordResourceClick(currentElem: HTMLDivElement) {
        const pathsTo: HTMLDivElement[] | undefined = this.resultBlocks.filter((block) =>
            block.classList.contains('empty-answer')
        );
        let indexTo = -1;
        let firstIndex = false;
        this.resultBlocks.forEach((block, index) => {
            if (block.classList.contains('empty-answer') && !firstIndex) {
                indexTo = index;
                firstIndex = true;
            }
        });
        if (pathsTo && !currentElem.classList.contains('empty-resource')) {
            Coordinates.animateBlock(pathsTo[0], currentElem, 1000);
            const checkDisabled: boolean = pathsTo.length === 1;
            this.resultBlocks.splice(indexTo, 1, currentElem);
            setTimeout(this.setContentToResultBlock.bind(this), 1000, pathsTo[0], currentElem, checkDisabled);
        }
    }

    wordResultClick(currentElem: HTMLDivElement) {
        if (currentElem.classList.contains('non-active')) return;
        currentElem.classList.remove('true-result', 'false-result');
        const pathTo: HTMLDivElement | undefined = this.wordBlocks.find((block) =>
            block.classList.contains('empty-resource')
        );
        let indexTo = -1;
        let firstIndex = false;
        this.wordBlocks.forEach((block, index) => {
            if (block.classList.contains('empty-resource') && !firstIndex) {
                indexTo = index;
                firstIndex = true;
            }
        });
        if (pathTo && currentElem.classList.contains('full-answer')) {
            Coordinates.animateBlock(pathTo, currentElem, 1000);
            pathTo.classList.remove('empty-resource');
            this.wordBlocks.splice(indexTo, 1, currentElem);
            setTimeout(this.setContentToResorceBlock.bind(this), 1000, pathTo, currentElem);
        }
        isNull(this.checkButton);
        this.checkButton.disabled = true;
    }

    setContentToResultBlock(blockTo: HTMLDivElement, blockFrom: HTMLDivElement, checkDisabled: boolean) {
        const to: HTMLDivElement = blockTo;
        const from: HTMLDivElement = blockFrom;
        from.classList.add('full-answer');
        from.classList.remove('full-resource');
        if (checkDisabled) {
            isNull(this.checkButton);
            this.checkButton.disabled = false;
        }
        const emptyResource = new Component('div', '', '', [
            'word-block',
            'empty-resource',
            'hide-resource',
        ]).getContainer<HTMLDivElement>();
        const findIndex = GameLogic.findBlock(from, this.wordBlocks);
        if (findIndex !== -1) {
            this.wordBlocks.splice(findIndex, 1, emptyResource);
        }
        from.after(emptyResource);
        to.after(from);
        isNull(this.resultContainer);
        const sentenceContainer: NodeListOf<HTMLDivElement> = this.resultContainer.querySelectorAll('.sentence-block');
        sentenceContainer[this.countSentence].removeChild(to);
    }

    static findBlock(currentBlock: HTMLDivElement, container: HTMLDivElement[]) {
        let findIndex = -1;
        container.forEach((block, index) => {
            if (block.id === currentBlock.id) {
                findIndex = index;
            }
        });
        return findIndex;
    }

    setContentToResorceBlock(blockTo: HTMLDivElement, blockFrom: HTMLDivElement) {
        const to: HTMLDivElement = blockTo;
        const from: HTMLDivElement = blockFrom;
        from.classList.add('full-resource');
        from.classList.remove('full-answer');
        const emptyAnswer = new Component('div', '', '', ['word-block', 'empty-answer']).getContainer<HTMLDivElement>();
        const indexTo = GameLogic.findBlock(from, this.resultBlocks);
        from.after(emptyAnswer);
        to.after(from);
        this.resultBlocks.splice(indexTo, 1, emptyAnswer);
        this.resourcesContainer?.removeChild(to);
    }

    static mixWords(array: HTMLDivElement[]) {
        const mixArray: HTMLDivElement[] = array;
        return mixArray.sort(() => Math.random() - 0.5);
    }

    setCheckLogic() {
        isNull(this.checkButton);
        this.checkButton.addEventListener('click', this.checkSentence.bind(this));
    }

    checkSentence() {
        let trueValues: number = 0;
        isNull(this.checkButton);
        isNull(this.resultContainer);
        const sentenceContainer: NodeListOf<HTMLDivElement> = this.resultContainer.querySelectorAll('.sentence-block');
        const answers: NodeList = sentenceContainer[this.countSentence].childNodes;
        let sequenceOrder = 0;
        answers.forEach((block) => {
            const currentBlock: HTMLDivElement = <HTMLDivElement>block;
            const order: number = Number(currentBlock.id.split('_').pop());
            if (order !== sequenceOrder) {
                currentBlock.classList.add('false-result');
            } else {
                currentBlock.classList.add('true-result');
                trueValues += 1;
            }
            sequenceOrder += 1;
        });
        if (this.continueState) {
            this.nextSentence();
            trueValues = 0;
        }
        if (trueValues === this.resultBlocks.length && !this.continueState) {
            this.resultBlocks.forEach((block: HTMLDivElement) => {
                const temp: HTMLDivElement = block;
                temp.classList.add('non-active');
                temp.draggable = false;
            });
            this.continueState = true;
            this.checkButton.textContent = 'Continue';
            this.currentFindSentence[this.countSentence].removeEventListener('dragover', (event) => {
                event.preventDefault();
            });
            this.currentFindSentence[this.countSentence].removeEventListener('drop', (event) => {
                this.dropResultEvent(event);
            });
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
