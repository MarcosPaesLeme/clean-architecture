import CustomerChangeAddressEvent from '../@shared/customer/customer-change-address.event';
import CustomerCreatedEvent from '../@shared/customer/customer-created.event';
import CustomerChangeEventHandler from '../@shared/customer/handler/customer-change-address.handler';
import FirstCustomerCreateEventHandler from '../@shared/customer/handler/first-customer-create.handler';
import SecondCustomerCreateEventHandler from '../@shared/customer/handler/second-customer-create.handler';
import EventDispatcher from '../@shared/event/event-dispatcher';

import Address from './address';

export default class Customer {

    private _id: string;
    private _name: string = "";
    private _address!: Address;
    private _active: boolean = false;
    private _rewardPoints: number = 0;
    // Creating the event dispatcher
    private _eventDispatcher: EventDispatcher;

    constructor(id: string, name: string) {
        this._id = id;
        this._name = name;
        this.validate();

        // Implementing create events
        this._eventDispatcher = new EventDispatcher();
        const firstCreateEventHandler = new FirstCustomerCreateEventHandler();
        const secondCreateEventHandler = new SecondCustomerCreateEventHandler();

        // Registering the events
        this._eventDispatcher.register("CustomerCreatedEvent", firstCreateEventHandler);
        this._eventDispatcher.register("CustomerCreatedEvent", secondCreateEventHandler);

        // Creating the create customer event
        const customerCreatingEvent = new CustomerCreatedEvent({
            ...this
        });

        this._eventDispatcher.notify(customerCreatingEvent);
    }

    get id(): string {
        return this._id;
    }

    get Address(): Address {
        return this._address;
    }

    get name(): string {
        return this._name;
    }

    get rewardPoints(): number {
        return this._rewardPoints;
    }

    get getEventDispatcher(): EventDispatcher {
        return this._eventDispatcher;
    }

    validate() {
        if (this._id.length === 0) {
            throw new Error("Id is required");
        }
        if (this._name.length === 0) {
            throw new Error("Name is required");
        }
    }

    changeName(name: string) {
        this._name = name;
        this.validate();
    }

    changeAddress(address: Address) {
        this._address = address;

        // Implementing the changeAddress event
        const changeAddressHandler = new CustomerChangeEventHandler();

        // Registering the changeAddress event
        this._eventDispatcher.register("CustomerChangeAddressEvent", changeAddressHandler);

        // Creating the change address event
        const changeAddressEvent = new CustomerChangeAddressEvent({
            _id: this._id,
            _name: this._name,
            _address: this._address
        });

        this._eventDispatcher.notify(changeAddressEvent);
    }

    isActive(): boolean {
        return this._active;
    }
    
    activate() {
        if (this._address === undefined) {
            throw new Error("Address is mandatory to activate a customer");
        }
        this._active = true;
    }

    deactivate() {
        this._active = false;
    }

    addRewardPoints(points: number) {
        this._rewardPoints += points;
    }

    set Address(address: Address) {
        this._address = address;
    }
}