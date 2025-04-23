import { firestore } from "@/config/firebase";
import { PersonType, ResponseType } from "@/types";
import { collection, doc, setDoc } from "firebase/firestore";

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

export const updatePerson = async (
  personData: Partial<PersonType>
): Promise<ResponseType> => {
  try {
    const { id, totalAmount, remainingAmount, paidAmount } = personData;
    if (!id) {
      return { success: false, msg: "Invalid person data!" };
    }

    const personRef = doc(collection(firestore, "persons"), id);

    await setDoc(personRef, personData, { merge: true });

    return { success: true, msg: "Person updated successfully!" };
  } catch (error) {
    return { success: false, msg: "Error updating person!" };
  }
};
