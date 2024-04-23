class EventSubscribersRegistry {

    static events_subscribers = {
        'fits-loaded': ['header-component', 'data-component', 'settings-component'],
        'configuration': ['settings-component']
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