import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { DataContext } from "@/contexts/DataContext";
import { Entry, Payment, CropType, Equipments } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import Header from "@/components/Header";

export default function EntryDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { getEntry, getPaymentsForEntry, cropTypes, equipments } =
    useContext(DataContext);
  const [entry, setEntry] = useState<Entry | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEntryDetails();
  }, [id, getPaymentsForEntry]);

  const loadEntryDetails = async () => {
    try {
      const entryData = await getEntry(id as string);
      setEntry(entryData);

      const paymentsData = await getPaymentsForEntry(id as string);
      setPayments(paymentsData);
    } catch (error) {
      console.error("Error loading entry details:", error);
      Alert.alert("Error", "Failed to load entry details");
    } finally {
      setLoading(false);
    }
  };

  const getCropName = (cropTypeId: string) => {
    const cropType = cropTypes.find((ct: CropType) => ct.$id === cropTypeId);
    return cropType?.crop || "Unknown Crop";
  };

  const getEquipmentName = (equipmentId: string) => {
    const equipment = equipments.find(
      (eq: Equipments) => eq.$id === equipmentId
    );
    return equipment?.name || "Unknown Equipment";
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading || !entry) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "full_paid":
        return "#4CAF50";
      case "partially_paid":
        return "#FFC107";
      case "not_paid":
        return "#F44336";
      default:
        return "#9E9E9E";
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <Header
        title="Entry Details"
        showAddButton={false}
        showBackButton={true}
      />

      {/* Main Info Card */}
      <View style={styles.card}>
        <Text style={styles.personName}>{entry.personName}</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(entry.paymentStatus) },
          ]}
        >
          <Text style={styles.statusText}>
            {entry.paymentStatus.replace("_", " ").toUpperCase()}
          </Text>
        </View>

        {/* Details Grid */}
        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Equipment</Text>
            <Text style={styles.detailValue}>
              {getEquipmentName(entry.equipmentId)}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Crop</Text>
            <Text style={styles.detailValue}>
              {getCropName(entry.cropTypeId)}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Quantity</Text>
            <Text style={styles.detailValue}>{entry.quantity}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Price/Unit</Text>
            <Text style={styles.detailValue}>
              {formatCurrency(entry.pricePerUnit)}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Date</Text>
            <Text style={styles.detailValue}>
              {formatDate(entry.$createdAt)}
            </Text>
          </View>
        </View>

        {/* Financial Summary */}
        <View style={styles.financialSummary}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total Amount</Text>
            <Text style={styles.summaryValue}>
              {formatCurrency(entry.totalPrice)}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Paid Amount</Text>
            <Text style={styles.summaryValue}>
              {formatCurrency(entry.totalAmountPaid)}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Remaining</Text>
            <Text
              style={[
                styles.summaryValue,
                { color: entry.remainingAmount > 0 ? "#F44336" : "#4CAF50" },
              ]}
            >
              {formatCurrency(entry.remainingAmount)}
            </Text>
          </View>
        </View>

        {entry.notes && (
          <View style={styles.notes}>
            <Text style={styles.notesLabel}>Notes</Text>
            <Text style={styles.notesText}>{entry.notes}</Text>
          </View>
        )}
      </View>

      {/* Payments History */}
      <View style={styles.paymentsSection}>
        <View style={styles.paymentHeader}>
          <Text style={styles.paymentTitle}>Payment History</Text>
          {entry.paymentStatus !== "full_paid" && (
            <TouchableOpacity
              style={styles.addPaymentButton}
              onPress={() =>
                router.push({
                  pathname: "/payments/new" as any,
                  params: { entryId: entry.$id },
                })
              }
            >
              <Ionicons name="add-circle-outline" size={24} color="#2196F3" />
              <Text style={styles.addPaymentText}>Add Payment</Text>
            </TouchableOpacity>
          )}
        </View>

        {payments.length === 0 ? (
          <View style={styles.noPayments}>
            <Text style={styles.noPaymentsText}>No payments recorded yet</Text>
          </View>
        ) : (
          payments.map((payment) => (
            <TouchableOpacity
              key={payment.$id}
              style={styles.paymentCard}
              onPress={() => {
                router.push({
                  pathname: '/payments/[paymentId]',
                  params: { 
                    paymentId: payment.$id,
                    entryId: entry.$id 
                  }
                });
              }}
            >
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentAmount}>
                  {formatCurrency(payment.amount)}
                </Text>
                <Text style={styles.paymentDate}>
                  {formatDate(payment.paymentDate)}
                </Text>
              </View>
              {payment.notes && (
                <Text style={styles.paymentNotes}>{payment.notes}</Text>
              )}
            </TouchableOpacity>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    margin: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  personName: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 8,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 16,
  },
  statusText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "600",
  },
  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  detailItem: {
    width: "50%",
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 14,
    color: "#757575",
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "500",
  },
  financialSummary: {
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    paddingTop: 16,
    marginBottom: 16,
  },
  summaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: "#757575",
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  notes: {
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    paddingTop: 16,
  },
  notesLabel: {
    fontSize: 14,
    color: "#757575",
    marginBottom: 4,
  },
  notesText: {
    fontSize: 16,
    color: "#424242",
  },
  paymentsSection: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    margin: 16,
    padding: 16,
    marginTop: 0,
  },
  paymentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  paymentTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  addPaymentButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  addPaymentText: {
    color: "#2196F3",
    marginLeft: 4,
    fontSize: 16,
  },
  noPayments: {
    padding: 24,
    alignItems: "center",
  },
  noPaymentsText: {
    color: "#757575",
    fontSize: 16,
  },
  paymentCard: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  paymentInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  paymentAmount: {
    fontSize: 16,
    fontWeight: "600",
  },
  paymentDate: {
    color: "#757575",
  },
  paymentNotes: {
    color: "#616161",
    fontSize: 14,
    marginTop: 4,
  },
});
