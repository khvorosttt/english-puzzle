import Component from '../../utils/base-component';
import { isNull } from '../../base-methods';
import Coordinates from '../../Coordinates/Coordinates';
import LevelInfoModel from '../../Model/LevelInfoModel';
import { RoundInterface } from '../../Model/interface';

const AUDIO_PATH: string = 'https://raw.githubusercontent.com/rolling-scopes-school/rss-puzzle-data/main/';
const IMG_PATH: string = 'https://raw.githubusercontent.com/rolling-scopes-school/rss-puzzle-data/main/images/';

export default class GameLogic {
    private level: number = 1;

    private levelInfo: LevelInfoModel;

    private roundInfo: RoundInterface;

    private round: number = 0;

    private resoucesSentence: string[];

    private countSentence = 0;

    private wordBlocks: HTMLDivElement[];

    private resultBlocks: HTMLDivElement[];

    private checkButton: HTMLButtonElement | null;

    private buttonAutoComplete: HTMLButtonElement | null;

    private resultContainer: HTMLDivElement | null;

    private resourcesContainer: HTMLDivElement | null;

    private continueState: boolean;

    private userIteractionContainer: HTMLDivElement | null;

    private levelRoundContainer: HTMLDivElement | null;

    private translateContainer: HTMLDivElement | null;

    private audio: HTMLAudioElement | null;

    constructor() {
        this.wordBlocks = [];
        this.resultBlocks = [];
        this.setCurrentRound();
        this.levelInfo = new LevelInfoModel(this.level);
        this.roundInfo = this.levelInfo.getRound(this.round);
        console.log(this.roundInfo);
        console.log(this.level);
        console.log(this.round);
        this.resoucesSentence = this.roundInfo.words[this.countSentence].textExample.split(' ');
        this.resultContainer = null;
        this.resourcesContainer = null;
        this.checkButton = null;
        this.buttonAutoComplete = null;
        this.continueState = false;
        this.userIteractionContainer = null;
        this.levelRoundContainer = null;
        this.translateContainer = null;
        this.audio = null;
    }

    setCurrentRound() {
        const levelRound: string | null = localStorage.getItem('level_round');
        let level: number = 1;
        let round: number = 0;
        if (levelRound === null) {
            this.levelInfo = new LevelInfoModel(this.level);
            this.roundInfo = this.levelInfo.getRound(this.round);
            return;
        }
        const temp: string[] = levelRound.split('_');
        level = Number(temp[0]);
        round = Number(temp[1]);
        const tempLevelInfo: LevelInfoModel = new LevelInfoModel(level);
        if (round < tempLevelInfo.getRounds().length - 1) {
            this.round += 1;
        } else if (level === 6) {
            this.level = 1;
            this.round = 0;
        } else {
            this.level += 1;
            this.levelInfo = new LevelInfoModel(this.level);
            this.round = 0;
        }
    }

    initLevel() {
        this.levelInfo = new LevelInfoModel(this.level);
        isNull(this.levelRoundContainer);
        const roundList: HTMLDivElement | null = this.levelRoundContainer.querySelector('.round-list');
        isNull(roundList);
        this.initRoundList(roundList);
        this.initRound();
        isNull(this.levelRoundContainer);
        const levelButton: HTMLButtonElement | null = this.levelRoundContainer.querySelector('.level-button');
        isNull(levelButton);
        levelButton.textContent = `Level ${this.level}`;
    }

    initRound() {
        this.countSentence = 0;
        this.roundInfo = this.levelInfo.getRound(this.round);
        this.resoucesSentence = this.roundInfo.words[this.countSentence].textExample.split(' ');
        this.createResourceBlocks();
        this.resultContainer?.replaceChildren();
        this.createResultBlocks();
        isNull(this.userIteractionContainer);
        const hideImgButton: HTMLButtonElement | null = this.userIteractionContainer.querySelector('.hide-img-button');
        isNull(hideImgButton);
        this.initHideImgButton(hideImgButton);
    }

