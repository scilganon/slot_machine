import * as PIXI from "pixi.js";
import {btnTextures} from "./textures";

export const spinBtn = PIXI.Sprite.from(btnTextures[1]);
spinBtn.interactive = true;
spinBtn.buttonMode = true;
spinBtn.addListener('pointerover', () => {
    spinBtn.texture = btnTextures[0];
});
spinBtn.addListener('pointerout', () => {
    spinBtn.texture = btnTextures[1];
});