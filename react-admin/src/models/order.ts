import { OrderItem } from "./order_item";
export interface Order {
  id: number;
  name: string;
  email: string;
  total: number;
  order_items: OrderItem[];
}