    initRoundList(roundList: HTMLDivElement) {
        roundList.replaceChildren();
        for (let i = 0; i < this.levelInfo.getRounds().length; i += 1) {
            const roundItem: HTMLLIElement = new Component('div', `round_${i}`, `Round ${i + 1}`, [
                'round-item',
            ]).getContainer<HTMLLIElement>();
            if (i === this.round) {
                roundItem.classList.add('round-selected');
            }
            roundList.append(roundItem);
            roundItem.addEventListener('click', (event) => this.roundClick.bind(this)(event));
        }
        isNull(this.levelRoundContainer);
        const roundButton: HTMLButtonElement | null = this.levelRoundContainer.querySelector('.round-button');
        isNull(roundButton);
        roundButton.textContent = `Round ${this.round + 1}`;
    }

    autoComplete() {
        if (this.countSentence < 10) {
            const cardsAnswer: HTMLDivElement[] = this.resultBlocks.filter((block) =>
                block.classList.contains('full-answer')
            );
            const cardsResources: HTMLDivElement[] = this.wordBlocks.filter((block) =>
                block.classList.contains('full-resource')
            );
            isNull(cardsResources);
            isNull(cardsResources);
            const cards: HTMLDivElement[] = [...cardsAnswer, ...cardsResources];
            cards.forEach((card) => {
                card.classList.add('full-answer');
                card.classList.remove('full-resource');
            });
            GameLogic.sortCards(cards);
            isNull(this.resultContainer);
            const sentenceContainer: NodeListOf<HTMLDivElement> =
                this.resultContainer.querySelectorAll('.sentence-block');
            const answers: HTMLDivElement = <HTMLDivElement>sentenceContainer[this.countSentence];
            answers.replaceChildren();
            answers.append(...cards);
            this.resultBlocks = [...cards];
            this.checkSentence();
            isNull(this.checkButton);
            this.checkButton.disabled = false;
            isNull(this.buttonAutoComplete);
            this.buttonAutoComplete.disabled = true;
        }
    }

    static sortCards(cards: HTMLDivElement[]) {
        cards.sort((a, b) => {
            const idA: number = Number(a.id.split('_').pop());
            const idB: number = Number(b.id.split('_').pop());
            return idA - idB;
        });
    }

    roundClick(event: Event) {
        const currentElem: HTMLLIElement = <HTMLLIElement>event.currentTarget;
        isNull(this.levelRoundContainer);
        const beforeSelected: HTMLLIElement | null = this.levelRoundContainer.querySelector('.round-selected');
        isNull(beforeSelected);
        beforeSelected.classList.remove('round-selected');
        currentElem.classList.add('round-selected');
        this.round = Number(currentElem.id.split('_').pop());
        const roundButton: HTMLButtonElement | null = this.levelRoundContainer.querySelector('.round-button');
        isNull(roundButton);
        roundButton.textContent = currentElem.textContent;
        this.levelRoundContainer.querySelector('.round-list')?.classList.remove('showed');
        this.initRound();
    }

    levelClick(event: Event) {
        const currentElem: HTMLLIElement = <HTMLLIElement>event.currentTarget;
        isNull(this.levelRoundContainer);
        const beforeSelected: HTMLLIElement | null = this.levelRoundContainer.querySelector('.level-selected');
        isNull(beforeSelected);
        beforeSelected.classList.remove('level-selected');
        currentElem.classList.add('level-selected');
        this.level = Number(currentElem.id.split('_').pop());
        const levelButton: HTMLButtonElement | null = this.levelRoundContainer.querySelector('.level-button');
        isNull(levelButton);
        levelButton.textContent = currentElem.textContent;
        this.levelRoundContainer.querySelector('.level-list')?.classList.remove('showed');
        this.round = 0;
        this.initLevel();
        const roundButton: HTMLButtonElement | null = this.levelRoundContainer.querySelector('.round-button');
        isNull(roundButton);
        roundButton.textContent = `Round ${this.round + 1}`;
    }

