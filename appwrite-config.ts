import { Client, Account, Databases } from 'appwrite';

// Initialize the Appwrite client
const client = new Client()
  .setEndpoint(`${process.env.EXPO_PUBLIC_APPWRITE_ENDPOINTS}`) // Replace with your Appwrite endpoint
  .setProject(`${process.env.EXPO_PUBLIC_PROJECT_ID}`); // Replace with your project ID

// Initialize the Account service
export const account = new Account(client);
export const database = new Databases(client);

// Replace with your Database and Collection IDs
export const databaseId = process.env.EXPO_PUBLIC_DATABASE_ID; // REPLACE THIS WITH YOUR ACTUAL DATABASE ID

// Collection IDs
export const usersCollectionId = 'users';
export const cropTypesCollectionId = process.env.EXPO_PUBLIC_CROPS_COLLECTION_ID;
export const equipmentCollectionId = process.env.EXPO_PUBLIC_EQUIPMENTS_COLLECTION_ID;
export const entriesCollectionId = process.env.EXPO_PUBLIC_ENTRIES_COLLECTION_ID;
export const paymentsCollectionId = process.env.EXPO_PUBLIC_PAYMENTS_COLLECTION_ID;

export default client;