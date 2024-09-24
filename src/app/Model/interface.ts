export interface WordInterface {
    audioExample: string;
    textExample: string;
    textExampleTranslate: string;
    id: number;
    word: string;
    wordTranslate: string;
}

export interface LevelDataInterface {
    id: string;
    name: string;
    imageSrc: string;
    cutSrc: string;
    author: string;
    year: string;
}

export interface RoundInterface {
    levelData: LevelDataInterface;
    words: WordInterface[];
}
