import * as PIXI from 'pixi.js';

export class WinMsg extends PIXI.Container {
	constructor({ color, width, height, x, y }) {
		super();

		this.x = 0;
		this.y = 0;

		this.interactive = true;
		this.buttonMode = true;

		let bgGraphics = new PIXI.Graphics();
		bgGraphics.beginFill(color, 1);
		bgGraphics.drawRect(x, y, width, height);
		bgGraphics.endFill();
		bgGraphics.alpha = 0.5;
		this.addChild(bgGraphics);

		let style = new PIXI.TextStyle({
			fontSize: 100,
			stroke: 0xffff00,
		});

		let text = new PIXI.Text('YOU WON!', style);
		text.x = x + (width - text.width) / 2;
		text.y = y + (height - text.height) / 2;
		this.addChild(text);
	}
}
