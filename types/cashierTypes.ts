// export interface ProductVariant {
//   id: number;
//   name: string;
//   price: number;
// }

// export interface Product {
//   id: number;
//   name: string;
//   variants: ProductVariant[];
// }

// export interface OrderItem {
//   id: number;
//   order_id: number;
//   product_id: number;
//   variant_id: number;
//   product: string;  
//   variant: string;  
//   quantity: number;
//   price: number;
//   total: number;
//   created_at?: Date;
// }

// export type OrderSource = 'phone' | 'in_person' | 'online' | 'third_party';
// export type OrderType = 'delivery' | 'pickup';
// export type OrderStatus = 'pending' | 'in_progress' | 'ready' | 'completed' | 'cancelled';
// export type OrderStatusFilter = OrderStatus | 'all';

// export interface FormValues {
//   orderType: OrderType;
//   name: string;
//   phone: string;
//   orderSource: OrderSource;
//   address?: string;
//   deliverer?: string;
// }

// export interface Order {
//   id: number;
//   store_id: number;
//   employee_id: string;
//   customer_id: number | null;
//   customer_name?: string; // Add this
//   customer_phone?: string; // Add this
//   order_type: OrderType;
//   order_source: OrderSource;
//   status: OrderStatus;
//   subtotal: number;
//   discount_amount: number;
//   total_amount: number;
//   notes: string | null;
//   created_at: string;
//   updated_at: string;
//   payment_status: 'pending' | 'paid' | 'refunded';
//   order_items?: OrderItem[];
// }

// export interface CreateOrderRequest {
//   employee_id: number;
//   store_id: number;
//   orderData: {
//     customer_id?: number | null;
//     order_type: OrderType;
//     order_source: OrderSource;
//     subtotal: number;
//     total_amount: number;
//     notes?: string;
//   };
//   items: Array<{
//     product_id: number;
//     variant_id: number;
//     quantity: number;
//     unit_price: number;
//     discount_amount?: number;
//     total_price: number;
//   }>;
// }

// export interface UpdateOrderStatusRequest {
//   status: OrderStatus;
// }


// export interface AddOrderModalProps {
//   visible: boolean;
//   onClose: () => void;
//   onSubmit: (values: FormValues, orderItems: OrderItem[]) => void;
//   products: Product[];
// }

// export interface Customer {
//   id: number;
//   name: string;
//   phone: string;
//   address?: string;
//   created_at?: string;
//   updated_at?: string;
// }


// types/cashierTypes.ts
// This file defines the types for your frontend and backend to ensure consistency.

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

// OrderItem as it appears in the database and in API responses (flattened with product/variant names)
export interface OrderItem {
    total: any;
    price: any;
    id: number;
    order_id: number;
    product_id: number;
    variant_id: number;
    product: string; // Product name from join
    variant: string; // Variant name from join
    quantity: number;
    unit_price: number;
    discount_amount: number;
    total_price: number;
    created_at: string; // Consistent with JSON string dates
}

// Enums for clarity and type safety
export type OrderSource = 'phone' | 'in_person' | 'online' | 'third_party';
export type OrderType = 'delivery' | 'pickup';
export type OrderStatus = 'pending' | 'in_progress' | 'ready' | 'completed' | 'cancelled';
export type OrderStatusFilter = OrderStatus | 'all';

// Form values used in the AddOrderModal (frontend)
export interface FormValues {
    orderType: OrderType;
    name: string; // Customer name for new customer or lookup
    phone: string; // Customer phone for new customer or lookup
    orderSource: OrderSource;
    address?: string; // Optional for pickup
    deliverer?: string; // Optional for pickup (assuming this is a name/string, not UUID)
}

export interface FormErrors {
  orderType?: string;
  name?: string;
  phone?: string;
  orderSource?: string;
  address?: string;
  deliverer?: string;
}

