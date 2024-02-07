import CustomerChangeEventHandler from "../event/handler/customer-change-address.handler";
import FirstCustomerCreateEventHandler from "../event/handler/first-customer-create.handler";
import SecondCustomerCreateEventHandler from "../event/handler/second-customer-create.handler";
import Address from "../value-object/address";
import Customer from "./customer";

describe("Customer unit tests", () => {

    it("should throw error when id is empty", () => {
        expect(() => {
            let customer = new Customer("", "John");
        }).toThrow("Id is required");
    });    

    it("should throw error when name is empty", () => {
        expect(() => {
            let customer = new Customer("123", "");
        }).toThrow("Name is required");
    });    

    it("should change name", () => {

        // Arrange
        const customer = new Customer("123", "John");
        
        // Act
        customer.changeName("Jane");

        // Assert
        expect(customer.name).toBe("Jane");
    });    

    it("should activate customer", () => {
        const customer = new Customer("1", "Customer 1")
        const address = new Address("Street 1",123,"13330-250","São Paulo");
        customer.changeAddress(address);

        customer.activate();

        expect(customer.isActive()).toBe(true);
    });    

    it("should throw error when address is undefined when you activate a customer", () => {
        
        expect(()=> {
            const customer = new Customer("1", "Customer 1")
            customer.activate();
        }).toThrow("Address is mandatory to activate a customer");        

    });  

    it("should deactivate customer", () => {
        const customer = new Customer("1", "Customer 1")
        
        customer.deactivate();

        expect(customer.isActive()).toBe(false);
    });  

    it("should add reward points", () => {
        const customer = new Customer("1", "Customer 1")
        expect(customer.rewardPoints).toBe(0);

        customer.addRewardPoints(10);
        expect(customer.rewardPoints).toBe(10);

        customer.addRewardPoints(10);
        expect(customer.rewardPoints).toBe(20);
    });

    // Testing the events
    it('should trigger the create event', ()=> {
        const customer = new Customer("123", "John");

        const firstHandler = new FirstCustomerCreateEventHandler();
        const secondHandler = new SecondCustomerCreateEventHandler();

        const createEvent = customer.getEventDispatcher.getEventHandlers['CustomerCreatedEvent'];

        expect(createEvent).toBeDefined();
        expect(createEvent.length).toBe(2);
        expect(createEvent).toMatchObject([firstHandler, secondHandler]);
    });

    it('should trigger the create event and the change address event', ()=> {
        const customer = new Customer("123", "John");
        const address = new Address("Street 1",123,"13330-250","São Paulo");
        customer.changeAddress(address);
        customer.activate();

        const firstHandler = new FirstCustomerCreateEventHandler();
        const secondHandler = new SecondCustomerCreateEventHandler();
        const thirdHandler = new CustomerChangeEventHandler();

        const createEvent = customer.getEventDispatcher.getEventHandlers['CustomerCreatedEvent'];
        const changeAddressEvent = customer.getEventDispatcher.getEventHandlers['CustomerChangeAddressEvent'];

        expect(createEvent).toBeDefined();
        expect(createEvent.length).toBe(2);
        expect(createEvent).toMatchObject([firstHandler, secondHandler]);

        expect(changeAddressEvent).toBeDefined();
        expect(changeAddressEvent.length).toBe(1);
        expect(changeAddressEvent).toMatchObject(thirdHandler);
    });

});