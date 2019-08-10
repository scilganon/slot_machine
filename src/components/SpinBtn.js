import * as PIXI from 'pixi.js';
import { btnTextures } from '../textures';

export class SpinBtn extends PIXI.Sprite {
	constructor(texture = btnTextures[1]) {
		super(texture);

		this.enable();
	}

	disable() {
		this.interactive = false;
		this.buttonMode = false;
		this.texture = btnTextures[1];
	}

	enable() {
		this.interactive = true;
		this.buttonMode = true;
		this.texture = btnTextures[0];
	}
}