    initGameElement(
        resultContainer: HTMLDivElement,
        resourcesContainer: HTMLDivElement,
        checkButton: HTMLButtonElement,
        buttonAutoComplete: HTMLButtonElement,
        userIteractionContainer: HTMLDivElement,
        translateContainer: HTMLDivElement,
        audio: HTMLAudioElement
    ) {
        this.resultContainer = resultContainer;
        this.resourcesContainer = resourcesContainer;
        this.checkButton = checkButton;
        this.buttonAutoComplete = buttonAutoComplete;
        this.userIteractionContainer = userIteractionContainer;
        this.levelRoundContainer = userIteractionContainer.querySelector('.level-round-container');
        this.translateContainer = translateContainer;
        this.setCheckLogic();
        this.resourcesContainer.addEventListener('dragover', (event) => {
            event.preventDefault();
        });
        this.resourcesContainer.addEventListener('drop', (event) => {
            this.dropResourceEvent.bind(this)(event);
        });
        this.audio = audio;
        this.initLevel();
        const hideImgButton: HTMLButtonElement | null = userIteractionContainer.querySelector('.hide-img-button');
        isNull(hideImgButton);
        this.initEventHideImgButton(hideImgButton);
    }

    initEventHideImgButton(button: HTMLButtonElement) {
        button.addEventListener('click', () => {
            button.classList.toggle('active-hide-img');
            this.initHideImgButton(button);
        });
    }

    initHideImgButton(button: HTMLButtonElement) {
        const cardsAnswer: NodeListOf<HTMLDivElement> | undefined =
            this.resultContainer?.querySelectorAll('.full-answer');
        const cardsResources: NodeListOf<HTMLDivElement> | undefined =
            this.resourcesContainer?.querySelectorAll('.full-resource');
        isNull(cardsAnswer);
        isNull(cardsResources);
        const cards: HTMLDivElement[] = [...cardsAnswer, ...cardsResources];
        if (button.classList.contains('active-hide-img')) {
            cards.forEach((card) => {
                const copyCard = card;
                if (!copyCard.classList.contains('non-active')) {
                    copyCard.style.backgroundImage = '';
                }
            });
            localStorage.setItem('hideImg', 'off');
        } else {
            cards.forEach((card) => {
                const copyCard = card;
                copyCard.style.backgroundImage = `url(${IMG_PATH}${this.roundInfo.levelData.imageSrc})`;
            });
            localStorage.setItem('hideImg', 'on');
        }
    }

