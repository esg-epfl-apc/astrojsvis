import { EventSubscribersRegistry } from '../registries/EventSubscribersRegistry.js'
import {FileRegistry} from "../registries/FileRegistry";

export class RegistryContainer {

    static file_registry = null;

    constructor() {

    }

    getEventSubscribersRegistry() {
        return new EventSubscribersRegistry();
    }

    getFileRegistry() {
        return RegistryContainer.file_registry;
    }

    static setFileRegistry(file_registry) {
        RegistryContainer.file_registry = file_registry;
    }

    static getRegistryContainer() {
        return new RegistryContainer();
    }

}