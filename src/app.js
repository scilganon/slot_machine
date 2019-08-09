import * as PIXI from "pixi.js";
import {SPINS, SYMBOLS, BG, WILD_SYMBOL } from "./config";
import { SpinBtn } from "./components/SpinBtn";
import { WinMsg } from "./components/WinMsg";
import { LoadingMsg } from "./components/LoadingMsg";
import { Roller } from "./components/ReelContainer";

// for debug in chrome
// @see https://github.com/bfanger/pixi-inspector/issues/35#issuecomment-518009811
PIXI.useDeprecated();
window.__PIXI_INSPECTOR_GLOBAL_HOOK__ &&
window.__PIXI_INSPECTOR_GLOBAL_HOOK__.register({ PIXI: PIXI });

const app = new PIXI.Application({
    backgroundColor: 0xffffff,
    width: 960,
    height: 536,
});

document.body.appendChild(app.view);

SYMBOLS
    .concat(SPINS)
    .concat([BG, WILD_SYMBOL])
    .forEach((path) => app.loader.add(path, path));

app.loader
    .load(() => setTimeout(onAssetsLoaded, 200));

const loadingMsg = new LoadingMsg();
loadingMsg.x = (app.screen.width - loadingMsg.width ) / 2;
loadingMsg.y = (app.screen.height - loadingMsg.height ) / 2;

app.stage.addChild(loadingMsg);

const winMsg = new WinMsg({
    color: 0x00ff00,
    height: 360,
    width: 720,
    y: 110,
    x: 70
});

function onAssetsLoaded() {
    loadingMsg.destroy();

    const background = PIXI.Sprite.from(BG);
    background.x = 0;
    background.y = 0;
    app.stage.addChild(background);


    const reelContainer = new Roller();
    reelContainer.y = - app.screen.height / 2;
    reelContainer.x = 70;
    app.stage.addChild(reelContainer);

    //interactive btn
    const innerMargin = 10;
    const spinBtn = new SpinBtn();
    spinBtn.x = app.screen.width - spinBtn.width - 28 - innerMargin;
    spinBtn.y = (app.screen.height - spinBtn.width) / 2;
    spinBtn.addListener('pointerdown', () => startPlay());

    app.stage.addChild(spinBtn);

    winMsg.addListener('pointerdown', () => hideWinMsg());

    function hideWinMsg() {
        app.stage.removeChild(winMsg);
        spinBtn.enable();
    }

    function showWinMsg(){
        spinBtn.disable();
        app.stage.addChild(winMsg);

        setTimeout(() => hideWinMsg(), 3000);
    }

    let running = false;

    async function startPlay() {
        if (running) return;
        running = true;
        spinBtn.disable();

        await reelContainer.roll();
        reelsComplete();
    }

    function isWon(){
        const symbols = reelContainer.getCurrentCombinationOnPosition(4);
        const countOfWilds = symbols.filter((symbol) => symbol.isWild()).length;

        return countOfWilds > 0 && countOfWilds < 3;
    }

    // Reels done handler.
    function reelsComplete() {
        running = false;
        spinBtn.enable();

        if(isWon()){
            showWinMsg();
        }
    }

    app.ticker.add((delta) => reelContainer.tickUpdateSymbols());
    app.ticker.add((delta) => reelContainer.tickAnimationUpdate());
}
