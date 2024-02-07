import EventHandlerInterface from "../../event/event-handler.interface";
import CustomerCreatedEvent from "../customer-created.event";

export default class SecondCustomerCreateEventHandler
  implements EventHandlerInterface<CustomerCreatedEvent>
{
  handler(event: CustomerCreatedEvent): void {
      console.log('Esse é o segundo console.log do evento: CustomerCreated')
  }
}