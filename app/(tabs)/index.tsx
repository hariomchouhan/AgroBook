import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { EquipmentType, CropType } from '@/types';
import { useAuth } from '@/contexts/authContext';
import { useRouter } from 'expo-router';
import { orderBy, where } from 'firebase/firestore';
import ScreenWrapper from '@/components/ScreenWrapper';
import useFetchData from '@/hooks/useFetchData';
import Typo from '@/components/Typo';
import Button from '@/components/Button';

type Props = {}

const HomeScreen = (props: Props) => {
  const { user } = useAuth();
  const router = useRouter();

  const constraints = [
    where("uid", "==", user?.uid),
  ];

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

  return (
    <ScreenWrapper>
      <Typo size={24} fontWeight='bold'>HomeScreen</Typo>
      {equipments.map((equipment) => (
        <Text key={equipment.id}>{equipment.name}</Text>
      ))}
      {equipmentsLoading && <Text>Loading...</Text>}
      {equipmentsError && <Text>Error: {equipmentsError}</Text>}
      <Typo size={24} fontWeight='bold'>Crops</Typo>
      {crops.map((crop) => (
        <Text key={crop.id}>{crop.name}</Text>
      ))}
      {cropsLoading && <Text>Loading...</Text>}
      {cropsError && <Text>Error: {cropsError}</Text>}

      <Button onPress={() => router.push("/(modals)/addPersonModal")}>
        <Typo>Add Person</Typo>
      </Button>
    </ScreenWrapper>
  )
}

export default HomeScreen

const styles = StyleSheet.create({})