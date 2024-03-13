import Component from '../../utils/base-component';
import { isNull } from '../../base-methods';
import Coordinates from '../../Coordinates/Coordinates';

export default class GameLogic {
    private level: number = 1;

    private round: number = 1;

    private resoucesSentence: string[];

    private currentFindSentence: HTMLDivElement[];

    private countSentence = 0;

    private wordBlocks: HTMLDivElement[];

    private resultBlocks: HTMLDivElement[];

    constructor() {
        this.wordBlocks = [];
        this.resultBlocks = [];
        this.currentFindSentence = [];
        this.resoucesSentence = 'The students agree they have too much homework'.split(' ');
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
        this.countSentence += 1;
    }

    wordResourceClick(event: Event | undefined) {
        isNull(event);
        const currentElem: HTMLDivElement = <HTMLDivElement>event.currentTarget;
        const pathTo: HTMLDivElement | undefined = this.resultBlocks.find((block) =>
            block.classList.contains('empty-answer')
        );
        if (pathTo) {
            Coordinates.animateBlock(pathTo, currentElem, 3000);
            pathTo.classList.remove('empty-answer');
            setTimeout(GameLogic.setContentToResultBlock, 3000, pathTo, currentElem);
        }
    }

    wordResultClick(event: Event | undefined) {
        isNull(event);
        const currentElem: HTMLDivElement = <HTMLDivElement>event.currentTarget;
        const pathTo: HTMLDivElement | undefined = this.wordBlocks.find((block) =>
            block.classList.contains('empty-resource')
        );
        if (pathTo) {
            Coordinates.animateBlock(pathTo, currentElem, 3000);
            pathTo.classList.remove('empty-resource');
            setTimeout(GameLogic.setContentToResorceBlock, 3000, pathTo, currentElem);
        }
    }

    static setContentToResultBlock(blockTo: HTMLDivElement, blockFrom: HTMLDivElement) {
        const to: HTMLDivElement = blockTo;
        const from: HTMLDivElement = blockFrom;
        to.classList.add('full-answer');
        to.textContent = from.textContent;
        from.textContent = '';
        from.classList.remove('full-resource');
        from.classList.add('empty-resource', 'hide-resource');
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
}
