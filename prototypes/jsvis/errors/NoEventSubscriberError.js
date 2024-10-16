export class NoEventSubscriberError extends Error {
    constructor(message) {
        super(message);
        this.name = "NoEventSubscriberError";
    }
}