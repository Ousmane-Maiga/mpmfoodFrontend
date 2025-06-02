export interface KitchenItem {
  id: string;
  name: string;
  type: 'ingredient' | 'container' | 'packaging';
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


export interface KitchenPerformanceData {
  teamMembers: KitchenTeamMember[];
  currentEmployee: {
    itemsPrepared: number;
    avgPrepTime: number;
    breakDuration: number;
    performanceRating?: number;
  };
}

// kitchenTypes.ts
export interface KitchenTeamMember {
  id: string;
  name: string;
  role: string;
  is_active: boolean;  // Changed from isActive to match API
  itemsPreparedToday: number;
  breakDuration: number;
  currentStatus: 'available' | 'on_break' | 'offline';
}