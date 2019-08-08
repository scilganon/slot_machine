import * as PIXI from "pixi.js";
import { slotTextures} from "./textures";

export const SYMBOL_SIZE = 233;
export const REEL_WIDTH = 233;

export function createReel() {
    const rc = new PIXI.Container();
    const reel = {
        container: rc,
        symbols: [],
        position: 0,
        previousPosition: 0,
        blur: new PIXI.filters.BlurFilter(),
    };
    reel.blur.blurX = 0;
    reel.blur.blurY = 0;
    rc.filters = [reel.blur];

// Build the symbols
    for (let j = 0; j < slotTextures.length; j++) {
        const symbol = new PIXI.Sprite(slotTextures[Math.floor(Math.random() * slotTextures.length)]);
        // Scale the symbol to fit symbol area.
        symbol.y = j * SYMBOL_SIZE;
        symbol.x = Math.round((SYMBOL_SIZE - symbol.width) / 2);
        reel.symbols.push(symbol);
        rc.addChild(symbol);
    }

    return reel;
}