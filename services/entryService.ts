import { firestore } from "@/config/firebase";
import { EntryType, ResponseType } from "@/types";
import { collection, doc, setDoc } from "firebase/firestore";
import { updatePerson } from "./personService";

export const createEntry = async (
  entryData: Partial<EntryType>
): Promise<ResponseType> => {
  try {
    const {
      equipmentId,
      cropId,
      quantity,
      pricePerUnit,
      notes,
      personId,
      entryDate,
      totalPrice,
    } = entryData;
    if (
      !equipmentId ||
      !cropId ||
      !quantity ||
      !pricePerUnit ||
      !personId ||
      !entryDate
    ) {
      return { success: false, msg: "Invalid entry data!" };
    }

    const entryRef = doc(collection(firestore, "entries"));

    await setDoc(entryRef, entryData, { merge: true });

    // Update person total amount
    await updatePerson({
      id: personId,
      totalAmount: totalPrice as number,
      remainingAmount: totalPrice as number,
    });
    return { success: true, msg: "Entry created successfully!" };
  } catch (error) {
    return { success: false, msg: "Error creating entry!" };
  }
};
