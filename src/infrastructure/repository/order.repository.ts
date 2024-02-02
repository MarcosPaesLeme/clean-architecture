import Order from "../../domain/entity/order";
import OrderItem from "../../domain/entity/order_item";
import OrderRepositoryInterface from "../../domain/repository/order-repository.interface";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import OrderModel from "../db/sequelize/model/order.model";

export default class OrderRepository implements OrderRepositoryInterface {
    async create(entity: Order): Promise<void> {
        await OrderModel.create(
            {
                id: entity.id,
                customer_id: entity.customerId,
                total: entity.total(),
                items: entity.items.map((item) => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    product_id: item.productId,
                    quantity: item.quantity,
                })),
            },
            {
                include: [{ model: OrderItemModel }],
            }
        );
    }

    async update(entity: Order): Promise<void> {
        await OrderModel.destroy({ where: { id: entity.id } });

        await this.create(entity);
    }

    async find(entity: Order): Promise<Order> {
        try {
            const orderModel = await OrderModel.findOne({ where: { id: entity.id }, include: ["items"] });
            return new Order(
                orderModel.id, 
                orderModel.customer_id, 
                orderModel.items.map(orderItem => new OrderItem(
                    orderItem.id,
                    orderItem.name,
                    orderItem.price,
                    orderItem.product_id,
                    orderItem.quantity,
                ))
            );
        } catch (e) {
            throw new Error("Order not found");
        }

    }

    async findAll(entity?: Order): Promise<Order[]> {
        const orderModels = await OrderModel.findAll({
            include: ["items"],
          });
      
          const orders = orderModels.map((orderModel) => {
            return new Order(
              orderModel.id,
              orderModel.customer_id,
              orderModel.items.map(orderItem => new OrderItem(
                orderItem.id,
                orderItem.name,
                orderItem.price,
                orderItem.product_id,
                orderItem.quantity,
              ))
            );
          });
      
          return orders;
    }
}