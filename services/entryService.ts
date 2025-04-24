import { firestore } from "@/config/firebase";
import { EntryType, ResponseType } from "@/types";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";
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

    // Update person total amount and remaining amount
    const personRef = doc(firestore, "persons", personId);
    const personDoc = await getDoc(personRef);
    
    if (personDoc.exists()) {
      const personData = personDoc.data();
      const currentTotalAmount = Number(personData.totalAmount)
      const currentRemainingAmount = Number(personData.remainingAmount);
      const entryAmount = Number(totalPrice) || Number(quantity) * Number(pricePerUnit);
      
      const newTotalAmount = currentTotalAmount + entryAmount;
      const newRemainingAmount = currentRemainingAmount + entryAmount;
      
      console.log("Updating person with:", {
        id: personId,
        totalAmount: newTotalAmount,
        remainingAmount: newRemainingAmount
      });
      
      await updatePerson({
        id: personId,
        totalAmount: newTotalAmount,
        remainingAmount: newRemainingAmount
      });
    }

    return { success: true, msg: "Entry created successfully!" };
  } catch (error) {
    console.error("Error creating entry:", error);
    return { success: false, msg: "Error creating entry!" };
  }
};
