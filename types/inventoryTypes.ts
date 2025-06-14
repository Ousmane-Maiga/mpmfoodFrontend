/**
 * Represents a supplier of inventory items.
 */
export interface Supplier {
  id: number;
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  created_at: Date; // Date when the supplier record was created
  updated_at: Date; // Date when the supplier record was last updated
}

/**
 * Represents an inventory item in the system.
 * Note: 'created_at' is not directly on the inventory_items table, but 'updated_at' is.
 * Supplier data is nested.
 */
export interface InventoryItem {
  id: number;
  name: string;
  type: 'ingredient' | 'container' | 'packaging'; // Specific types for inventory items
  quantity: number;
  unit: string;
  min_threshold: number;
  last_restocked?: Date; // Optional: Last time this item was restocked
  supplier_id?: number | null; // Optional: ID of the associated supplier
  cost_per_unit?: number | null; // Optional: Cost per unit of the item
  // created_at: Date; // Removed as per backend schema clarification for inventory_items table
  updated_at: Date; // Date when the inventory item was last updated

  // Nested supplier object, populated when fetched with join
  supplier?: Supplier;
}

/**
 * Represents the data structure for creating a new inventory item.
 * Omits auto-generated fields like 'id', 'created_at', 'updated_at', 'last_restocked' (as it's set by backend), and 'supplier'.
 */
export type CreateInventoryItemPayload = Omit<InventoryItem, 'id' | 'created_at' | 'updated_at' | 'last_restocked' | 'supplier'>;

/**
 * Represents the data structure for updating an existing inventory item.
 * All fields are optional as it's a partial update, but 'id' is required for identification.
 */
export type InventoryItemUpdate = Partial<Omit<InventoryItem, 'id' | 'created_at' | 'updated_at' | 'last_restocked' | 'supplier'>>;


/**
 * Represents a record of inventory usage.
 */
export interface InventoryUsage {
  order_id: number;
  inventory_item_id: number;
  amount_used: number;
  unit: string;
  recorded_at: Date; // Date and time when the usage was recorded
}
