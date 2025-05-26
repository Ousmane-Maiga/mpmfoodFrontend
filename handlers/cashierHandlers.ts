// // src/handlers/cashierHandlers.ts
// import { Product, OrderItem, FormValues } from '@/types/cashierTypes';
// import { getProducts, createOrder, getOrders } from '@/services/api';
// import { User } from '@/types/userTypes';

// export interface CashierHandlers {
//   handleSubmitOrder: (
//     values: FormValues,
//     orderItems: OrderItem[],
//     employee: User | null
//   ) => Promise<{ success: boolean; error?: string }>;
//   handleLoadOrders: () => Promise<{ orders: any[]; error?: string }>;
//   fetchProducts: () => Promise<{ products: Product[]; error?: string }>;
// }

// export const createCashierHandlers = (setters: {
//   setProducts: (products: Product[]) => void;
//   setCurrentOrder: (order: { values: FormValues; items: OrderItem[] } | null) => void;
//   setOrders: (orders: any[]) => void;
//   setLoading: (loading: boolean) => void;
//   setError: (error: string | null) => void;
// }): CashierHandlers => {
//   const handleSubmitOrder = async (values: FormValues, orderItems: OrderItem[], employee: User | null) => {
//     try {
//       if (!employee || !employee.id) {
//         throw new Error('Employee not authenticated');
//       }

//       const orderData = {
//         employee_id: employee.id,
//         store_id: 1,
//         orderData: {
//           customer_id: null,
//           order_type: values.orderType,
//           order_source: values.orderSource,
//           subtotal: orderItems.reduce((sum, item) => sum + (item.total_price || item.total), 0),
//           total_amount: orderItems.reduce((sum, item) => sum + (item.total_price || item.total), 0),
//           address: values.address || null,
//           deliverer: values.deliverer || null,
//           notes: ''
//         },
//         items: orderItems.map(item => ({
//           product_id: item.product_id,
//           variant_id: item.variant_id,
//           quantity: item.quantity,
//           unit_price: item.unit_price,
//           total_price: item.total_price,
//           discount_amount: item.discount_amount || 0
//         }))
//       };

//       await createOrder(orderData);
      
//       setters.setCurrentOrder({
//         values,
//         items: orderItems
//       });
      
//       const { orders: updatedOrders } = await getOrders({});
//       setters.setOrders(updatedOrders);
      
//       return { success: true };
//     } catch (err) {
//       const error = err instanceof Error ? err.message : 'Failed to create order';
//       setters.setError(error);
//       return { success: false, error };
//     }
//   };

//   const handleLoadOrders = async () => {
//     try {
//       setters.setLoading(true);
//       const { orders: fetchedOrders } = await getOrders({});
//       setters.setOrders(fetchedOrders);
//       return { orders: fetchedOrders };
//     } catch (err) {
//       const error = err instanceof Error ? err.message : 'Failed to load orders';
//       setters.setError(error);
//       return { orders: [], error };
//     } finally {
//       setters.setLoading(false);
//     }
//   };

//   const fetchProducts = async () => {
//     try {
//       setters.setLoading(true);
//       const productsData = await getProducts();
//       setters.setProducts(productsData);
//       return { products: productsData };
//     } catch (err) {
//       const error = err instanceof Error ? err.message : 'Failed to load products';
//       setters.setError(error);
//       return { products: [], error };
//     } finally {
//       setters.setLoading(false);
//     }
//   };

//   return {
//     handleSubmitOrder,
//     handleLoadOrders,
//     fetchProducts
//   };
// };