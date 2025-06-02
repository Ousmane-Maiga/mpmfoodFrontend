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
    created_at: string | null; // Consistent with JSON string dates
    // Removed 'price' and 'total' as they are redundant with unit_price and total_price
}

// Add this to your types file
export const OrderStatusValues = {
    PENDING: 'pending',
    IN_PROGRESS: 'in_progress',
    READY: 'ready',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled'
} as const;

export type OrderStatus = typeof OrderStatusValues[keyof typeof OrderStatusValues];

// Enums for clarity and type safety
export type OrderSource = 'phone' | 'in_person' | 'online' | 'phone_call' | 'third_party' | 'whatsapp' | 'tiktok' | 'snapchat';
export type OrderType = 'delivery' | 'pickup';
export type OrderStatusFilter = OrderStatus | 'all';

// FIX: Updated FormValues interface to include missing properties and correct types
export interface FormValues {
    orderType: OrderType;
    customerName: string; // Renamed from 'name'
    customerPhone: string; // Renamed from 'phone'
    orderSource: OrderSource;
    address?: string | null; // Changed to allow null
    deliverer?: string | null; // Changed to allow null

    // NEW: Properties added to match usage in handleSubmitOrder
    customerId?: number | null; // Optional customer ID if existing customer
    discountAmount?: number; // Optional discount amount
    notes?: string; // Optional notes for the order
    paymentStatus?: 'pending' | 'paid' | 'refunded'; // Optional payment status
    preparedBy?: string | null; // Optional prepared_by ID (UUID string)
}

// FIX: Added FormErrors interface
export interface FormErrors {
    orderType?: string;
    customerName?: string;
    customerPhone?: string;
    orderSource?: string;
    address?: string;
    deliverer?: string;
    // Add other fields as needed for validation
}


// Order as it appears in the database and in API responses
export interface Order {
    id: number;
    store_id: number;
    created_by: string; // FIX: Renamed from employee_id to created_by (UUID from DB, represented as string in TS)
    prepared_by?: string | null; // NEW: Added prepared_by (UUID from DB, represented as string in TS)
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
    store_name?: string;
    store_phone?: string;
    store_location?: string;
    created_by_name?: string; // NEW: Name of the employee who created the order
    prepared_by_name?: string; // NEW: Name of the employee who prepared the order
    order_items?: OrderItem[]; // Optional array of items, typically included in detailed fetches
}

// Request body for creating an order (frontend to backend)
export interface CreateOrderRequest {
    created_by: string; // FIX: Renamed from employee_id to created_by (UUID)
    store_id: number;
    orderData: {
        payment_status?: 'pending' | 'paid' | 'refunded';
        customer_id?: number | null; // Optional if new customer
        name?: string; // For customer lookup/creation
        phone?: string; // For customer lookup/creation
        order_type: OrderType;
        order_source: OrderSource;
        subtotal: number;
        total_amount: number;
        notes?: string;
        discount_amount?: number; // Added as optional for consistency
        address?: string | null; // Changed to allow null
        deliverer?: string | null; // Changed to allow null
        prepared_by?: string | null; // NEW: Optional prepared_by for creation
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
    defaultPreparedBy?: string | null; // Added for passing employee ID
}

// Team Performance Types (from backend model)
export interface TeamMember {
    id: string;
    name: string;
    role: string;
    isActive: boolean;
    ordersToday: number;
    breakDuration: number; // In minutes
    currentStatus: 'offline' | 'on_break' | 'available';
    lastActive: string; // ISO string date
}

export interface PerformanceStats {
    ordersHandled: number;
    averageProcessingTime: number; // In minutes
    breakDuration: string; // Formatted string like "0m"
}

export interface TeamPerformanceData {
    teamMembers: TeamMember[];
    currentEmployee: {
        ordersHandled: number;
        averageProcessingTime: number;
        breakDuration: number; // In minutes
    };
}