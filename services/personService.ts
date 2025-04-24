import { firestore } from "@/config/firebase";
import { PersonType, ResponseType } from "@/types";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";

export const createPerson = async (
  personData: Partial<PersonType>
): Promise<ResponseType> => {
  try {
    const { name, uid, totalAmount, remainingAmount, paidAmount, date } =
      personData;
    if (!name) {
      return { success: false, msg: "Invalid person data!" };
    }

    const personRef = doc(collection(firestore, "persons"));

    await setDoc(personRef, personData, { merge: true });

    return { success: true, msg: "Person created successfully!" };
  } catch (error) {
    return { success: false, msg: "Error creating person!" };
  }
};

export const getPersonById = async (id: string): Promise<PersonType | null> => {
  try {
    const personRef = doc(collection(firestore, "persons"), id);
    const docSnap = await getDoc(personRef);
    if (!docSnap.exists()) {
      return null;
    }
    return docSnap.data() as PersonType;
  } catch (error) {
    console.error("Error fetching person:", error);
    return null;
  }
};

export const updatePerson = async (
  personData: Partial<PersonType>
): Promise<ResponseType> => {
  try {
    const { id, totalAmount, remainingAmount, paidAmount } = personData;
    console.log("personData", personData);
    if (!id) {
      return { success: false, msg: "Invalid person data!" };
    }

    // Create reference to the person document
    const personRef = doc(collection(firestore, "persons"), id);

    // Get current document data
    const docSnap = await getDoc(personRef);
    if (!docSnap.exists()) {
      return { success: false, msg: "Person not found!" };
    }

    const currentData = docSnap.data() as PersonType;

    // Create update object with calculated values
    const updateData: Partial<PersonType> = {};
    
    // Update total amount if provided
    if (totalAmount !== undefined) {
      updateData.totalAmount = totalAmount;
    }
    
    // Update remaining amount if provided
    if (remainingAmount !== undefined) {
      updateData.remainingAmount = remainingAmount;
    }
    
    // Update paid amount if provided
    if (paidAmount !== undefined) {
      updateData.paidAmount = paidAmount;
    }

    // Update the document with the new data
    await setDoc(personRef, updateData, { merge: true });

    return { success: true, msg: "Person updated successfully!" };
  } catch (error) {
    console.error("Error updating person:", error);
    return { success: false, msg: "Error updating person!" };
  }
};
