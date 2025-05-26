// import { Order } from "../cashier/orders";
// import { InventoryItem } from "../admin/inventory";

// export type WebSocketEvent = 
//   | {
//       type: 'order_update';
//       payload: {
//         event_type: 'created' | 'status_changed' | 'completed';
//         order: Order;
//       };
//     }
//   | {
//       type: 'inventory_update';
//       payload: {
//         event_type: 'restocked' | 'used' | 'low_stock';
//         item?: InventoryItem;
//       };
//     };