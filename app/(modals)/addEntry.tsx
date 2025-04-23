import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { CropType, EntryType, EquipmentType, PersonType } from "@/types";
import { useAuth } from "@/contexts/authContext";
import ModalWrapper from "@/components/ModalWrapper";
import Header from "@/components/Header";
import BackButton from "@/components/BackButton";
import Typo from "@/components/Typo";
import { colors } from "@/constants/theme";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { createEntry } from "@/services/entryService";
import Modal from "@/components/Modal";
import useFetchData from "@/hooks/useFetchData";
import { CaretDown } from "phosphor-react-native";
import { currency } from "@/constants/currency";

type Props = {};

const AddEntry = (props: Props) => {
  const router = useRouter();
  const { user } = useAuth();
  const { personId } = useLocalSearchParams();
  //   console.log("Person ID from params:", personId);

  const [showEquipmentPicker, setShowEquipmentPicker] = useState(false);
  const [showCropPicker, setShowCropPicker] = useState(false);
  const [equipmentName, setEquipmentName] = useState("");
  const [cropName, setCropName] = useState("");

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
  const [formData, setFormData] = useState<EntryType>({
    quantity: "",
    entryDate: new Date(),
    equipmentId: "",
    cropId: "",
    pricePerUnit: "",
    notes: "",
    personId: (personId as string) || "",
    totalPrice: 0,
  });

  // Calculate total price whenever quantity or pricePerUnit changes
  useEffect(() => {
    const quantity = Number(formData.quantity) || 0;
    const pricePerUnit = Number(formData.pricePerUnit) || 0;
    const totalPrice = quantity * pricePerUnit;

    setFormData((prevData) => ({
      ...prevData,
      totalPrice: totalPrice,
    }));
  }, [formData.quantity, formData.pricePerUnit]);

  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = async () => {
    if (!formData.personId) {
      Alert.alert("Add Entry", "Please fill the person field");
      return;
    }

    if (!formData.equipmentId) {
      Alert.alert("Add Entry", "Please select an equipment");
      return;
    }

    if (!formData.cropId) {
      Alert.alert("Add Entry", "Please select a crop");
      return;
    }

    if (!formData.quantity) {
      Alert.alert("Add Entry", "Please enter quantity");
      return;
    }

    if (!formData.pricePerUnit) {
      Alert.alert("Add Entry", "Please enter price per unit");
      return;
    }

    setLoading(true);

    const res = await createEntry(formData);

    setLoading(false);
    if (res.success) {
      router.back();
    } else {
      Alert.alert("Add Entry: ", res.msg);
    }
  };

  const renderPickerModal = (
    items: (EquipmentType | CropType)[],
    selectedId: string,
    onSelect: (item: EquipmentType | CropType) => void,
    visible: boolean,
    onClose: () => void
  ) => (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onClose={onClose}
    >
      <View style={styles.modalContent}>
        <ScrollView>
          {items.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.pickerItem,
                selectedId === item.id && styles.pickerItemSelected,
              ]}
              onPress={() => {
                onSelect(item);
                onClose();
              }}
            >
              <Text style={styles.pickerItemText}>
                {"name" in item && item.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title={"Add Entry"}
          leftIcon={<BackButton />}
          style={{ marginBottom: 10 }}
        />

        {/* form */}
        <ScrollView
          contentContainerStyle={styles.form}
          showsVerticalScrollIndicator={false}
        >
          {/* equipment */}
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral800} size={16} fontWeight="600">
              Equipment *
            </Typo>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setShowEquipmentPicker(true)}
            >
              <Text style={styles.pickerButtonText}>
                {equipmentName || "Select Equipment"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* crop */}
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral800} size={16} fontWeight="600">
              Crop *
            </Typo>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setShowCropPicker(true)}
            >
              <Text style={styles.pickerButtonText}>
                {cropName || "Select Crop"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* quantity */}
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral800} size={16} fontWeight="600">
              Trolley & Biga *
            </Typo>
            <Input
              keyboardType="number-pad"
              value={formData.quantity.toString()}
              onChangeText={(value) =>
                setFormData({
                  ...formData,
                  quantity: value,
                })
              }
            />
          </View>

          {/* price per unit */}
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral800} size={16} fontWeight="600">
              Price Per Unit *
            </Typo>
            <Input
              keyboardType="number-pad"
              value={formData.pricePerUnit.toString()}
              onChangeText={(value) =>
                setFormData({
                  ...formData,
                  pricePerUnit: Number(value),
                })
              }
            />
          </View>

          {/* total price (read-only) */}
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral800} size={16} fontWeight="600">
              Total Price
            </Typo>
            <View style={styles.totalPriceContainer}>
              <Typo size={18} fontWeight="700" color={colors.success}>
                {currency}
                {formData.totalPrice || 0}
              </Typo>
            </View>
          </View>

          {/* notes */}
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral800} size={16} fontWeight="600">
              Notes
            </Typo>
            <View style={styles.notesContainer}>
              <TextInput
                multiline
                numberOfLines={3}
                style={styles.notesInput}
                value={formData.notes}
                placeholder="Add any additional notes here"
                onChangeText={(value) =>
                  setFormData({
                    ...formData,
                    notes: value,
                  })
                }
              />
            </View>
          </View>

          {renderPickerModal(
            equipments,
            formData.equipmentId,
            (item) => {
              if ("name" in item) {
                setFormData({
                  ...formData,
                  equipmentId: item.id!,
                });
                setEquipmentName(item.name!);
              }
            },
            showEquipmentPicker,
            () => setShowEquipmentPicker(false)
          )}

          {renderPickerModal(
            crops,
            formData.cropId,
            (item) => {
              if ("name" in item) {
                setFormData({
                  ...formData,
                  cropId: item.id!,
                });
                setCropName(item.name!);
              }
            },
            showCropPicker,
            () => setShowCropPicker(false)
          )}
        </ScrollView>
      </View>

      <View style={styles.footer}>
        <Button onPress={onSubmit} loading={loading} style={{ flex: 1 }}>
          <Typo color={colors.white} fontWeight={"700"}>
            Submit
          </Typo>
        </Button>
      </View>
    </ModalWrapper>
  );
};

export default AddEntry;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  form: {
    gap: 20,
    paddingVertical: 15,
    paddingBottom: 40,
  },
  inputContainer: {
    gap: 10,
  },
  notesContainer: {
    flexDirection: "row",
    height: 84,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.neutral300,
    borderRadius: 12,
    paddingHorizontal: 15,
    gap: 10,
  },
  notesInput: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
    textAlignVertical: "top",
  },
  totalPriceContainer: {
    height: 50,
    borderWidth: 1,
    borderColor: colors.neutral300,
    borderRadius: 12,
    paddingHorizontal: 15,
    justifyContent: "center",
    backgroundColor: colors.white,
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 20,
    gap: 12,
    paddingTop: 15,
    borderTopColor: colors.neutral300,
    marginBottom: 5,
    borderTopWidth: 1,
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 16,
    width: "100%",
  },
  pickerItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral200,
  },
  pickerItemSelected: {
    backgroundColor: colors.veryLightBlue,
  },
  pickerItemText: {
    fontSize: 16,
    color: colors.neutral800,
  },
  closeButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: colors.primary,
    borderRadius: 8,
    alignItems: "center",
  },
  closeButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  pickerButton: {
    // backgroundColor: colors.white,
    borderRadius: 17,
    height: 54,
    justifyContent: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: colors.neutral800,
  },
  pickerButtonText: {
    fontSize: 16,
    color: colors.neutral800,
  },
});
