import * as PIXI from 'pixi.js';
import { slotTextures } from '../textures';
import { WILD_SYMBOL } from '../config';

export const SYMBOL_SIZE = 233;

export class Symbol extends PIXI.Sprite {
	constructor(texture) {
		super(texture);

		if (!texture) {
			this.setRandomTexture();
		}
	}

	setRandomTexture() {
		this.texture =
			slotTextures[Math.floor(Math.random() * slotTextures.length)];
		this.scale.x = this.scale.y = Math.min(
			SYMBOL_SIZE / this.texture.width,
			SYMBOL_SIZE / this.texture.height,
		);
	}

	isWild() {
		return this.texture.textureCacheIds[0] === WILD_SYMBOL;
	}
}
