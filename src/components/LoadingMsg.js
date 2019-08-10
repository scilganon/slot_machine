import * as PIXI from 'pixi.js';

export class LoadingMsg extends PIXI.Text {
	constructor(text, style, canvas) {
		super(text || 'Loading game...', style, canvas);
	}
}