    createResourceBlocks() {
        isNull(this.resourcesContainer);
        this.resourcesContainer.replaceChildren();
        this.wordBlocks.length = 0;
        const countSymbols: number = this.resoucesSentence.join('').length;
        const coeffSymbol: number = 670 / countSymbols;
        let positionX: number = 0;
        this.resoucesSentence.forEach((word, index) => {
            const wordBlock: HTMLDivElement = new Component(
                'div',
                `${this.countSentence}_${index}`,
                word,
                ['word-block', 'full-resource'],
                { eventName: 'click', callback: (event) => this.wordClick(event) }
            ).getContainer<HTMLDivElement>();
            wordBlock.draggable = true;
            wordBlock.style.width = `${coeffSymbol * word.length}px`;
            wordBlock.addEventListener('dragstart', (event) => GameLogic.dragStart(event));
            wordBlock.addEventListener('dragend', (event) => this.dragEnd.bind(this)(event));
            this.wordBlocks.push(wordBlock);
            if (index === 0) {
                wordBlock.classList.add('start-puzzle');
            } else if (index === this.resoucesSentence.length - 1) {
                wordBlock.classList.add('end-puzzle');
            } else {
                wordBlock.classList.add('middle-puzzle');
            }
            wordBlock.style.backgroundImage = `url(${IMG_PATH}${this.roundInfo.levelData.imageSrc})`;
            wordBlock.style.backgroundSize = `${700}px ${400}px`;
            wordBlock.style.backgroundPosition = `-${positionX}px -${40 * this.countSentence}px`;
            positionX += coeffSymbol * word.length;
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
        isNull(this.checkButton);
        if (!checkState) {
            this.checkButton.disabled = false;
        } else {
            this.checkButton.disabled = true;
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
        isNull(this.audio);
        this.audio.src = `${AUDIO_PATH}${this.levelInfo.getRound(this.round).words[this.countSentence].audioExample}`;
        isNull(this.translateContainer);
        this.translateContainer.textContent = this.levelInfo.getRound(this.round).words[
            this.countSentence
        ].textExampleTranslate;
        const sentenceBlock: HTMLDivElement = new Component('div', '', '', [
            'sentence-block',
        ]).getContainer<HTMLDivElement>();
        isNull(this.resultContainer);
        sentenceBlock.style.height = `9%`;
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
        sentenceBlock.addEventListener('dragover', (event) => {
            event.preventDefault();
        });
        sentenceBlock.addEventListener('drop', (event) => {
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
        if (this.countSentence < 10) {
            const sentenceContainer: NodeListOf<HTMLDivElement> =
                this.resultContainer.querySelectorAll('.sentence-block');
            const answers: NodeList = sentenceContainer[this.countSentence].childNodes;
            let sequenceOrder = 0;
            if (this.countSentence < 10) {
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
            }
        }
        isNull(this.userIteractionContainer);
        const audioButton: HTMLButtonElement | null = this.userIteractionContainer.querySelector('.audio-button');
        const audioHideButton: HTMLButtonElement | null =
            this.userIteractionContainer.querySelector('.audio-hide-button');
        const translateButton: HTMLButtonElement | null =
            this.userIteractionContainer.querySelector('.translate-button');
        isNull(audioButton);
        isNull(audioHideButton);
        isNull(translateButton);
        isNull(this.translateContainer);
        if (this.continueState) {
            if (this.countSentence === 9) {
                this.checkButton.disabled = true;
                this.showFullImage();
                this.countSentence += 1;
                audioButton.classList.remove('show');
                this.translateContainer.classList.remove('show');
                localStorage.setItem('level_round', `${this.level}_${this.round}`);
                this.showFullImage();
            } else {
                if (this.countSentence === 10) {
                    GameLogic.addClassIfContains(audioHideButton, audioButton, 'active-button', 'show');
                    GameLogic.addClassIfContains(translateButton, this.translateContainer, 'active-button', 'show');
                } else {
                    GameLogic.removeClassIfNotContains(audioHideButton, audioButton, 'active-button', 'show');
                    GameLogic.removeClassIfNotContains(
                        translateButton,
                        this.translateContainer,
                        'active-button',
                        'show'
                    );
                    this.resultContainer.classList.remove('full-result');
                }
                this.nextSentence();
                trueValues = 0;
                isNull(this.buttonAutoComplete);
                this.buttonAutoComplete.disabled = false;
            }
        }
        if (trueValues === this.resultBlocks.length && !this.continueState) {
            this.resultBlocks.forEach((block: HTMLDivElement) => {
                const temp: HTMLDivElement = block;
                temp.classList.add('non-active');
                temp.draggable = false;
                temp.style.backgroundImage = `url(${IMG_PATH}${this.roundInfo.levelData.imageSrc})`;
            });
            this.continueState = true;
            this.checkButton.textContent = 'Continue';
            audioButton.classList.add('show');
            this.translateContainer.classList.add('show');
        }
    }

    showFullImage() {
        const cards: NodeListOf<HTMLDivElement> | undefined = this.resultContainer?.querySelectorAll('.full-answer');
        isNull(cards);
        isNull(this.resultContainer);
        this.resultContainer.classList.add('full-result');
        cards.forEach((card) => {
            card.classList.add('hide-card');
        });
        setTimeout(this.setFullImgContainer.bind(this), 2000);
    }

    setFullImgContainer() {
        this.resultContainer?.replaceChildren();
        const fullImgContainer: HTMLDivElement = new Component('div', '', '', [
            'full-img-container',
        ]).getContainer<HTMLDivElement>();
        const imgContainer: HTMLDivElement = new Component('div', '', '', [
            'img-container',
        ]).getContainer<HTMLDivElement>();
        imgContainer.style.backgroundImage = `url(${IMG_PATH}${this.roundInfo.levelData.imageSrc})`;
        const infoContainer: HTMLDivElement = new Component('div', '', '', [
            'info-container',
        ]).getContainer<HTMLDivElement>();
        const author: HTMLDivElement = new Component('div', '', '', ['author']).getContainer<HTMLDivElement>();
        author.textContent = this.roundInfo.levelData.author;
        const nameYear: HTMLDivElement = new Component('div', '', '', ['name-year']).getContainer<HTMLDivElement>();
        nameYear.textContent = `${this.roundInfo.levelData.name} (${this.roundInfo.levelData.year})`;
        infoContainer.append(author, nameYear);
        fullImgContainer.append(imgContainer, infoContainer);
        this.resultContainer?.append(fullImgContainer);
        imgContainer.classList.add('active-full-img');
        isNull(this.checkButton);
        this.checkButton.disabled = false;
    }

    static removeClassIfNotContains(
        element: HTMLElement,
        container: HTMLElement,
        classContainsName: string,
        className: string
    ) {
        if (!element.classList.contains(classContainsName)) {
            container.classList.remove(className);
        }
    }

    static addClassIfContains(
        element: HTMLElement,
        container: HTMLElement,
        classContainsName: string,
        className: string
    ) {
        if (element.classList.contains(classContainsName)) {
            container.classList.add(className);
        }
    }

    nextSentence() {
        this.countSentence += 1;
        if (this.countSentence < 10) {
            this.goToNextSentence();
        } else {
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
        isNull(this.userIteractionContainer);
        const hideImgButton: HTMLButtonElement | null = this.userIteractionContainer.querySelector('.hide-img-button');
        isNull(hideImgButton);
        this.initHideImgButton(hideImgButton);
    }

    goToNextRound() {
        this.resourcesContainer?.replaceChildren();
        this.resultContainer?.replaceChildren();
        if (this.round < this.levelInfo.getRounds().length - 1) {
            this.round += 1;
            this.roundInfo = this.levelInfo.getRound(this.round);
            this.changeRound();
            this.initRound();
        } else if (this.level < 6) {
            this.level += 1;
            this.round = 0;
            this.changeLevel();
            this.changeRound();
        } else if (this.level === 6) {
            this.level = 1;
            this.round = 0;
            this.changeLevel();
            this.changeRound();
        }
        this.goToNextSentence();
    }

    changeRound() {
        isNull(this.levelRoundContainer);
        const beforeSelected: HTMLLIElement | null = this.levelRoundContainer.querySelector('.round-selected');
        isNull(beforeSelected);
        beforeSelected.classList.remove('round-selected');
        const newRound: HTMLLIElement | null = this.levelRoundContainer.querySelector(`#round_${this.round}`);
        isNull(newRound);
        newRound.classList.add('round-selected');
        const roundButton: HTMLButtonElement | null = this.levelRoundContainer.querySelector('.round-button');
        isNull(roundButton);
        roundButton.textContent = `Round ${this.round + 1}`;
    }

    changeLevel() {
        isNull(this.levelRoundContainer);
        const beforeSelected: HTMLLIElement | null = this.levelRoundContainer.querySelector('.level-selected');
        isNull(beforeSelected);
        beforeSelected.classList.remove('level-selected');
        const newRound: HTMLLIElement | null = this.levelRoundContainer.querySelector(`#level_${this.level}`);
        isNull(newRound);
        newRound.classList.add('level-selected');
        const levelButton: HTMLButtonElement | null = this.levelRoundContainer.querySelector('.level-button');
        isNull(levelButton);
        levelButton.textContent = `level ${this.level}`;
        this.initLevel();
    }
}
