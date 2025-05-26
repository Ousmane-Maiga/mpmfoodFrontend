export interface Employee {
  id: string;
  name: string;
  role: string;
  email?: string;
  phone?: string;
  schedule: Array<{
    day: string;
    shift: string;
  }>;
  efficiency?: number;
  attendance?: number;
}

export interface Supplier {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export interface InventoryItemBase {
  id: number;
  name: string;
  type: 'ingredient' | 'container' | 'packaging';
  quantity: number;
  unit: string;
  min_threshold: number;
  supplier_id?: number | null;
  supplier?: Supplier;
  cost_per_unit?: number | null;
}

export interface InventoryItem extends InventoryItemBase {
  last_restocked: string;
  created_at: string;
  updated_at: string;
  supplier?: Supplier;
}

export interface InventoryUsage {
  id: number;
  inventory_item_id: number;
  order_id: number;
  quantity_used: number;
  date: string;
  created_at: string;
}

export type InventoryItemUpdate = Omit<InventoryItemBase, 'id'>;