import { Sequelize } from "sequelize-typescript";
import Address from "../../../../domain/customer/value-object/address";
import Customer from "../../../../domain/customer/entity/customer";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import Product from "../../../../domain/product/entity/product";
import CustomerModel from "../../../customer/respository/sequelize/customer.model";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import ProductModel from "../../../product/repository/sequelize/product.model";
import CustomerRepository from "../../../customer/respository/sequelize/customer.repository";
import ProductRepository from "../../../product/repository/sequelize/product.repository";
import Order from "../../../../domain/checkout/entity/order";
import OrderRepository from "./order.repository";

describe("Order repository test", () => {
  let sequelize: Sequelize;
  const customerRepository = new CustomerRepository();
  const productRepository = new ProductRepository();
  const orderRepository = new OrderRepository();
  

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a new order", async () => {
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const ordemItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order("123", "123", [ordemItem]);

    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "123",
      customer_id: "123",
      total: order.total(),
      items: [
        {
          id: ordemItem.id,
          name: ordemItem.name,
          price: ordemItem.price,
          quantity: ordemItem.quantity,
          order_id: "123",
          product_id: "123",
        },
      ],
    });
  });

  it("should update a order", async () => {

    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const ordemItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    let order = new Order("123", "123", [ordemItem]);

    await orderRepository.create(order);

    let orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });


    expect(orderModel.toJSON()).toStrictEqual({
      id: "123",
      customer_id: "123",
      total: order.total(),
      items: [
        {
          id: ordemItem.id,
          name: ordemItem.name,
          price: ordemItem.price,
          quantity: ordemItem.quantity,
          order_id: "123",
          product_id: "123",
        },
      ],
    });

    const product2 = new Product("456", "Product 2", 10);
    await productRepository.create(product2);

    const ordemItem2 = new OrderItem(
      "2",
      product2.name,
      product2.price,
      product2.id,
      5
    );
    order = new Order("123", "123", [ordemItem, ordemItem2]);

    await orderRepository.update(order);

    orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });


    expect(orderModel.toJSON()).toStrictEqual({
      id: "123",
      customer_id: "123",
      total: order.total(),
      items: [
        {
          id: ordemItem.id,
          name: ordemItem.name,
          price: ordemItem.price,
          quantity: ordemItem.quantity,
          order_id: "123",
          product_id: "123",
        },
        {
          id: ordemItem2.id,
          name: ordemItem2.name,
          price: ordemItem2.price,
          quantity: ordemItem2.quantity,
          order_id: "123",
          product_id: "456",
        }
      ],
    });
  });

  it('should find an order', async () => {
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const ordemItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    let order = new Order("123", "123", [ordemItem]);

    await orderRepository.create(order);

    let orderModel = await orderRepository.find(order);

    expect(orderModel).toStrictEqual(order);
  });

  it("should throw an error when order is not found", async () => {
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const product = new Product("123", "Product 1", 10);

    const ordemItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    let order = new Order("123", "123", [ordemItem]);


    expect(async () => {
      await orderRepository.find(order);
    }).rejects.toThrow("Order not found");
  });

  it("should find all orders", async () => {
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      1
    );

    const order = new Order("123", "123", [orderItem]);

    await orderRepository.create(order);

    const orderItem2 = new OrderItem(
      "2",
      product.name,
      product.price,
      product.id,
      1
    );

    const order2 = new Order("456", "123", [orderItem2]);
    await orderRepository.create(order2);

    const foundOrders = await orderRepository.findAll();

    expect(foundOrders).toHaveLength(2);
    expect(foundOrders).toEqual([order, order2]);
  });
});