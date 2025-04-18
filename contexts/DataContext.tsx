import React, { ReactNode } from "react";
import {
  cropTypesCollectionId,
  database,
  databaseId,
  entriesCollectionId,
  equipmentCollectionId,
  paymentsCollectionId,
} from "@/appwrite-config";
import { useAuth } from "@/hooks/useAuth";
import {
  CropType,
  Entry,
  EntryFormData,
  Equipments,
  Payment,
  PaymentFormData,
} from "@/types";
import { ID, Query } from "appwrite";
import { createContext, useEffect, useState } from "react";

// Define the context type
interface DataContextType {
  // State
  entries: Entry[];
  payments: Payment[];
  cropTypes: CropType[];
  equipments: Equipments[];
  loading: boolean;
  error: string | null;

  // Entry functions
  createEntry: (data: EntryFormData) => Promise<Entry>;
  updateEntry: (id: string, data: Partial<Entry>) => Promise<Entry>;
  // deleteEntry: (id: string) => Promise<void>;
  getEntry: (id: string) => Promise<Entry>;
  refreshEntries: () => Promise<void>;
  fetchFilteredEntries: (
    status: 'all' | 'full_paid' | 'partially_paid' | 'not_paid',
    page: number,
    limit: number,
    searchQuery?: string
  ) => Promise<{ entries: Entry[]; total: number }>;

  // Payment functions
  createPayment: (entryId: string, data: PaymentFormData) => Promise<Payment>;
  //   deletePayment: (id: string) => Promise<void>;
  getPaymentsForEntry: (entryId: string) => Promise<Payment[]>;
  refreshPayments: () => Promise<void>;

  // Data loading functions
  loadCropTypes: () => Promise<void>;
  loadEquipments: () => Promise<void>;
}

// Create the context with a default value
export const DataContext = createContext<DataContextType>({
  // State
  entries: [],
  payments: [],
  cropTypes: [],
  equipments: [],
  loading: false,
  error: null,

  // Entry functions
  createEntry: async () => {
    throw new Error("Not implemented");
  },
  updateEntry: async () => {
    throw new Error("Not implemented");
  },
  // deleteEntry: async () => { throw new Error('Not implemented'); },
  getEntry: async () => {
    throw new Error("Not implemented");
  },
  refreshEntries: async () => {
    throw new Error("Not implemented");
  },
  fetchFilteredEntries: async () => {
    throw new Error("Not implemented");
  },

  // Payment functions
  createPayment: async () => {
    throw new Error("Not implemented");
  },
  // deletePayment: async () => { throw new Error('Not implemented'); },
  getPaymentsForEntry: async () => {
    throw new Error("Not implemented");
  },
  refreshPayments: async () => {
    throw new Error("Not implemented");
  },

  // Data loading functions
  loadCropTypes: async () => {
    throw new Error("Not implemented");
  },
  loadEquipments: async () => {
    throw new Error("Not implemented");
  },
});

