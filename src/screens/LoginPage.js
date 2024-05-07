import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Pressable, Text, Image, SafeAreaView, ScrollView, Modal, Alert } from 'react-native';
import { Loading } from '../components';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { setIsLoading } from '../redux/userSlice';
import { login, autoLogin} from '../redux/userSlice';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

const LoginPage = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [resetButtonEnabled, setResetButtonEnabled] = useState(false); 

  const { isLoading } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(autoLogin());
  }, []);

  const handleForgotPassword = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleResetPassword = async () => {
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValidEmail) {
      Alert.alert('Uyarı', 'Lütfen geçerli bir e-posta adresi girin.');
      setResetButtonEnabled(false);
      return;
    }
  
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      setShowModal(false);
      Alert.alert('Bilgi', 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.');
    } catch (error) {
      console.error("Şifre sıfırlama isteği gönderilirken bir hata oluştu:", error);
      Alert.alert('Hata', 'Şifre sıfırlama isteği gönderilirken bir hata oluştu.');
    }
  };
  
  useEffect(() => {
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    setResetButtonEnabled(isValidEmail);
  }, [email]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.imageContainer}>
          <Image
            source={require('../../assets/İmage/icon1.png')}
            style={styles.image}
          />
        </View>

        <View style={styles.bilgiContainer}>
          <TextInput
            placeholder='Email'
            style={styles.TextInputStyle}
            onChangeText={(email) => setEmail(email)}
            value={email}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <TextInput
            placeholder='Şifre'
            secureTextEntry={true}
            style={styles.TextInputStyle}
            onChangeText={(password) => setPassword(password)}
            value={password}
          />

          <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={styles.forgotPasswordText}>Şifremi Unuttum</Text>
          </TouchableOpacity>

          <View style={styles.buttonContainer}>
            <Pressable
              onPress={() => dispatch(login({ email, password }))}
              style={({ pressed }) => [{
                backgroundColor: pressed ? "gray" : "#8a1194"
              }, styles.button]}>
              <Text style={styles.buttonText}>Giriş</Text>
            </Pressable>
            <Pressable
              onPress={() => navigation.navigate('Signup')}
              style={({ pressed }) => [{
                backgroundColor: pressed ? "gray" : "#8a1194"
              }, styles.button]}>
              <Text style={styles.buttonText}>Kaydol</Text>
            </Pressable>
          </View>
        </View>
        {isLoading && <Loading isLoading={() => dispatch(setIsLoading(false))} />}

        <View style={styles.imageContainer}>
          <Image
            source={require('../../assets/İmage/3.jpeg')}
            style={styles.image_alt}
          />
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={showModal}
          onRequestClose={handleModalClose}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modal}>
              <TouchableOpacity onPress={handleModalClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Şifre Sıfırlama</Text>
              <TextInput
                placeholder="E-posta"
                style={styles.TextInputStyle}
                onChangeText={(email) => setEmail(email)}
                value={email}
                autoCapitalize="none"
                keyboardType="email-address"
              />
              <Pressable
                onPress={handleResetPassword}
                style={({ pressed }) => [{
                  backgroundColor: resetButtonEnabled ? pressed ? "purple" : "#8a1194" : "gray"
                }, styles.modalButton]}
                disabled={!resetButtonEnabled}>
                <Text style={styles.modalButtonText}>Gönder</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bilgiContainer: {
    flex: 1,
    alignItems: 'center',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  TextInputStyle: {
    borderWidth: 1,
    width: '70%',
    height: 35,
    borderRadius: 10,
    marginVertical: 10,
    textAlign: 'center',
    fontSize: 18,
    margin: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '70%',
  },
  button: {
    borderWidth: 1,
    width: '48%',
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 18,
  },
  image: {
    width: 200,
    height: 200,
  },
  image_alt: {
    width: 300,
    height: 300,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
    width: '100%',
  },
  modalButton: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonText: {
    fontSize: 16,
  },
  forgotPasswordText: {
    marginTop: 10,
    textDecorationLine: 'underline',
    color: 'black',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
  },
  closeButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default LoginPage;
