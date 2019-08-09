import * as PIXI from "pixi.js";
import {Reel, REEL_WIDTH, SYMBOLS_PER_REEL} from "./Reel";

export class Roller extends PIXI.Container {

    constructor(count = 3) {
        super();

        this.reels = [];
        for (let i = 0; i < count; i++) {
            const reel = new Reel();

            reel.container.x = i * (REEL_WIDTH + 8 * (i > 0));

            this.reels.push(reel);
            this.addChild(reel.container);
        }
    }

    getCurrentCombination(){
        return this.reels
            .map((reel) => Math.floor((reel.position + 4) % SYMBOLS_PER_REEL)) // position of prev 4th symbol
            .map((pos) =>  4 + SYMBOLS_PER_REEL * (pos > 4) - pos) // dist between 4th and current
            .map((dist) => (4 + dist) % SYMBOLS_PER_REEL) // pos of current 4th
            .map((pos, index) => this.reels[index].symbols[pos]);
    }
}