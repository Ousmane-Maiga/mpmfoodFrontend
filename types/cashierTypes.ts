export interface ProductVariant {
  id: number;
  name: string;
  price: number;
}

export interface Product {
  id: number;
  name: string;
  variants: ProductVariant[];
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  variant_id: number;
  product: string;  
  variant: string;  
  quantity: number;
  price: number;
  total: number;
  created_at?: Date;
}

export type OrderSource = 'phone' | 'in_person' | 'online' | 'third_party';
export type OrderType = 'delivery' | 'pickup';
export type OrderStatus = 'pending' | 'in_progress' | 'ready' | 'completed' | 'cancelled';
export type OrderStatusFilter = OrderStatus | 'all';

export interface FormValues {
  orderType: OrderType;
  name: string;
  phone: string;
  orderSource: OrderSource;
  address?: string;
  deliverer?: string;
}

export interface Order {
  id: number;
  store_id: number;
  employee_id: string;
  customer_id: number | null;
  order_type: OrderType;
  order_source: OrderSource;
  status: OrderStatus;
  subtotal: number;
  discount_amount: number;
  total_amount: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
  payment_status: 'pending' | 'paid' | 'refunded';
  order_items?: OrderItem[];
}


export interface AddOrderModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: FormValues, orderItems: OrderItem[]) => void;
  products: Product[];
}