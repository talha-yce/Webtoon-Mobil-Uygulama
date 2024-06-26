import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Switch, TextInput, Alert,RefreshControl,Modal } from 'react-native';
import { useNavigation,useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { logout, changeTheme } from '../redux/userSlice';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { query, where, getDocs, collection } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { lightTheme, darkTheme,DarkToonTheme} from '../components/ThemaStil';


const SettingsPage = () => {

  const [username, setUsername] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [showLogoutConfirmationModal, setShowLogoutConfirmationModal] = useState(false);
 
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [emailForPasswordReset, setEmailForPasswordReset] = useState('');
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [showFAQModal, setShowFAQModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showUsageModal, setShowUsageModal] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const {profileImage} = route.params;
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const theme = useSelector(state => state.user.theme);

  useEffect(() => {
    vericek();
    }, []);

    const onRefresh = async () => {
      setRefreshing(true);
      await vericek();
      setRefreshing(false);
    };

const vericek=async()=>{
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
  }



  const handleThemeChange = (selectedTheme) => {
    dispatch(changeTheme(selectedTheme));
    setShowThemeModal(false);
    
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
          "Girdiğiniz e-posta adresi uyuşmuyor. Lütfen geçerli bir e-posta adresi girin.",
          [{ text: "Tamam" }]
        );
      }
    } catch (error) {
      Alert.alert("Hata", "Şifre sıfırlama gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
      console.error("Şifre sıfırlama hatası:", error);
    }
  };

  const getGreetingMessage = () => {
    const currentHour = new Date().getHours();
    
    const messages = [
      { startHour: 0, endHour: 6, message: 'Gece kuşu musun? İyi Geceler!' },
      { startHour: 6, endHour: 9, message: 'Keyifli okumalar.' },
      { startHour: 9, endHour: 12, message: 'Webtoon zamanı.' },
      { startHour: 12, endHour: 14, message: 'Yeni bölümler seni bekliyor.' },
      { startHour: 14, endHour: 17, message: 'Ara ver ve biraz oku.' },
      { startHour: 17, endHour: 19, message: 'Hikayelere devam.' },
      { startHour: 19, endHour: 21, message: 'Rahatla ve oku.' },
      { startHour: 21, endHour: 24, message: 'Güzel rüyalar.' },
    ];
  
    const messageObj = messages.find(({ startHour, endHour }) => currentHour >= startHour && currentHour < endHour);
  
    return messageObj ? messageObj.message : 'Bir hata oluştu!';
  };
  

  return (
    <View style={[styles.container, { backgroundColor: theme === 'DarkToon' 
    ? DarkToonTheme.purpleStil.backgroundColor: theme === 'lightTheme'
      ? lightTheme.whiteStil.backgroundColor
      : darkTheme.darkStil.backgroundColor }]}>
      <View style={styles.header}>
        <View style={styles.profileContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Profil', { username: username, profileImage: profileImage })}>
            <Image source={{ uri: profileImage }} style={styles.profilePicture} />
          </TouchableOpacity>
          <View>
            <Text style={styles.greeting}>{getGreetingMessage()}</Text>
            <Text style={styles.username}>{username}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Settings', { username: username, profileImage: profileImage })}>
   <Image source={theme === 'DarkToon' ? require('../../assets/İmage/HomePage_images/settings_beyaz.png') : theme === 'lightTheme' ? require('../../assets/İmage/HomePage_images/settings.png') : require('../../assets/İmage/HomePage_images/settings_beyaz.png')} style={styles.settingicon} />
 </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={[styles.container, { backgroundColor: theme === 'DarkToon' 
    ? DarkToonTheme.toonStil.backgroundColor: theme === 'lightTheme'
      ? lightTheme.whiteStil.backgroundColor
      : darkTheme.greyStil.backgroundColor }]} refreshControl={
    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {/* ayarMenu */}
        
        <View style={styles.contentContainer}>
  <View style={styles.sectionContainer}>
    <Text style={styles.sectionTitle}>Hesap Bilgileri</Text>
    <View style={styles.sectionContent}>
      <Text style={styles.sectionText}>E-posta: {userEmail}</Text>
      <Text style={styles.sectionText}>Kullanıcı Adı: {username}</Text>
    </View>
  </View>
  <TouchableOpacity style={[styles.sectionButton, { backgroundColor: theme === 'DarkToon' 
    ? DarkToonTheme.whiteStil.backgroundColor: theme === 'lightTheme'
      ? lightTheme.whiteStil.backgroundColor
      : darkTheme.koyugrayStil.backgroundColor }]} onPress={() => setShowResetPasswordModal(true)}>
    <Text style={styles.sectionButtonText}>Şifremi Unuttum</Text>
  </TouchableOpacity>
  
  <TouchableOpacity style={[styles.sectionButton, { backgroundColor: theme === 'DarkToon' 
    ? DarkToonTheme.whiteStil.backgroundColor: theme === 'lightTheme'
      ? lightTheme.whiteStil.backgroundColor
      : darkTheme.koyugrayStil.backgroundColor }]} onPress={() => setShowThemeModal(true)}>
    <Text style={styles.sectionButtonText}>Tema: {theme}</Text>
  </TouchableOpacity>

  <TouchableOpacity style={[styles.sectionButton, { backgroundColor: theme === 'DarkToon' 
    ? DarkToonTheme.whiteStil.backgroundColor: theme === 'lightTheme'
      ? lightTheme.whiteStil.backgroundColor
      : darkTheme.koyugrayStil.backgroundColor }]} onPress={() => setShowFAQModal(true)}>
    <Text style={styles.sectionButtonText}>Sık Sorulan Sorular</Text>
    <Text style={styles.sectionDescription}>Sıkça sorulan soruları buradan inceleyebilirsiniz.</Text>
  </TouchableOpacity>

  <TouchableOpacity style={[styles.sectionButton, { backgroundColor: theme === 'DarkToon' 
    ? DarkToonTheme.whiteStil.backgroundColor: theme === 'lightTheme'
      ? lightTheme.whiteStil.backgroundColor
      : darkTheme.koyugrayStil.backgroundColor }]} onPress={() => setShowHelpModal(true)}>
    <Text style={styles.sectionButtonText}>Yardım</Text>
    <Text style={styles.sectionDescription}>Yardım almak veya geri bildirimde bulunmak için bu seçeneği kullanabilirsiniz.</Text>
  </TouchableOpacity>

  <TouchableOpacity style={[styles.sectionButton, { backgroundColor: theme === 'DarkToon' 
    ? DarkToonTheme.whiteStil.backgroundColor: theme === 'lightTheme'
      ? lightTheme.whiteStil.backgroundColor
      : darkTheme.koyugrayStil.backgroundColor }]} onPress={() => setShowUsageModal(true)}>
    <Text style={styles.sectionButtonText}>Kullanım Şekilleri</Text>
    <Text style={styles.sectionDescription}>Uygulamanın kullanımı hakkında daha fazla bilgi edinin.</Text>
  </TouchableOpacity>

  <TouchableOpacity style={styles.exitButton} onPress={() => setShowLogoutConfirmationModal(true)}>
    <Text style={styles.exitButtonText}>Çıkış Yap</Text>
  </TouchableOpacity>
</View>

      </ScrollView>
      {/* Alt navigasyon */}
      <View style={[styles.bottomNav, { backgroundColor: theme === 'DarkToon' 
 ? DarkToonTheme.purpleStil.backgroundColor : theme === 'lightTheme'
 ? lightTheme.whiteStil.backgroundColor
 : darkTheme.darkStil.backgroundColor }]}>
 <TouchableOpacity onPress={() => navigation.navigate('Home', { username: username, profileImage: profileImage })}>
   <Image source={theme === 'DarkToon' ? require('../../assets/İmage/HomePage_images/home_beyaz.png') : theme === 'lightTheme' ? require('../../assets/İmage/HomePage_images/home.png') : require('../../assets/İmage/HomePage_images/home_beyaz.png')} style={styles.navIcon} />
 </TouchableOpacity>
 <TouchableOpacity onPress={() => navigation.navigate('Kaydet', { username: username, profileImage: profileImage })}>
   <Image source={theme === 'DarkToon' ? require('../../assets/İmage/HomePage_images/save_beyaz.png') : theme === 'lightTheme' ? require('../../assets/İmage/HomePage_images/save.png') : require('../../assets/İmage/HomePage_images/save_beyaz.png')} style={styles.navIcon} />
 </TouchableOpacity>
 <TouchableOpacity onPress={() => navigation.navigate('Kesfet', { username: username, profileImage: profileImage })}>
   <Image source={theme === 'DarkToon' ? require('../../assets/İmage/HomePage_images/keşif_beyaz.png') : theme === 'lightTheme' ? require('../../assets/İmage/HomePage_images/keşif.png') : require('../../assets/İmage/HomePage_images/keşif_beyaz.png')} style={styles.navIcon} />
 </TouchableOpacity>
</View>
      {/* Tema seçim modal */}
      {showThemeModal && (
        <View style={styles.themeModal}>
          <View style={styles.themeModalContent}>
            <Text style={styles.themeModalTitle}>Uygulama Teması Seçin</Text>
            <TouchableOpacity onPress={() => handleThemeChange('lightTheme')}>
              <Text style={styles.themeOption}>Açık Tema</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleThemeChange('darkTheme')}>
              <Text style={styles.themeOption}>Dark Tema</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleThemeChange('DarkToon')}>
              <Text style={styles.themeOption}>DarkToon Tema</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowThemeModal(false)}>
              <Text style={styles.themeModalClose}>Kapat</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {/* Sık Sorulan Sorular Modal */}
      {showFAQModal && (
  <View style={styles.faqModal}>
    <View style={styles.faqModalContent}>
      <Text style={styles.faqModalTitle}>Sık Sorulan Sorular</Text>
      <ScrollView>
        <View>
          <Text style={styles.question}>1. Uygulamayı nasıl güncelleyebilirim?</Text>
          <Text style={styles.answer}>
            Uygulamanızı güncellemek için App Store veya Google Play Store'a gidin. Ardından, "Güncelleme" bölümünden uygulamanızı güncelleyebilirsiniz.
          </Text>
        </View>
        <View>
          <Text style={styles.question}>2. Nasıl bir webtoon kaydedilenlere eklerim?</Text>
          <Text style={styles.answer}>
            Bir webtoon'u kaydedilenlere eklemek için webtoonun detay sayfasına gidin ve kaydet simgesine dokunun. Böylece kaydedilenlere eklenmiş olacak.
          </Text>
        </View>
        <View>
          <Text style={styles.question}>3. Profil resmi, kullanıcı adı ve alıntı metin nasıl değiştirilir?</Text>
          <Text style={styles.answer}>
            Profil sayfasına gidiniz. Daha sonra "Profili Düzenle" düğmesine basınız. Profil resminin üstüne basarak profil resmi seçebilir, kullanıc adı ve alıntı metnini istediğiniz gibi değiştirebilirsiniz. Son olarak "Bilgileri Kaydet" düğmesine basarak bilgileri kaydedebiilirsiniz.
          </Text>
        </View>
        {/* Diğer SSS maddeleri buraya eklenebilir */}
      </ScrollView>
      <TouchableOpacity onPress={() => setShowFAQModal(false)}>
        <Text style={styles.faqModalClose}>Kapat</Text>
      </TouchableOpacity>
    </View>
  </View>
)}

      {/* Yardım Modal */}
      {showHelpModal && (
  <View style={styles.helpModal}>
    <View style={styles.helpModalContent}>
      <Text style={styles.helpModalTitle}>Yardım</Text>
      <Text style={styles.description}>
        Eğer uygulamamızla ilgili bir sorun yaşadığınızda, bir isteğiniz veya geri bildiriminiz varsa lütfen aşağıdaki bilgileri içeren bir e-posta gönderin:
      </Text>
      <Text style={styles.subtitles}>E-posta Adresi:</Text>
      <Text style={styles.email}>info@darkton.com</Text>
      <Text style={styles.subtitles}>Konu:</Text>
      <Text style={styles.topic}>[Sorun / İstek / Geri Bildirim]</Text>
      <Text style={styles.subtitles}>Açıklama:</Text>
      <Text style={styles.description}>
        Lütfen yaşadığınız sorunu, isteği veya geri bildirimi detaylı bir şekilde açıklayın.
      </Text>
      <TouchableOpacity onPress={() => setShowHelpModal(false)}>
        <Text style={styles.helpModalClose}>Kapat</Text>
      </TouchableOpacity>
    </View>
  </View>
)}
{/* Çıkış yap modal */}
<Modal visible={showLogoutConfirmationModal} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Şuan Çıkış Yapmak İstiyorsunuz. Emin misiniz?</Text>
            <TouchableOpacity style={styles.button} onPress={() => {
              dispatch(logout());}}>
              <Text style={styles.buttonText}>Yine Görüşeceğiz</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => setShowLogoutConfirmationModal(false)}>
              <Text style={styles.buttonText}>Gitmiyorum, Buradayım</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Kullanım Şekilleri Modal */}
      {showUsageModal && (
  <View style={styles.usageModal}>
    <View style={styles.usageModalContent}>
      <Text style={styles.usageModalTitle}>Kullanım Şekilleri</Text>
      <ScrollView>
        <View>
          <Text style={styles.step}>Adım 1:</Text>
          <Text style={styles.description}>
            Ana sayfada bulunan webtoon listesinden okumak istediğiniz bir webtoon seçin.
          </Text>
        </View>
        <View>
          <Text style={styles.step}>Adım 2:</Text>
          <Text style={styles.description}>
            Seçtiğiniz webtoonun detay sayfasına gidin ve okumak istediğiniz bölümün düğmesine dokunun.
          </Text>
        </View>
        <View>
          <Text style={styles.step}>Adım 3:</Text>
          <Text style={styles.description}>
            Webtoon okumaya başladığınızda, sayfadaki ileri ve geri butonları ile sonraki resimlere geçebilirsiniz.
          </Text>
        </View>
        <View>
          <Text style={styles.step}>Adım 4:</Text>
          <Text style={styles.description}>
           Sonraki bölüm butonuna basarak bir sonraki bölüme gidebilirsiniz.
          </Text>
        </View>
        {/* Diğer kullanım şekilleri buraya eklenebilir */}
      </ScrollView>
      <TouchableOpacity onPress={() => setShowUsageModal(false)}>
        <Text style={styles.usageModalClose}>Kapat</Text>
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
    paddingBottom: 10,
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
  
  logo: {
    marginRight: 10,
    width: 30,
    height: 30,
  },
  scrollVieworta:{
    backgroundColor:'white',
  },
 
  contentContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionContainer: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginBottom: 15,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionContent: {
    marginTop: 5,
  },
  sectionText: {
    fontSize: 16,
    marginBottom: 5,
  },
  sectionButton: {
    backgroundColor: 'purple',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth:1,
    borderColor:'gray',
  },
  sectionButtonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionDescription: {
    fontSize: 16,
    color: 'black',
    marginTop: 5,
  },
  exitButton: {
    backgroundColor: '#ffb685',
    borderRadius: 10,
    padding: 15,
    marginBottom: 90,
  },
  exitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
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
  bildirimicon: {
    width: 35,
    height: 35,
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
    color: 'purple',
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  themeOption: {
    fontSize: 20,
    marginBottom: 10,
  },
  themeModalClose: {
    fontSize: 18,
    color: 'purple',
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
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  inputmail: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    fontSize:16,
  },
  resetPasswordButton: {
    backgroundColor: 'purple',
    color: 'white',
    textAlign: 'center',
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
    fontSize:18,
  },
  resetPasswordModalClose: {
    fontSize: 18,
    color: 'purple',
    marginTop: 10,
    textAlign: 'right',
  },
  faqModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  faqModalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxHeight: '80%',
  },
  faqModalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  question: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  answer: {
    fontSize: 16,
    marginBottom: 15,
  },
  faqModalClose: {
    fontSize: 18,
    color: 'purple',
    marginTop: 10,
    textAlign: 'right',
  },
  helpModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  helpModalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxHeight: '80%',
  },
  helpModalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitles: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  email: {
    fontSize: 16,
    marginBottom: 10,
  },
  topic: {
    fontSize: 16,
    marginBottom: 5,
  },
  description: {
    fontSize: 16,
    marginBottom: 15,
  },
  helpModalClose: {
    fontSize: 18,
    color: 'purple',
    marginTop: 10,
    textAlign: 'right',
  },
  usageModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  usageModalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  usageModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  usageModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  usageModalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxHeight: '80%',
  },
  usageModalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  step: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  usageModalClose: {
    fontSize: 18,
    color: 'purple',
    marginTop: 10,
    textAlign: 'right',
  },
  button: {
    width: '100%',
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor:'purple',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 300,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    marginTop:5,
  },
  greeting: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffb685',
  },
  username: {
    fontSize: 14,
    color: '#ffb685',
  },
  settingicon: {
    width: 35,
    height: 35,
    marginTop:10,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 35,
    paddingBottom: 5,
    paddingTop: 5,
    borderRadius: 27,
    borderWidth: 1,
    margin: 15,
    position: 'absolute',
    bottom: 0,
    width: '92%',
  },
  navIcon: {
    width: 35,
    height: 35,
  },

});


export default SettingsPage;