// Order as it appears in the database and in API responses
export interface Order {
    id: number;
    store_id: number;
    employee_id: string; // UUID from DB, represented as string in TS
    customer_id: number | null;
    customer_name?: string; // From join in get queries
    customer_phone?: string; // From join in get queries
    order_type: OrderType; // Specific enum type
    order_source: OrderSource; // Specific enum type
    status: OrderStatus; // Specific enum type
    subtotal: number;
    discount_amount: number;
    total_amount: number;
    notes: string | null;
    created_at: string; // Consistent with JSON string dates
    updated_at: string; // Consistent with JSON string dates
    payment_status: 'pending' | 'paid' | 'refunded';
    address: string | null; // Added to match DB schema
    deliverer: string | null; // Added to match DB schema
    started_at?: string | null; // Added for kitchen module, nullable
    completed_at?: string | null; // Added for kitchen module, nullable
    preparation_notes?: string | null; // Added for kitchen module, nullable
    order_items?: OrderItem[]; // Optional array of items, typically included in detailed fetches
}

// Request body for creating an order (frontend to backend)
export interface CreateOrderRequest {
    employee_id: string; // FIX: Changed from number to string (UUID)
    store_id: number;
    orderData: {
        customer_id?: number | null; // Optional if new customer
        name?: string; // For customer lookup/creation
        phone?: string; // For customer lookup/creation
        order_type: OrderType;
        order_source: OrderSource;
        subtotal: number;
        total_amount: number;
        notes?: string;
        discount_amount?: number; // Added as optional for consistency
        address?: string; // Added to match DB schema
        deliverer?: string; // Added to match DB schema
    };
    items: Array<{
        product_id: number;
        variant_id: number;
        quantity: number;
        unit_price: number;
        discount_amount?: number;
        total_price: number;
    }>;
}

// Request body for updating order status (frontend to backend)
export interface UpdateOrderStatusRequest {
    status: OrderStatus;
}

// Customer interface (used in getOrderById response)
export interface Customer {
    id: number;
    name: string;
    phone: string;
    address?: string;
    created_at?: string;
    updated_at?: string;
}

// AddOrderModalProps (frontend component props)
export interface AddOrderModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (values: FormValues, orderItems: OrderItem[]) => void;
    products: Product[];
}


// Add these new types to your existing cashierTypes.ts

export interface TeamMember {
    id: string;
    name: string;
    role: string;
    isActive: boolean;
    ordersToday: number;
    breakDuration: number;
    lastActive?: string;
    performanceRating?: number;
    currentStatus?: 'available' | 'on_break' | 'offline';
};

export interface TeamPerformanceResponse {
    teamMembers: TeamMember[];
    currentEmployee: {
        ordersHandled: number;
        averageProcessingTime: number;
        breakDuration: number;
        performanceRating?: number;
    };
}

export interface TeamPerformanceData {
  teamMembers: TeamMember[];
  currentEmployee: {
    ordersHandled: number;
    averageProcessingTime: number;
    breakDuration: number; // in minutes
  };
}

export interface PerformanceStats {
    ordersHandled: number;
    averageProcessingTime: number;
    breakDuration: string;
    performanceRating?: number;
}

// Add this to your existing OrderItem interface if needed
export interface OrderItemWithProduct extends OrderItem {
    productDetails?: Product; // Full product details if needed
    variantDetails?: ProductVariant; // Full variant details if needed
}

// Add this if you need detailed order metrics
export interface OrderMetrics {
    totalOrders: number;
    completedOrders: number;
    canceledOrders: number;
    averageOrderValue: number;
    bestSellingProducts: {
        product: Product;
        quantity: number;
    }[];
}

// Add this if you need shift information
export interface ShiftInfo {
    startTime: string; // ISO timestamp
    endTime?: string; // Optional if shift is ongoing
    duration?: string; // Formatted duration
    ordersCompleted: number;
    breaksTaken: number;
    totalBreakDuration: string;
}

// Add this if you need user status information
export interface UserStatus {
    userId: string;
    isOnline: boolean;
    lastActive: string;
    currentActivity?: 'processing_order' | 'on_break' | 'available';
}

// Add this to your existing FormValues if needed for customer lookup
export interface CustomerLookup {
    id?: number;
    name: string;
    phone: string;
    address?: string;
    orderHistory?: Order[];
}