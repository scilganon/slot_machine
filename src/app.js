import * as PIXI from "pixi.js";
import {backout, lerp} from "./math";
import {SPINS, SYMBOLS, BG, WILD_SYMBOL } from "./config";
import { spinBtn } from "./spinButton";
import { createReel, SYMBOL_SIZE, REEL_WIDTH, SYMBOLS_PER_REEL } from "./reel";
import {slotTextures} from "./textures";

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

const WILD_CACHE_KEY = 'wild';

SYMBOLS
    .concat(SPINS)
    .concat(BG)
    .forEach((path) => app.loader.add(path, path));

app.loader
    .add(WILD_CACHE_KEY, WILD_SYMBOL)
    .load(() => setTimeout(onAssetsLoaded, 200));

const REEL_COUNT = 3;

const loadingMsg = new PIXI.Text('Loading game...');
loadingMsg.x = (app.screen.width - loadingMsg.width ) / 2;
loadingMsg.y = (app.screen.height - loadingMsg.height ) / 2;

app.stage.addChild(loadingMsg);

// onAssetsLoaded handler builds the example.
function onAssetsLoaded() {
    loadingMsg.destroy();

    const background = PIXI.Sprite.from('assets/BG.png');
    background.x = 0;
    background.y = 0;
    app.stage.addChild(background);

    // Build the reels
    const reels = [];
    window.reels = reels; //@TODO: remove
    const reelContainer = new PIXI.Container();
    for (let i = 0; i < REEL_COUNT; i++) {
        const reel = createReel();

        reel.container.x = i * (REEL_WIDTH + 8 * (i > 0));

        reels.push(reel);
        reelContainer.addChild(reel.container);
    }
    reelContainer.y = - app.screen.height / 2;
    reelContainer.x = 70;
    app.stage.addChild(reelContainer);

    //interactive btn
    const innerMargin = 10;
    spinBtn.x = app.screen.width - spinBtn.width - 28 - innerMargin;
    spinBtn.y = (app.screen.height - spinBtn.width) / 2;
    spinBtn.addListener('pointerdown', () => startPlay());

    app.stage.addChild(spinBtn);

    let running = false;

    // Function to start playing.
    function startPlay() {
        if (running) return;
        running = true;

        for (let i = 0; i < reels.length; i++) {
            const currentReel = reels[i];
            const extra = Math.floor(Math.random() * 3);
            const target = currentReel.position + 10 + i * 5 + extra;
            const time = 2500 + i * 600 + extra * 600;
            tweenTo(currentReel, 'position', target, time, backout(0.5), null, i === reels.length - 1 ? reelsComplete : null);
        }
    }

    function isWon(){
        const combination = reels
            .map((reel) => Math.floor((reel.position + 4) % SYMBOLS_PER_REEL)) // position of prev 4th symbol
            .map((pos) =>  4 + SYMBOLS_PER_REEL * (pos > 4) - pos) // dist between 4th and current
            .map((dist) => (4 + dist) % SYMBOLS_PER_REEL) // pos of current 4th
            .map((pos, index) => reels[index].symbols[pos].texture.textureCacheIds[0]);

        const countOfWilds = combination.filter((cacheKey) => cacheKey === WILD_CACHE_KEY).length;

        return countOfWilds > 0 && countOfWilds < 3;
    }

    // Reels done handler.
    function reelsComplete() {
        running = false;

        if(isWon()){
            alert("WIN")
        }
    }

    // Listen for animate update.
    app.ticker.add((delta) => {
        // Update the slots.
        for (let i = 0; i < reels.length; i++) {
            const currentReel = reels[i];
            // Update blur filter y amount based on speed.
            // This would be better if calculated with time in mind also. Now blur depends on frame rate.
            currentReel.blur.blurY = (currentReel.position - currentReel.previousPosition) * 8;
            currentReel.previousPosition = currentReel.position;

            // Update symbol positions on reel.
            for (let j = 0; j < currentReel.symbols.length; j++) {
                const symbol = currentReel.symbols[j];
                const prevY = symbol.y;
                symbol.y = ((currentReel.position + j) % currentReel.symbols.length) * SYMBOL_SIZE - SYMBOL_SIZE;
                if (symbol.y < 0 && prevY > SYMBOL_SIZE) {
                    // Detect going over and swap a texture.
                    // This should in proper product be determined from some logical reel.
                    symbol.texture = slotTextures[Math.floor(Math.random() * slotTextures.length)];
                    symbol.scale.x = symbol.scale.y = Math.min(SYMBOL_SIZE / symbol.texture.width, SYMBOL_SIZE / symbol.texture.height);
                    symbol.x = Math.round((SYMBOL_SIZE - symbol.width) / 2);
                }
            }
        }
    });
}

// Very simple tweening utility function. This should be replaced with a proper tweening library in a real product.
const tweening = [];
function tweenTo(object, property, target, time, easing, onchange, oncomplete) {
    const tween = {
        object,
        property,
        propertyBeginValue: object[property],
        target,
        easing,
        time,
        change: onchange,
        complete: oncomplete,
        start: Date.now(),
    };

    tweening.push(tween);
    return tween;
}
// Listen for animate update.
app.ticker.add((delta) => {
    const now = Date.now();
    const remove = [];
    for (let i = 0; i < tweening.length; i++) {
        const t = tweening[i];
        const phase = Math.min(1, (now - t.start) / t.time);

        t.object[t.property] = lerp(t.propertyBeginValue, t.target, t.easing(phase));
        if (t.change) t.change(t);
        if (phase === 1) {
            t.object[t.property] = t.target;
            if (t.complete) t.complete(t);
            remove.push(t);
        }
    }
    for (let i = 0; i < remove.length; i++) {
        tweening.splice(tweening.indexOf(remove[i]), 1);
    }
});

