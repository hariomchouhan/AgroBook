import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import Typo from "./Typo";
import { colors } from "@/constants/theme";
import { CropType, EntryType, EquipmentType } from "@/types";
import { currency } from "@/constants/currency";
import { Timestamp } from "firebase/firestore";
import useFetchData from "@/hooks/useFetchData";

type Props = {
  data: EntryType;
};

const EntryCard = ({ data }: Props) => {

    const {
        data: equipments,
        loading: equipmentsLoading,
        error: equipmentsError,
      } = useFetchData<EquipmentType>("equipments");

  const {
    data: crops,
    loading: cropsLoading,
    error: cropsError,
  } = useFetchData<CropType>("crops");
  
  const date = (data?.entryDate as Timestamp)
    ?.toDate()
    ?.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Typo size={16} fontWeight="600" color={colors.neutral800}>
            {date}
          </Typo>
          <Typo size={18} fontWeight="700" color={colors.success}>
            {currency}
            {data.totalPrice || 0}
          </Typo>
        </View>

        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Typo size={14} color={colors.neutral600}>
              Crop:
            </Typo>
            <Typo size={14} fontWeight="500" color={colors.neutral800}>
              {crops?.find(crop => crop.id === data.cropId)?.name || ''}
            </Typo>
          </View>

          <View style={styles.detailRow}>
            <Typo size={14} color={colors.neutral600}>
              Equipment:
            </Typo>
            <Typo size={14} fontWeight="500" color={colors.neutral800}>
              {equipments?.find(equip => equip.id === data.equipmentId)?.name || ''}
            </Typo>
          </View>
          
          <View style={styles.detailRow}>
            <Typo size={14} color={colors.neutral600}>
              Quantity:
            </Typo>
            <Typo size={14} fontWeight="500" color={colors.neutral800}>
              {data.quantity}
            </Typo>
          </View>
          
          <View style={styles.detailRow}>
            <Typo size={14} color={colors.neutral600}>
              Price/Unit:
            </Typo>
            <Typo size={14} fontWeight="500" color={colors.neutral800}>
              {currency}
              {data.pricePerUnit}
            </Typo>
          </View>
        </View>

        {data.notes && (
          <View style={styles.notesContainer}>
            <Typo size={14} color={colors.neutral600}>
              {data.notes}
            </Typo>
          </View>
        )}
      </View>
    </View>
  );
};

export default EntryCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  details: {
    gap: 8,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  notesContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.neutral200,
  },
  arrowContainer: {
    justifyContent: "center",
    paddingRight: 16,
  },
});
