// Create different slot symbols.
import {SPINS, SYMBOLS} from "./config";
import * as PIXI from "pixi.js";

export const slotTextures = SYMBOLS.map((symbol) => PIXI.Texture.from(symbol));
export const btnTextures = SPINS.map((spin) => PIXI.Texture.from(spin));
