import * as PIXI from 'pixi.js';
import { Reel, REEL_WIDTH, SYMBOLS_PER_REEL } from './Reel';
import { SYMBOL_SIZE } from './Symbol';
import { backout, lerp } from '../utils/math';

const tweening = [];
// Very simple tweening utility function. This should be replaced with a proper tweening library in a real product.
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

export class Roller extends PIXI.Container {
	constructor(count = 3) {
		super();

		this.reels = [];
		for (let i = 0; i < count; i++) {
			const reel = new Reel();

			reel.container.x = i * (REEL_WIDTH + 8 * (i > 0));

			this.reels.push(reel);
			this.addChild(reel.container);
		}
	}

	async roll() {
		return new Promise(resolve => {
			for (let i = 0; i < this.reels.length; i++) {
				const currentReel = this.reels[i];
				const extra = Math.floor(Math.random() * 3);
				const target = currentReel.position + 10 + i * 5 + extra;
				const time = 2500 + i * 600 + extra * 600;
				tweenTo(
					currentReel,
					'position',
					target,
					time,
					backout(0.5),
					null,
					i === this.reels.length - 1 ? resolve : null,
				);
			}
		});
	}

	getCurrentCombinationOnPosition(winPosition) {
		return this.reels
			.map(reel => Math.floor((reel.position + winPosition) % SYMBOLS_PER_REEL)) // position of prev 4th symbol
			.map(pos => winPosition + SYMBOLS_PER_REEL * (pos > winPosition) - pos) // dist between 4th and current
			.map(dist => (winPosition + dist) % SYMBOLS_PER_REEL) // pos of current 4th
			.map((pos, index) => this.reels[index].symbols[pos]);
	}

	tickUpdateSymbols() {
		for (let i = 0; i < this.reels.length; i++) {
			const currentReel = this.reels[i];
			// Update blur filter y amount based on speed.
			// This would be better if calculated with time in mind also. Now blur depends on frame rate.
			currentReel.blur.blurY =
				(currentReel.position - currentReel.previousPosition) * 8;
			currentReel.previousPosition = currentReel.position;

			// Update symbol positions on reel.
			for (let j = 0; j < currentReel.symbols.length; j++) {
				const symbol = currentReel.symbols[j];
				const prevY = symbol.y;
				symbol.y =
					((currentReel.position + j) % currentReel.symbols.length) *
						SYMBOL_SIZE -
					SYMBOL_SIZE;
				if (symbol.y < 0 && prevY > SYMBOL_SIZE) {
					// Detect going over and swap a texture.
					// This should in proper product be determined from some logical reel.
					symbol.setRandomTexture();
					symbol.scale.x = symbol.scale.y = Math.min(
						SYMBOL_SIZE / symbol.texture.width,
						SYMBOL_SIZE / symbol.texture.height,
					);
					symbol.x = Math.round((SYMBOL_SIZE - symbol.width) / 2);
				}
			}
		}
	}

	// Listen for animate update.
	// how does it work???? o_0
	tickAnimationUpdate() {
		const now = Date.now();
		const remove = [];
		for (let i = 0; i < tweening.length; i++) {
			const t = tweening[i];
			const phase = Math.min(1, (now - t.start) / t.time);

			t.object[t.property] = lerp(
				t.propertyBeginValue,
				t.target,
				t.easing(phase),
			);
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
	}
}
