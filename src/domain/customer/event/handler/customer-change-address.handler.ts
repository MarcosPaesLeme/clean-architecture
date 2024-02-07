import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import CustomerChangeAddressEvent from "../customer-change-address.event";

export default class CustomerChangeEventHandler
  implements EventHandlerInterface<CustomerChangeAddressEvent>
{
  handler(event: CustomerChangeAddressEvent): void {
      console.log(`Endereço do cliente: ${event.eventData._id}, ${event.eventData._name} alterado para: ${event.eventData._address}`)
  }
}