// Define the provider props
interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider = ({ children }: DataProviderProps) => {
  const { user, isAuthenticated } = useAuth();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [cropTypes, setCropTypes] = useState<CropType[]>([]);
  const [equipments, setEquipments] = useState<Equipments[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load data when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      loadCropTypes();
      loadEquipments();
      refreshEntries();
      refreshPayments();
    }
  }, [isAuthenticated, user]);

  // Load crop types
  const loadCropTypes = async () => {
    setLoading(true);
    try {
      const response = await database.listDocuments(
        databaseId!,
        cropTypesCollectionId!
      );
      setCropTypes(response.documents as unknown as CropType[]);
    } catch (err) {
      console.error("Error loading crop types:", err);
      setError("Failed to load crop types");
    } finally {
      setLoading(false);
    }
  };

  // Load equipments
  const loadEquipments = async () => {
    setLoading(true);
    try {
      const response = await database.listDocuments(
        databaseId!,
        equipmentCollectionId!
      );
      setEquipments(response.documents as unknown as Equipments[]);
    } catch (err) {
      console.error("Error loading equipment:", err);
      setError("Failed to load equipment");
    } finally {
      setLoading(false);
    }
  };

  // Refresh entries
  const refreshEntries = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const response = await database.listDocuments(
        databaseId!,
        entriesCollectionId!,
        [Query.equal("userId", user.$id)]
      );
      setEntries(response.documents as unknown as Entry[]);
    } catch (err) {
      console.error("Error refreshing entries:", err);
      setError("Failed to refresh entries");
    } finally {
      setLoading(false);
    }
  };

  // Refresh payments
  const refreshPayments = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Get all entries for the user
      const entriesResponse = await database.listDocuments(
        databaseId!,
        entriesCollectionId!,
        [Query.equal("userId", user.$id)]
      );

      const entryIds = entriesResponse.documents.map((entry) => entry.$id);

      if (entryIds.length === 0) {
        setPayments([]);
        return;
      }

      // Get all payments for these entries
      const response = await database.listDocuments(
        databaseId!,
        paymentsCollectionId!,
        [Query.equal("entryId", entryIds), Query.orderDesc("paymentDate")]
      );

      setPayments(response.documents as unknown as Payment[]);
    } catch (err) {
      console.error("Error refreshing payments:", err);
      setError("Failed to refresh payments");
    } finally {
      setLoading(false);
    }
  };

  // Create a new entry
  const createEntry = async (data: EntryFormData): Promise<Entry> => {
    if (!user) throw new Error("User not authenticated");

    setLoading(true);
    try {
      const totalPrice = data.quantity * data.pricePerUnit;

      const entryData = {
        userId: user.$id,
        personName: data.personName,
        equipmentId: data.equipmentId,
        cropTypeId: data.cropTypeId,
        quantity: data.quantity,
        pricePerUnit: data.pricePerUnit,
        totalPrice: totalPrice,
        totalAmountPaid: 0,
        paymentStatus: "not_paid",
        remainingAmount: totalPrice,
        lastPaymentDate: data.lastPaymentDate,
        notes: data.notes,
      };

      const response = await database.createDocument(
        databaseId!,
        entriesCollectionId!,
        ID.unique(),
        entryData
      );

      await refreshEntries();
      return response as unknown as Entry;
    } catch (err) {
      console.error("Error creating entry:", err);
      setError("Failed to create entry");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update an entry
  const updateEntry = async (
    id: string,
    data: Partial<Entry>
  ): Promise<Entry> => {
    if (!user) throw new Error("User not authenticated");

    setLoading(true);
    try {
      const response = await database.updateDocument(
        databaseId!,
        entriesCollectionId!,
        id,
        data
      );

      await refreshEntries();
      return response as unknown as Entry;
    } catch (err) {
      console.error("Error updating entry:", err);
      setError("Failed to update entry");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete an entry
  const deleteEntry = async (id: string): Promise<void> => {
    setLoading(true);
    try {
      // First, delete all payments for this entry
      const paymentsResponse = await database.listDocuments(
        databaseId!,
        paymentsCollectionId!,
        [Query.equal("entryId", id)]
      );

      for (const payment of paymentsResponse.documents) {
        await database.deleteDocument(
          databaseId!,
          paymentsCollectionId!,
          payment.$id
        );
      }

      // Then delete the entry
      await database.deleteDocument(databaseId!, entriesCollectionId!, id);

      await refreshEntries();
      await refreshPayments();
    } catch (err) {
      console.error("Error deleting entry:", err);
      setError("Failed to delete entry");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get a single entry
  const getEntry = async (id: string): Promise<Entry> => {
    setLoading(true);
    try {
      const response = await database.getDocument(
        databaseId!,
        entriesCollectionId!,
        id
      );

      return response as unknown as Entry;
    } catch (err) {
      console.error("Error getting entry:", err);
      setError("Failed to get entry");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Create a new payment
  const createPayment = async (
    entryId: string,
    data: PaymentFormData
  ): Promise<Payment> => {
    setLoading(true);
    try {
      // Create the payment
      const paymentData = {
        entryId: entryId,
        amount: data.amount,
        notes: data.notes,
        paymentDate: data.paymentDate,
      };

      // Get the entry
      const entry = await getEntry(entryId);

      // Calculate new totals
      const newTotalAmountPaid = entry.totalAmountPaid + data.amount;
      const newRemainingAmount = entry.totalPrice - newTotalAmountPaid;

      const paymentResponse = await database.createDocument(
        databaseId!,
        paymentsCollectionId!,
        ID.unique(),
        paymentData
      );

      // Determine new payment status
      let newPaymentStatus: "full_paid" | "partially_paid" | "not_paid";
      if (newRemainingAmount <= 0) {
        newPaymentStatus = "full_paid";
      } else if (newTotalAmountPaid > 0) {
        newPaymentStatus = "partially_paid";
      } else {
        newPaymentStatus = "not_paid";
      }

      // Update the entry
      await updateEntry(entryId, {
        totalAmountPaid: newTotalAmountPaid,
        lastPaymentDate: data.paymentDate,
        remainingAmount: newRemainingAmount,
        paymentStatus: newPaymentStatus,
      });

      await refreshPayments();
      return paymentResponse as unknown as Payment;
    } catch (err) {
      console.error("Error creating payment:", err);
      setError("Failed to create payment");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a payment
  const deletePayment = async (id: string): Promise<void> => {
    setLoading(true);
    try {
      // Get the payment to find the entry ID
      const payment = (await database.getDocument(
        databaseId!,
        paymentsCollectionId!,
        id
      )) as unknown as Payment;

      // Delete the payment
      await database.deleteDocument(databaseId!, paymentsCollectionId!, id);

      // Recalculate entry totals
      const entryPayments = await getPaymentsForEntry(payment.entryId);
      const totalAmountPaid = entryPayments.reduce(
        (sum, p) => sum + p.amount,
        0
      );
      const entry = await getEntry(payment.entryId);

      const remainingAmount = entry.totalPrice - totalAmountPaid;

      // Determine new payment status
      let paymentStatus: "full_paid" | "partially_paid" | "not_paid";
      if (remainingAmount <= 0) {
        paymentStatus = "full_paid";
      } else if (totalAmountPaid > 0) {
        paymentStatus = "partially_paid";
      } else {
        paymentStatus = "not_paid";
      }

      // Update the entry
      await updateEntry(payment.entryId, {
        totalAmountPaid,
        remainingAmount,
        paymentStatus,
        lastPaymentDate:
          entryPayments.length > 0 ? entryPayments[0].$createdAt : undefined,
      });

      await refreshPayments();
    } catch (err) {
      console.error("Error deleting payment:", err);
      setError("Failed to delete payment");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get payments for an entry
  const getPaymentsForEntry = async (entryId: string): Promise<Payment[]> => {
    setLoading(true);
    try {
      const response = await database.listDocuments(
        databaseId!,
        paymentsCollectionId!,
        [Query.equal("entryId", entryId), Query.orderDesc("paymentDate")]
      );

      return response.documents as unknown as Payment[];
    } catch (err) {
      console.error("Error getting payments for entry:", err);
      setError("Failed to get payments for entry");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchFilteredEntries = async (
    status: 'all' | 'full_paid' | 'partially_paid' | 'not_paid',
    page: number,
    limit: number,
    searchQuery?: string
  ): Promise<{ entries: Entry[]; total: number }> => {
    if (!user) throw new Error("User not authenticated");

    setLoading(true);
    try {
      const queries = [Query.equal("userId", user.$id)];
      
      if (status !== 'all') {
        queries.push(Query.equal("paymentStatus", status));
      } else {
        // Exclude full_paid entries when showing all
        queries.push(Query.notEqual("paymentStatus", "full_paid"));
      }

      // Add search query if provided
      if (searchQuery && searchQuery.trim()) {
        queries.push(Query.contains("personName", searchQuery.trim()));
      }

      const offset = (page - 1) * limit;

      const response = await database.listDocuments(
        databaseId!,
        entriesCollectionId!,
        [
          ...queries,
          Query.orderDesc("$createdAt"),
          Query.limit(limit),
          Query.offset(offset)
        ]
      );

      return {
        entries: response.documents as unknown as Entry[],
        total: response.total
      };
    } catch (err) {
      console.error("Error fetching filtered entries:", err);
      setError("Failed to fetch filtered entries");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const contextValue = {
    // State
    entries,
    payments,
    cropTypes,
    equipments,
    loading,
    error,

    // Entry functions
    createEntry,
    updateEntry,
    // deleteEntry,
    getEntry,
    refreshEntries,
    fetchFilteredEntries,

    // Payment functions
    createPayment,
    // deletePayment,
    getPaymentsForEntry,
    refreshPayments,

    // Data loading functions
    loadCropTypes,
    loadEquipments,
  };

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};
