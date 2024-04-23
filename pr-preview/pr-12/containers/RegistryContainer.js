class RegistryContainer {

    constructor() {

    }

    getEventSubscribersRegistry() {
        return new EventSubscribersRegistry();
    }

    static getRegistryContainer() {
        return new RegistryContainer();
    }

}