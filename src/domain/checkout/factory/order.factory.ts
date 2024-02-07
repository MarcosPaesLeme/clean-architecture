import Order from "../entity/order";
import OrderInterface from "../entity/order.interface";
import OrderItem from "../entity/order_item";


export default class OrderFactory {
  public static create(props: OrderInterface): Order {
    const items = props.items.map((item) => {
      return new OrderItem(
        item.id,
        item.name,
        item.price,
        item.productId,
        item.quantity
      );
    });
    
    return new Order(props.id, props.customerId, items);
  }
}