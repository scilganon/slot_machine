// Basic lerp funtion.
export function lerp(a1, a2, t) {
	return a1 * (1 - t) + a2 * t;
}

// Backout function from tweenjs.
// https://github.com/CreateJS/TweenJS/blob/master/src/tweenjs/Ease.js
export function backout(amount) {
	return t => --t * t * ((amount + 1) * t + amount) + 1;
}
