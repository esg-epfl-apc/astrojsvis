import {RegistryContainer} from "../containers/RegistryContainer";

export class ArithmeticColumnChangeEvent {

    static defaultOptions = {
        bubbles: true,
        composed: true
    };

    static name = "arithmetic-column-change";
    static main_root_id = 'jsvis-main';
    static main_root_element = null;

    event = null;

    constructor(detail = {}, options = {}) {

        this.detail = { ...detail };
        this.options = { ...ArithmeticColumnChangeEvent.defaultOptions, ...options };

        this.event = new CustomEvent(ArithmeticColumnChangeEvent.name, {
            detail: this.detail,
            ...this.options
        });
    }

    dispatchToTarget(target) {
        target.dispatchEvent(this.event);
    }

    dispatchToMainRoot() {
        if(ArithmeticColumnChangeEvent.main_root_element === null) {
            ArithmeticColumnChangeEvent.main_root_element = document.getElementById(ArithmeticColumnChangeEvent.main_root_id);
        }
        
        document.dispatchEvent(this.event);
    }

    dispatchToSubscribers() {
        let esr = RegistryContainer.getRegistryContainer().getEventSubscribersRegistry();
        let subscribers_id = esr.getSubscribersForEvent(ArithmeticColumnChangeEvent.name);

        let subscriber_element = null;
        subscribers_id.forEach((subscriber_id) => {
            subscriber_element = document.getElementById(subscriber_id);
            subscriber_element.dispatchEvent(this.event);
        })
    }
}
