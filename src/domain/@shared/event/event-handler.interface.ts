// Interface related with handle the events

import EventInterface from './event.interface';

export default interface EventHandlerInterface<T extends EventInterface=EventInterface> {
    handler(event: T): void;
}