import { EventSubscribersRegistry } from '../registries/EventSubscribersRegistry.js'
import {FileRegistry} from "../registries/FileRegistry";

export class RegistryContainer {

    static file_registry = null;
    static column_registry = null;

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

    static setCustomColumnRegistry(column_registry) {
        RegistryContainer.column_registry = column_registry;
    }

    static getCustomColumnRegistry() {
        return RegistryContainer.column_registry;
    }

}