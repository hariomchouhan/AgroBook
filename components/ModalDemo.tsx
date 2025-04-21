import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Modal from './Modal';
import Typo from './Typo';
import { colors } from '@/constants/theme';
import { Check, Warning, Info } from 'phosphor-react-native';

const ModalDemo = () => {
  const [centerModalVisible, setCenterModalVisible] = useState(false);
  const [bottomModalVisible, setBottomModalVisible] = useState(false);
  const [alertModalVisible, setAlertModalVisible] = useState(false);
  const [infoModalVisible, setInfoModalVisible] = useState(false);

  return (
    <ScrollView style={styles.container}>
      <Typo size={24} fontWeight="700" style={styles.title}>
        Modal Examples
      </Typo>
      
      {/* Center Modal Button */}
      <TouchableOpacity 
        style={styles.button}
        onPress={() => setCenterModalVisible(true)}
      >
        <Typo size={16} fontWeight="600" color={colors.white}>
          Open Center Modal
        </Typo>
      </TouchableOpacity>
      
      {/* Bottom Modal Button */}
      <TouchableOpacity 
        style={styles.button}
        onPress={() => setBottomModalVisible(true)}
      >
        <Typo size={16} fontWeight="600" color={colors.white}>
          Open Bottom Modal
        </Typo>
      </TouchableOpacity>
      
      {/* Alert Modal Button */}
      <TouchableOpacity 
        style={[styles.button, { backgroundColor: colors.error }]}
        onPress={() => setAlertModalVisible(true)}
      >
        <Typo size={16} fontWeight="600" color={colors.white}>
          Open Alert Modal
        </Typo>
      </TouchableOpacity>
      
      {/* Info Modal Button */}
      <TouchableOpacity 
        style={[styles.button, { backgroundColor: colors.info }]}
        onPress={() => setInfoModalVisible(true)}
      >
        <Typo size={16} fontWeight="600" color={colors.white}>
          Open Info Modal
        </Typo>
      </TouchableOpacity>
      
      {/* Center Modal */}
      <Modal
        visible={centerModalVisible}
        onClose={() => setCenterModalVisible(false)}
        title="Center Modal"
        position="center"
      >
        <View style={styles.modalContent}>
          <Typo size={16}>
            This is a center modal with a title and close button.
          </Typo>
          <TouchableOpacity 
            style={styles.modalButton}
            onPress={() => setCenterModalVisible(false)}
          >
            <Typo size={16} fontWeight="600" color={colors.white}>
              Close
            </Typo>
          </TouchableOpacity>
        </View>
      </Modal>
      
      {/* Bottom Modal */}
      <Modal
        visible={bottomModalVisible}
        onClose={() => setBottomModalVisible(false)}
        title="Bottom Modal"
        position="bottom"
      >
        <View style={styles.modalContent}>
          <Typo size={16}>
            This is a bottom modal that slides up from the bottom of the screen.
          </Typo>
          <TouchableOpacity 
            style={styles.modalButton}
            onPress={() => setBottomModalVisible(false)}
          >
            <Typo size={16} fontWeight="600" color={colors.white}>
              Close
            </Typo>
          </TouchableOpacity>
        </View>
      </Modal>
      
      {/* Alert Modal */}
      <Modal
        visible={alertModalVisible}
        onClose={() => setAlertModalVisible(false)}
        title="Warning"
        position="center"
        width="80%"
      >
        <View style={styles.modalContent}>
          <View style={styles.iconContainer}>
            <Warning size={48} color={colors.error} weight="fill" />
          </View>
          <Typo size={16} style={styles.modalText}>
            This is an alert modal with a warning icon. Use this for important alerts.
          </Typo>
          <TouchableOpacity 
            style={[styles.modalButton, { backgroundColor: colors.error }]}
            onPress={() => setAlertModalVisible(false)}
          >
            <Typo size={16} fontWeight="600" color={colors.white}>
              OK
            </Typo>
          </TouchableOpacity>
        </View>
      </Modal>
      
      {/* Info Modal */}
      <Modal
        visible={infoModalVisible}
        onClose={() => setInfoModalVisible(false)}
        title="Information"
        position="center"
        width="80%"
      >
        <View style={styles.modalContent}>
          <View style={styles.iconContainer}>
            <Info size={48} color={colors.info} weight="fill" />
          </View>
          <Typo size={16} style={styles.modalText}>
            This is an info modal with an information icon. Use this for helpful tips.
          </Typo>
          <TouchableOpacity 
            style={[styles.modalButton, { backgroundColor: colors.info }]}
            onPress={() => setInfoModalVisible(false)}
          >
            <Typo size={16} fontWeight="600" color={colors.white}>
              Got it
            </Typo>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    marginBottom: 20,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  modalContent: {
    alignItems: 'center',
  },
  modalText: {
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
  },
  iconContainer: {
    marginBottom: 16,
  },
});

export default ModalDemo; 