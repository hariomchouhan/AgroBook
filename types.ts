
// User Types
export type User = {
    id: string;
    name: string;
    email: string;
  };
  
  // Crop Type Types
  export type CropType = {
    id: string;
    name: string;
    description?: string;
  };
  
  // Equipment Types
  export type Equipment = {
    id: string;
    name: string;
    description?: string;
    unitType: 'biga' | 'trolley';
    isActive: boolean;
  };
  
  // Entry Types
  export type Entry = {
    id: string;
    userId: string;
    personName: string;
    equipmentId: string;
    cropTypeId: string;
    quantity: number;
    pricePerUnit: number;
    totalPrice: number;
    totalAmountPaid: number;
    lastPaymentDate?: string;
    paymentStatus: 'paid' | 'partially_paid' | 'not_paid';
    remainingAmount: number;
    notes?: string;
    date: string;
    createdAt: string;
    updatedAt: string;
  };
  
  // Payment Types
  export type Payment = {
    id: string;
    entryId: string;
    amount: number;
    paymentDate: string;
    notes?: string;
    createdAt: string;
  };
  
  // Form Types
  export type EntryFormData = {
    personName: string;
    equipmentId: string;
    cropTypeId: string;
    quantity: number;
    pricePerUnit: number;
    date: string;
    notes?: string;
  };
  
  export type PaymentFormData = {
    amount: number;
    paymentDate: string;
    notes?: string;
  };
    