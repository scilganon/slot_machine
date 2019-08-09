import * as PIXI from "pixi.js";

export function createWinMsg({ color, width, height, x, y }) {
    let container = new PIXI.Container();
    container.x = 0;
    container.y = 0;

    container.interactive = false;
    container.buttonMode = false;
    container.visible = false;

    let bgGraphics = new PIXI.Graphics();
    bgGraphics.beginFill(color, 1);
    bgGraphics.drawRect(x, y, width, height);
    bgGraphics.endFill();
    bgGraphics.alpha = .5;
    container.addChild(bgGraphics);

    let style = new PIXI.TextStyle({
        fontSize: 100,
        stroke: 0xffff00
    });

    let text = new PIXI.Text('YOU WON!', style);
    text.x = x + (width - text.width) / 2;
    text.y = y + (height - text.height) / 2;
    container.addChild(text);

    return container;
}