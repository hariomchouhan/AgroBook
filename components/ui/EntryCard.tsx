import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Entry } from "@/types";
import { useRouter } from "expo-router";

type Props = {
  entry: Entry;
};

const EntryCard = ({ entry }: Props) => {
  const router = useRouter();
  const getStatusColor = (status: string) => {
        switch (status) {
          case 'full_paid':
            return '#4CAF50';
          case 'partially_paid':
            return '#FFC107';
          case 'not_paid':
            return '#F44336';
          default:
            return '#9E9E9E';
        }
      };
  return (
    <TouchableOpacity
      key={entry.$id}
      style={styles.entryCard}
      onPress={() => {
        router.push(`/entries/${entry.$id}`);
      }}
    >
      <View style={styles.entryHeader}>
        <Text style={styles.entryName}>{entry.personName}</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(entry.paymentStatus) },
          ]}
        >
          <Text style={styles.statusText}>
            {entry.paymentStatus.replace("_", " ")}
          </Text>
        </View>
      </View>
      <View style={styles.entryDetails}>
        <Text style={styles.amount}>₹{entry.totalPrice}</Text>
        <Text style={styles.remaining}>
          Remaining: ₹{entry.remainingAmount}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  entryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  entryName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "500",
    textTransform: "capitalize",
  },
  entryDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  remaining: {
    fontSize: 14,
    color: '#666666',
  },
});

export default EntryCard;
