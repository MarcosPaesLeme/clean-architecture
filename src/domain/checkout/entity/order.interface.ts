export default interface OrderInterface {
    id: string;
    customerId: string;
    items: OrderItem[];
};

interface OrderItem {
    id: string;
    name: string;
    productId: string;
    quantity: number;
    price: number;
}