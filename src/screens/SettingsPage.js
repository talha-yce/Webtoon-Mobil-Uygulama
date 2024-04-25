import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Switch, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { logout, changeTheme } from '../redux/userSlice';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { query, where, getDocs, collection } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { lightTheme, darkTheme,DarkToonTheme} from '../components/ThemaStil';


const SettingsPage = () => {
  const [contentLanguage, setContentLanguage] = useState('Türkçe');
  const [username, setUsername] = useState('');
  const [userEmail, setUserEmail] = useState('');
  
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [emailForPasswordReset, setEmailForPasswordReset] = useState('');
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const theme = useSelector(state => state.user.theme);

  useEffect(() => {
    const unsubscribe = getAuth().onAuthStateChanged(async (user) => {
      if (user) {
        const userId = user.uid;

        const q = query(collection(db, "users"), where("uid", "==", userId));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          setUsername(userData.name);
          setUserEmail(userData.email);
        });
      } else {
        console.log("Kullanıcı oturum açmamış.");
      }
    });

    // Cleanup
    return () => unsubscribe();
  }, []);

  const handleLanguageChange = (language) => {
    setContentLanguage(language);
    setShowLanguageModal(false); 
    console.log(`Selected language: ${language}`);
  };

  const handleThemeChange = (selectedTheme) => {
    dispatch(changeTheme(selectedTheme));
    setShowThemeModal(false);
    console.log(`Selected theme: ${selectedTheme}`);
  };

  const handlePasswordReset = async () => {
    try {
      if (emailForPasswordReset === userEmail) {
        await sendPasswordResetEmail(getAuth(), emailForPasswordReset);
        Alert.alert(
          "Şifre Sıfırlama Gönderildi",
          "Şifre sıfırlama bağlantısı e-posta adresinize gönderildi. Lütfen e-postanızı kontrol edin.",
          [{ text: "Tamam" }]
        );
        setEmailForPasswordReset('');
      } else {
        Alert.alert(
          "Uyarı",
          "Girdiğiniz e-posta adresi ile kayıtlı bir kullanıcı bulunamadı. Lütfen geçerli bir e-posta adresi girin.",
          [{ text: "Tamam" }]
        );
      }
    } catch (error) {
      Alert.alert("Hata", "Şifre sıfırlama gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
      console.error("Şifre sıfırlama hatası:", error);
    }
  };

  const renderItem = (title, content) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemTitle}>{title}</Text>
      <View>{content}</View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme === 'DarkToon' 
    ? DarkToonTheme.purpleStil.backgroundColor: theme === 'lightTheme'
      ? lightTheme.whiteStil.backgroundColor
      : darkTheme.darkStil.backgroundColor }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Image source={require('../../assets/İmage/HomePage_images/settings.png')} style={styles.settingicon} />
        </TouchableOpacity>
        <View style={styles.logoyazi}>
          <Image source={require('../../assets/İmage/HomePage_images/icon1.png')} style={styles.logo} />
          <View style={styles.titleContainer}>
            <Text style={styles.title}>DARK</Text>
            <Text style={styles.subtitle}>TON</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Bildirimler')}>
          <Image source={require('../../assets/İmage/HomePage_images/bildirim.png')} style={styles.bildirimicon} />
        </TouchableOpacity>
      </View>
      {/* Content */}
      <ScrollView style={styles.scrollView}>
        {/* ayarMenu */}
        <View style={styles.ayarMenu}>
          {renderItem("HESAP:", <Text>{userEmail}</Text>)}
          {renderItem("TAKMA AD:", <Text>{username}</Text>)}
          {/* Şifremi unuttum */}
          {renderItem("Şifremi Unuttum:", 
            <View>
              <TouchableOpacity onPress={() => setShowResetPasswordModal(true)}>
                <Text>Şifremi Unuttum</Text>
              </TouchableOpacity>
            </View>
          )}
          {renderItem("SEÇENEKLER:", null)}
          {renderItem("Uygulama Dili:", 
            <TouchableOpacity style={styles.optionButton} onPress={() => setShowLanguageModal(true)}>
              <Text style={styles.optionButtonText}>{contentLanguage}</Text>
            </TouchableOpacity>
          )}
          {renderItem("Tema:", 
            <TouchableOpacity style={styles.optionButton} onPress={() => setShowThemeModal(true)}>
              <Text style={styles.optionButtonText}>{theme}</Text>
            </TouchableOpacity>
          )}
          {renderItem("BİLDİRİMLER:", null)}
          {renderItem("Servis Bildirimi", <Switch />)}
          {renderItem("Güncel Yeni Bölüm", <Switch />)}
          
          {renderItem("HAKKINDA:", null)}
          {renderItem("Fark Etme:", <TouchableOpacity><Text>SSS</Text></TouchableOpacity>)}
          {renderItem("Yardım:", <TouchableOpacity><Text>Yardım</Text></TouchableOpacity>)}
          {renderItem("Kullanım Şekilleri:", <TouchableOpacity><Text>Kullanım Şekilleri</Text></TouchableOpacity>)}
          {/* Çıkış Yap butonu */}
          <View style={styles.exitButtonContainer}>
            <TouchableOpacity style={styles.exitButton} onPress={() => dispatch(logout())}>
              <Text style={styles.exitButtonText}>Çıkış Yap</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      {/* alt navigasyon bölümü*/}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Image source={require('../../assets/İmage/HomePage_images/home.png')} style={styles.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Kesfet')}>
          <Image source={require('../../assets/İmage/HomePage_images/keşif.png')} style={styles.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Kaydet')}>
          <Image source={require('../../assets/İmage/HomePage_images/save.png')} style={styles.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Profil')}>
          <Image source={require('../../assets/İmage/HomePage_images/profil.png')} style={styles.navIcon} />
        </TouchableOpacity>
      </View>
      {/* Dil seçim modal */}
      {showLanguageModal && (
        <View style={styles.languageModal}>
          <View style={styles.languageModalContent}>
            <Text style={styles.languageModalTitle}>Uygulama Dili Seçin</Text>
            <TouchableOpacity onPress={() => handleLanguageChange('Türkçe')}>
              <Text style={styles.languageOption}>Türkçe</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleLanguageChange('English')}>
              <Text style={styles.languageOption}>English</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleLanguageChange('Deutsch')}>
              <Text style={styles.languageOption}>Deutsch</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleLanguageChange('한국어')}>
              <Text style={styles.languageOption}>한국어</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleLanguageChange('日本語')}>
              <Text style={styles.languageOption}>日本語</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowLanguageModal(false)}>
              <Text style={styles.languageModalClose}>Kapat</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {/* Tema seçim modal */}
      {showThemeModal && (
        <View style={styles.themeModal}>
          <View style={styles.themeModalContent}>
            <Text style={styles.themeModalTitle}>Uygulama Teması Seçin</Text>
            <TouchableOpacity onPress={() => handleThemeChange('lightTheme')}>
              <Text style={styles.themeOption}>lightTheme</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleThemeChange('darkTheme')}>
              <Text style={styles.themeOption}>darkTheme</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleThemeChange('DarkToon')}>
              <Text style={styles.themeOption}>DarkToon</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowThemeModal(false)}>
              <Text style={styles.themeModalClose}>Kapat</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {/* Şifre sıfırlama modalı */}
      {showResetPasswordModal && (
        <View style={styles.resetPasswordModal}>
          <View style={styles.resetPasswordModalContent}>
            <Text style={styles.resetPasswordModalTitle}>Şifremi Unuttum</Text>
            <TextInput
              style={styles.inputmail}
              placeholder="E-posta Adresi"
              onChangeText={setEmailForPasswordReset}
              value={emailForPasswordReset}
            />
            <TouchableOpacity onPress={handlePasswordReset}>
              <Text style={styles.resetPasswordButton}>Şifremi Sıfırla</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowResetPasswordModal(false)}>
              <Text style={styles.resetPasswordModalClose}>Kapat</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
    paddingBottom: 15,
    paddingTop: 10,
  },
  titleContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    color: '#ffb685',
  },
  subtitle: {
    fontSize: 20,
    color: '#ffb685',
    position: 'relative',
    left: 37,
    top: -5,
  },
  logoyazi: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingicon: {
    width: 35,
    height: 35,
  },
  logo: {
    marginRight: 10,
    width: 30,
    height: 30,
  },
  ayarMenu: {
    flex: 1,
    backgroundColor: 'white',
  },
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  optionButton: {
    paddingVertical: 10,
    paddingLeft: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  optionButtonText: {
    color: 'black',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    color: 'white',
  },
  bildirimicon: {
    width: 35,
    height: 35,
  },
  navIcon: {
    width: 35,
    height: 35,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
    paddingBottom: 15,
    paddingTop: 10,
  },
  exitButtonContainer: {
    alignItems: 'flex-end', 
    margin: 10,
    marginRight: 20,
    justifyContent: 'center',
  },
  exitButton: {
    backgroundColor: 'purple', 
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  exitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  languageModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  languageModalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  languageModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  languageOption: {
    fontSize: 16,
    marginBottom: 5,
  },
  languageModalClose: {
    fontSize: 18,
    color: 'blue',
    marginTop: 10,
    textAlign: 'right',
  },
  themeModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  themeModalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  themeModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  themeOption: {
    fontSize: 16,
    marginBottom: 5,
  },
  themeModalClose: {
    fontSize: 18,
    color: 'blue',
    marginTop: 10,
    textAlign: 'right',
  },
  resetPasswordModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetPasswordModalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  resetPasswordModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  inputmail: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  resetPasswordButton: {
    backgroundColor: 'purple',
    color: 'white',
    textAlign: 'center',
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  resetPasswordModalClose: {
    fontSize: 18,
    color: 'blue',
    marginTop: 10,
    textAlign: 'right',
  },
});

export default SettingsPage;
