import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { DataContext } from '@/contexts/DataContext';
import { Entry } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import Header from '@/components/Header';

export default function NewPaymentScreen() {
  const { entryId } = useLocalSearchParams();
  const router = useRouter();
  const { getEntry, createPayment } = useContext(DataContext);
  const [entry, setEntry] = useState<Entry | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    notes: '',
  });

  useEffect(() => {
    loadEntryDetails();
  }, [entryId]);

  const loadEntryDetails = async () => {
    try {
      if (!entryId) {
        Alert.alert('Error', 'Entry ID is missing');
        router.back();
        return;
      }
      const entryData = await getEntry(entryId as string);
      setEntry(entryData);
    } catch (error) {
      console.error('Error loading entry details:', error);
      Alert.alert('Error', 'Failed to load entry details');
      router.back();
    }
  };

  const handleSubmit = async () => {
    if (!entry) return;

    // Validate amount
    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    // Check if amount exceeds remaining amount
    if (amount > entry.remainingAmount) {
      Alert.alert('Error', 'Payment amount cannot exceed the remaining amount');
      return;
    }

    setLoading(true);
    try {
      await createPayment(entry.$id, {
        entryId: entry.$id,
        amount,
        notes: formData.notes,
        paymentDate: new Date().toISOString(),
      });
      Alert.alert('Success', 'Payment added successfully', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error('Error creating payment:', error);
      Alert.alert('Error', 'Failed to add payment');
    } finally {
      setLoading(false);
    }
  };

  if (!entry) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <Header title="Add Payment" showAddButton={false} showBackButton={true} />

        {/* Entry Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.personName}>{entry.personName}</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Amount:</Text>
            <Text style={styles.summaryValue}>{formatCurrency(entry.totalPrice)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Paid Amount:</Text>
            <Text style={styles.summaryValue}>{formatCurrency(entry.totalAmountPaid)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Remaining:</Text>
            <Text style={[styles.summaryValue, { color: entry.remainingAmount > 0 ? '#F44336' : '#4CAF50' }]}>
              {formatCurrency(entry.remainingAmount)}
            </Text>
          </View>
        </View>

        {/* Payment Form */}
        <View style={styles.formCard}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Amount</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter amount"
              keyboardType="numeric"
              value={formData.amount}
              onChangeText={(text) => setFormData({ ...formData, amount: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Notes (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Add notes about this payment"
              multiline
              numberOfLines={4}
              value={formData.notes}
              onChangeText={(text) => setFormData({ ...formData, notes: text })}
            />
          </View>

          <TouchableOpacity 
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <Text style={styles.submitButtonText}>Adding Payment...</Text>
            ) : (
              <Text style={styles.submitButtonText}>Add Payment</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  summaryCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    margin: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  personName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#757575',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  formCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    margin: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#424242',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#F9F9F9',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#B0BEC5',
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
}); 