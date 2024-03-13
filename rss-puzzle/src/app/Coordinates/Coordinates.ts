export default class Coordinates {
    static setCoordination(x1: number, x2: number) {
        return x2 - x1;
    }

    static animateBlock(blockTo: HTMLDivElement, blockFrom: HTMLDivElement, time: number) {
        blockFrom.animate(
            [
                {
                    transform: `translate(${Coordinates.setCoordination(blockFrom.offsetLeft, blockTo.offsetLeft)}px, ${Coordinates.setCoordination(blockFrom.offsetTop, blockTo.offsetTop)}px)`,
                },
            ],
            time
        );
    }
}
