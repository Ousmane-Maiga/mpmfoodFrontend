export interface KitchenItem {
  id: string;
  name: string;
  type: 'ingredient' | 'container';
  quantity: number;
  unit: string;
  minThreshold: number;
  lastRestocked: Date;
  supplierId?: string;
  costPerUnit?: number;
}

export interface IngredientUsage {
  id: string;
  orderId: string;
  date: Date;
  items: {
    kitchenItemId: string;
    quantityUsed: number;
    itemName?: string;
    unit?: string;
  }[];
}

export interface RestockRequest {
  itemId: string;
  quantityAdded: number;
}

export interface KitchenResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}