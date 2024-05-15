import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth } from "firebase/auth";
import { query, where, getDoc,getDocs, collection, updateDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, db } from '../../firebaseConfig'; 
import * as ImagePicker from 'expo-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import { lightTheme, darkTheme,DarkToonTheme} from '../components/ThemaStil';
const ProfilePage = () => {
  const navigation = useNavigation();
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [quote, setQuote] = useState("");
  const [newname, setNewname] = useState("");
  const [newQuote, setNewQuote] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [okunan, setOkunan] = useState(0); 
  const [kaydet, setKaydet] = useState([]);
const [like, setLike] = useState([]);
  const [webtoons, setWebtoons] = useState([]);
  const theme = useSelector(state => state.user.theme);
  useEffect(() => {
    const unsubscribe = getAuth().onAuthStateChanged(async (user) => {
      if (user) {
        const userId = user.uid; 
  
        const userDocRef = doc(db, "users", userId);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          
          setUsername(userData.name); 
          setQuote(userData.quote); 
          setProfileImage(userData.profileImage);
          setOkunan(userData.okunan || []);
          setKaydet(userData.kaydet || []);
          setLike(userData.like || []);
        } else {
          console.log("Kullanıcı dökümanı bulunamadı.");
        }
      } else {
        console.log("Kullanıcı oturum açmamış.");
      }
    });
  
    return () => unsubscribe();
  }, []);


  useEffect(() => {
    const fetchWebtoons = async () => {
      try {
        const user = getAuth().currentUser;
  
        if (user) {
          const userId = user.uid;
  
          const userDocRef = doc(db, 'users', userId);
          const userDocSnap = await getDoc(userDocRef);
  
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            const savedWebtoonNames = userData.kaydet || []; // Kaydet alanı boş olabilir, bu yüzden varsayılan olarak boş dizi ayarlayın
            const webtoonsPromises = savedWebtoonNames.map(async (webtoonName) => {
              try {
                const coverUrl = await getCoverUrl(webtoonName);
                return { name: webtoonName, coverUrl };
              } catch (error) {
                console.error(`Webtoon getirilirken bir hata oluştu: ${webtoonName}`, error);
                return null; // Hata oluştuğunda null döndürün
              }
            });
            const fetchedWebtoons = await Promise.all(webtoonsPromises);
            setWebtoons(fetchedWebtoons.filter(Boolean)); // Boş değerlerin filtrelenmesi
          } else {
            console.error(`Kullanıcı belgesi bulunamadı: ${userId}`);
          }
        } else {
          console.error("Kullanıcı oturumu açık değil");
        }
  
      } catch (error) {
        console.error('Webtoonları getirirken hata oluştu:', error);
      }
    };
  
    fetchWebtoons();
  }, []);
  
  
  const getCoverUrl = async (webtoonName) => {
    let coverUrl = '';
  
    try {
      coverUrl = await getDownloadURL(ref(storage, `Webtoons/${webtoonName}/Kapak/${webtoonName}.jpg`));
    } catch (error) {
      try {
        coverUrl = await getDownloadURL(ref(storage, `Webtoons/${webtoonName}/Kapak/${webtoonName}.jpeg`));
      } catch (error) {
        try {
          coverUrl = await getDownloadURL(ref(storage, `Webtoons/${webtoonName}/Kapak/${webtoonName}.png`));
        } catch (error) {
          console.error(`Kapak resmi alınamadı: ${webtoonName}`, error);
        }
      }
    }
  
    return coverUrl;
  };
  
  

  
  
  

  const handleWebtoonSelect = (webtoonName) => {
    console.log(`Seçilen webtoon: ${webtoonName}`);
    navigation.navigate('WebtoonInfoPage', { webtoon: webtoonName });
  };
  

  const handleEditProfile = async () => {
    if (editing) {
      if (newname.trim() === '') {
        Alert.alert("Kullanıcı adı boş bırakılamaz.");
        return;
      }
  
      try {
        const user = getAuth().currentUser;
  
        if (user) {
          const userId = user.uid;
  
          const userRef = doc(db, "users", userId);
          await updateDoc(userRef, {
            name: newname,
            quote: newQuote
          });
  
          Alert.alert("Kullanıcı verileri güncellendi.");
          setUsername(newname);
          setQuote(newQuote);
          setEditing(false);
        } else {
          console.log("Kullanıcı oturum açmamış.");
        }
      } catch (error) {
        console.error("Kullanıcı verilerini güncellemede hata oluştu:", error);
      }
    } else {
      setNewname(username);
      setNewQuote(quote);
      setEditing(true);
    }
  };
  

  const handleQuoteChange = (text) => {
    if (text.length > 50) {
      Alert.alert("Uyarı", "Maximum 50 karaktere izin verilmektedir.");
    } else {
      setNewQuote(text);
    }
  };

  const uploadProfileImage = async (imageUri) => {
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const userId = getAuth().currentUser.uid;
      const storageRef = ref(storage, `users/${userId}/profileImage.jpg`);
      await uploadBytes(storageRef, blob);
      const imageUrl = await getDownloadURL(storageRef);
      setImageUrl(imageUrl);
      await updateProfileImageUrl(imageUrl);
      console.log("Profile image updated.");
    } catch (error) {
      console.error("Profil resmi yüklenirken hata oluştu:", error);
    }
  };

  const updateProfileImageUrl = async (imageUrl) => {
    try {
      const user = getAuth().currentUser;
      if (user) {
        const userId = user.uid;
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, {
          profileImage: imageUrl
        });
        console.log("Firestore'daki profil resmi URL'si güncellendi.");
        setProfileImage(imageUrl);
      } else {
        console.log("Kullanıcı oturum açmamış.");
      }
    } catch (error) {
      console.error("Firestore'daki profil resmi URL'sini güncellemede hata oluştu:", error);
    }
  };
  

  const changeProfileImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log("Permission status:", status);
      if (status !== 'granted') {
        Alert.alert('Uyarı', 'Galeri erişimi reddedildi.');
        return;
      }
  
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
  
      
      if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        await uploadProfileImage(imageUri);
      }
    } catch (error) {
      console.error('Profil resmi yükleme hatası:', error);
    }
  };
  

  return (
    <View style={[styles.container, { backgroundColor: theme === 'DarkToon' 
    ? DarkToonTheme.purpleStil.backgroundColor: theme === 'lightTheme'
      ? lightTheme.whiteStil.backgroundColor
      : darkTheme.darkStil.backgroundColor }]}>
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

        <TouchableOpacity>
          <Text style={styles.bildirimicon} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <View style={styles.profileSection}>
          <TouchableOpacity onPress={() => {
              if (editing) {
                changeProfileImage();
              } else {
                console.log("Profil düzenleme modu kapalı, fotoğraf değiştirme işlemi yapılamaz.");
              }
            }}>
              <Image source={profileImage ? {uri: profileImage} : require('../../assets/İmage/HomePage_images/person.png')} style={styles.profileImage} />
            </TouchableOpacity>
            <TextInput
              style={styles.profileUsername}
              value={editing ? newname : username}
              onChangeText={(text) => setNewname(text)}
              placeholder={editing ? "Kullanıcı Adı" : ""}
              placeholderTextColor="grey"
              editable={editing}
            />
            <View style={styles.profileCounters}>
            <View style={styles.counterContainer}>
                <Image source={require('../../assets/İmage/HomePage_images/okunan.png')} style={styles.counterIcon} />
                <Text style={styles.counterText}>{okunan.length}</Text>
              </View>
              <View style={styles.counterContainer}>
                <Image source={require('../../assets/İmage/HomePage_images/kaydet.png')} style={styles.counterIcon} />
                <Text style={styles.counterText}>{kaydet.length}</Text>
              </View>
              <View style={styles.counterContainer}>
                <Image source={require('../../assets/İmage/HomePage_images/like.png')} style={styles.counterIcon} />
                <Text style={styles.counterText}>{like.length}</Text>
              </View>
            </View>
            <TextInput
              style={styles.quoteText}
              value={editing ? newQuote : quote}
              onChangeText={handleQuoteChange}
              placeholder={editing ? "Alıntı Metni" : ""}
              placeholderTextColor="grey"
              editable={editing}
              multiline={true}
            />
            <TouchableOpacity onPress={handleEditProfile}>
              <Text style={styles.editProfileButton}>{editing ? "Bilgileri Kaydet" : "Profili Düzenle"}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
      <View style={styles.contentSection}>
        <Text style={styles.contentTitle}>Kaydettiğin Webtoonlar</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {webtoons.map((webtoon) => (
            <TouchableOpacity key={webtoon.name} onPress={() => handleWebtoonSelect(webtoon.name)}>
              <View style={styles.trendingWebtoon}>
                <Image source={{ uri: webtoon.coverUrl }} style={styles.webtoonCover} />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
      </ScrollView>

      {/* alt navigaysyon bölümu*/}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'purple',
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
  logo: {
    marginRight: 10,
    width: 30,
    height: 30,
  },
  settingicon: {
    width: 35,
    height: 35,
  },
  bildirimicon: {
    width: 35,
    height: 35,
  },
  scrollView: {
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  section: {
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 15,
  },
  profileSection: {
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 20,
    marginBottom: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    backgroundColor: 'purple',
    marginBottom: 10,
    borderRadius: 75,
  },
  profileUsername: {
    alignItems: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
    textAlign: 'center',
  },
  profileCounters: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  counterContainer: {
    alignItems: 'center',
    marginRight: 10,
  },
  counterIcon: {
    width: 30,
    height: 30,
  },
  counterText: {
    color: 'black',
  },
  quoteText: {
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 10,
    color: 'black',
    paddingHorizontal: 20,
    maxHeight: 100,
    textAlignVertical: 'top',
  },
  editProfileButton: {
    backgroundColor: 'purple',
    color: '#ff9a82',
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'purple',
    marginTop: 10,
  },
  contentSection: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 20,
    marginBottom: 20,
  },
  contentTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
  },
  trendingWebtoon: {
    marginRight: 15,
  },
  webtoonCover: {
    width: 150,
    height: 200,
    borderRadius: 10,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
    paddingBottom: 15,
    paddingTop: 10,
  },
  navIcon: {
    width: 35,
    height: 35,
  },
  personalWebtoon: {
    width: 100,
    height: 150,
    backgroundColor: 'gray',
    marginRight: 10,
  },
  trendingWebtoon: {
    width: 150,
    height: 200,
    backgroundColor: 'gray',
    marginRight: 10,
    borderRadius: 10,
  },
});

export default ProfilePage;
