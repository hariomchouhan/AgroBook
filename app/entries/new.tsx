import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
} from "react-native";
import { DataContext } from "@/contexts/DataContext";
import { useRouter } from "expo-router";
import { Equipments, CropType } from "@/types";
import Header from "@/components/Header";

export default function NewEntryScreen() {
  const router = useRouter();
  const { createEntry, cropTypes, equipments } = useContext(DataContext);
  const [loading, setLoading] = useState(false);
  const [showEquipmentPicker, setShowEquipmentPicker] = useState(false);
  const [showCropPicker, setShowCropPicker] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    personName: "",
    equipmentId: "",
    equipmentName: "",
    cropTypeId: "",
    cropName: "",
    quantity: "",
    pricePerUnit: "",
    notes: "",
  });

  // Calculate total price
  const totalPrice = parseFloat(formData.quantity) * parseFloat(formData.pricePerUnit);

  const handleSubmit = async () => {
    // Validate form
    if (
      !formData.personName ||
      !formData.equipmentId ||
      !formData.cropTypeId ||
      !formData.quantity ||
      !formData.pricePerUnit
    ) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      await createEntry({
        personName: formData.personName,
        equipmentId: formData.equipmentId,
        cropTypeId: formData.cropTypeId,
        quantity: parseFloat(formData.quantity),
        pricePerUnit: parseFloat(formData.pricePerUnit),
        totalPrice: totalPrice,
        totalAmountPaid: 0,
        paymentStatus: "not_paid",
        remainingAmount: totalPrice,
        notes: formData.notes,
        userId: "", // This will be set by the context
        lastPaymentDate: new Date().toISOString(),
      });
      router.back();
    } catch (error) {
      Alert.alert("Error", "Failed to create entry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderPickerModal = (
    items: (Equipments | CropType)[],
    selectedId: string,
    onSelect: (item: Equipments | CropType) => void,
    visible: boolean,
    onClose: () => void
  ) => (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ScrollView>
            {items.map((item) => (
              <TouchableOpacity
                key={item.$id}
                style={[
                  styles.pickerItem,
                  selectedId === item.$id && styles.pickerItemSelected,
                ]}
                onPress={() => {
                  onSelect(item);
                  onClose();
                }}
              >
                <Text style={styles.pickerItemText}>
                  {"name" in item ? item.name : item.crop}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <Header title="New Entry" showAddButton={false} showBackButton={true} />

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Person Name *</Text>
          <TextInput
            style={styles.input}
            value={formData.personName}
            onChangeText={(text) =>
              setFormData({ ...formData, personName: text })
            }
            placeholder="Enter person name"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Equipment *</Text>
          <TouchableOpacity
            style={styles.pickerButton}
            onPress={() => setShowEquipmentPicker(true)}
          >
            <Text style={styles.pickerButtonText}>
              {formData.equipmentName || "Select Equipment"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Crop Type *</Text>
          <TouchableOpacity
            style={styles.pickerButton}
            onPress={() => setShowCropPicker(true)}
          >
            <Text style={styles.pickerButtonText}>
              {formData.cropName || "Select Crop Type"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Quantity *</Text>
          <TextInput
            style={styles.input}
            value={formData.quantity}
            onChangeText={(text) =>
              setFormData({ ...formData, quantity: text })
            }
            placeholder="Enter quantity"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Price Per Unit *</Text>
          <TextInput
            style={styles.input}
            value={formData.pricePerUnit}
            onChangeText={(text) =>
              setFormData({ ...formData, pricePerUnit: text })
            }
            placeholder="Enter price per unit"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.summaryContainer}>
          <Text style={styles.summaryLabel}>Total Price:</Text>
          <Text style={styles.summaryValue}>₹{(totalPrice ? totalPrice.toFixed(2) : 0)}</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.notes}
            onChangeText={(text) => setFormData({ ...formData, notes: text })}
            placeholder="Enter any additional notes"
            multiline
            numberOfLines={4}
          />
        </View>

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? "Creating..." : "Create Entry"}
          </Text>
        </TouchableOpacity>
      </View>

      {renderPickerModal(
        equipments,
        formData.equipmentId,
        (item) => {
          if ("name" in item) {
            setFormData({
              ...formData,
              equipmentId: item.$id,
              equipmentName: item.name,
            });
          }
        },
        showEquipmentPicker,
        () => setShowEquipmentPicker(false)
      )}

      {renderPickerModal(
        cropTypes,
        formData.cropTypeId,
        (item) => {
          if ("crop" in item) {
            setFormData({
              ...formData,
              cropTypeId: item.$id,
              cropName: item.crop,
            });
          }
        },
        showCropPicker,
        () => setShowCropPicker(false)
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  form: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  pickerButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  pickerButtonText: {
    fontSize: 16,
    color: "#333333",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 16,
  },
  submitButtonDisabled: {
    backgroundColor: "#A5D6A7",
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    width: "80%",
    maxHeight: "80%",
  },
  pickerItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  pickerItemSelected: {
    backgroundColor: "#E8F5E9",
  },
  pickerItemText: {
    fontSize: 16,
    color: "#333333",
  },
  closeButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  summaryContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  summaryLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#4CAF50",
  },
});
