class EventSubscribersRegistry {

    static events_subscribers = {
        'fits-loaded': ['settings-component', 'file-component'],
        'configuration': ['settings-component'],
        'file-loaded': ['file-component'],
        'file-selected': ['header-component', 'data-component', 'settings-component'],
        'file-registry-change': ['header-component', 'data-component', 'settings-component', 'file-component']
    }

    constructor() {

    }

    getSubscribersForEvent(event_name) {
        if(EventSubscribersRegistry.events_subscribers.hasOwnProperty(event_name)) {
            return EventSubscribersRegistry.events_subscribers[event_name];
        } else {
            throw new EventNotFoundInRegistryError("Event not found : " + event_name);
        }
    }

}