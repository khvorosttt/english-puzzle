import dataLeve1 from '../data/wordCollectionLevel1.json';
import dataLevel2 from '../data/wordCollectionLevel2.json';
import dataLevel3 from '../data/wordCollectionLevel3.json';
import dataLevel4 from '../data/wordCollectionLevel4.json';
import dataLevel5 from '../data/wordCollectionLevel5.json';
import dataLevel6 from '../data/wordCollectionLevel6.json';
import { RoundInterface } from './interface';

export default class LevelInfoModel {
    rounds: RoundInterface[];

    constructor(level: number) {
        this.rounds = LevelInfoModel.setData(level);
    }

    static setData(level: number) {
        switch (level) {
            case 1:
                return dataLeve1.rounds;
            case 2:
                return dataLevel2.rounds;
            case 3:
                return dataLevel3.rounds;
            case 4:
                return dataLevel4.rounds;
            case 5:
                return dataLevel5.rounds;
            default:
                return dataLevel6.rounds;
        }
    }

    getRound(round: number) {
        return this.rounds[round];
    }
}
