// User Types
export type User = {
    $id: string;
    name: string;
    email: string;
  };
  
  // Crop Type Types
  export type CropType = {
    $id: string;
    crop: string;
  };
  
  // Equipment Types
  export type Equipments = {
    $id: string;
    name: string;
  };
  
  // Entry Types
  export type Entry = {
    $id: string;
    $createdAt: string;
    $updatedAt: string;
    userId: string;
    personName: string;
    equipmentId: string;
    cropTypeId: string;
    quantity: number;
    pricePerUnit: number;
    totalPrice: number;
    totalAmountPaid: number;
    lastPaymentDate?: string;
    paymentStatus: 'full_paid' | 'partially_paid' | 'not_paid';
    remainingAmount: number;
    notes?: string;
  };
  
  // Payment Types
  export type Payment = {
    $id: string;
    entryId: string;
    amount: number;
    paymentDate: string;
    notes?: string;
    $createdAt: string;
    $updatedAt: string;
  };
  
  // Form Types
  export type EntryFormData = {
    userId: string;
    personName: string;
    equipmentId: string;
    cropTypeId: string;
    quantity: number;
    pricePerUnit: number;
    totalPrice: number;
    totalAmountPaid: number;
    lastPaymentDate?: string;
    paymentStatus: 'full_paid' | 'partially_paid' | 'not_paid';
    remainingAmount: number;
    notes?: string;
  };
  
  export type PaymentFormData = {
    entryId: string;
    amount: number;
    paymentDate: string;
    notes?: string;
  };
    