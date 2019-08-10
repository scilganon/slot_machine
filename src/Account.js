const STORAGE_KEY = "demo_account";
const BET_VALUE = 5;

export function chargeDemoWin(){
    const current = +localStorage.getItem(STORAGE_KEY);
    localStorage.setItem(STORAGE_KEY, current + BET_VALUE*2);
}

export function initDemoAccount() {
    if(!localStorage.hasOwnProperty(STORAGE_KEY)) {
        localStorage.setItem(STORAGE_KEY, 100);
    }
}

export class Account {

    constructor() {
        this.coins = 0;
    }

    async load() {
        this.coins = +localStorage.getItem(STORAGE_KEY);
    }

    async makeBet() {
        if(this.coins - BET_VALUE < 0) {
            return Promise.reject(new Error("Not enough cash"));
        }

        localStorage.setItem(STORAGE_KEY, this.coins - BET_VALUE);
        this.coins -= BET_VALUE;
    }
}