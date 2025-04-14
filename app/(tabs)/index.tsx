import { DataContext } from "@/contexts/DataContext";
import { Link } from "expo-router";
import { useContext } from "react";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen() {
  const { entries } = useContext(DataContext);
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AgroBook</Text>
        <Link href="/entries/new" asChild>
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add-circle" size={24} color="#4CAF50" />
          </TouchableOpacity>
        </Link>
      </View>

      <ScrollView style={styles.content}>
        {entries.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={48} color="#9E9E9E" />
            <Text style={styles.emptyStateText}>No entries yet</Text>
            <Text style={styles.emptyStateSubtext}>Add your first entry to get started</Text>
          </View>
        ) : (
          entries.map((entry) => (
            <TouchableOpacity 
              key={entry.$id} 
              style={styles.entryCard}
              onPress={() => {/* Add navigation to entry details */}}
            >
              <View style={styles.entryHeader}>
                <Text style={styles.entryName}>{entry.personName}</Text>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(entry.paymentStatus) }
                ]}>
                  <Text style={styles.statusText}>{entry.paymentStatus}</Text>
                </View>
              </View>
              <View style={styles.entryDetails}>
                <Text style={styles.amount}>₹{entry.totalPrice}</Text>
                <Text style={styles.remaining}>Remaining: ₹{entry.remainingAmount}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'paid':
      return '#4CAF50';
    case 'partially_paid':
      return '#FFC107';
    case 'not_paid':
      return '#F44336';
    default:
      return '#9E9E9E';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  addButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#666666',
    marginTop: 8,
  },
  entryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  entryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
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
