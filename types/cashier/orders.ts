// import { OrderStatus, OrderSource, OrderType } from "../shared/enums";
// import { BaseEntity } from "../shared/base";

// export interface OrderItem extends BaseEntity {
//   order_id: number;
//   product_id: number;
//   variant_id: number;
//   product: string;
//   variant: string;
//   quantity: number;
//   unit_price: number;
//   total_price: number;
// }

// export interface Order extends BaseEntity {
//   store_id: number;
//   employee_id: string;
//   customer_id: number | null;
//   order_type: OrderType;
//   order_source: OrderSource;
//   status: OrderStatus;
//   subtotal: number;
//   total_amount: number;
//   notes: string | null;
//   order_items?: OrderItem[];
// }