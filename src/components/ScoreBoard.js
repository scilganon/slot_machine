import * as PIXI from "pixi.js";

export class ScoreBoard extends PIXI.Container {

    constructor() {
        super();

        let bgGraphics = this.bg = new PIXI.Graphics();
        bgGraphics.beginFill(0xcccccc, .5);
        bgGraphics.drawRect(0, 0, 118, 60);
        bgGraphics.endFill();
        bgGraphics.alpha = .5;
        this.addChild(bgGraphics);

        let style = new PIXI.TextStyle({
            fontSize: 15,
            stroke: 0xffff00,
        });

        this.moneyText = new PIXI.Text("...", style);
        this.moneyText.x = 3;
        this.moneyText.y = 10;
        this.addChild(this.moneyText);

        this.winsText = new PIXI.Text("...", style);
        this.winsText.x = 3;
        this.winsText.y = 30;
        this.addChild(this.winsText);
    }

    set width(v){
        this.bg.width = v;
    }

    updateWins(count){
        this.winsText.text = `WIN: ${count}`;
    }

    //what if amount > 999? increase size of box, or use shortness?
    updateMoney(amount){
        this.moneyText.text = `MONEY: $${amount}`;
    }
}