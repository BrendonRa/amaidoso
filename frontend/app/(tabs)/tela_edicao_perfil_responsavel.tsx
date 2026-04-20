import { Feather, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function TelaEdicaoPerfilResponsavel() {
  const [nome, setNome] = React.useState('Fulano da Silva');
  const [usuario, setUsuario] = React.useState('Fulano da Silva');
  const [nascimento, setNascimento] = React.useState('--/--/--');
  const [email, setEmail] = React.useState('fulanosilva2002@gmail.com');
  const [senha, setSenha] = React.useState('A12345678!');
  const [photoUri, setPhotoUri] = React.useState<string | null>(null);

  async function pickImage() {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Permita o acesso à galeria para selecionar uma foto.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      setPhotoUri(result.assets[0].uri);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView
          bounces={false}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.avatarWrapper}>
            <TouchableOpacity activeOpacity={0.8} onPress={pickImage} style={styles.avatar}>
              {photoUri ? (
                <Image source={{ uri: photoUri }} style={styles.avatarImage} />
              ) : (
                <Ionicons name="person-outline" size={58} color="#5A429B" />
              )}
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.6} onPress={pickImage} style={styles.cameraButton}>
              <Feather name="image" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.formCard}>
            <View style={styles.fieldBlock}>
              <Text style={styles.label}>Nome</Text>
              <TextInput onChangeText={setNome} style={styles.input} value={nome} />
            </View>

            <View style={styles.fieldBlock}>
              <Text style={styles.label}>Nome de Usuário</Text>
              <TextInput onChangeText={setUsuario} style={styles.input} value={usuario} />
            </View>

            <View style={styles.fieldBlock}>
              <Text style={styles.label}>Data de Nascimento</Text>
              <TextInput onChangeText={setNascimento} style={styles.input} value={nascimento} />
            </View>

            <View style={styles.fieldBlock}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                autoCapitalize="none"
                keyboardType="email-address"
                onChangeText={setEmail}
                style={styles.input}
                value={email}
              />
            </View>

            <View style={styles.fieldBlock}>
              <Text style={styles.label}>Senha</Text>
              <TextInput onChangeText={setSenha} secureTextEntry style={styles.input} value={senha} />
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => router.push('/tela_editar_perfil_responsavel')}
            style={styles.confirmButton}>
            <Feather name="chevron-down" size={18} color="#FFFFFF" />
            <Text style={styles.confirmText}>Confirmar Alteração</Text>
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.bottomBar}>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => router.push('/tela_painel_responsavel')}
            style={styles.navItem}>
            <Feather name="edit-3" size={24} color="#121212" />
            <Text style={styles.navLabel}>Painel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => router.push('/tela_home_responsavel')}
            style={styles.navItem}>
            <Ionicons name="home-outline" size={26} color="#121212" />
            <Text style={styles.navLabel}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => router.push('/tela_config_responsavel')}
            style={styles.navItem}>
            <Feather name="settings" size={24} color="#121212" />
            <Text style={styles.navLabel}>Configurações</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingTop: 18,
    paddingHorizontal: 14,
    paddingBottom: 24,
  },
  avatarWrapper: {
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#E9D9FF',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cameraButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1F63FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -18,
    marginLeft: 72,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  formCard: {
    borderRadius: 16,
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 10,
    paddingVertical: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  fieldBlock: {
    marginBottom: 6,
  },
  label: {
    fontSize: 12,
    color: '#3A3A3A',
    marginBottom: 4,
  },
  input: {
    minHeight: 44,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4E4E4',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#111111',
    textAlignVertical: 'center',
  },
  confirmButton: {
    alignSelf: 'center',
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1F63FF',
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 4,
  },
  confirmText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  bottomBar: {
    height: 82,
    borderTopWidth: 1,
    borderTopColor: '#151515',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingBottom: 6,
  },
  navItem: {
    minWidth: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navLabel: {
    marginTop: 4,
    fontSize: 12,
    color: '#1A1A1A',
  },
});
