import {RegistryContainer} from "../containers/RegistryContainer";
import {NoEventSubscriberError} from "../errors/NoEventSubscriberError";

export class FileRegistryChangeEvent {

    static defaultOptions = {
        bubbles: true,
        composed: true
    };

    static name = "file-registry-change";
    static main_root_id = 'jsvis-main';
    static main_root_element = null;

    event = null;

    constructor(detail = {}, options = {}) {

        this.detail = { ...detail };
        this.options = { ...FileRegistryChangeEvent.defaultOptions, ...options };

        this.event = new CustomEvent(FileRegistryChangeEvent.name, {
            detail: this.detail,
            ...this.options
        });
    }

    dispatchToTarget(target) {
        target.dispatchEvent(this.event);
    }

    dispatchToMainRoot() {
        if(FileRegistryChangeEvent.main_root_element === null) {
            FileRegistryChangeEvent.main_root_element = document.getElementById(FileRegistryChangeEvent.main_root_id);
        }
        
        document.dispatchEvent(this.event);
    }

    dispatchToSubscribers() {
        let esr = RegistryContainer.getRegistryContainer().getEventSubscribersRegistry();
        let subscribers_id = esr.getSubscribersForEvent(FileRegistryChangeEvent.name);

        let subscriber_element = null;
        try {
            subscribers_id.forEach((subscriber_id) => {
                subscriber_element = document.getElementById(subscriber_id);
                subscriber_element.dispatchEvent(this.event);
            })
        } catch(e) {
            if(subscribers_id.length <= 0) {
                throw new NoEventSubscriberError();
            }
        }
    }
}
