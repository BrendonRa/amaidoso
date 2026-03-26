import { Image } from 'expo-image';
import { FlatList, Platform, StyleSheet } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import api from '../services/api';


import { Redirect } from 'expo-router';

export default function HomeScreen() {
  return <Redirect href="/tela_inicio1" />;
}