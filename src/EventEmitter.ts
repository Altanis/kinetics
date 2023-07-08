/** Polyfill for an event emitter. */
export default class EventEmitter {
    private events: { [key: string]: Function[] } = {};

    /** Adds a listener for an event. */
    public on(event: string, listener: Function) {
        if (!this.events[event]) this.events[event] = [];
        this.events[event].push(listener);
    }

    /** Emits an event. */
    public emit(event: string, ...args: any[]) {
        if (!this.events[event]) return;
        for (const listener of this.events[event]) {
            listener(...args);
        }
    }
};