import { makeAutoObservable } from 'mobx';

export class PendingStore {
    private _isPending = false;

    constructor() {
        makeAutoObservable(this);
    }

    set isPending(value: boolean) {
        // This setter is a MobX action to handle property changes correctly.
        this._isPending = value;
    }

    get isPending() {
        return this._isPending;
    }
}
