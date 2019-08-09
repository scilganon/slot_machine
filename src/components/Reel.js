import * as PIXI from "pixi.js";
import { slotTextures} from "../textures";
import { Symbol, SYMBOL_SIZE } from "./Symbol";

export const REEL_WIDTH = 233;
export const SYMBOLS_PER_REEL = slotTextures.length;


export class Reel {
    constructor() {
        this.container = new PIXI.Container();
        this.symbols = [];
        this.position = 0;
        this.previousPosition = 0;
        this.blur = new PIXI.filters.BlurFilter();

        this.blur.blurX = 0;
        this.blur.blurY = 0;
        this.container.filters = [this.blur];

        for (let j = 0; j < SYMBOLS_PER_REEL; j++) {
            const symbol = new Symbol();
            symbol.y = j * SYMBOL_SIZE;
            symbol.x = Math.round((SYMBOL_SIZE - symbol.width) / 2);
            this.symbols.push(symbol);
            this.container.addChild(symbol);
        }
    }
}
