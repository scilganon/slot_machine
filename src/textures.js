// Create different slot symbols.
import {SPINS, SYMBOLS, WILD_SYMBOL} from "./config";
import * as PIXI from "pixi.js";

export const slotTextures = SYMBOLS.concat([WILD_SYMBOL]).map((symbol) => PIXI.Texture.from(symbol));
export const btnTextures = SPINS.map((spin) => PIXI.Texture.from(spin));
